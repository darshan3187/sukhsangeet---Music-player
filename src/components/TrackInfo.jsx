import { usePlayer } from '../context/PlayerContext';

/**
 * TrackInfo – compact now-playing info card.
 * Currently a reserved/legacy component; kept in sync with the design system.
 */
export default function TrackInfo() {
  const { currentTrack, isBuffering } = usePlayer();

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
      {/* Thumbnail */}
      <div className="relative shrink-0">
        <img
          src={currentTrack.poster}
          alt={currentTrack.title}
          className={`
            w-11 h-11 rounded-xl object-cover shadow-md
            transition-opacity duration-300
            ${isBuffering ? 'opacity-60 animate-pulse' : 'opacity-100'}
          `}
        />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1 overflow-hidden">
        {/* Marquee title for long names */}
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
