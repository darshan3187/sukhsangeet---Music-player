import uuid

from django.conf import settings
from django.db import models


class Playlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="playlists")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    cover_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "playlists"

    def __str__(self):
        return self.name


class PlaylistTrack(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name="playlist_tracks")
    track = models.ForeignKey("tracks.Track", on_delete=models.CASCADE, related_name="playlist_tracks")
    position = models.PositiveIntegerField()
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "playlist_tracks"
        unique_together = (("playlist", "position"),)
        ordering = ["position"]

    def __str__(self):
        return f"{self.playlist_id} - {self.track_id} @ {self.position}"
