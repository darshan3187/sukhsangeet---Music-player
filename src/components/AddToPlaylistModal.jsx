import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Loader2, Music, Plus, X } from 'lucide-react';
import { usePlaylists } from '../hooks/usePlaylists';
import { addTrackByYoutubeId } from '../api/playlists';

const AddToPlaylistModal = ({ isOpen, onClose, track, onRequestCreatePlaylist }) => {
  const { playlists, isLoading: isPlaylistsLoading } = usePlaylists();
  const [addingToPlaylistId, setAddingToPlaylistId] = useState(null);
  const [addedPlaylistIds, setAddedPlaylistIds] = useState(new Set());
  const [errorMap, setErrorMap] = useState({});
  const dialogRef = useRef(null);

  const focusableSelector = useMemo(
    () => 'button, input, [tabindex]:not([tabindex="-1"])',
    []
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };

    const trapFocus = (e) => {
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll(focusableSelector));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    window.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', trapFocus);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', trapFocus);
    };
  }, [focusableSelector, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setAddingToPlaylistId(null);
      setAddedPlaylistIds(new Set());
      setErrorMap({});
    }
  }, [isOpen]);

  if (!isOpen || !track) return null;

  const youtubeId = track.youtubeId || track.youtube_id || track.id;
  const trackTitle = track.title || 'Selected Track';
  const trackPoster = track.poster || track.thumbnail_url || '';

  const handleAddToPlaylist = async (playlistId) => {
    if (addingToPlaylistId || addedPlaylistIds.has(playlistId)) return;

    setAddingToPlaylistId(playlistId);
    setErrorMap((prev) => ({ ...prev, [playlistId]: null }));

    try {
      await addTrackByYoutubeId(playlistId, youtubeId);
      setAddedPlaylistIds((prev) => new Set(prev).add(playlistId));
      
      // Auto close after 1.2s on success
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      const errMsg = err?.response?.data?.error || err?.message || 'Failed to add track.';
      setErrorMap((prev) => ({ ...prev, [playlistId]: errMsg }));
    } finally {
      setAddingToPlaylistId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center
                 bg-black/30 backdrop-blur-sm px-4 pb-4 md:py-8 animate-in fade-in duration-200"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-label="Add track to playlist dialog backdrop"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-playlist-title"
        className="
          w-full max-w-md surface-raised rounded-[2rem] md:rounded-[2.5rem]
          p-6 md:p-8 shadow-2xl flex flex-col max-h-[85vh]
          animate-in slide-in-from-bottom-6 md:zoom-in-95 duration-300
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5 shrink-0">
          <div>
            <h2
              id="add-to-playlist-title"
              className="text-xl md:text-2xl font-black text-gray-900 tracking-tight"
            >
              Add to Playlist
            </h2>
            <p className="text-caption mt-0.5">Select a playlist to save this song</p>
          </div>
          <button
            onClick={onClose}
            className="touch-target rounded-xl text-gray-400 hover:text-gray-900 hover:bg-black/5 transition-all -mt-1 -mr-1"
            aria-label="Close dialog"
            id="close-add-to-playlist-modal-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Track Preview */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-black/[0.03] border border-black/[0.04] mb-5 shrink-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5 shrink-0 flex items-center justify-center">
            {trackPoster ? (
              <img src={trackPoster} alt={trackTitle} className="w-full h-full object-cover" />
            ) : (
              <Music size={20} className="text-gray-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-gray-900 truncate leading-tight">{trackTitle}</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 mt-1 truncate">
              {track.artist || 'YouTube'}
            </p>
          </div>
        </div>

        {/* Playlists List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-0">
          {isPlaylistsLoading ? (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-xs font-semibold">Loading playlists...</span>
            </div>
          ) : playlists.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p className="text-sm font-semibold">No playlists found.</p>
              <p className="text-xs text-gray-400 mt-1">Create one below to get started!</p>
            </div>
          ) : (
            playlists.map((pl) => {
              const isAdding = addingToPlaylistId === pl.id;
              const isAdded = addedPlaylistIds.has(pl.id);
              const err = errorMap[pl.id];

              return (
                <div key={pl.id} className="flex flex-col">
                  <button
                    onClick={() => handleAddToPlaylist(pl.id)}
                    disabled={isAdding || isAdded}
                    className={`
                      w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200
                      ${isAdded
                        ? 'bg-emerald-50 border-emerald-200/80 text-emerald-900'
                        : 'bg-white hover:bg-black/[0.02] border-black/[0.06] text-gray-900 active:scale-[0.99]'}
                      disabled:cursor-default
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`
                          w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black shrink-0 transition-colors
                          ${isAdded ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'}
                        `}
                      >
                        {isAdded ? <Check size={18} strokeWidth={3} /> : pl.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black truncate leading-tight">{pl.name}</p>
                        <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
                          {pl.track_count ?? pl.trackCount ?? 0} tracks
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-3">
                      {isAdding ? (
                        <Loader2 size={18} className="animate-spin text-gray-500" />
                      ) : isAdded ? (
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Added ✓</span>
                      ) : (
                        <Plus size={18} className="text-gray-400 group-hover:text-gray-700" />
                      )}
                    </div>
                  </button>

                  {err && (
                    <p className="mt-1 ml-3 text-[11px] font-bold text-red-500">
                      {err}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Create New Playlist Option */}
        <div className="mt-4 pt-4 border-t border-black/[0.06] shrink-0">
          <button
            onClick={() => {
              onClose();
              if (typeof onRequestCreatePlaylist === 'function') {
                onRequestCreatePlaylist(track);
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                       bg-black/[0.04] hover:bg-black/[0.08] text-gray-900 text-xs font-black
                       uppercase tracking-[0.14em] transition-all duration-200 min-h-[44px]"
            id="modal-create-new-playlist-btn"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Create New Playlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
