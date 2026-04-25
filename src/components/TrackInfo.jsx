import { usePlayer } from '../context/PlayerContext';
import { useCallback, useState } from 'react';

export default function TrackInfo() {
  const { currentTrack, isBuffering } = usePlayer();
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  if (!currentTrack) {
    return (
      <div className="flex items-center gap-3" aria-busy="true" aria-label="Loading track info">
        <div className="w-11 h-11 rounded-xl bg-black/[0.06] skeleton-shimmer shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-2.5 w-32 bg-black/[0.06] rounded-full skeleton-shimmer" />
          <div className="h-2 w-20 bg-black/[0.04] rounded-full skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 min-w-0" aria-label={`Now playing: ${currentTrack.title}`}>
      <div className="relative shrink-0 flex items-center justify-center">
        <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/[0.06] flex items-center justify-center">
          {imageError || !currentTrack.poster ? (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-500">♪</span>
            </div>
          ) : (
            <img
              src={currentTrack.poster}
              alt={currentTrack.title}
              onError={handleImageError}
              className={`
                w-full h-full rounded-xl object-cover shadow-md
                transition-opacity duration-300
                ${isBuffering ? 'opacity-60 animate-pulse' : 'opacity-100'}
              `}
            />
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="relative overflow-hidden h-[1.2em]">
          <h4
            className={`
              text-sm font-bold text-gray-900 leading-tight whitespace-nowrap
              ${currentTrack.title.length > 28 ? 'animate-marquee' : ''}
            `}
          >
            {currentTrack.title}
          </h4>
        </div>
        <p className="text-caption mt-0.5 truncate">
          {currentTrack.artist || 'Unknown Artist'}
        </p>
      </div>
    </div>
  );
}
