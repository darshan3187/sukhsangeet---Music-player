// Ensure image URLs are HTTPS and valid
const ensureHttpsImageUrl = (url) => {
  if (!url) return '';
  const urlStr = String(url).trim();
  if (!urlStr) return '';
  
  // Convert HTTP to HTTPS for YouTube images (avoid mixed content)
  if (urlStr.startsWith('http://')) {
    return urlStr.replace('http://', 'https://');
  }
  return urlStr;
};

export const toPlayerTrack = (track) => {
  const posterUrl = ensureHttpsImageUrl(track.poster ?? track.thumbnail_url ?? '');
  
  return {
    id: track.id,
    youtubeId: track.youtubeId ?? track.youtube_id ?? '',
    youtube_id: track.youtube_id ?? track.youtubeId ?? '',
    title: track.title ?? '',
    artist: track.artist ?? '',
    poster: posterUrl,
    thumbnail_url: posterUrl,
    color: track.color ?? '#e62135',
    duration_seconds: track.duration_seconds ?? 0,
  };
};

export const toPlayerQueue = (tracks = []) => tracks.map(toPlayerTrack);
