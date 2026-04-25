import { memo, useCallback, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return null;
  const total = Number(seconds) || 0;
  const minutes = Math.floor(total / 60);
  const secs = Math.floor(total % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const SortableTrackItem = ({ track, isActive, onPlay, onRemove, index }) => {
  const [imageError, setImageError] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.playlistTrackId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const durationLabel = formatDuration(track.duration);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="listitem"
      aria-label={`Track ${index}: ${track.title}${isActive ? ', now playing' : ''}`}
      className={`
        group relative flex items-center gap-3 md:gap-5
        rounded-xl md:rounded-2xl p-2.5 pr-4 md:pr-6
        transition-all duration-200 cursor-default
        ${isDragging
          ? 'opacity-60 scale-[0.98] z-50 surface-raised shadow-xl'
          : isActive
            ? 'surface-raised border border-gray-300/80 shadow-md ring-1 ring-black/[0.06]'
            : 'hover:bg-black/[0.035] text-gray-500'}
      `}
    >
      <div
        className="hidden md:flex w-10 shrink-0 items-center justify-center
                   text-[11px] font-black tabular-nums text-gray-400 opacity-50 select-none"
        aria-hidden="true"
      >
        {String(index).padStart(2, '0')}
      </div>

      <button
        type="button"
        className="relative shrink-0"
        onClick={onPlay}
        aria-label={`Play ${track.title}`}
      >
        <div className="w-11 h-11 md:w-14 md:h-14 overflow-hidden rounded-xl shadow-sm bg-black/5 ring-1 ring-black/[0.03] cursor-pointer flex items-center justify-center">
          {imageError || !track.poster ? (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-500">♪</span>
            </div>
          ) : (
            <img
              src={track.poster}
              alt={`${track.title} artwork`}
              loading="lazy"
              onError={handleImageError}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>

        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl backdrop-blur-[2px]">
            <div className="flex items-end gap-[3px] h-4 text-white" aria-hidden="true">
              {[0.1, 0.3, 0.2, 0.4, 0.15].map((delay, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-current animate-waveform"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </button>


      <button
        type="button"
        className="flex-1 min-w-0 py-0.5 text-left"
        onClick={onPlay}
        aria-label={`Play ${track.title}`}
      >
        <p
          className={`
            truncate font-bold leading-snug tracking-tight transition-colors
            ${isActive
              ? 'text-gray-900 text-sm md:text-base'
              : 'text-gray-800 text-sm md:text-[0.9375rem]'}
          `}
        >
          {track.title}
        </p>
        <p className="text-caption mt-1 truncate">
          {track.artist || 'Unknown Artist'}
        </p>
      </button>

      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        {durationLabel ? (
          <span className="hidden lg:block text-[12px] font-bold tabular-nums text-gray-400/60 min-w-[40px] text-right">
            {durationLabel}
          </span>
        ) : (
          <span className="hidden lg:flex items-center justify-end min-w-[40px] text-gray-300" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="
            min-w-[40px] min-h-[40px] flex items-center justify-center
            rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50
            transition-all duration-150
            opacity-100 md:opacity-0 group-hover:opacity-100
            focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-red-500
          "
          aria-label={`Remove ${track.title} from playlist`}
          id={`remove-track-${track.playlistTrackId}`}
        >
          <Trash2 size={16} />
        </button>

        <div
          {...attributes}
          {...listeners}
          className="
            hidden md:flex min-w-[40px] min-h-[40px] items-center justify-center
            rounded-xl text-gray-300 cursor-grab active:cursor-grabbing
            hover:text-gray-500 hover:bg-black/5
            transition-all duration-150
          "
          title="Drag to reorder"
          aria-roledescription="Sortable"
          aria-label={`Reorder ${track.title}`}
        >
          <GripVertical size={17} />
        </div>
      </div>
    </div>
  );
};

export default memo(SortableTrackItem);
