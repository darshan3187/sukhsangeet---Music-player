import { memo, useCallback, useMemo } from 'react';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylist } from '../hooks/usePlaylist';
import { toPlayerQueue } from '../utils/playerTrackAdapter';
import AddTrackInput from './AddTrackInput';
import SortableTrackItem from './SortableTrackItem';
import { Music, Play, Search } from 'lucide-react';

const PlaylistTracksPanel = ({ playlistId, onRequestOpenLibrary, onImportPlaylist }) => {
  const { playlist, tracks, isLoading, error, addTrack, removeTrack, reorderTracks } = usePlaylist(playlistId);
  const { loadQueue, currentTrack } = usePlayer();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const trackIds = useMemo(() => tracks.map((t) => t.playlistTrackId), [tracks]);
  const queueTracks = useMemo(() => toPlayerQueue(tracks), [tracks]);

  const handleTrackPlay = useCallback((index) => {
    loadQueue(queueTracks, { autoPlayIndex: index, preserveCurrentTrack: false });
  }, [loadQueue, queueTracks]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = trackIds.indexOf(active.id);
    const newIndex = trackIds.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    void reorderTracks(arrayMove(trackIds, oldIndex, newIndex));
  }, [reorderTracks, trackIds]);

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0" aria-busy="true" aria-label="Loading playlist">
        {/* Header skeleton */}
        <div className="px-8 md:px-12 pt-10 md:pt-14 pb-8 shrink-0 space-y-6">
          <div className="space-y-3">
            <div className="w-20 h-3 bg-black/5 rounded-full skeleton-shimmer" />
            <div className="w-64 h-10 bg-black/[0.06] rounded-2xl skeleton-shimmer" />
          </div>
          <div className="w-full max-w-2xl h-14 bg-black/[0.04] rounded-2xl skeleton-shimmer" />
        </div>
        {/* Track skeletons – match SortableTrackItem structure */}
        <div className="flex-1 px-8 md:px-12 pb-12 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-2.5 rounded-xl"
              style={{ opacity: 1 - i * 0.13 }}
            >
              <div className="hidden md:block w-10 h-3 bg-black/[0.04] rounded-full skeleton-shimmer" />
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-black/[0.05] skeleton-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/5 bg-black/[0.06] rounded-full skeleton-shimmer" />
                <div className="h-2.5 w-1/4 bg-black/[0.04] rounded-full skeleton-shimmer" />
              </div>
              <div className="hidden md:block w-10 h-2.5 bg-black/[0.04] rounded-full skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── No playlist selected ── */
  if (!playlistId) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade-in-up"
        role="main"
        aria-label="No playlist selected"
      >
        <div
          className="w-24 h-24 surface-raised rounded-[2rem] flex items-center justify-center mb-8
                     transition-transform hover:scale-105 hover-lift"
        >
          <Music size={40} className="text-gray-900" aria-hidden="true" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-gray-900">
          Choose a Soundtrack
        </h2>
        <p className="text-body-sm max-w-xs mb-10">
          Select a playlist from your library to start your listening experience.
        </p>
        <button
          onClick={() => onRequestOpenLibrary?.()}
          className="btn-primary text-sm px-8 py-3.5 rounded-xl"
          aria-label="Open library to choose a playlist"
          id="open-library-cta-btn"
        >
          Open Library
        </button>
      </div>
    );
  }

  /* ── Playlist view ── */
  return (
    <div className="w-full h-full flex flex-col min-h-0 relative" role="main">

      {/* ── Panel Header ── */}
      {playlist && (
        <div className="px-8 md:px-12 pt-10 md:pt-14 pb-6 shrink-0">
          {/* Title row */}
          <div className="flex items-end justify-between gap-6 mb-8">
            <div className="flex-1 min-w-0">
              <span className="text-label block mb-3">
                Collective · Playlist
              </span>
              <h2
                className="font-black text-gray-900 tracking-tighter truncate"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
              >
                {playlist?.name}
              </h2>
              {tracks.length > 0 && (
                <p className="text-caption mt-2">
                  {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
                </p>
              )}
            </div>

            {/* Play button */}
            <button
              onClick={() => handleTrackPlay(0)}
              disabled={!tracks.length}
              className="
                w-14 h-14 md:w-16 md:h-16 rounded-[1.25rem] bg-gray-900 text-white shrink-0
                flex items-center justify-center mb-1
                shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200
                hover:scale-105 disabled:opacity-40 disabled:pointer-events-none
                focus-visible:outline-2 focus-visible:outline-gray-900
              "
              aria-label={`Play ${playlist?.name || 'playlist'}`}
              id="play-playlist-btn"
            >
              <Play size={24} fill="currentColor" className="translate-x-0.5" />
            </button>
          </div>

          {/* Add Track Input */}
          <div className="max-w-2xl">
            <AddTrackInput 
              onAddTrack={addTrack} 
              onImportPlaylist={onImportPlaylist}
              isLoading={isLoading} 
            />
          </div>
        </div>
      )}

      {/* ── Tracks List ── */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-5 md:px-12 pb-44 lg:pb-20 custom-scrollbar"
      >
        {error && (
          <p role="alert" className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
            {error}
          </p>
        )}
        {!tracks.length ? (
          /* Empty state */
          <div
            className="
              mt-4 py-24 flex flex-col items-center justify-center
              border-2 border-dashed border-black/[0.05] rounded-3xl bg-black/[0.01]
            "
            aria-label="No tracks in this playlist"
          >
            <div className="w-16 h-16 rounded-2xl bg-black/[0.04] flex items-center justify-center mb-6">
              <Search size={28} className="text-gray-400" aria-hidden="true" />
            </div>
            <p className="text-label">No Tracks Yet</p>
            <p className="text-body-sm mt-2 max-w-[200px] text-center">
              Paste a YouTube URL above to add your first track.
            </p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={trackIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-1.5 md:space-y-2 pt-1" role="list" aria-label={`Tracks in ${playlist?.name || 'playlist'}`}>
                {tracks.map((track, index) => (
                  <SortableTrackItem
                    key={track.playlistTrackId}
                    track={track}
                    isActive={currentTrack?.youtubeId === track.youtubeId}
                    onPlay={() => handleTrackPlay(index)}
                    onRemove={() => removeTrack(track.playlistTrackId)}
                    index={index + 1}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default memo(PlaylistTracksPanel);
