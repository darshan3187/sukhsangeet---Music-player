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
        <div className="w-10 h-10 rounded-md bg-[#f5f5f5] shrink-0 animate-pulse border border-[#ebebeb]" />
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="h-2 w-28 bg-[#f5f5f5] rounded-full animate-pulse" />
          <div className="h-2 w-16 bg-[#f5f5f5] rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 min-w-0" aria-label={`Now playing: ${currentTrack.title}`}>
      <div className="relative shrink-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-md overflow-hidden bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center">
          {imageError || !currentTrack.poster ? (
            <div className="w-full h-full bg-[#f5f5f5] flex items-center justify-center">
              <span className="font-mono text-xs font-semibold text-[#888888]">♪</span>
            </div>
          ) : (
            <img
              src={currentTrack.poster}
              alt={currentTrack.title}
              onError={handleImageError}
              className={`
                w-full h-full object-cover
                transition-opacity duration-150
                ${isBuffering ? 'opacity-50 animate-pulse' : 'opacity-100'}
              `}
            />
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="relative overflow-hidden h-[1.25em]">
          <h4
            className={`
              text-xs font-semibold text-[#171717] leading-tight whitespace-nowrap
              ${currentTrack.title.length > 28 ? 'animate-marquee' : ''}
            `}
          >
            {currentTrack.title}
          </h4>
        </div>
        <p className="font-mono text-[10px] text-[#888888] mt-0.5 truncate uppercase">
          {currentTrack.artist || 'Unknown Artist'}
        </p>
      </div>
    </div>
  );
}
