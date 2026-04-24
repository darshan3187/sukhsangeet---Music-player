import re
from urllib.parse import parse_qs, urlparse

import requests
from decouple import config
from django.db import transaction
from django.utils import timezone

from .models import Track


class VideoNotFound(Exception):
    pass


class YouTubeAPIError(Exception):
    pass


class PlaylistError(Exception):
    pass


def parse_iso8601_duration(duration):
    match = re.fullmatch(
        r"PT(?:(?P<hours>\d+)H)?(?:(?P<minutes>\d+)M)?(?:(?P<seconds>\d+)S)?",
        duration or "",
    )
    if not match:
        return 0

    hours = int(match.group("hours") or 0)
    minutes = int(match.group("minutes") or 0)
    seconds = int(match.group("seconds") or 0)
    return hours * 3600 + minutes * 60 + seconds


def _extract_video_id(url_or_id):
    value = (url_or_id or "").strip()
    if not value:
        return None

    parsed = urlparse(value)

    if not parsed.scheme and not parsed.netloc and "/" not in value and "?" not in value:
        return value

    query_id = parse_qs(parsed.query).get("v", [None])[0]
    if query_id:
        return query_id

    if parsed.netloc in {"youtu.be", "www.youtu.be"}:
        path_id = parsed.path.lstrip("/").split("/")[0]
        if path_id:
            return path_id

    if "youtube.com" in parsed.netloc:
        path_bits = [part for part in parsed.path.split("/") if part]
        if path_bits:
            if path_bits[0] == "shorts" and len(path_bits) > 1:
                return path_bits[1]
            if path_bits[0] == "embed" and len(path_bits) > 1:
                return path_bits[1]

    return None


def _extract_playlist_id(url):
    value = (url or "").strip()
    if not value:
        return None

    parsed = urlparse(value)

    playlist_id = parse_qs(parsed.query).get("list", [None])[0]
    if playlist_id:
        return playlist_id

    return None


def _pick_thumbnail(thumbnails):
    for key in ("high", "medium", "default"):
        thumbnail = thumbnails.get(key) if thumbnails else None
        if thumbnail and thumbnail.get("url"):
            return thumbnail["url"]
    return None


def _fallback_thumbnail_url(video_id):
    return f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"


def _fetch_track_via_oembed(video_id):
    try:
        response = requests.get(
            "https://www.youtube.com/oembed",
            params={
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "format": "json",
            },
            timeout=15,
        )
    except requests.RequestException as exc:
        raise YouTubeAPIError("Could not fetch video details") from exc

    if response.status_code == 404:
        raise VideoNotFound("Video not found or unavailable")

    if response.status_code != 200:
        raise YouTubeAPIError("Could not fetch video details")

    payload = response.json()
    thumbnail_url = payload.get("thumbnail_url") or _fallback_thumbnail_url(video_id)
    track, _ = Track.objects.get_or_create(
        youtube_id=video_id,
        defaults={
            "title": payload.get("title", "Unknown Title"),
            "artist": payload.get("author_name", "YouTube"),
            "thumbnail_url": thumbnail_url,
            "duration_seconds": 0,
            "cached_at": timezone.now(),
        },
    )

    if not track.thumbnail_url:
        track.thumbnail_url = thumbnail_url
        track.cached_at = timezone.now()
        track.save(update_fields=["thumbnail_url", "cached_at"])

    return track


def fetch_or_create_track(url_or_id):
    video_id = _extract_video_id(url_or_id)
    if not video_id:
        raise ValueError("Invalid YouTube URL")

    existing = Track.objects.filter(youtube_id=video_id).first()
    if existing:
        return existing

    api_key = config("YOUTUBE_API_KEY", default="")
    if not api_key:
        return _fetch_track_via_oembed(video_id)

    try:
        response = requests.get(
            "https://www.googleapis.com/youtube/v3/videos",
            params={
                "part": "snippet,contentDetails",
                "id": video_id,
                "key": api_key,
            },
            timeout=15,
        )
    except requests.RequestException as exc:
        raise YouTubeAPIError("Could not fetch video details") from exc

    if response.status_code != 200:
        return _fetch_track_via_oembed(video_id)

    payload = response.json()
    if isinstance(payload, dict) and payload.get("error"):
        reason = None
        errors = payload["error"].get("errors") or []
        if errors:
            reason = errors[0].get("reason")
        if reason in {"quotaExceeded", "dailyLimitExceeded", "rateLimitExceeded"}:
            return _fetch_track_via_oembed(video_id)
        return _fetch_track_via_oembed(video_id)

    items = payload.get("items") or []
    if not items:
        raise VideoNotFound("Video not found or unavailable")

    item = items[0]
    snippet = item.get("snippet") or {}
    content_details = item.get("contentDetails") or {}
    thumbnail_url = _pick_thumbnail(snippet.get("thumbnails") or {}) or _fallback_thumbnail_url(video_id)

    track, _ = Track.objects.get_or_create(
        youtube_id=video_id,
        defaults={
            "title": snippet.get("title", ""),
            "artist": snippet.get("channelTitle", ""),
            "thumbnail_url": thumbnail_url,
            "duration_seconds": parse_iso8601_duration(content_details.get("duration", "")),
            "cached_at": timezone.now(),
        },
    )

    if not track.thumbnail_url:
        track.thumbnail_url = thumbnail_url
        track.cached_at = timezone.now()
        track.save(update_fields=["thumbnail_url", "cached_at"])

    return track


def fetch_playlist_video_ids(playlist_id, max_results=100):
    """Fetch all video IDs from a YouTube playlist."""
    api_key = config("YOUTUBE_API_KEY", default="")
    if not api_key:
        raise PlaylistError("YouTube API key not configured")

    video_ids = []
    next_page_token = None

    while len(video_ids) < max_results:
        try:
            response = requests.get(
                "https://www.googleapis.com/youtube/v3/playlistItems",
                params={
                    "part": "snippet",
                    "playlistId": playlist_id,
                    "pageToken": next_page_token,
                    "maxResults": 50,
                    "key": api_key,
                },
                timeout=15,
            )
        except requests.RequestException as exc:
            raise PlaylistError("Could not fetch playlist details") from exc

        if response.status_code != 200:
            payload = response.json()
            if isinstance(payload, dict) and payload.get("error"):
                errors = payload["error"].get("errors") or []
                if errors and errors[0].get("reason") == "playlistNotFound":
                    raise PlaylistError("Playlist not found or unavailable")
            raise PlaylistError("Could not fetch playlist details")

        payload = response.json()
        items = payload.get("items") or []
        for item in items:
            snippet = item.get("snippet") or {}
            video_id = snippet.get("resourceId", {}).get("videoId")
            if video_id:
                video_ids.append(video_id)

        next_page_token = payload.get("nextPageToken")
        if not next_page_token or len(video_ids) >= max_results:
            break

    return video_ids[:max_results]


def search_youtube_videos(query, max_results=12):
    """Search YouTube for videos and return track-like metadata."""
    search_query = (query or "").strip()
    if not search_query:
        return []

    api_key = config("YOUTUBE_API_KEY", default="")
    if not api_key:
        raise YouTubeAPIError("YouTube search is unavailable because the API key is not configured")

    try:
        response = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "part": "snippet",
                "q": search_query,
                "type": "video",
                "maxResults": min(max_results, 20),
                "safeSearch": "moderate",
                "videoEmbeddable": "true",
                "key": api_key,
            },
            timeout=15,
        )
    except requests.RequestException as exc:
        raise YouTubeAPIError("Could not search YouTube") from exc

    if response.status_code != 200:
        raise YouTubeAPIError("Could not search YouTube")

    payload = response.json()
    if isinstance(payload, dict) and payload.get("error"):
        errors = payload["error"].get("errors") or []
        reason = errors[0].get("reason") if errors else None
        if reason in {"quotaExceeded", "dailyLimitExceeded", "rateLimitExceeded"}:
            raise YouTubeAPIError("YouTube search quota is exhausted")
        raise YouTubeAPIError("Could not search YouTube")

    search_items = payload.get("items") or []
    video_ids = []
    search_meta = {}

    for item in search_items:
        video_id = item.get("id", {}).get("videoId")
        if not video_id or video_id in search_meta:
            continue

        snippet = item.get("snippet") or {}
        search_meta[video_id] = snippet
        video_ids.append(video_id)

    if not video_ids:
        return []

    details_by_id = {}
    try:
        details_response = requests.get(
            "https://www.googleapis.com/youtube/v3/videos",
            params={
                "part": "snippet,contentDetails",
                "id": ",".join(video_ids),
                "key": api_key,
            },
            timeout=15,
        )
    except requests.RequestException as exc:
        raise YouTubeAPIError("Could not fetch video details") from exc

    if details_response.status_code == 200:
        details_payload = details_response.json()
        for item in details_payload.get("items") or []:
            video_id = item.get("id")
            if not video_id:
                continue

            snippet = item.get("snippet") or {}
            content_details = item.get("contentDetails") or {}
            details_by_id[video_id] = {
                "title": snippet.get("title", "Unknown Title"),
                "artist": snippet.get("channelTitle", "YouTube"),
                "thumbnail_url": _pick_thumbnail(snippet.get("thumbnails") or {}) or _fallback_thumbnail_url(video_id),
                "duration_seconds": parse_iso8601_duration(content_details.get("duration", "")),
            }

    results = []
    for video_id in video_ids[:max_results]:
        detail = details_by_id.get(video_id)
        snippet = search_meta.get(video_id) or {}
        thumbnail_url = _pick_thumbnail(snippet.get("thumbnails") or {}) or _fallback_thumbnail_url(video_id)

        results.append(
            {
                "id": video_id,
                "youtube_id": video_id,
                "title": (detail or {}).get("title") or snippet.get("title", "Unknown Title"),
                "artist": (detail or {}).get("artist") or snippet.get("channelTitle", "YouTube"),
                "thumbnail_url": (detail or {}).get("thumbnail_url") or thumbnail_url,
                "duration_seconds": (detail or {}).get("duration_seconds", 0),
            }
        )

    return results


def is_playlist_url(url):
    """Check if the URL is a YouTube playlist URL."""
    return _extract_playlist_id(url) is not None