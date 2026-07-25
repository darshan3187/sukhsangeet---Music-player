import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';

const inputCls = `
  w-full rounded-md border border-[#ebebeb] bg-[#fafafa]
  px-3.5 py-2.5 text-sm font-sans text-[#171717]
  outline-none transition-all duration-150
  placeholder:text-[#888888] placeholder:font-normal
  focus:bg-white focus:border-[#171717] focus:ring-1 focus:ring-[#171717]
  h-[40px]
`;

const CreatePlaylistModal = ({ isOpen, onClose, onCreate }) => {
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [error,       setError]       = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef    = useRef(null);
  const firstInputRef = useRef(null);

  const focusableSelector = useMemo(
    () => 'button, input, textarea, [tabindex]:not([tabindex="-1"])',
    []
  );

  useEffect(() => {
    if (!isOpen) return;

    const timeout = window.setTimeout(() => firstInputRef.current?.focus(), 50);

    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };

    const trapFocus = (e) => {
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll(focusableSelector));
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    window.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', trapFocus);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', trapFocus);
    };
  }, [focusableSelector, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setName(''); setDescription(''); setError(''); setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) { setError('Playlist name is required.'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      await onCreate(trimmedName, description.trim());
      setName(''); setDescription(''); onClose();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to create playlist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center
                 bg-black/30 backdrop-blur-xs px-4 pb-4 md:py-8 animate-in fade-in duration-150"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-label="Create playlist dialog backdrop"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-playlist-title"
        className="
          w-full max-w-md bg-white border border-[#ebebeb] rounded-xl
          p-6 md:p-8 shadow-level-5
          animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-150
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <span className="mono-eyebrow mb-1 block">NEW COLLECTION</span>
            <h2
              id="create-playlist-title"
              className="text-xl md:text-2xl font-semibold text-[#171717] tracking-tight"
            >
              Create Playlist.
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#888888] hover:text-[#171717] hover:bg-[#fafafa] transition-all -mt-1 -mr-1 cursor-pointer"
            aria-label="Close dialog"
            id="close-create-modal-btn"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <label className="block" htmlFor="playlist-name">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4d4d4d] mb-1.5 block">Playlist Name</span>
            <input
              ref={firstInputRef}
              id="playlist-name"
              value={name}
              onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
              className={inputCls}
              placeholder="e.g. Late Night Vibes"
              required
              maxLength={80}
            />
          </label>

          <label className="block" htmlFor="playlist-desc">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4d4d4d] mb-1.5 block">Description <span className="text-[#888888] font-normal lowercase">(optional)</span></span>
            <textarea
              id="playlist-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputCls} h-[80px] resize-none py-2`}
              placeholder="What's the vibe?"
              maxLength={200}
            />
          </label>

          {error && (
            <p role="alert" className="rounded-md bg-[#f7d4d6]/40 border border-[#ee0000]/20 px-3 py-2 font-mono text-xs text-[#ee0000]">
              {error}
            </p>
          )}

          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md bg-[#fafafa] border border-[#ebebeb] hover:bg-[#f5f5f5] px-4 h-10
                         font-mono text-xs font-medium uppercase tracking-wider text-[#4d4d4d]
                         transition-all duration-150 cursor-pointer"
              id="cancel-create-modal-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[1.5] rounded-md bg-[#171717] px-4 h-10
                         font-mono text-xs font-medium uppercase tracking-wider text-white
                         shadow-sm hover:bg-black active:scale-[0.98]
                         disabled:opacity-40 disabled:pointer-events-none
                         transition-all duration-150 cursor-pointer"
              id="submit-create-modal-btn"
            >
              {isSubmitting ? 'Creating…' : 'Create Playlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
