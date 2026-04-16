import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
          ? <mark key={i} className="bg-gray-900/10 text-gray-900 rounded px-0.5 not-italic">{part}</mark>
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

  /* Escape key */
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
        flex flex-col overflow-hidden bg-white
        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${isStatic
          ? 'w-full h-full'
          : `fixed inset-x-0 bottom-0 z-[100]
             h-[88vh] rounded-t-[2rem]
             lg:absolute lg:inset-auto lg:left-1/2 lg:top-1/2
             lg:-translate-x-1/2 lg:-translate-y-1/2
             lg:w-[480px] lg:h-[80vh] lg:max-h-[740px]
             lg:rounded-[2.5rem] lg:shadow-2xl`
        }
        ${!isStatic && (isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drag handle – mobile only */}
      {!isStatic && (
        <div className="lg:hidden pt-3.5 pb-1 shrink-0" aria-hidden="true">
          <div className="w-10 h-1 bg-black/[0.08] rounded-full mx-auto" />
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-8 pt-5 pb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Queue</h2>
          <p className="text-caption mt-0.5">{queue.length} {queue.length === 1 ? 'track' : 'tracks'}</p>
        </div>
        {!isStatic && (
          <button
            onClick={onClose}
            className="touch-target rounded-xl bg-black/[0.04] hover:bg-gray-900 hover:text-white
                       text-gray-500 transition-all duration-150"
            aria-label="Close queue"
            id="close-queue-btn"
          >
            <X size={19} />
          </button>
        )}
      </header>

      {/* Search */}
      <div className="px-6 md:px-8 pb-4 shrink-0">
        <div className="relative flex items-center group">
          <Search
            size={16}
            className="absolute left-4 text-gray-400 group-focus-within:text-gray-700 transition-colors pointer-events-none"
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search queue…"
            className="
              w-full h-11 bg-black/[0.04] rounded-xl pl-11 pr-4
              text-sm font-semibold text-gray-900
              placeholder:text-gray-400/70 placeholder:font-normal
              outline-none focus:bg-black/[0.06] transition-all duration-200
              border border-transparent focus:border-gray-200
            "
            aria-label="Search queue"
          />
        </div>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto px-5 md:px-7 pb-6 space-y-6 custom-scrollbar">

          {/* Now Playing */}
          <section aria-label="Now playing">
            <div className="flex items-center gap-2 mb-3 ml-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-900 shadow-[0_0_6px_rgba(0,0,0,0.3)]" aria-hidden="true" />
              <h3 className="text-label">Now Playing</h3>
            </div>

            {currentTrack ? (
              <div className="surface-inset rounded-2xl p-3.5 flex items-center gap-4">
                <img
                  src={currentTrack.poster}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-gray-900 leading-tight">{currentTrack.title}</p>
                  <p className="text-caption mt-0.5 truncate">{currentTrack.artist || 'Unknown Artist'}</p>
                </div>
                {/* Waveform indicator */}
                <div className="flex items-end gap-[3px] h-4 text-gray-900 pr-1 shrink-0" aria-hidden="true">
                  {[0.1, 0.3, 0.2, 0.4, 0.15].map((delay, i) => (
                    <div key={i} className="w-[3px] rounded-full bg-current animate-waveform" style={{ animationDelay: `${delay}s` }} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-black/[0.06] rounded-2xl py-8 text-center">
                <p className="text-label">No active track</p>
              </div>
            )}
          </section>

          {/* Up Next */}
          <section aria-label="Up next">
            <h3 className="text-label mb-3 ml-0.5">Up Next</h3>

            {!filteredItems.length ? (
              <div className="py-16 text-center">
                <p className="text-label opacity-40">{search ? 'No matches' : 'Empty Queue'}</p>
              </div>
            ) : (
              <div className="space-y-0.5" role="list">
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
                        group relative flex items-center gap-3.5 px-2 py-2 rounded-xl
                        transition-all duration-150 cursor-pointer
                        hover:bg-black/[0.04] active:bg-black/[0.07]
                        ${isDragging ? 'opacity-30 scale-[0.98]' : ''}
                      `}
                      aria-label={`Track ${index + 1}: ${track.title}`}
                    >
                      {/* Drop indicator line */}
                      {isDropTarget && (
                        <div className="absolute -top-px inset-x-3 h-[2px] bg-gray-900 rounded-full" aria-hidden="true" />
                      )}

                      {/* Index */}
                      <span className="hidden sm:flex w-7 shrink-0 items-center justify-center text-[10px] font-black tabular-nums text-gray-400/50 select-none">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Thumbnail */}
                      <img
                        src={track.poster}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0"
                      />

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-gray-900 leading-tight">
                          <HighlightedText text={track.title} query={search} />
                        </p>
                        <p className="text-caption mt-0.5 truncate">
                          <HighlightedText text={track.artist || 'Unknown Artist'} query={search} />
                        </p>
                      </div>

                      {/* Duration + drag handle */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                        <span className="text-[11px] font-bold tabular-nums text-gray-400/70">
                          {formatDuration(getTrackDuration(track))}
                        </span>
                        <GripVertical size={15} className="text-gray-300 cursor-grab" aria-hidden="true" />
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
      <footer className="px-6 md:px-8 py-5 border-t border-black/[0.04] bg-white shrink-0">
        <button
          onClick={shuffleQueue}
          className="
            w-full h-12 rounded-xl bg-gray-900 text-white
            text-[10px] font-black uppercase tracking-[0.2em]
            shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]
            transition-all duration-150
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
      className={`fixed inset-0 z-[1000] bg-black/20 backdrop-blur-sm transition-opacity duration-400 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-hidden={!isOpen}
    >
      {drawerContent}
    </div>
  );
}
