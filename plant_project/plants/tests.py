from io import BytesIO
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from PIL import Image
from rest_framework.test import APIClient

from .ai_service import DiagnosisResult
from .models import Diagnosis

User = get_user_model()


def image_upload(name="leaf.jpg"):
    buffer = BytesIO()
    Image.new("RGB", (20, 20), "green").save(buffer, format="JPEG")
    return SimpleUploadedFile(name, buffer.getvalue(), content_type="image/jpeg")


class PlantApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="owner", email="owner@example.com", password="securepass123"
        )

    @patch("plants.views.analyze_plant_image")
    def test_anonymous_diagnosis_is_available_in_demo_mode(self, analyze):
        analyze.return_value = DiagnosisResult(
            "Tomato", "Healthy", 0.91, "Keep watering at soil level.", "Keep airflow good.", "test"
        )
        response = self.client.post("/api/analyze/", {"image": image_upload()}, format="multipart")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["plant_name"], "Tomato")
        self.assertEqual(Diagnosis.objects.count(), 1)

    def test_register_creates_session_and_preferences(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": "new-user",
                "email": "new@example.com",
                "password": "securepass123",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 200)
        self.assertEqual(self.client.get("/api/preferences/").status_code, 200)

    def test_profile_fields_can_be_read_and_updated(self):
        self.client.force_authenticate(self.user)
        response = self.client.patch(
            "/api/profile/",
            {
                "first_name": "Alex",
                "last_name": "Morgan",
                "experience_level": "advanced",
                "favorite_plants": "Tomatoes, basil",
                "location": "Seoul",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["experience_level"], "advanced")
        self.assertEqual(response.data["favorite_plants"], "Tomatoes, basil")
        self.assertEqual(response.data["location"], "Seoul")
        self.assertEqual(self.client.get("/api/profile/").data["first_name"], "Alex")

    def test_language_preference_accepts_supported_languages_only(self):
        self.client.force_authenticate(self.user)
        response = self.client.patch(
            "/api/preferences/", {"language": "ru"}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["language"], "ru")
        invalid = self.client.patch(
            "/api/preferences/", {"language": "fr"}, format="json"
        )
        self.assertEqual(invalid.status_code, 400)

    @patch("plants.views.analyze_plant_image")
    def test_selected_language_is_passed_to_diagnosis_provider(self, analyze):
        analyze.return_value = DiagnosisResult(
            "Яблоня", "Здорова", 0.9, "Поливайте у корней.", "Следите за листьями.", "test"
        )
        response = self.client.post(
            "/api/analyze/",
            {"image": image_upload(), "language": "ru"},
            format="multipart",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(analyze.call_args.args[1], "ru")

    def test_users_only_see_their_own_history(self):
        self.client.force_authenticate(self.user)
        self.client.post("/api/analyze/", {"image": image_upload()}, format="multipart")
        other = User.objects.create_user(
            username="other", email="other@example.com", password="securepass123"
        )
        self.client.force_authenticate(other)
        response = self.client.get("/api/history/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])
