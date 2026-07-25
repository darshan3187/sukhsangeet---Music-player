import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylist } from '../hooks/usePlaylist';
import { toPlayerQueue } from '../utils/playerTrackAdapter';
import { searchYouTubeTracks } from '../api/playlists';
import AddTrackInput from './AddTrackInput';
import SortableTrackItem from './SortableTrackItem';
import { Loader2, Music, Play, Plus, Search } from 'lucide-react';

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

const PlaylistTracksPanel = ({ playlistId, onRequestOpenLibrary, onImportPlaylist, onAddToPlaylist }) => {
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

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0" aria-busy="true" aria-label="Loading playlist">
        <div className="px-6 md:px-10 pt-8 md:pt-12 pb-6 shrink-0 space-y-4">
          <div className="space-y-2">
            <div className="w-16 h-2.5 bg-[#ebebeb] rounded-full animate-pulse" />
            <div className="w-56 h-8 bg-[#ebebeb] rounded-md animate-pulse" />
          </div>
          <div className="w-full max-w-xl h-10 bg-[#ebebeb] rounded-md animate-pulse" />
        </div>
        <div className="flex-1 px-6 md:px-10 pb-8 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-md border border-[#ebebeb] bg-white"
              style={{ opacity: 1 - i * 0.15 }}
            >
              <div className="w-10 h-10 rounded-md bg-[#f5f5f5] shrink-0 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-2/5 bg-[#f5f5f5] rounded-full animate-pulse" />
                <div className="h-2 w-1/4 bg-[#f5f5f5] rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!playlistId) {
    return (
      <div className="flex-1 flex flex-col min-h-0 h-full overflow-y-auto overflow-x-hidden custom-scrollbar" role="main" aria-label="YouTube music search">
        <div className="px-5 md:px-10 pt-8 md:pt-12 pb-4 shrink-0">
          <div className="max-w-4xl">
            <span className="mono-eyebrow mb-2">SEARCH YOUTUBE</span>
            <h2 className="font-semibold text-[#171717] tracking-tight text-3xl sm:text-5xl">
              Find a song on YouTube.
            </h2>
            <p className="text-xs text-[#4d4d4d] mt-3 max-w-xl leading-relaxed">
              Search directly from the workspace when no playlist is selected. Pick a result to play it immediately, or open the library to switch to your saved playlists.
            </p>

            <div className="mt-6 max-w-xl relative group">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] group-focus-within:text-[#171717] transition-colors pointer-events-none"
                aria-hidden="true"
              />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search music, artist, or song..."
                className="w-full rounded-md bg-white border border-[#ebebeb] hover:border-[#a1a1a1] focus:border-[#171717] focus:ring-1 focus:ring-[#171717] pl-[2.75rem] pr-4 h-11 text-sm font-sans text-[#171717] outline-none transition-all duration-150 placeholder:text-[#888888]"
                autoComplete="off"
                aria-label="Search music on YouTube"
              />
            </div>

            {searchError && (
              <p role="alert" className="mt-3 rounded-md border border-[#ee0000]/20 bg-[#f7d4d6]/40 px-4 py-2.5 font-mono text-xs text-[#ee0000]">
                {searchError}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 px-5 md:px-10 pb-10">
          {!searchQuery.trim() ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-xl border border-[#ebebeb] bg-[#171717] text-white p-8 shadow-level-4">
                <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center mb-5 border border-white/10">
                  <Music size={20} aria-hidden="true" />
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#a1a1a1]">Workspace Search</span>
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white mt-1">Search from the workspace</h3>
                <p className="mt-3 max-w-md text-xs text-white/70 leading-relaxed font-sans">
                  Enter any song, artist, or mood and pull matching videos from YouTube without leaving the workspace.
                </p>
              </div>

              <div className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2">
                <span className="mono-eyebrow mb-2">SAVED PLAYLISTS</span>
                <p className="text-sm font-semibold text-[#171717]">Need your playlists instead?</p>
                <p className="mt-2 text-xs text-[#4d4d4d] leading-relaxed">
                  Open the library to browse, add tracks, or jump back into a saved playlist.
                </p>
                <button
                  onClick={() => onRequestOpenLibrary?.()}
                  className="mt-5 btn-vercel-primary text-xs px-5 h-9"
                  aria-label="Open library to choose a playlist"
                  id="open-library-cta-btn"
                >
                  Open Library
                </button>
              </div>
            </div>
          ) : searchLoading ? (
            <div className="mt-6 flex items-center justify-center rounded-xl border border-[#ebebeb] bg-white py-14 text-[#888888]">
              <Loader2 size={18} className="mr-2.5 animate-spin text-[#171717]" />
              <span className="font-mono text-xs uppercase tracking-wider">Searching YouTube...</span>
            </div>
          ) : searchResults.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {searchResults.map((track, index) => (
                <div
                  key={`${track.youtube_id || track.id}-${index}`}
                  className="group text-left rounded-xl border border-[#ebebeb] bg-white p-3.5 shadow-level-2 transition-all duration-150 hover:shadow-level-3 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 sm:block">
                    <div className="w-20 h-20 sm:w-full sm:h-auto sm:aspect-[16/10] shrink-0 overflow-hidden rounded-md border border-[#ebebeb] bg-[#fafafa]">
                      <img
                        src={track.thumbnail_url}
                        alt={track.title}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0 flex-1 sm:mt-3">
                      <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-xs font-semibold leading-snug text-[#171717] sm:truncate">
                            {track.title}
                          </p>
                          <p className="mt-1 truncate font-mono text-[10px] uppercase text-[#888888]">
                            {track.artist || 'YouTube'}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md bg-[#fafafa] border border-[#ebebeb] px-2 py-0.5 font-mono text-[10px] text-[#4d4d4d]">
                          {formatDuration(track.duration_seconds)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 pt-2.5 border-t border-[#ebebeb]">
                    <button
                      type="button"
                      onClick={() => handleSearchPlay(index)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white shadow-sm hover:bg-black transition-all cursor-pointer"
                      aria-label={`Play ${track.title}`}
                    >
                      <Play size={10} fill="currentColor" />
                      Play
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddToPlaylist?.(track)}
                      className="inline-flex items-center gap-1 rounded-full bg-[#fafafa] border border-[#ebebeb] hover:bg-[#f5f5f5] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#171717] transition-all cursor-pointer"
                      aria-label={`Save ${track.title} to playlist`}
                      title="Add to Playlist"
                    >
                      <Plus size={11} strokeWidth={2} />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-[#ebebeb] bg-white px-6 py-12 text-center shadow-level-1">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-[#ebebeb] bg-[#fafafa] text-[#888888]">
                <Search size={22} aria-hidden="true" />
              </div>
              <span className="mono-eyebrow mb-1">NO MATCHES FOUND</span>
              <p className="mx-auto mt-2 max-w-sm text-xs text-[#888888]">
                Search for a song, artist, or phrase to show matching YouTube videos here.
              </p>
            </div>
          )}

          <div className="h-[calc(18rem+env(safe-area-inset-bottom))] md:h-10" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0 relative" role="main">
      {playlist && (
        <div className="px-6 md:px-10 pt-8 md:pt-12 pb-5 shrink-0">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <span className="mono-eyebrow mb-1.5 block">
                PLAYLIST WORKSPACE
              </span>
              <h2
                className="font-semibold text-[#171717] tracking-tight truncate text-2xl md:text-4xl"
              >
                {playlist?.name}
              </h2>
              {tracks.length > 0 && (
                <p className="font-mono text-xs text-[#888888] mt-1">
                  {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
                </p>
              )}
            </div>

            <button
              onClick={() => handleTrackPlay(0)}
              disabled={!tracks.length}
              className="
                w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#171717] text-white shrink-0
                flex items-center justify-center
                shadow-level-2 hover:bg-black active:scale-95 transition-all duration-150
                disabled:opacity-30 disabled:pointer-events-none cursor-pointer
              "
              aria-label={`Play ${playlist?.name || 'playlist'}`}
              id="play-playlist-btn"
            >
              <Play size={20} fill="currentColor" className="translate-x-0.5" />
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
        className="flex-1 min-h-0 overflow-y-auto px-5 md:px-10 pb-44 lg:pb-20 custom-scrollbar"
      >
        {error && (
          <p role="alert" className="mb-4 rounded-md border border-[#ee0000]/20 bg-[#f7d4d6]/40 px-4 py-2.5 font-mono text-xs text-[#ee0000]">
            {error}
          </p>
        )}
        {!tracks.length ? (
          /* Empty state */
          <div
            className="
              mt-4 py-20 flex flex-col items-center justify-center
              border border-dashed border-[#ebebeb] rounded-xl bg-white shadow-level-1
            "
            aria-label="No tracks in this playlist"
          >
            <div className="w-12 h-12 rounded-md bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center mb-4 text-[#888888]">
              <Search size={22} aria-hidden="true" />
            </div>
            <span className="mono-eyebrow mb-1">EMPTY PLAYLIST</span>
            <p className="text-xs text-[#888888] mt-1 max-w-[260px] text-center">
              Search YouTube above or paste a URL to add your first track.
            </p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={trackIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 pt-1" role="list" aria-label={`Tracks in ${playlist?.name || 'playlist'}`}>
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
