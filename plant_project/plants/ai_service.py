import base64
import json
import logging
import mimetypes
import os
import re
import time
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from groq import Groq

logger = logging.getLogger(__name__)


@dataclass
class DiagnosisResult:
    plant_name: str
    disease: str
    confidence: float
    treatment: str
    prevention: str
    provider: str


def _demo_result() -> DiagnosisResult:
    return DiagnosisResult(
        plant_name="Sample Plant",
        disease="Early Blight (demo result)",
        confidence=0.76,
        treatment=(
            "Remove affected leaves, improve airflow, and avoid watering the foliage. "
            "A locally approved copper-based fungicide may help; follow its label."
        ),
        prevention=(
            "Water at soil level, sanitize pruning tools, and rotate susceptible crops."
        ),
        provider="demo",
    )


def _encode_image(image_path: str) -> str:
    with Path(image_path).open("rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def _parse_json(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    return json.loads(cleaned)


def _language_name(language: str) -> str:
    return {"en": "English", "ru": "Russian", "uz": "Uzbek"}.get(language, "English")


@lru_cache(maxsize=1)
def _load_local_tomato_model():
    try:
        import torch
        from torchvision import models, transforms
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "The local tomato model dependencies are not installed. Run pip install torch torchvision."
        ) from exc

    project_root = Path(__file__).resolve().parent.parent
    model_dir = project_root / "Tomato-classfier"
    model_path = model_dir / "plant_disease_model.pth"
    mapping_path = model_dir / "class_mapping.json"

    if not model_path.exists() or not mapping_path.exists():
        raise RuntimeError(
            "The local tomato model files were not found in the Tomato-classfier folder."
        )

    with mapping_path.open("r", encoding="utf-8") as file:
        idx_to_class = json.load(file)
    idx_to_class = {int(key): value for key, value in idx_to_class.items()}

    model = models.resnet34(weights=None)
    model.fc = torch.nn.Sequential(
        torch.nn.Dropout(0.3),
        torch.nn.Linear(model.fc.in_features, len(idx_to_class)),
    )

    state_dict = torch.load(model_path, map_location="cpu", weights_only=True)
    model.load_state_dict(state_dict)
    model.eval()

    transform = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    return model, idx_to_class, transform


def _clean_local_disease_name(raw_name: str) -> str:
    cleaned = raw_name.replace("___", " ").replace("_", " ")
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    cleaned = cleaned.replace("Tomato ", "", 1)
    if cleaned.lower() == "healthy":
        return "Healthy"
    return cleaned.title() if cleaned and cleaned[0].isalpha() else cleaned


def _predict_with_local_tomato_model(image_path: str) -> DiagnosisResult:
    try:
        import torch
        from PIL import Image
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "The local tomato model dependencies are not installed. Run pip install torch torchvision."
        ) from exc

    model, idx_to_class, transform = _load_local_tomato_model()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)

    image = Image.open(image_path).convert("RGB")
    tensor = transform(image).unsqueeze(0).to(device)

    with torch.inference_mode():
        outputs = model(tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]

    results = [
        {"class": idx_to_class[index], "confidence": float(probability.item())}
        for index, probability in enumerate(probabilities)
    ]
    results.sort(key=lambda item: item["confidence"], reverse=True)

    top = results[0]
    disease = _clean_local_disease_name(top["class"])
    confidence = max(0.0, min(1.0, float(top["confidence"])))

    return DiagnosisResult(
        plant_name="Tomato",
        disease=disease,
        confidence=confidence,
        treatment=(
            "Remove damaged leaves, keep the canopy well ventilated, and keep foliage dry when possible. "
            "Follow the disease-specific treatment guidance for the identified tomato issue."
        ),
        prevention=(
            "Use clean planting material, avoid overhead watering, and maintain good spacing and airflow."
        ),
        provider="local_tomato_model",
    )


def analyze_plant_image(image_path: str, language: str = "en") -> DiagnosisResult:
    try:
        return _predict_with_local_tomato_model(image_path)
    except RuntimeError as exc:
        logger.warning("Local tomato model unavailable: %s", exc)
        return _demo_result()
    except Exception as exc:
        logger.exception("Local tomato model analysis failed: %s", exc)
        raise RuntimeError("The local tomato disease model could not analyze this image.") from exc


def chat_with_groq(diagnosis_history, user_message: str, language: str = "en") -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_actual_groq_api_key_here":
        return (
            "Demo mode is active. Add GROQ_API_KEY to your .env file to enable "
            "personalized AI follow-up answers."
        )

    try:
        client = Groq(api_key=api_key)
        messages = [
            {
                "role": "system",
                "content": (
                    f"You are PlantCare AI, a cautious agricultural assistant. Respond in "
                    f"{_language_name(language)}. Give "
                    "friendly human-style practical advice with short paragraphs, clear "
                    "line breaks, and at most a few relevant emojis. Explain uncertainty, "
                    "and never present "
                    "a pesticide as safe without following its label and local rules."
                ),
            }
        ]
        for message in diagnosis_history:
            messages.append(
                {
                    "role": "assistant" if message.sender == "ai" else "user",
                    "content": message.message,
                }
            )
        messages.append({"role": "user", "content": user_message})
        response = client.chat.completions.create(
            model=os.getenv("GROQ_CHAT_MODEL", "openai/gpt-oss-120b"),
            messages=messages,
            temperature=0.4,
            max_tokens=700,
        )
        return response.choices[0].message.content
    except Exception as exc:
        raise RuntimeError("The AI chat provider is temporarily unavailable.") from exc
