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


def _pick_thumbnail(thumbnails):
    for key in ("high", "medium", "default"):
        thumbnail = thumbnails.get(key) if thumbnails else None
        if thumbnail and thumbnail.get("url"):
            return thumbnail["url"]
    return None


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
    track, _ = Track.objects.get_or_create(
        youtube_id=video_id,
        defaults={
            "title": payload.get("title", "Unknown Title"),
            "artist": payload.get("author_name", "YouTube"),
            "thumbnail_url": payload.get("thumbnail_url"),
            "duration_seconds": 0,
            "cached_at": timezone.now(),
        },
    )
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

    track, _ = Track.objects.get_or_create(
        youtube_id=video_id,
        defaults={
            "title": snippet.get("title", ""),
            "artist": snippet.get("channelTitle", ""),
            "thumbnail_url": _pick_thumbnail((snippet.get("thumbnails") or {})),
            "duration_seconds": parse_iso8601_duration(content_details.get("duration", "")),
            "cached_at": timezone.now(),
        },
    )
    return track