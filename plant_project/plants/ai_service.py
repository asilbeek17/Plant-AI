import base64
import json
import logging
import mimetypes
import os
import time
from dataclasses import dataclass
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


def analyze_plant_image(image_path: str, language: str = "en") -> DiagnosisResult:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_actual_groq_api_key_here":
        return _demo_result()

    try:
        mime_type = mimetypes.guess_type(image_path)[0] or "image/jpeg"
        if mime_type not in {"image/jpeg", "image/png", "image/webp"}:
            mime_type = "image/jpeg"
        client = Groq(api_key=api_key)
        content = [
            {
                "type": "text",
                "text": (
                    f"You are a careful plant pathologist. Analyze this image and return your "
                    f"natural-language fields in {_language_name(language)}. Return "
                    "ONLY valid JSON with these keys: plant_name (string), disease "
                    "(string, use Healthy if appropriate), confidence (number 0 to 1), "
                    "treatment (string), prevention (string). Be warm and practical, use "
                    "short paragraphs and at most a few relevant plant-care emojis. "
                    "Do not invent certainty. "
                    "For pesticides, recommend only following the product label and local "
                    "agricultural guidance."
                ),
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:{mime_type};base64,{_encode_image(image_path)}"
                },
            },
        ]
        request = {
            "model": os.getenv("GROQ_VISION_MODEL", "qwen/qwen3.8-27b"),
            "messages": [{"role": "user", "content": content}],
            "temperature": 0.2,
        }
        response = None
        for attempt in range(2):
            try:
                response = client.chat.completions.create(**request)
                break
            except Exception as exc:
                status_code = getattr(exc, "status_code", None)
                if attempt == 1 or status_code in {400, 401, 403, 404, 413, 422}:
                    raise
                logger.warning("Temporary Groq image-analysis failure; retrying: %s", exc)
                time.sleep(1)
        if response is None:
            raise RuntimeError("The AI provider did not return a diagnosis.")
        result = _parse_json(response.choices[0].message.content)
        return DiagnosisResult(
            plant_name=str(result.get("plant_name", "Unknown plant")),
            disease=str(result.get("disease", "Analysis inconclusive")),
            confidence=max(0.0, min(1.0, float(result.get("confidence", 0.0)))),
            treatment=str(result.get("treatment", "")),
            prevention=str(result.get("prevention", "")),
            provider="groq",
        )
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as exc:
        logger.exception("Groq returned an invalid plant diagnosis response: %s", exc)
        raise RuntimeError("The AI returned an invalid diagnosis response.") from exc
    except Exception as exc:
        logger.exception("Groq plant image analysis failed: %s", exc)
        raise RuntimeError("The AI provider could not analyze this image.") from exc


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
        )
        return response.choices[0].message.content
    except Exception as exc:
        raise RuntimeError("The AI chat provider is temporarily unavailable.") from exc
