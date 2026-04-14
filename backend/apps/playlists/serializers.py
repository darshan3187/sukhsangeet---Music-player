from rest_framework import serializers

from .models import Playlist, PlaylistTrack
from apps.tracks.models import Track


class PlaylistTrackInputSerializer(serializers.Serializer):
    url = serializers.CharField()


class ReorderPlaylistTracksSerializer(serializers.Serializer):
    track_ids = serializers.ListField(child=serializers.UUIDField(), allow_empty=False)


class TrackResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ("id", "youtube_id", "title", "artist", "thumbnail_url", "duration_seconds")


class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ("id", "name", "description", "cover_url", "created_at", "updated_at")


class PlaylistTrackSerializer(serializers.ModelSerializer):
    playlist_track_id = serializers.UUIDField(source="id", read_only=True)
    id = serializers.UUIDField(source="track.id", read_only=True)
    youtube_id = serializers.CharField(source="track.youtube_id", read_only=True)
    title = serializers.CharField(source="track.title", read_only=True)
    artist = serializers.CharField(source="track.artist", read_only=True)
    thumbnail_url = serializers.CharField(source="track.thumbnail_url", read_only=True)
    duration_seconds = serializers.IntegerField(source="track.duration_seconds", read_only=True)
    color = serializers.CharField(source="track.color", read_only=True)

    class Meta:
        model = PlaylistTrack
        fields = (
            "playlist_track_id",
            "id",
            "youtube_id",
            "title",
            "artist",
            "thumbnail_url",
            "duration_seconds",
            "color",
            "position",
            "added_at",
        )


class PlaylistDetailSerializer(PlaylistSerializer):
    tracks = serializers.SerializerMethodField()

    class Meta(PlaylistSerializer.Meta):
        fields = PlaylistSerializer.Meta.fields + ("tracks",)

    def get_tracks(self, obj):
        playlist_tracks = obj.playlist_tracks.select_related("track").order_by("position")
        return PlaylistTrackSerializer(playlist_tracks, many=True).data
