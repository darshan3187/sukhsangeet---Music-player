import { useEffect, useMemo, useRef, useState } from 'react';
import { GripVertical, Search, X } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const HighlightedText = ({ text, query }) => {
  if (!query) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'ig'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-[#171717]/10 text-[#171717] font-semibold rounded px-0.5 not-italic">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
};

export default function TrackDrawer({ isOpen, onClose, isStatic = false }) {
  const { queue, currentTrack, currentTrackIndex, playTrack, reorderQueue, shuffleQueue, getTrackDuration } = usePlayer();

  const [search, setSearch] = useState('');
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const drawerRef  = useRef(null);
  const backdropRef = useRef(null);
  const dragItem   = useRef(null);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return queue
      .map((track, index) => ({ track, index }))
      .filter(({ track }) =>
        !q ||
        (track.title  || '').toLowerCase().includes(q) ||
        (track.artist || '').toLowerCase().includes(q)
      );
  }, [queue, search]);

  useEffect(() => {
    if (!isOpen || isStatic) return;
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isOpen, onClose, isStatic]);

  /* Drag handlers */
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e, index) => { e.preventDefault(); setDragOverIndex(index); };
  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragItem.current !== null) reorderQueue(dragItem.current, index);
    dragItem.current = null;
    setDraggingIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    dragItem.current = null;
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  /* ── Drawer content ── */
  const drawerContent = (
    <aside
      ref={drawerRef}
      role="complementary"
      aria-label="Playback queue"
      aria-hidden={!isStatic && !isOpen}
      inert={!isStatic && !isOpen}
      className={`
        flex flex-col overflow-hidden bg-white border border-[#ebebeb]
        transition-all duration-300 ease-in-out
        ${isStatic
          ? 'w-full h-full'
          : `fixed inset-x-0 bottom-0 z-[100]
             h-[88vh] rounded-t-xl
             lg:absolute lg:inset-auto lg:left-1/2 lg:top-1/2
             lg:-translate-x-1/2 lg:-translate-y-1/2
             lg:w-[480px] lg:h-[80vh] lg:max-h-[740px]
             lg:rounded-xl lg:shadow-level-5`
        }
        ${!isStatic && (isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drag handle – mobile only */}
      {!isStatic && (
        <div className="lg:hidden pt-3 pb-1 shrink-0" aria-hidden="true">
          <div className="w-8 h-1 bg-[#ebebeb] rounded-full mx-auto" />
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0 border-b border-[#ebebeb]">
        <div>
          <span className="mono-eyebrow mb-0.5 block">PLAYBACK QUEUE</span>
          <h2 className="text-xl font-semibold text-[#171717] tracking-tight">Queue</h2>
        </div>
        {!isStatic && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#888888] hover:text-[#171717] hover:bg-[#fafafa] transition-all cursor-pointer"
            aria-label="Close queue"
            id="close-queue-btn"
          >
            <X size={18} />
          </button>
        )}
      </header>

      {/* Search */}
      <div className="px-6 pt-4 pb-3 shrink-0">
        <div className="relative flex items-center group">
          <Search
            size={15}
            className="absolute left-3.5 text-[#888888] group-focus-within:text-[#171717] transition-colors pointer-events-none"
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search queue…"
            className="
              w-full h-9 bg-white border border-[#ebebeb] rounded-md pl-9 pr-3
              text-xs font-sans text-[#171717]
              placeholder:text-[#888888]
              outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all duration-150
            "
            aria-label="Search queue"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-5 custom-scrollbar">

          {/* Now Playing */}
          <section aria-label="Now playing">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" aria-hidden="true" />
              <span className="mono-eyebrow">Now Playing</span>
            </div>

            {currentTrack ? (
              <div className="rounded-md border border-[#ebebeb] bg-[#fafafa] p-3 flex items-center gap-3">
                <img
                  src={currentTrack.poster}
                  alt={currentTrack.title}
                  className="w-10 h-10 rounded-md object-cover border border-[#ebebeb] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate text-[#171717] leading-tight">{currentTrack.title}</p>
                  <p className="font-mono text-[10px] text-[#888888] mt-0.5 truncate uppercase">{currentTrack.artist || 'Unknown Artist'}</p>
                </div>
                {/* Waveform indicator */}
                <div className="flex items-end gap-[2px] h-3 text-[#171717] pr-1 shrink-0" aria-hidden="true">
                  {[0.1, 0.3, 0.2, 0.4, 0.15].map((delay, i) => (
                    <div key={i} className="w-[2px] rounded-full bg-current animate-waveform" style={{ animationDelay: `${delay}s` }} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-[#ebebeb] rounded-md py-6 text-center bg-white">
                <span className="mono-eyebrow text-[#888888]">No active track</span>
              </div>
            )}
          </section>

          {/* Up Next */}
          <section aria-label="Up next">
            <span className="mono-eyebrow mb-2 block">Up Next</span>

            {!filteredItems.length ? (
              <div className="py-12 text-center font-mono text-xs text-[#888888]">
                <p>{search ? 'No matches found' : 'Queue is empty'}</p>
              </div>
            ) : (
              <div className="space-y-1" role="list">
                {filteredItems.map(({ track, index }) => {
                  const isCurrent    = index === currentTrackIndex;
                  const isDragging   = draggingIndex === index;
                  const isDropTarget = dragOverIndex === index && draggingIndex !== index;

                  if (isCurrent) return null;

                  return (
                    <div
                      key={`${track.playlistTrackId}-${index}`}
                      role="listitem"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      onClick={() => playTrack(index)}
                      className={`
                        group relative flex items-center gap-3 p-2 rounded-md border border-[#ebebeb] bg-white
                        transition-all duration-150 cursor-pointer
                        hover:bg-[#fafafa] active:bg-[#f5f5f5]
                        ${isDragging ? 'opacity-40 scale-[0.98]' : ''}
                      `}
                      aria-label={`Track ${index + 1}: ${track.title}`}
                    >
                      {/* Drop indicator line */}
                      {isDropTarget && (
                        <div className="absolute -top-px inset-x-2 h-[2px] bg-[#171717] rounded-full" aria-hidden="true" />
                      )}

                      {/* Index */}
                      <span className="hidden sm:flex w-6 shrink-0 items-center justify-center font-mono text-[10px] text-[#888888] select-none">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Thumbnail */}
                      <img
                        src={track.poster}
                        alt=""
                        className="w-8 h-8 rounded-md object-cover border border-[#ebebeb] shrink-0"
                      />

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate text-[#171717] leading-tight">
                          <HighlightedText text={track.title} query={search} />
                        </p>
                        <p className="font-mono text-[10px] text-[#888888] mt-0.5 truncate uppercase">
                          <HighlightedText text={track.artist || 'Unknown Artist'} query={search} />
                        </p>
                      </div>

                      {/* Duration + drag handle */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-[10px] text-[#888888]">
                          {formatDuration(getTrackDuration(track))}
                        </span>
                        <GripVertical size={14} className="text-[#a1a1a1] cursor-grab" aria-hidden="true" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#ebebeb] bg-white shrink-0">
        <button
          onClick={shuffleQueue}
          className="
            w-full h-10 rounded-md bg-[#171717] text-white
            font-mono text-xs font-medium uppercase tracking-wider
            shadow-sm hover:bg-black active:scale-[0.98]
            transition-all duration-150 cursor-pointer
          "
          id="shuffle-queue-btn"
        >
          Shuffle Queue
        </button>
      </footer>
    </aside>
  );

  if (isStatic) return drawerContent;

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-[1000] bg-black/30 backdrop-blur-xs transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-hidden={!isOpen}
    >
      {drawerContent}
    </div>
  );
}
