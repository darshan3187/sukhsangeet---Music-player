const ensureHttpsImageUrl = (url) => {
  if (!url) return '';
  const urlStr = String(url).trim();
  if (!urlStr) return '';
  
  if (urlStr.startsWith('http://')) {
    return urlStr.replace('http://', 'https://');
  }
  return urlStr;
};

// Pre-compiled regex patterns for performance
const VIDEO_TAG_REGEX = /[\(\[](official|video|audio|lyric|lyrics|hd|mv|full video)[\)\]]/gi;
const SEPARATOR_REGEX = /\s+[-–—~]\s+/;

/**
 * Parses and sanitizes raw track title and artist strings to prevent duplicate artist displays
 * and clean up common video title artifacts like [Official Video].
 */
export const getCleanTrackDetails = (rawTitle = '', rawArtist = '') => {
  let title = (rawTitle || '').trim();
  let artist = (rawArtist || '').trim();

  if (artist === 'Unknown Artist' || artist === 'Sukh Sangeet') {
    artist = '';
  }

  if (SEPARATOR_REGEX.test(title)) {
    const parts = title.split(SEPARATOR_REGEX);
    if (parts.length >= 2) {
      const p1 = parts[0].trim();
      const p2 = parts.slice(1).join(' - ').trim();

      const cleanP1 = p1.replace(VIDEO_TAG_REGEX, '').trim();
      const cleanP2 = p2.replace(VIDEO_TAG_REGEX, '').trim();

      if (artist) {
        const lowerArtist = artist.toLowerCase();
        if (cleanP2.toLowerCase() === lowerArtist || cleanP2.toLowerCase().includes(lowerArtist)) {
          title = cleanP1;
        } else if (cleanP1.toLowerCase() === lowerArtist || cleanP1.toLowerCase().includes(lowerArtist)) {
          title = cleanP2;
        } else {
          title = cleanP1;
          if (!artist) artist = cleanP2;
        }
      } else {
        title = cleanP1;
        artist = cleanP2;
      }
    }
  }

  if (artist) {
    const escapedArtist = artist.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const suffixRegex = new RegExp(`\\s*[-–—~]?\\s*${escapedArtist}\\s*$`, 'i');
    const prefixRegex = new RegExp(`^\\s*${escapedArtist}\\s*[-–—~]?\\s*`, 'i');

    title = title.replace(suffixRegex, '').replace(prefixRegex, '').trim();
  }

  return {
    title: title || rawTitle,
    artist: artist || rawArtist || 'Unknown Artist',
  };
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
