import { useCallback, useEffect, useRef, useState } from 'react';
import { createPlaylist as createPlaylistRequest, deletePlaylist as deletePlaylistRequest, fetchPlaylists } from '../api/playlists';

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchPlaylists();
      if (!mountedRef.current) {
        return [];
      }

      const nextPlaylists = Array.isArray(data) ? data : data?.results ?? [];
      setPlaylists(nextPlaylists);
      return nextPlaylists;
    } catch (requestError) {
      if (mountedRef.current) {
        setError(requestError?.response?.data?.error || 'Failed to load playlists.');
      }
      return [];
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refetch();

    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  const createPlaylist = useCallback(async (name, description = '') => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Playlist name is required.');
    }

    const created = await createPlaylistRequest(trimmedName, description.trim());
    const playlist = created?.playlist ?? created;

    if (mountedRef.current) {
      setPlaylists((current) => [...current, playlist]);
    }

    return playlist;
  }, []);

  const deletePlaylist = useCallback(async (id) => {
    const previous = playlists;
    setPlaylists((current) => current.filter((playlist) => playlist.id !== id));

    try {
      await deletePlaylistRequest(id);
      return true;
    } catch (requestError) {
      if (mountedRef.current) {
        setPlaylists(previous);
        setError(requestError?.response?.data?.error || 'Failed to delete playlist.');
      }
      throw requestError;
    }
  }, [playlists]);

  return {
    playlists,
    isLoading,
    error,
    createPlaylist,
    deletePlaylist,
    refetch,
  };
};
