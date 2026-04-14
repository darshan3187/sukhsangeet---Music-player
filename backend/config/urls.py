from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.urls import include, path


def health_check(_request):
    return JsonResponse({"status": "ok", "service": "sukhsangeet-api"})

urlpatterns = [
    path("", health_check, name="root-health"),
    path("health/", health_check, name="health"),
    path("api/health/", health_check, name="api-health"),
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.users.urls")),
    path("api/playlists/", include("apps.playlists.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
