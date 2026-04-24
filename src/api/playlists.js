import api from './axios';

export const fetchPlaylists = async () => {
  const response = await api.get('/playlists/');
  return response.data;
};

export const createPlaylist = async (name, description) => {
  const response = await api.post('/playlists/', { name, description });
  return response.data;
};

export const deletePlaylist = async (id) => {
  const response = await api.delete(`/playlists/${id}/`);
  return response.data;
};

export const fetchPlaylist = async (id) => {
  const response = await api.get(`/playlists/${id}/`);
  return response.data;
};

export const addTrack = async (playlistId, youtubeUrl) => {
  const response = await api.post(`/playlists/${playlistId}/tracks/`, { url: youtubeUrl });
  return response.data;
};

export const importPlaylist = async (youtubePlaylistUrl, playlistName) => {
  const response = await api.post('/playlists/import/', { 
    url: youtubePlaylistUrl,
    name: playlistName 
  });
  return response.data;
};

export const searchYouTubeTracks = async (query, limit = 12) => {
  const response = await api.get('/playlists/search/', {
    params: {
      q: query,
      limit,
    },
  });

  return response.data;
};

export const removeTrack = async (playlistId, trackId) => {
  const response = await api.delete(`/playlists/${playlistId}/tracks/${trackId}/`);
  return response.data;
};

export const reorderTracks = async (playlistId, orderedTrackIds) => {
  const response = await api.patch(`/playlists/${playlistId}/reorder/`, { track_ids: orderedTrackIds });
  return response.data;
};
