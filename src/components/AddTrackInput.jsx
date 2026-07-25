import { useState, useEffect, useRef } from 'react';
import { Plus, Link as LinkIcon, Search, Loader2, Download, ExternalLink, Check } from 'lucide-react';
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
        {/* Left Icon */}
        <div
          className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none
                     text-[#888888] group-focus-within:text-[#171717] transition-colors duration-150"
          aria-hidden="true"
        >
          {isUrl ? <LinkIcon size={16} /> : <Search size={16} />}
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
            w-full bg-white hover:border-[#a1a1a1]
            focus:bg-white focus:border-[#171717]
            border border-[#ebebeb] focus:ring-1 focus:ring-[#171717]
            rounded-md pl-10 pr-32 py-2.5
            text-sm font-sans text-[#171717]
            outline-none transition-all duration-150
            placeholder:text-[#888888]
            h-[40px]
          `}
          aria-describedby={error ? 'add-track-error' : undefined}
          autoComplete="off"
        />

        {/* Action Button */}
        <div className="absolute inset-y-1 right-1 flex items-center gap-1">
          <button
            type="submit"
            disabled={showLoading}
            className="
              h-[32px] px-3.5 bg-[#171717] text-white rounded-md
              font-mono text-[11px] font-medium uppercase tracking-wider
              flex items-center gap-1.5
              hover:bg-black active:scale-[0.98]
              disabled:opacity-40 disabled:pointer-events-none
              transition-all duration-150 cursor-pointer
            "
            aria-label={
              showLoading
                ? (isPlaylist ? 'Importing playlist' : 'Adding track')
                : (isPlaylist ? 'Import playlist' : isUrl ? 'Add track' : 'Search')
            }
            id="add-track-submit-btn"
          >
            {showLoading ? (
              <Loader2 size={13} className="animate-spin shrink-0" />
            ) : isPlaylist ? (
              <Download size={13} strokeWidth={2} className="shrink-0" />
            ) : isUrl ? (
              <Plus size={13} strokeWidth={2} className="shrink-0" />
            ) : (
              <Search size={13} strokeWidth={2} className="shrink-0" />
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
          className="mt-2 text-xs font-mono text-[#ee0000] flex items-center gap-1.5"
        >
          <span>• {error}</span>
        </p>
      )}

      {/* Search Results Popover Dropdown */}
      {isOpenPopover && !isUrl && trimmedValue.length >= 2 && (
        <div
          className="
            absolute left-0 right-0 top-full mt-2 z-50
            bg-white border border-[#ebebeb]
            rounded-xl shadow-level-5 p-3 overflow-hidden
            animate-in fade-in duration-150
            max-h-[380px] flex flex-col
          "
        >
          {/* Header row with External YouTube Search link */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#ebebeb] shrink-0">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#888888]">
              YouTube Search Results
            </span>

            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[#171717] hover:text-[#0070f3] bg-[#fafafa] border border-[#ebebeb] px-2.5 py-1 rounded-md transition-colors"
              title="Open YouTube search in a new tab"
            >
              <span>YouTube.com</span>
              <ExternalLink size={11} />
            </a>
          </div>

          {/* Results content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-0.5">
            {isSearching ? (
              <div className="py-6 flex items-center justify-center text-[#888888] gap-2 font-mono text-xs">
                <Loader2 size={15} className="animate-spin text-[#171717]" />
                <span>Searching YouTube for "{trimmedValue}"…</span>
              </div>
            ) : searchError ? (
              <div className="p-3 rounded-md bg-[#f7d4d6]/40 border border-[#ee0000]/20 text-center space-y-2 font-mono text-xs">
                <p className="text-[#ee0000]">{searchError}</p>
                <a
                  href={youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#171717] bg-white border border-[#ebebeb] px-3 py-1.5 rounded-md hover:bg-[#fafafa] transition-all"
                >
                  <span>Open "{trimmedValue}" on YouTube</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-6 text-center text-[#888888] space-y-2 font-mono text-xs">
                <p>No direct results found.</p>
                <a
                  href={youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#171717] bg-[#fafafa] border border-[#ebebeb] hover:bg-[#f5f5f5] px-3 py-1.5 rounded-md transition-all"
                >
                  <span>Search on YouTube.com</span>
                  <ExternalLink size={12} />
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
                      flex items-center gap-3 p-2 rounded-md border border-[#ebebeb]
                      bg-white hover:bg-[#fafafa] transition-all duration-150 group/item
                    "
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-[#f5f5f5] shrink-0 border border-[#ebebeb]">
                      <img
                        src={track.thumbnail_url}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Meta */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#171717] truncate leading-snug">
                        {track.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px]">
                        <span className="text-[#888888] truncate">
                          {track.artist || 'YouTube'}
                        </span>
                        {durationStr && (
                          <span className="text-[#4d4d4d] bg-[#fafafa] border border-[#ebebeb] px-1 py-0.2 rounded">
                            {durationStr}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 flex items-center gap-1">
                      <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-[#888888] hover:text-[#171717] hover:bg-[#f5f5f5] transition-colors"
                        title="Watch on YouTube"
                      >
                        <ExternalLink size={13} />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleAddSearchResult(track)}
                        disabled={isAddingThis || isAddedThis}
                        className={`
                          px-2.5 py-1 rounded-md font-mono text-[10px] font-medium uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer
                          ${
                            isAddedThis
                              ? 'bg-[#fafafa] text-[#0070f3] border border-[#ebebeb]'
                              : 'bg-[#171717] hover:bg-black text-white active:scale-95 shadow-xs'
                          }
                          disabled:opacity-50 disabled:pointer-events-none
                        `}
                      >
                        {isAddingThis ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : isAddedThis ? (
                          <Check size={11} strokeWidth={2.5} />
                        ) : (
                          <Plus size={11} strokeWidth={2.5} />
                        )}
                        <span>{isAddingThis ? 'Adding…' : isAddedThis ? 'Added' : 'Add'}</span>
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
