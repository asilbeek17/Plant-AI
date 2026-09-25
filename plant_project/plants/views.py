import logging

from django.contrib.auth import login, logout
from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from PIL import Image, UnidentifiedImageError

logger = logging.getLogger(__name__)

from .ai_service import (
    LOCALIZED_DISEASE_NAMES,
    DISEASE_KNOWLEDGE_BASE,
    _disease_report,
    _localized_plant_name,
    analyze_plant_image,
)
from .models import ChatMessage, Diagnosis, Plant, UserPreference
from .serializers import (
    DiagnosisSerializer,
    LoginSerializer,
    PlantSerializer,
    ProfileSerializer,
    RegisterSerializer,
    UserPreferenceSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        UserPreference.objects.create(user=user)
        login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login(request, serializer.validated_data["user"])
        return Response(UserSerializer(request.user).data)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_preference(self, request):
        preference, _ = UserPreference.objects.get_or_create(user=request.user)
        return preference

    def get(self, request):
        preference = self.get_preference(request)
        return Response(
            {
                **UserSerializer(request.user).data,
                "experience_level": preference.experience_level,
                "favorite_plants": preference.favorite_plants,
                "location": preference.location,
            }
        )

    def patch(self, request):
        serializer = ProfileSerializer(
            data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user
        for field in ("first_name", "last_name", "email"):
            if field in data:
                setattr(user, field, data[field])
        user.save(update_fields=[field for field in ("first_name", "last_name", "email") if field in data])
        preference = self.get_preference(request)
        for field in ("experience_level", "favorite_plants", "location"):
            if field in data:
                setattr(preference, field, data[field])
        preference.save(update_fields=[field for field in ("experience_level", "favorite_plants", "location") if field in data])
        return self.get(request)


class PlantListCreateView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        plants = Plant.objects.filter(owner=request.user).annotate(
            diagnosis_count=Count("diagnoses")
        )
        return Response(PlantSerializer(plants, many=True).data)

    def post(self, request):
        serializer = PlantSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plant = serializer.save(owner=request.user)
        return Response(PlantSerializer(plant).data, status=status.HTTP_201_CREATED)


class PlantAnalyzeView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (AllowAny,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        image_file = request.FILES.get("image")
        if not image_file:
            return Response(
                {"error": "No image uploaded."}, status=status.HTTP_400_BAD_REQUEST
            )
        if image_file.size > 10 * 1024 * 1024:
            return Response(
                {"error": "Images must be 10 MB or smaller."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if image_file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
            return Response(
                {"error": "Only JPEG, PNG, and WEBP images are supported."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            image_file.seek(0)
            with Image.open(image_file) as image:
                image.verify()
            image_file.seek(0)
        except (UnidentifiedImageError, OSError):
            return Response(
                {"error": "The uploaded file is not a readable image."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        requested_language = request.data.get("language")
        if requested_language in {"en", "ru", "uz", "ko"}:
            language = requested_language
        elif request.user.is_authenticated:
            language = UserPreference.objects.get_or_create(user=request.user)[0].language
        else:
            language = "en"
        plant = None
        if request.user.is_authenticated and request.data.get("plant_id"):
            plant = get_object_or_404(
                Plant, id=request.data["plant_id"], owner=request.user
            )
        if not request.user.is_authenticated and not request.session.session_key:
            request.session.create()
        diagnosis = Diagnosis.objects.create(
            owner=request.user if request.user.is_authenticated else None,
            session_key="" if request.user.is_authenticated else request.session.session_key,
            plant=plant,
            image=image_file,
            status="processing",
        )
        try:
            result = analyze_plant_image(diagnosis.image.path, language)
            diagnosis.plant_name = result.plant_name
            diagnosis.disease_detected = result.disease
            diagnosis.confidence = result.confidence
            diagnosis.treatment_advice = result.treatment
            diagnosis.prevention_advice = result.prevention
            diagnosis.provider = result.provider
            diagnosis.status = "complete"
            diagnosis.save()
            ChatMessage.objects.create(
                diagnosis=diagnosis,
                sender="ai",
                message=(
                    f"🌿 Plant: {diagnosis.plant_name}\n"
                    f"🔎 Status: {diagnosis.disease_detected}\n\n"
                    f"💊 Treatment strategy:\n{diagnosis.treatment_advice}\n\n"
                    f"🛡️ Prevention:\n{diagnosis.prevention_advice}"
                ),
            )
        except RuntimeError as exc:
            diagnosis.status = "failed"
            diagnosis.error_message = str(exc)
            diagnosis.save(update_fields=("status", "error_message", "updated_at"))
            logger.exception("Plant diagnosis failed for diagnosis_id=%s", diagnosis.id)
            return Response(
                {"error": diagnosis.error_message, "diagnosis_id": diagnosis.id},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except Exception as exc:
            diagnosis.status = "failed"
            diagnosis.error_message = f"Unexpected server error while analyzing image: {exc}"
            diagnosis.save(update_fields=("status", "error_message", "updated_at"))
            logger.exception("Unexpected error while analyzing diagnosis_id=%s", diagnosis.id)
            return Response(
                {"error": diagnosis.error_message, "diagnosis_id": diagnosis.id},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(DiagnosisSerializer(diagnosis, context={"request": request}).data,
                        status=status.HTTP_201_CREATED)


class HistoryListView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        queryset = Diagnosis.objects.select_related("plant")
        if request.user.is_authenticated:
            queryset = queryset.filter(owner=request.user)
        else:
            queryset = queryset.filter(
                owner__isnull=True, session_key=request.session.session_key or ""
            )
        language = request.query_params.get("language", "en")
        if language not in {"en", "ru", "uz", "ko"}:
            language = "en"
        records = []
        for diagnosis in queryset[:100]:
            data = DiagnosisSerializer(diagnosis, context={"request": request}).data
            disease = diagnosis.disease_detected
            reverse_names = {
                localized: canonical
                for translations in LOCALIZED_DISEASE_NAMES.values()
                for canonical, localized in translations.items()
            }
            canonical_disease = reverse_names.get(disease, disease)
            if canonical_disease in {"Healthy", *DISEASE_KNOWLEDGE_BASE}:
                data["plant_name"] = _localized_plant_name(language)
                data["disease_detected"] = LOCALIZED_DISEASE_NAMES.get(language, {}).get(
                    canonical_disease, canonical_disease
                )
            records.append(data)
        return Response(records)


class DiagnosisDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, diagnosis_id):
        diagnosis = get_object_or_404(
            Diagnosis.objects.select_related("plant"), id=diagnosis_id, owner=request.user
        )
        data = DiagnosisSerializer(diagnosis, context={"request": request}).data
        language = request.query_params.get("language", "en")
        if language not in {"en", "ru", "uz", "ko"}:
            language = "en"
        disease = diagnosis.disease_detected
        reverse_names = {
            localized: canonical
            for translations in LOCALIZED_DISEASE_NAMES.values()
            for canonical, localized in translations.items()
        }
        canonical_disease = reverse_names.get(disease, disease)
        if canonical_disease in {"Healthy", *DISEASE_KNOWLEDGE_BASE}:
            summary, treatment, prevention = _disease_report(canonical_disease, language)
            data["plant_name"] = _localized_plant_name(language)
            data["disease_detected"] = LOCALIZED_DISEASE_NAMES.get(language, {}).get(
                canonical_disease, canonical_disease
            )
            data["treatment_advice"] = f"{summary}\n\nTreatment:\n{treatment}"
            data["prevention_advice"] = prevention
            labels = {
                "en": ("Plant", "Status", "Treatment strategy", "Prevention"),
                "ru": ("Растение", "Статус", "Лечение", "Профилактика"),
                "uz": ("O‘simlik", "Holat", "Davolash", "Oldini olish"),
                "ko": ("식물", "상태", "치료 방법", "예방"),
            }
            plant_label, status_label, treatment_label, prevention_label = labels[language]
            data["messages"] = [
                {
                    "id": f"localized-{diagnosis.id}",
                    "sender": "ai",
                    "message": (
                        f"{plant_label}: {data['plant_name']}\n"
                        f"{status_label}: {data['disease_detected']}\n\n"
                        f"{treatment_label}:\n{data['treatment_advice']}\n\n"
                        f"{prevention_label}:\n{data['prevention_advice']}"
                    ),
                    "timestamp": diagnosis.updated_at,
                }
            ]
        return Response(data)


class ChatView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (AllowAny,)
    parser_classes = (JSONParser,)

    def post(self, request):
        return Response(
            {"error": "Follow-up AI chat is disabled. Diagnosis uses only the local tomato model."},
            status=status.HTTP_410_GONE,
        )


class PreferencesView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self, request):
        preference, _ = UserPreference.objects.get_or_create(user=request.user)
        return preference

    def get(self, request):
        return Response(UserPreferenceSerializer(self.get_object(request)).data)

    def patch(self, request):
        preference = self.get_object(request)
        serializer = UserPreferenceSerializer(preference, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
