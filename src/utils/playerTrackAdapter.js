export const toPlayerTrack = (track) => ({
  id: track.id,
  youtubeId: track.youtubeId ?? track.youtube_id ?? '',
  youtube_id: track.youtube_id ?? track.youtubeId ?? '',
  title: track.title ?? '',
  artist: track.artist ?? '',
  poster: track.poster ?? track.thumbnail_url ?? '',
  thumbnail_url: track.thumbnail_url ?? track.poster ?? '',
  color: track.color ?? '#e62135',
  duration_seconds: track.duration_seconds ?? 0,
});

export const toPlayerQueue = (tracks = []) => tracks.map(toPlayerTrack);
