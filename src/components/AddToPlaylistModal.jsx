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
                 bg-black/30 backdrop-blur-xs px-4 pb-4 md:py-8 animate-in fade-in duration-150"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-label="Add track to playlist dialog backdrop"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-playlist-title"
        className="
          w-full max-w-md bg-white border border-[#ebebeb] rounded-xl
          p-6 shadow-level-5 flex flex-col max-h-[85vh]
          animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-150
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4 shrink-0">
          <div>
            <span className="mono-eyebrow mb-1 block">SAVE TRACK</span>
            <h2
              id="add-to-playlist-title"
              className="text-xl font-semibold text-[#171717] tracking-tight"
            >
              Add to Playlist.
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#888888] hover:text-[#171717] hover:bg-[#fafafa] transition-all -mt-1 -mr-1 cursor-pointer"
            aria-label="Close dialog"
            id="close-add-to-playlist-modal-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Track Preview */}
        <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#fafafa] border border-[#ebebeb] mb-4 shrink-0">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-[#f5f5f5] shrink-0 border border-[#ebebeb] flex items-center justify-center">
            {trackPoster ? (
              <img src={trackPoster} alt={trackTitle} className="w-full h-full object-cover" />
            ) : (
              <Music size={18} className="text-[#888888]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#171717] truncate leading-tight">{trackTitle}</p>
            <p className="font-mono text-[10px] text-[#888888] mt-0.5 truncate uppercase">
              {track.artist || 'YouTube'}
            </p>
          </div>
        </div>

        {/* Playlists List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 custom-scrollbar min-h-0">
          {isPlaylistsLoading ? (
            <div className="py-10 text-center text-[#888888] flex flex-col items-center gap-2 font-mono text-xs">
              <Loader2 size={20} className="animate-spin text-[#171717]" />
              <span>Loading playlists...</span>
            </div>
          ) : playlists.length === 0 ? (
            <div className="py-6 text-center text-[#888888] font-mono text-xs">
              <p className="font-medium text-[#171717]">No playlists found.</p>
              <p className="mt-1">Create one below to get started.</p>
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
                      w-full flex items-center justify-between p-2.5 rounded-md border text-left transition-all duration-150 cursor-pointer
                      ${isAdded
                        ? 'bg-[#fafafa] border-[#ebebeb] text-[#0070f3]'
                        : 'bg-white hover:bg-[#fafafa] border-[#ebebeb] text-[#171717] active:scale-[0.99]'}
                      disabled:cursor-default
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`
                          w-8 h-8 rounded-md flex items-center justify-center font-mono text-xs font-medium uppercase shrink-0 transition-colors
                          ${isAdded ? 'bg-[#171717] text-white' : 'bg-[#f5f5f5] text-[#171717] border border-[#ebebeb]'}
                        `}
                      >
                        {isAdded ? <Check size={15} strokeWidth={2.5} /> : pl.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate leading-tight">{pl.name}</p>
                        <p className="font-mono text-[10px] text-[#888888] mt-0.5">
                          {pl.track_count ?? pl.trackCount ?? 0} tracks
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isAdding ? (
                        <Loader2 size={16} className="animate-spin text-[#171717]" />
                      ) : isAdded ? (
                        <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#0070f3]">Added ✓</span>
                      ) : (
                        <Plus size={16} className="text-[#888888]" />
                      )}
                    </div>
                  </button>

                  {err && (
                    <p className="mt-1 ml-2 font-mono text-[10px] text-[#ee0000]">
                      {err}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Create New Playlist Option */}
        <div className="mt-4 pt-3 border-t border-[#ebebeb] shrink-0">
          <button
            onClick={() => {
              onClose();
              if (typeof onRequestCreatePlaylist === 'function') {
                onRequestCreatePlaylist(track);
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 h-10 rounded-md
                       bg-[#fafafa] border border-[#ebebeb] hover:bg-[#f5f5f5] text-[#171717]
                       font-mono text-xs font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer"
            id="modal-create-new-playlist-btn"
          >
            <Plus size={15} strokeWidth={2} />
            <span>Create New Playlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
