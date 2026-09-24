from django.urls import path

from .views import (
    ChatView,
    DiagnosisDetailView,
    HistoryListView,
    LoginView,
    LogoutView,
    MeView,
    ProfileView,
    PlantAnalyzeView,
    PlantListCreateView,
    PreferencesView,
    RegisterView,
)

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", MeView.as_view(), name="me"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("plants/", PlantListCreateView.as_view(), name="plant-list"),
    path("analyze/", PlantAnalyzeView.as_view(), name="plant-analyze"),
    path("history/", HistoryListView.as_view(), name="plant-history"),
    path("history/<int:diagnosis_id>/", DiagnosisDetailView.as_view(), name="diagnosis-detail"),
    path("chat/", ChatView.as_view(), name="plant-chat"),
    path("preferences/", PreferencesView.as_view(), name="preferences"),
]
