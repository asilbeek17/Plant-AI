from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from .models import ChatMessage, Diagnosis, Plant, UserPreference

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")
        read_only_fields = ("id",)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name")

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            username=attrs["username"], password=attrs["password"]
        )
        if not user:
            raise serializers.ValidationError("Invalid username or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")
        attrs["user"] = user
        return attrs


class PlantSerializer(serializers.ModelSerializer):
    diagnosis_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Plant
        fields = ("id", "name", "species", "notes", "diagnosis_count", "created_at")
        read_only_fields = ("id", "diagnosis_count", "created_at")


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ("id", "sender", "message", "timestamp")
        read_only_fields = fields


class DiagnosisSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    plant = PlantSerializer(read_only=True)
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = Diagnosis
        fields = (
            "id",
            "plant",
            "image",
            "plant_name",
            "disease_detected",
            "confidence",
            "treatment_advice",
            "prevention_advice",
            "status",
            "error_message",
            "provider",
            "created_at",
            "messages",
        )
        read_only_fields = fields


class UserPreferenceSerializer(serializers.ModelSerializer):
    def validate_language(self, value):
        if value not in {"en", "ru", "uz", "ko"}:
            raise serializers.ValidationError("Language must be English, Russian, Uzbek, or Korean.")
        return value

    class Meta:
        model = UserPreference
        fields = (
            "email_updates",
            "auto_save_checkups",
            "compact_cards",
            "language",
            "experience_level",
            "favorite_plants",
            "location",
        )


class ProfileSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    experience_level = serializers.ChoiceField(
        choices=[choice[0] for choice in UserPreference.EXPERIENCE_LEVELS],
        required=False,
    )
    favorite_plants = serializers.CharField(required=False, allow_blank=True, max_length=300)
    location = serializers.CharField(required=False, allow_blank=True, max_length=120)

    def validate_email(self, value):
        user = self.context.get("request").user if self.context.get("request") else None
        query = User.objects.filter(email__iexact=value)
        if user:
            query = query.exclude(pk=user.pk)
        if query.exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()
