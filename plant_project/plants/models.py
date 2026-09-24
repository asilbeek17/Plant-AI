from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Plant(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="plants",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=120)
    species = models.CharField(max_length=120, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-updated_at",)

    def __str__(self):
        return self.name


class Diagnosis(models.Model):
    STATUS_CHOICES = (
        ("queued", "Queued"),
        ("processing", "Processing"),
        ("complete", "Complete"),
        ("failed", "Failed"),
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="diagnoses",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    session_key = models.CharField(max_length=40, blank=True, db_index=True)
    plant = models.ForeignKey(
        Plant,
        related_name="diagnoses",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    image = models.ImageField(upload_to="plant_diagnoses/%Y/%m/")
    plant_name = models.CharField(max_length=120, blank=True, default="Unknown")
    disease_detected = models.CharField(
        max_length=200, blank=True, default="Pending Analysis"
    )
    confidence = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
    )
    treatment_advice = models.TextField(blank=True)
    prevention_advice = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="queued")
    error_message = models.TextField(blank=True)
    provider = models.CharField(max_length=40, blank=True, default="demo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.plant_name} - {self.disease_detected}"


class ChatMessage(models.Model):
    SENDER_CHOICES = (("user", "User"), ("ai", "AI"))

    diagnosis = models.ForeignKey(
        Diagnosis, related_name="messages", on_delete=models.CASCADE
    )
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("timestamp",)


class UserPreference(models.Model):
    EXPERIENCE_LEVELS = (
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name="preference", on_delete=models.CASCADE
    )
    email_updates = models.BooleanField(default=True)
    auto_save_checkups = models.BooleanField(default=True)
    compact_cards = models.BooleanField(default=False)
    language = models.CharField(max_length=20, default="en")
    experience_level = models.CharField(
        max_length=20, choices=EXPERIENCE_LEVELS, default="beginner"
    )
    favorite_plants = models.CharField(max_length=300, blank=True)
    location = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return f"Preferences for {self.user}"
