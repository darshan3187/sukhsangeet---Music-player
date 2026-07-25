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
        group relative flex items-center gap-3 md:gap-4
        rounded-lg p-2 md:p-2.5 pr-3 md:pr-4 border transition-all duration-150 cursor-default
        ${isDragging
          ? 'opacity-60 scale-[0.98] z-50 bg-white border-[#171717] shadow-level-4'
          : isActive
            ? 'bg-white border-[#171717] shadow-level-2'
            : 'bg-white border-[#ebebeb] hover:border-[#a1a1a1] shadow-level-1 text-[#4d4d4d]'}
      `}
    >
      <div
        className="hidden md:flex w-8 shrink-0 items-center justify-center
                   font-mono text-xs font-medium text-[#888888] select-none"
        aria-hidden="true"
      >
        {String(index).padStart(2, '0')}
      </div>

      <button
        type="button"
        className="relative shrink-0 cursor-pointer"
        onClick={onPlay}
        aria-label={`Play ${track.title}`}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-md border border-[#ebebeb] bg-[#fafafa] flex items-center justify-center">
          {imageError || !track.poster ? (
            <div className="w-full h-full bg-[#f5f5f5] flex items-center justify-center">
              <span className="font-mono text-xs font-semibold text-[#888888]">♪</span>
            </div>
          ) : (
            <img
              src={track.poster}
              alt={`${track.title} artwork`}
              loading="lazy"
              onError={handleImageError}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          )}
        </div>

        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#171717]/40 rounded-md backdrop-blur-xs">
            <div className="flex items-end gap-[2px] h-3 text-white" aria-hidden="true">
              {[0.1, 0.3, 0.2, 0.4, 0.15].map((delay, i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-full bg-current animate-waveform"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </button>

      <button
        type="button"
        className="flex-1 min-w-0 py-0.5 text-left cursor-pointer"
        onClick={onPlay}
        aria-label={`Play ${track.title}`}
      >
        <p
          className={`
            truncate font-medium text-xs md:text-sm leading-snug transition-colors
            ${isActive
              ? 'text-[#171717] font-semibold'
              : 'text-[#171717] group-hover:text-[#0070f3]'}
          `}
        >
          {track.title}
        </p>
        <p className="font-mono text-[10px] text-[#888888] mt-0.5 truncate uppercase">
          {track.artist || 'Unknown Artist'}
        </p>
      </button>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        {durationLabel ? (
          <span className="hidden lg:block font-mono text-[11px] text-[#888888] min-w-[36px] text-right">
            {durationLabel}
          </span>
        ) : (
          <span className="hidden lg:flex items-center justify-end min-w-[36px] text-[#888888]" aria-hidden="true">
            <span className="h-1 w-1 rounded-full bg-current" />
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="
            w-8 h-8 flex items-center justify-center cursor-pointer
            rounded-md text-[#888888] hover:text-[#ee0000] hover:bg-[#f7d4d6]/30
            transition-all duration-150
            opacity-100 md:opacity-0 group-hover:opacity-100
            focus-visible:opacity-100
          "
          aria-label={`Remove ${track.title} from playlist`}
          id={`remove-track-${track.playlistTrackId}`}
        >
          <Trash2 size={14} />
        </button>

        <div
          {...attributes}
          {...listeners}
          className="
            hidden md:flex w-8 h-8 items-center justify-center
            rounded-md text-[#a1a1a1] cursor-grab active:cursor-grabbing
            hover:text-[#171717] hover:bg-[#f5f5f5]
            transition-all duration-150
          "
          title="Drag to reorder"
          aria-roledescription="Sortable"
          aria-label={`Reorder ${track.title}`}
        >
          <GripVertical size={15} />
        </div>
      </div>
    </div>
  );
};

export default memo(SortableTrackItem);
