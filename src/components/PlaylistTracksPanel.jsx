import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylist } from '../hooks/usePlaylist';
import { toPlayerQueue } from '../utils/playerTrackAdapter';
import { searchYouTubeTracks } from '../api/playlists';
import AddTrackInput from './AddTrackInput';
import SortableTrackItem from './SortableTrackItem';
import { Loader2, Music, Play, Search } from 'lucide-react';

const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${remaining < 10 ? '0' : ''}${remaining}`;
};

const toSearchQueueTrack = (track) => ({
  id: track.id ?? track.youtube_id,
  youtubeId: track.youtube_id ?? track.youtubeId ?? track.id ?? '',
  youtube_id: track.youtube_id ?? track.youtubeId ?? track.id ?? '',
  title: track.title ?? '',
  artist: track.artist ?? 'YouTube',
  poster: track.thumbnail_url ?? '',
  thumbnail_url: track.thumbnail_url ?? '',
  color: track.color ?? '#e62135',
  duration_seconds: track.duration_seconds ?? 0,
});

const PlaylistTracksPanel = ({ playlistId, onRequestOpenLibrary, onImportPlaylist }) => {
  const { playlist, tracks, isLoading, error, addTrack, removeTrack, reorderTracks } = usePlaylist(playlistId);
  const { loadQueue, currentTrack } = usePlayer();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const searchRequestIdRef = useRef(0);

  const trackIds = useMemo(() => tracks.map((t) => t.playlistTrackId), [tracks]);
  const queueTracks = useMemo(() => toPlayerQueue(tracks), [tracks]);
  const normalizedSearchResults = useMemo(() => searchResults.map(toSearchQueueTrack), [searchResults]);

  const handleTrackPlay = useCallback((index) => {
    loadQueue(queueTracks, { autoPlayIndex: index, preserveCurrentTrack: false });
  }, [loadQueue, queueTracks]);

  const handleSearchPlay = useCallback((index) => {
    loadQueue(normalizedSearchResults, { autoPlayIndex: index, preserveCurrentTrack: false });
  }, [loadQueue, normalizedSearchResults]);

  useEffect(() => {
    if (playlistId) {
      return undefined;
    }

    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setSearchError('');
      setSearchLoading(false);
      return undefined;
    }

    if (query.length < 2) {
      setSearchResults([]);
      setSearchError('Type at least 2 characters to search YouTube.');
      setSearchLoading(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      const requestId = searchRequestIdRef.current + 1;
      searchRequestIdRef.current = requestId;
      setSearchLoading(true);
      setSearchError('');

      try {
        const payload = await searchYouTubeTracks(query, 12);
        if (searchRequestIdRef.current !== requestId) {
          return;
        }

        setSearchResults(Array.isArray(payload?.results) ? payload.results : []);
      } catch (requestError) {
        if (searchRequestIdRef.current === requestId) {
          setSearchResults([]);
          setSearchError(requestError?.response?.data?.error || requestError?.message || 'Failed to search YouTube.');
        }
      } finally {
        if (searchRequestIdRef.current === requestId) {
          setSearchLoading(false);
        }
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [playlistId, searchQuery]);

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
      <div className="flex-1 flex flex-col min-h-0 h-full overflow-y-auto overflow-x-hidden animate-fade-in-up custom-scrollbar" role="main" aria-label="YouTube music search">
        <div className="px-5 md:px-10 pt-8 md:pt-12 pb-5 shrink-0">
          <div className="max-w-4xl">
            <span className="text-label block mb-3">Search Music</span>
            <h2 className="font-black text-gray-900 tracking-tighter" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', lineHeight: 1.02 }}>
              Find a song on YouTube
            </h2>
            <p className="text-body-sm mt-4 max-w-2xl">
              Search directly from the workspace when no playlist is selected. Pick a result to play it immediately, or open the library to switch to your saved playlists.
            </p>

            <div className="mt-7 max-w-2xl relative group">
              <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-700 transition-colors pointer-events-none"
                aria-hidden="true"
              />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search music..."
                className="w-full rounded-full bg-black/[0.04] hover:bg-black/[0.06] focus:bg-white focus:shadow-sm border border-black/[0.06] focus:border-gray-300 focus:ring-2 focus:ring-gray-900/10 pl-[3.25rem] pr-4 py-4 md:py-[1.125rem] text-base md:text-lg font-semibold text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400/65 placeholder:font-normal"
                autoComplete="off"
                aria-label="Search music on YouTube"
              />
            </div>

            {searchError && (
              <p role="alert" className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
                {searchError}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 px-5 md:px-10 pb-10">
          {!searchQuery.trim() ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-[2rem] bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-8 md:p-10 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.6)]">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <Music size={28} aria-hidden="true" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">Search from the workspace</h3>
                <p className="mt-4 max-w-xl text-sm md:text-base text-white/75 leading-7">
                  Enter any song, artist, or mood and pull matching videos from YouTube without leaving the workspace.
                </p>
              </div>

              <div className="rounded-[2rem] border border-black/[0.06] bg-white p-7 md:p-8 shadow-sm">
                <p className="text-label">Need your playlists instead?</p>
                <p className="mt-3 text-body-sm text-gray-600">
                  Open the library to browse, add tracks, or jump back into a saved playlist.
                </p>
                <button
                  onClick={() => onRequestOpenLibrary?.()}
                  className="mt-6 btn-primary text-sm px-7 py-3.5 rounded-xl"
                  aria-label="Open library to choose a playlist"
                  id="open-library-cta-btn"
                >
                  Open Library
                </button>
              </div>
            </div>
          ) : searchLoading ? (
            <div className="mt-8 flex items-center justify-center rounded-[2rem] border border-black/[0.06] bg-white py-16 text-gray-500">
              <Loader2 size={20} className="mr-3 animate-spin" />
              <span className="text-sm font-semibold">Searching YouTube...</span>
            </div>
          ) : searchResults.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {searchResults.map((track, index) => (
                <button
                  key={`${track.youtube_id || track.id}-${index}`}
                  type="button"
                  onClick={() => handleSearchPlay(index)}
                  className="group text-left rounded-[1.75rem] border border-black/[0.06] bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-gray-900"
                  aria-label={`Play ${track.title}`}
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-black/[0.03]">
                    <img
                      src={track.thumbnail_url}
                      alt={track.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-4 flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black tracking-tight text-gray-900">{track.title}</p>
                      <p className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        {track.artist || 'YouTube'}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-600">
                      {formatDuration(track.duration_seconds)}
                    </span>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white transition-transform group-hover:translate-x-1">
                    <Play size={12} fill="currentColor" />
                    Play
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-dashed border-black/[0.08] bg-black/[0.015] px-6 py-14 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-black/[0.04] text-gray-700">
                <Search size={30} aria-hidden="true" />
              </div>
              <p className="text-label">No results yet</p>
              <p className="mx-auto mt-2 max-w-md text-body-sm text-gray-600">
                Search for a song, artist, or phrase to show matching YouTube videos here.
              </p>
            </div>
          )}
        </div>
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
