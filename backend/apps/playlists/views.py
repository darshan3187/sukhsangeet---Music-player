from django.db import transaction
from django.db.models import Count, Max, Prefetch
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.tracks.youtube import VideoNotFound, YouTubeAPIError, fetch_or_create_track

from .models import Playlist, PlaylistTrack
from .serializers import (
    PlaylistDetailSerializer,
    PlaylistSerializer,
    PlaylistTrackInputSerializer,
    ReorderPlaylistTracksSerializer,
    TrackResponseSerializer,
)


def get_owned_playlist_or_403(user, playlist_id):
    try:
        playlist = Playlist.objects.get(id=playlist_id)
    except Playlist.DoesNotExist:
        return None, Response({"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)

    if playlist.user_id != user.id:
        return None, Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    return playlist, None


def track_response(track):
    return TrackResponseSerializer(track).data


class PlaylistListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        playlists = (
            Playlist.objects.filter(user=request.user)
            .annotate(track_count=Count("playlist_tracks"))
            .order_by("created_at")
        )
        return Response(PlaylistSerializer(playlists, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PlaylistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        playlist = serializer.save(user=request.user)
        return Response(PlaylistSerializer(playlist).data, status=status.HTTP_201_CREATED)


class PlaylistDetailDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, playlist_id):
        playlist = (
            Playlist.objects.filter(id=playlist_id, user=request.user)
            .prefetch_related(
                Prefetch(
                    "playlist_tracks",
                    queryset=PlaylistTrack.objects.select_related("track").order_by("position"),
                    to_attr="prefetched_playlist_tracks",
                )
            )
            .first()
        )

        if not playlist:
            return Response({"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(PlaylistDetailSerializer(playlist).data, status=status.HTTP_200_OK)

    def delete(self, request, playlist_id):
        playlist, error_response = get_owned_playlist_or_403(request.user, playlist_id)
        if error_response:
            return error_response

        playlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlaylistTrackCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, playlist_id):
        playlist, error_response = get_owned_playlist_or_403(request.user, playlist_id)
        if error_response:
            return error_response

        serializer = PlaylistTrackInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            track = fetch_or_create_track(serializer.validated_data["url"])
        except ValueError:
            return Response({"error": "Invalid YouTube URL"}, status=status.HTTP_400_BAD_REQUEST)
        except VideoNotFound:
            return Response({"error": "Video not found or unavailable"}, status=status.HTTP_404_NOT_FOUND)
        except YouTubeAPIError:
            return Response({"error": "Could not fetch video details"}, status=status.HTTP_502_BAD_GATEWAY)

        if PlaylistTrack.objects.filter(playlist=playlist, track=track).exists():
            return Response({"error": "Track already exists in this playlist"}, status=status.HTTP_409_CONFLICT)

        max_position = PlaylistTrack.objects.filter(playlist=playlist).aggregate(max_pos=Max("position"))["max_pos"]
        next_position = 0 if max_position is None else max_position + 1

        PlaylistTrack.objects.create(playlist=playlist, track=track, position=next_position)
        return Response(track_response(track), status=status.HTTP_201_CREATED)


class PlaylistTrackDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, playlist_id, track_id):
        playlist, error_response = get_owned_playlist_or_403(request.user, playlist_id)
        if error_response:
            return error_response

        try:
            playlist_track = PlaylistTrack.objects.get(id=track_id, playlist=playlist)
        except PlaylistTrack.DoesNotExist:
            return Response({"error": "Track not found in playlist"}, status=status.HTTP_404_NOT_FOUND)

        deleted_position = playlist_track.position
        playlist_track.delete()

        remaining_tracks = list(
            PlaylistTrack.objects.filter(playlist=playlist, position__gt=deleted_position).order_by("position")
        )
        for item in remaining_tracks:
            item.position -= 1
        if remaining_tracks:
            PlaylistTrack.objects.bulk_update(remaining_tracks, ["position"])

        return Response(status=status.HTTP_204_NO_CONTENT)


class PlaylistReorderView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def patch(self, request, playlist_id):
        playlist, error_response = get_owned_playlist_or_403(request.user, playlist_id)
        if error_response:
            return error_response

        serializer = ReorderPlaylistTracksSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        track_ids = serializer.validated_data["track_ids"]

        playlist_tracks = list(
            PlaylistTrack.objects.filter(playlist=playlist, id__in=track_ids).select_for_update()
        )
        if len(playlist_tracks) != len(track_ids):
            return Response({"error": "One or more tracks do not belong to this playlist"}, status=status.HTTP_400_BAD_REQUEST)

        playlist_track_map = {str(item.id): item for item in playlist_tracks}

        for index, track_uuid in enumerate(track_ids):
            playlist_track = playlist_track_map[str(track_uuid)]
            playlist_track.position = index
        PlaylistTrack.objects.bulk_update(playlist_tracks, ["position"])

        return Response(status=status.HTTP_200_OK)
