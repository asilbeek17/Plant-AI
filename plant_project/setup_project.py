import os

# Define project structure and file contents
FILES = {
    "requirements.txt": """
Django>=4.2,<5.0
djangorestframework>=3.14.0
django-cors-headers>=4.3.0
groq>=0.4.0
python-dotenv>=1.0.0
Pillow>=10.0.0
""".strip(),

    ".env": """
SECRET_KEY=django-insecure-plantcare-ai-local-dev-key
DEBUG=True
GROQ_API_KEY=your_actual_groq_api_key_here
""".strip(),

    "manage.py": """
#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plantcare_project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
""".strip(),

    "plantcare_project/__init__.py": "",

    "plantcare_project/settings.py": """
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'default-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'plants',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'plantcare_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'plantcare_project.wsgi.py'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True
""".strip(),

    "plantcare_project/urls.py": """
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('plants.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
""".strip(),

    "plantcare_project/wsgi.py": "",

    "plants/__init__.py": "",

    "plants/models.py": """
from django.db import models

class Diagnosis(models.Model):
    image = models.ImageField(upload_to='plant_diagnoses/')
    plant_name = models.CharField(max_length=100, blank=True, default='Unknown')
    disease_detected = models.CharField(max_length=200, blank=True, default='Pending Analysis')
    confidence = models.FloatField(default=0.0)
    treatment_advice = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.plant_name} - {self.disease_detected} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"

class ChatMessage(models.Model):
    diagnosis = models.ForeignKey(Diagnosis, related_name='messages', on_delete=models.CASCADE)
    sender = models.CharField(max_length=10, choices=[('user', 'User'), ('ai', 'AI')])
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
""".strip(),

    "plants/serializers.py": """
from rest_framework import serializers
from .models import Diagnosis, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'message', 'timestamp']

class DiagnosisSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = Diagnosis
        fields = ['id', 'image', 'plant_name', 'disease_detected', 'confidence', 'treatment_advice', 'created_at', 'messages']
""".strip(),

    "plants/ai_service.py": """
import os
import base64
from groq import Groq

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def analyze_plant_image(image_path):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_actual_groq_api_key_here":
        return {
            "plant_name": "Sample Plant",
            "disease": "Early Blight (Simulated - Add Groq Key in .env)",
            "treatment": "Please configure your GROQ_API_KEY in .env file to enable real Vision AI diagnosis. For blight, use copper-based fungicides."
        }

    try:
        client = Groq(api_key=api_key)
        base64_image = encode_image(image_path)

        prompt = (
            "Analyze this plant photo. Return response strictly in this format:\\n"
            "PLANT: <Name of plant>\\n"
            "DISEASE: <Name of disease or 'Healthy'>\\n"
            "TREATMENT: <Detailed diagnosis, recommended organic/chemical drugs, dosages, and recovery steps>"
        )

        response = client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                    ]
                }
            ],
            temperature=0.2
        )

        text = response.choices[0].message.content
        lines = text.split('\\n')

        plant = "Unknown Plant"
        disease = "Analysis Complete"
        treatment = text

        for line in lines:
            if line.startswith("PLANT:"):
                plant = line.replace("PLANT:", "").strip()
            elif line.startswith("DISEASE:"):
                disease = line.replace("DISEASE:", "").strip()
            elif line.startswith("TREATMENT:"):
                treatment = line.replace("TREATMENT:", "").strip()

        return {"plant_name": plant, "disease": disease, "treatment": treatment}

    except Exception as e:
        return {
            "plant_name": "Unknown",
            "disease": "Error analyzing image",
            "treatment": f"Groq API Error: {str(e)}"
        }

def chat_with_groq(diagnosis_history, user_message):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_actual_groq_api_key_here":
        return "Please set your actual GROQ_API_KEY in the .env file to chat with the AI model."

    try:
        client = Groq(api_key=api_key)

        messages = [
            {"role": "system", "content": "You are PlantCare AI, an expert agricultural botanist and plant disease treatment specialist."}
        ]

        for msg in diagnosis_history:
            role = "assistant" if msg.sender == "ai" else "user"
            messages.append({"role": role, "content": msg.message})

        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.5
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Groq Chat Error: {str(e)}"
""".strip(),

    "plants/views.py": """
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Diagnosis, ChatMessage
from .serializers import DiagnosisSerializer
from .ai_service import analyze_plant_image, chat_with_groq

class PlantAnalyzeView(APIView):
    def post(self, request):
        if 'image' not in request.FILES:
            return Response({"error": "No image uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES['image']
        diagnosis = Diagnosis.objects.create(image=image_file)

        # Run AI analysis
        ai_res = analyze_plant_image(diagnosis.image.path)

        diagnosis.plant_name = ai_res['plant_name']
        diagnosis.disease_detected = ai_res['disease']
        diagnosis.treatment_advice = ai_res['treatment']
        diagnosis.save()

        # Save initial AI message
        ChatMessage.objects.create(
            diagnosis=diagnosis,
            sender='ai',
            message=f"**Plant:** {diagnosis.plant_name}\\n**Status:** {diagnosis.disease_detected}\\n\\n**Treatment Strategy:**\\n{diagnosis.treatment_advice}"
        )

        return Response(DiagnosisSerializer(diagnosis).data, status=status.HTTP_201_CREATED)

class HistoryListView(APIView):
    def get(self, request):
        diagnoses = Diagnosis.objects.all().order_by('-created_at')
        return Response(DiagnosisSerializer(diagnoses, many=True).data)

class ChatView(APIView):
    def post(self, request):
        diagnosis_id = request.data.get('diagnosis_id')
        user_message = request.data.get('message')

        if not diagnosis_id or not user_message:
            return Response({"error": "diagnosis_id and message are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            diagnosis = Diagnosis.objects.get(id=diagnosis_id)
        except Diagnosis.DoesNotExist:
            return Response({"error": "Diagnosis not found"}, status=status.HTTP_404_NOT_FOUND)

        # Save user message
        ChatMessage.objects.create(diagnosis=diagnosis, sender='user', message=user_message)

        # Get history & ask Groq
        history = diagnosis.messages.all()
        reply = chat_with_groq(history, user_message)

        # Save AI reply
        ChatMessage.objects.create(diagnosis=diagnosis, sender='ai', message=reply)

        return Response({"reply": reply}, status=status.HTTP_200_OK)
""".strip(),

    "plants/urls.py": """
from django.urls import path
from .views import PlantAnalyzeView, HistoryListView, ChatView

urlpatterns = [
    path('analyze/', PlantAnalyzeView.as_view(), name='plant-analyze'),
    path('history/', HistoryListView.as_view(), name='plant-history'),
    path('chat/', ChatView.as_view(), name='plant-chat'),
]
""".strip(),

    "templates/index.html": """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PlantCare AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-gray-100 h-screen flex overflow-hidden font-sans">
    <aside class="w-64 bg-gray-950 border-r border-gray-800 flex flex-col justify-between p-4">
        <div>
            <h1 class="text-xl font-bold text-emerald-400 mb-8 flex items-center gap-2">🌱 PlantCare AI</h1>
            <nav class="space-y-2">
                <button onclick="showSection('dashboard')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-800 transition">Dashboard</button>
                <button onclick="loadHistory()" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-800 transition">History</button>
            </nav>
        </div>
    </aside>

    <main class="flex-1 flex flex-col bg-gray-900">
        <header class="h-16 border-b border-gray-800 flex items-center px-6">
            <h2 id="view-title" class="text-lg font-semibold">Diagnosis Dashboard</h2>
        </header>

        <section id="dashboard" class="flex-1 p-6 flex gap-6 overflow-hidden">
            <div class="w-1/2 flex flex-col gap-4">
                <div id="drop-zone" class="border-2 border-dashed border-gray-700 hover:border-emerald-500 rounded-2xl flex-1 flex flex-col items-center justify-center p-6 transition cursor-pointer bg-gray-950/50">
                    <p class="text-gray-400">Drag and drop plant photo here, or <span class="text-emerald-400 underline">browse</span></p>
                    <input type="file" id="file-input" class="hidden" accept="image/*">
                </div>
            </div>

            <div class="w-1/2 bg-gray-950 rounded-2xl border border-gray-800 flex flex-col">
                <div id="chat-box" class="flex-1 p-4 overflow-y-auto space-y-4">
                    <div class="text-gray-500 text-center mt-10">Upload a plant photo to begin analysis</div>
                </div>
                <div class="p-4 border-t border-gray-800 flex gap-2">
                    <input type="text" id="chat-input" placeholder="Ask follow-up questions..." class="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" disabled>
                    <button id="send-btn" onclick="sendMessage()" class="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50" disabled>Send</button>
                </div>
            </div>
        </section>

        <section id="history" class="flex-1 p-6 overflow-y-auto hidden">
            <div id="history-container" class="grid grid-cols-3 gap-4"></div>
        </section>
    </main>

    <script>
        let currentDiagnosisId = null;

        const fileInput = document.getElementById('file-input');
        const dropZone = document.getElementById('drop-zone');

        dropZone.onclick = () => fileInput.click();
        fileInput.onchange = (e) => handleUpload(e.target.files[0]);

        async function handleUpload(file) {
            if (!file) return;
            const formData = new FormData();
            formData.append('image', file);

            const chatBox = document.getElementById('chat-box');
            chatBox.innerHTML = '<div class="text-emerald-400 text-center">Analyzing image with Groq AI...</div>';

            try {
                const res = await fetch('/api/analyze/', { method: 'POST', body: formData });
                const data = await res.json();
                currentDiagnosisId = data.id;

                chatBox.innerHTML = '';
                data.messages.forEach(msg => appendMessage(msg.sender, msg.message));

                document.getElementById('chat-input').disabled = false;
                document.getElementById('send-btn').disabled = false;
            } catch (err) {
                chatBox.innerHTML = '<div class="text-red-400">Error connecting to server</div>';
            }
        }

        async function sendMessage() {
            const input = document.getElementById('chat-input');
            const msg = input.value.trim();
            if (!msg || !currentDiagnosisId) return;

            appendMessage('user', msg);
            input.value = '';

            const res = await fetch('/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ diagnosis_id: currentDiagnosisId, message: msg })
            });
            const data = await res.json();
            appendMessage('ai', data.reply);
        }

        function appendMessage(sender, text) {
            const chatBox = document.getElementById('chat-box');
            const div = document.createElement('div');
            div.className = sender === 'user' ? 'text-right' : 'text-left';
            div.innerHTML = `<div class="inline-block p-3 rounded-xl ${sender === 'user' ? 'bg-emerald-600' : 'bg-gray-800'} max-w-md">${text.replace(/\\n/g, '<br>')}</div>`;
            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function showSection(name) {
            document.getElementById('dashboard').classList.toggle('hidden', name !== 'dashboard');
            document.getElementById('history').classList.toggle('hidden', name !== 'history');
        }

        async function loadHistory() {
            showSection('history');
            const res = await fetch('/api/history/');
            const data = await res.json();
            const container = document.getElementById('history-container');
            container.innerHTML = data.map(d => `
                <div class="bg-gray-950 p-4 border border-gray-800 rounded-xl">
                    <img src="${d.image}" class="h-40 w-full object-cover rounded-lg mb-2">
                    <h3 class="font-bold text-emerald-400">${d.plant_name}</h3>
                    <p class="text-sm text-gray-400">${d.disease_detected}</p>
                </div>
            `).join('');
        }
    </script>
</body>
</html>
""".strip(),
}


def build_project():
    print("🚀 Initializing PlantCare AI Project Structure...")
    for file_path, content in FILES.items():
        folder = os.path.dirname(file_path)
        if folder and not os.path.exists(folder):
            os.makedirs(folder, exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  ✓ Created {file_path}")
    print("\n🎉 Project files generated successfully!")


if __name__ == "__main__":
    build_project()