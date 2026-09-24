from django.contrib import admin

from .models import ChatMessage, Diagnosis, Plant, UserPreference


@admin.register(Plant)
class PlantAdmin(admin.ModelAdmin):
    list_display = ("name", "species", "owner", "updated_at")
    list_filter = ("created_at",)
    search_fields = ("name", "species", "owner__username")


@admin.register(Diagnosis)
class DiagnosisAdmin(admin.ModelAdmin):
    list_display = (
        "plant_name",
        "disease_detected",
        "status",
        "provider",
        "owner",
        "created_at",
    )
    list_filter = ("status", "provider", "created_at")
    search_fields = ("plant_name", "disease_detected", "owner__username")
    readonly_fields = ("created_at", "updated_at")


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("diagnosis", "sender", "timestamp")
    list_filter = ("sender", "timestamp")
    search_fields = ("message",)


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "experience_level",
        "favorite_plants",
        "location",
        "email_updates",
        "auto_save_checkups",
    )
