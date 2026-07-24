from celery import shared_task
from django.contrib.auth import get_user_model
from apps.playlists.models import Playlist, PlaylistTrack
from apps.tracks.youtube import fetch_playlist_video_ids, fetch_or_create_track

User = get_user_model()


@shared_task
def import_playlist_async(user_id, playlist_url, playlist_name):
    """Import YouTube playlist tracks asynchronously in background worker."""
    try:
        user = User.objects.get(id=user_id)
        video_ids = fetch_playlist_video_ids(playlist_url, max_results=200)

        if not playlist_name:
            playlist_name = f"YouTube Playlist ({len(video_ids)} tracks)"

        playlist = Playlist.objects.create(user=user, name=playlist_name)
        playlist_tracks = []

        for pos, vid in enumerate(video_ids):
            try:
                track = fetch_or_create_track(vid)
                playlist_tracks.append(PlaylistTrack(playlist=playlist, track=track, position=pos))
            except Exception:
                continue

        if playlist_tracks:
            PlaylistTrack.objects.bulk_create(playlist_tracks)

        return {"status": "success", "playlist_id": str(playlist.id), "count": len(playlist_tracks)}
    except Exception as exc:
        return {"status": "failed", "error": str(exc)}
