import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Link as LinkIcon, Search, Loader2, Download, ExternalLink, Check, Music, X } from 'lucide-react';
import { searchYouTubeTracks } from '../api/playlists';

const isYouTubeUrl = (value) =>
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(value.trim());

const isPlaylistUrl = (value) => {
  try {
    const params = new URL(value, 'https://youtube.com').searchParams;
    return params.has('list');
  } catch {
    return false;
  }
};

const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return '';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const AddTrackInput = ({ onAddTrack, onImportPlaylist, isLoading = false }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search states
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  const containerRef = useRef(null);
  const searchRequestIdRef = useRef(0);

  const trimmedValue = value.trim();
  const isUrl = isYouTubeUrl(trimmedValue);
  const isPlaylist = isUrl && isPlaylistUrl(trimmedValue);

  // Debounced search when input is non-URL text
  useEffect(() => {
    if (!trimmedValue || isUrl) {
      setSearchResults([]);
      setSearchError('');
      setIsSearching(false);
      setIsOpenPopover(false);
      return undefined;
    }

    if (trimmedValue.length < 2) {
      setSearchResults([]);
      setSearchError('');
      setIsSearching(false);
      setIsOpenPopover(false);
      return undefined;
    }

    const timer = setTimeout(async () => {
      const requestId = searchRequestIdRef.current + 1;
      searchRequestIdRef.current = requestId;
      setIsSearching(true);
      setSearchError('');
      setIsOpenPopover(true);

      try {
        const data = await searchYouTubeTracks(trimmedValue, 8);
        if (searchRequestIdRef.current !== requestId) return;
        setSearchResults(Array.isArray(data?.results) ? data.results : []);
      } catch (err) {
        if (searchRequestIdRef.current === requestId) {
          setSearchResults([]);
          const msg = err?.response?.data?.error || err?.message || 'Could not search YouTube right now.';
          if (msg.includes('timeout')) {
            setSearchError('Search request timed out. Click below to search directly on YouTube.com.');
          } else {
            setSearchError(msg);
          }
        }
      } finally {
        if (searchRequestIdRef.current === requestId) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [trimmedValue, isUrl]);

  // Click outside to dismiss popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpenPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!trimmedValue) {
      setError('Enter a song name to search or paste a YouTube link.');
      return;
    }

    if (!isUrl) {
      setIsOpenPopover(true);
      if (searchResults.length > 0) {
        handleAddSearchResult(searchResults[0]);
      }
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      if (isPlaylist) {
        if (typeof onImportPlaylist !== 'function') {
          throw new Error('Playlist import is unavailable right now.');
        }
        await onImportPlaylist(trimmedValue);
      } else {
        await onAddTrack(trimmedValue);
      }
      setValue('');
      setIsOpenPopover(false);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to add track.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSearchResult = async (track) => {
    const videoId = track.youtube_id || track.id;
    if (!videoId || addingId || addedIds.has(videoId)) return;

    setAddingId(videoId);
    setError('');
    try {
      const fullUrl = `https://www.youtube.com/watch?v=${videoId}`;
      await onAddTrack(fullUrl);
      setAddedIds((prev) => new Set(prev).add(videoId));
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to add track.');
    } finally {
      setAddingId(null);
    }
  };

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(trimmedValue)}`;
  const showLoading = isSubmitting || isLoading;

  return (
    <div ref={containerRef} className="w-full relative" role="search" aria-label="Add track or search music">
      <form onSubmit={handleSubmit} className="relative group" noValidate>
        {/* Left Icon: Search or Link */}
        <div
          className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none
                     text-gray-400 group-focus-within:text-gray-700 transition-colors duration-200"
          aria-hidden="true"
        >
          {isUrl ? <LinkIcon size={18} /> : <Search size={18} />}
        </div>

        {/* Input field */}
        <input
          id="add-track-input"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError('');
          }}
          onFocus={() => {
            if (searchResults.length > 0 || searchError || isSearching) {
              setIsOpenPopover(true);
            }
          }}
          placeholder="Search song or paste YouTube link…"
          className={`
            w-full bg-black/[0.03] hover:bg-black/[0.05]
            focus:bg-white focus:shadow-sm
            border border-black/[0.06] focus:border-gray-300
            focus:ring-2 focus:ring-gray-900/10
            rounded-xl pl-12 pr-36 py-4
            text-sm font-semibold text-gray-900
            outline-none transition-all duration-200
            placeholder:text-gray-400/60 placeholder:font-normal
            min-h-[52px]
          `}
          aria-describedby={error ? 'add-track-error' : undefined}
          autoComplete="off"
        />

        {/* Action Button */}
        <div className="absolute inset-y-2 right-2 flex items-center gap-1.5">
          <button
            type="submit"
            disabled={showLoading}
            className="
              h-full px-4 bg-gray-900 text-white rounded-lg
              text-[10px] font-black uppercase tracking-[0.16em]
              flex items-center gap-2
              shadow-md hover:shadow-lg active:scale-95
              disabled:opacity-50 disabled:pointer-events-none
              transition-all duration-200
              min-w-[95px] justify-center
            "
            aria-label={
              showLoading
                ? (isPlaylist ? 'Importing playlist' : 'Adding track')
                : (isPlaylist ? 'Import playlist' : isUrl ? 'Add track' : 'Search')
            }
            id="add-track-submit-btn"
          >
            {showLoading ? (
              <Loader2 size={15} className="animate-spin shrink-0" />
            ) : isPlaylist ? (
              <Download size={15} strokeWidth={3} className="shrink-0" />
            ) : isUrl ? (
              <Plus size={15} strokeWidth={3} className="shrink-0" />
            ) : (
              <Search size={15} strokeWidth={2.5} className="shrink-0" />
            )}
            <span>
              {showLoading
                ? (isPlaylist ? 'Importing…' : 'Adding…')
                : (isPlaylist ? 'Import' : isUrl ? 'Add Track' : 'Search')}
            </span>
          </button>
        </div>
      </form>

      {/* Error under main bar */}
      {error && (
        <p
          id="add-track-error"
          role="alert"
          className="mt-2.5 ml-1 text-xs font-semibold text-red-500 flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Search Results Popover Dropdown */}
      {isOpenPopover && !isUrl && trimmedValue.length >= 2 && (
        <div
          className="
            absolute left-0 right-0 top-full mt-2.5 z-50
            bg-white/95 backdrop-blur-md border border-black/10
            rounded-2xl shadow-2xl p-4 overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-200
            max-h-[420px] flex flex-col
          "
        >
          {/* Header row with External YouTube Search link */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-black/[0.06] shrink-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
              YouTube Results
            </span>

            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 bg-black/[0.04] hover:bg-black/[0.08] px-3 py-1.5 rounded-lg transition-colors"
              title="Open YouTube search in a new tab"
            >
              <span>Search on YouTube</span>
              <ExternalLink size={12} strokeWidth={2.5} />
            </a>
          </div>

          {/* Results content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
            {isSearching ? (
              <div className="py-8 flex items-center justify-center text-gray-400 gap-2">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-xs font-semibold">Searching YouTube for "{trimmedValue}"…</span>
              </div>
            ) : searchError ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-center space-y-2">
                <p className="text-xs font-bold text-red-600">{searchError}</p>
                <a
                  href={youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-black text-gray-900 bg-white border border-black/10 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  <span>Open "{trimmedValue}" on YouTube.com</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-8 text-center text-gray-500 space-y-3">
                <p className="text-xs font-semibold">No direct results found.</p>
                <a
                  href={youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-black text-gray-900 bg-black/[0.04] hover:bg-black/[0.08] px-4 py-2 rounded-xl transition-all"
                >
                  <span>Search directly on YouTube.com</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              searchResults.map((track) => {
                const videoId = track.youtube_id || track.id;
                const isAddingThis = addingId === videoId;
                const isAddedThis = addedIds.has(videoId);
                const durationStr = formatDuration(track.duration_seconds);

                return (
                  <div
                    key={videoId}
                    className="
                      flex items-center gap-3 p-2.5 rounded-xl border border-black/[0.04]
                      bg-white hover:bg-black/[0.02] transition-all duration-150 group/item
                    "
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/5 shrink-0 relative">
                      <img
                        src={track.thumbnail_url}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Meta */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-gray-900 truncate leading-snug">
                        {track.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-gray-500 truncate">
                          {track.artist || 'YouTube'}
                        </span>
                        {durationStr && (
                          <span className="text-[10px] font-bold text-gray-400 bg-black/[0.04] px-1.5 py-0.5 rounded">
                            {durationStr}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-black/5 transition-colors"
                        title="Watch on YouTube"
                      >
                        <ExternalLink size={14} />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleAddSearchResult(track)}
                        disabled={isAddingThis || isAddedThis}
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all
                          ${
                            isAddedThis
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-900 hover:bg-black text-white active:scale-95 shadow-sm'
                          }
                          disabled:opacity-60 disabled:pointer-events-none
                        `}
                      >
                        {isAddingThis ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : isAddedThis ? (
                          <Check size={13} strokeWidth={3} />
                        ) : (
                          <Plus size={13} strokeWidth={3} />
                        )}
                        <span>{isAddingThis ? 'Adding…' : isAddedThis ? 'Added ✓' : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTrackInput;
