import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addTrack as addTrackRequest, fetchPlaylist, removeTrack as removeTrackRequest, reorderTracks as reorderTracksRequest } from '../api/playlists';

const PLAYLIST_TRACK_COUNT_UPDATED_EVENT = 'playlist-track-count-updated';

const emitTrackCountUpdate = (playlistId, trackCount) => {
  if (typeof window === 'undefined' || !playlistId) {
    return;
  }

  window.dispatchEvent(new CustomEvent(PLAYLIST_TRACK_COUNT_UPDATED_EVENT, {
    detail: {
      playlistId: String(playlistId),
      trackCount,
    },
  }));
};

const extractPlaylistData = (payload) => payload?.playlist ?? payload ?? null;
const extractTracks = (payload) => payload?.tracks ?? payload?.playlist_tracks ?? payload?.items ?? [];

const ensureHttpsImageUrl = (url) => {
  if (!url) return '';
  const urlStr = String(url).trim();
  if (!urlStr) return '';
  
  if (urlStr.startsWith('http://')) {
    return urlStr.replace('http://', 'https://');
  }
  return urlStr;
};

const normalizeTrack = (track, index = 0) => {
  const playlistTrackId = track?.playlist_track_id ?? track?.playlistTrackId ?? track?.playlistTrackUuid ?? track?.track_id ?? track?.id;
  const youtubeId = track?.youtube_id ?? track?.youtubeId ?? '';
  const thumbnailUrl = ensureHttpsImageUrl(track?.thumbnail_url ?? track?.poster ?? '');

  return {
    id: String(playlistTrackId ?? track?.id ?? `${youtubeId}-${index}`),
    playlistTrackId: String(playlistTrackId ?? track?.id ?? `${youtubeId}-${index}`),
    youtube_id: youtubeId,
    youtubeId,
    title: track?.title ?? '',
    artist: track?.artist ?? '',
    thumbnail_url: thumbnailUrl,
    poster: thumbnailUrl,
    duration_seconds: track?.duration_seconds ?? track?.durationSeconds ?? 0,
    color: track?.color ?? '#e62135',
    position: track?.position ?? index,
    __optimistic: Boolean(track?.__optimistic),
    __pending: Boolean(track?.__pending),
  };
};

const normalizeTracks = (tracks = []) => tracks.map((track, index) => normalizeTrack(track, index));

export const usePlaylist = (playlistId) => {
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(playlistId));
  const [error, setError] = useState('');
  const requestIdRef = useRef(0);
  const playlistIdRef = useRef(playlistId);

  useEffect(() => {
    playlistIdRef.current = playlistId;
  }, [playlistId]);

  const loadPlaylist = useCallback(async (targetPlaylistId) => {
    if (!targetPlaylistId) {
      setPlaylist(null);
      setTracks([]);
      setError('');
      setIsLoading(false);
      return null;
    }

    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setError('');

    try {
      const payload = await fetchPlaylist(targetPlaylistId);
      if (requestIdRef.current !== currentRequestId || playlistIdRef.current !== targetPlaylistId) {
        return null;
      }

      const nextPlaylist = extractPlaylistData(payload);
      const nextTracks = normalizeTracks(extractTracks(payload));
      setPlaylist(nextPlaylist);
      setTracks(nextTracks);
      emitTrackCountUpdate(targetPlaylistId, nextTracks.length);
      return { playlist: nextPlaylist, tracks: nextTracks };
    } catch (requestError) {
      if (requestIdRef.current === currentRequestId && playlistIdRef.current === targetPlaylistId) {
        setPlaylist(null);
        setTracks([]);
        setError(requestError?.response?.data?.error || 'Failed to load playlist.');
      }
      return null;
    } finally {
      if (requestIdRef.current === currentRequestId && playlistIdRef.current === targetPlaylistId) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadPlaylist(playlistId);

    return () => {
      requestIdRef.current += 1;
    };
  }, [loadPlaylist, playlistId]);

  const refetch = useCallback(() => loadPlaylist(playlistIdRef.current), [loadPlaylist]);

  const addTrack = useCallback(async (url) => {
    const targetPlaylistId = playlistIdRef.current;
    if (!targetPlaylistId) {
      throw new Error('No playlist selected.');
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const skeleton = {
      id: tempId,
      playlistTrackId: tempId,
      youtube_id: '',
      youtubeId: '',
      title: 'Fetching video details...',
      artist: 'Loading...',
      thumbnail_url: '',
      poster: '',
      duration_seconds: 0,
      color: '#e62135',
      position: tracks.length,
      __optimistic: true,
      __pending: true,
    };

    setTracks((current) => {
      const nextTracks = [...current, skeleton];
      emitTrackCountUpdate(targetPlaylistId, nextTracks.length);
      return nextTracks;
    });
    setError('');

    try {
      const result = await addTrackRequest(targetPlaylistId, url);
      if (playlistIdRef.current !== targetPlaylistId) {
        return null;
      }

      const trackPayload = result?.track ?? result?.playlist_track ?? result;
      const normalized = normalizeTrack(trackPayload, tracks.length);
      setTracks((current) => current.map((track) => (track.id === tempId ? normalized : track)));
      await refetch();
      return normalized;
    } catch (requestError) {
      if (playlistIdRef.current === targetPlaylistId) {
        setTracks((current) => {
          const nextTracks = current.filter((track) => track.id !== tempId);
          emitTrackCountUpdate(targetPlaylistId, nextTracks.length);
          return nextTracks;
        });
        setError(requestError?.response?.data?.error || requestError?.message || 'Failed to add track.');
      }
      throw requestError;
    }
  }, [refetch, tracks.length]);

  const removeTrack = useCallback(async (trackId) => {
    const targetPlaylistId = playlistIdRef.current;
    if (!targetPlaylistId) {
      throw new Error('No playlist selected.');
    }

    const previousTracks = tracks;
    setTracks((current) => {
      const nextTracks = current.filter((track) => track.playlistTrackId !== trackId);
      emitTrackCountUpdate(targetPlaylistId, nextTracks.length);
      return nextTracks;
    });
    setError('');

    try {
      await removeTrackRequest(targetPlaylistId, trackId);
      return true;
    } catch (requestError) {
      if (playlistIdRef.current === targetPlaylistId) {
        setTracks(previousTracks);
        emitTrackCountUpdate(targetPlaylistId, previousTracks.length);
        setError(requestError?.response?.data?.error || 'Failed to remove track.');
      }
      throw requestError;
    }
  }, [tracks]);

  const reorderTracks = useCallback(async (orderedTrackIds) => {
    const targetPlaylistId = playlistIdRef.current;
    if (!targetPlaylistId || !Array.isArray(orderedTrackIds)) {
      return false;
    }

    const previousTracks = tracks;
    const nextTracks = orderedTrackIds
      .map((trackId, index) => {
        const track = tracks.find((item) => item.playlistTrackId === trackId);
        return track ? { ...track, position: index } : null;
      })
      .filter(Boolean);

    if (nextTracks.length !== tracks.length) {
      throw new Error('Unable to reorder tracks.');
    }

    setTracks(nextTracks);
    setError('');

    try {
      await reorderTracksRequest(targetPlaylistId, orderedTrackIds);
      return true;
    } catch (requestError) {
      if (playlistIdRef.current === targetPlaylistId) {
        setTracks(previousTracks);
        setError(requestError?.response?.data?.error || 'Failed to reorder tracks.');
      }
      throw requestError;
    }
  }, [tracks]);

  const value = useMemo(() => ({
    playlist,
    tracks,
    isLoading,
    error,
    addTrack,
    removeTrack,
    reorderTracks,
    refetch,
  }), [addTrack, error, isLoading, playlist, refetch, reorderTracks, removeTrack, tracks]);

  return value;
};
