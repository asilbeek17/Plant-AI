from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.http import FileResponse, Http404
from django.views.generic import TemplateView
from pathlib import Path


def serve_uploaded_media(request, path):
    file_path = (settings.MEDIA_ROOT / Path(path)).resolve()
    media_root = settings.MEDIA_ROOT.resolve()
    if media_root not in file_path.parents or not file_path.is_file():
        raise Http404
    return FileResponse(file_path.open("rb"))

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('plants.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('media/<path:path>', serve_uploaded_media, name='uploaded-media'),
]