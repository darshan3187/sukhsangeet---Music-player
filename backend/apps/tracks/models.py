import uuid

from django.db import models
from django.utils import timezone


class Track(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    youtube_id = models.CharField(max_length=64, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    thumbnail_url = models.URLField(blank=True, null=True)
    duration_seconds = models.PositiveIntegerField()
    color = models.CharField(max_length=32, blank=True, null=True)
    cached_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "tracks"

    def __str__(self):
        return f"{self.title} - {self.artist}"
