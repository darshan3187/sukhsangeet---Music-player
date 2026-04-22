from django.urls import path

from .views import (
    PlaylistDetailDeleteView,
    PlaylistListCreateView,
    PlaylistReorderView,
    PlaylistTrackCreateView,
    PlaylistTrackDeleteView,
    PlaylistImportView,
)

urlpatterns = [
    path("", PlaylistListCreateView.as_view(), name="playlist-list-create"),
    path("import/", PlaylistImportView.as_view(), name="playlist-import"),
    path("<uuid:playlist_id>/", PlaylistDetailDeleteView.as_view(), name="playlist-detail-delete"),
    path("<uuid:playlist_id>/tracks/", PlaylistTrackCreateView.as_view(), name="playlist-track-create"),
    path(
        "<uuid:playlist_id>/tracks/<uuid:track_id>/",
        PlaylistTrackDeleteView.as_view(),
        name="playlist-track-delete",
    ),
    path("<uuid:playlist_id>/reorder/", PlaylistReorderView.as_view(), name="playlist-track-reorder"),
]
