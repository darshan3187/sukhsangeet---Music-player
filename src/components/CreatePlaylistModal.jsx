import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const inputCls = `
  w-full rounded-xl border border-black/[0.06] bg-black/[0.03]
  px-5 py-3.5 text-sm font-semibold text-gray-900
  outline-none transition-all duration-200
  placeholder:text-gray-400/60 placeholder:font-normal
  focus:bg-white focus:border-gray-300
  focus:ring-2 focus:ring-gray-900/10
  min-h-[48px]
`;

const CreatePlaylistModal = ({ isOpen, onClose, onCreate }) => {
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [error,       setError]       = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ name: false, description: false });
  const dialogRef    = useRef(null);
  const firstInputRef = useRef(null);

  const focusableSelector = useMemo(
    () => 'button, input, textarea, [tabindex]:not([tabindex="-1"])',
    []
  );

  /* Focus management + keyboard traps */
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

  /* Reset state when closed */
  useEffect(() => {
    if (!isOpen) {
      setName(''); setDescription(''); setError(''); setIsSubmitting(false);
      setTouched({ name: false, description: false });
    }
  }, [isOpen]);

  const nameError = touched.name && !name.trim() ? 'Playlist name is required.' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, description: true });
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
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center
                 bg-black/20 backdrop-blur-sm px-4 pb-4 md:py-8 animate-in fade-in duration-200"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-label="Create playlist dialog backdrop"
    >
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-playlist-title"
        className="
          w-full max-w-md surface-raised rounded-[2rem] md:rounded-[2.5rem]
          p-7 md:p-9 shadow-2xl
          animate-in slide-in-from-bottom-6 md:zoom-in-95 duration-300
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2
              id="create-playlist-title"
              className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight"
            >
              New Playlist
            </h2>
            <p className="text-caption mt-1">Give it a name and description.</p>
          </div>
          <button
            onClick={onClose}
            className="touch-target rounded-xl text-gray-400 hover:text-gray-900 hover:bg-black/5 transition-all -mt-1 -mr-1"
            aria-label="Close dialog"
            id="close-create-modal-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <label className="block" htmlFor="playlist-name">
            <span className="text-label mb-2 block">Playlist Name</span>
            <input
              ref={firstInputRef}
              id="playlist-name"
              value={name}
              onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
              className={`${inputCls} ${nameError ? 'border-red-300 bg-red-50/60' : name && touched.name ? 'border-emerald-300 bg-emerald-50/60' : ''}`}
              placeholder="e.g. Late Night Vibes"
              required
              maxLength={80}
              aria-invalid={Boolean(nameError)}
              aria-describedby="playlist-name-state"
            />
            <p id="playlist-name-state" className={`mt-2 flex items-center gap-2 text-xs font-semibold ${nameError ? 'text-red-600' : name && touched.name ? 'text-emerald-600' : 'text-gray-500'}`}>
              {nameError ? <AlertCircle size={14} /> : name && touched.name ? <CheckCircle2 size={14} /> : null}
              {nameError || (name && touched.name ? 'Looks good.' : 'Keep it short and memorable.')}
            </p>
          </label>

          <label className="block" htmlFor="playlist-desc">
            <span className="text-label mb-2 block">Description <span className="opacity-40 normal-case font-semibold tracking-normal">(optional)</span></span>
            <textarea
              id="playlist-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, description: true }))}
              className={`${inputCls} min-h-[96px] resize-none`}
              placeholder="What's the vibe?"
              maxLength={200}
            />
            <p className={`mt-2 flex items-center justify-between text-xs font-semibold ${description.length > 180 ? 'text-amber-600' : 'text-gray-500'}`}>
              <span className="flex items-center gap-2">
                {description.length > 180 ? <AlertCircle size={14} /> : null}
                {description.length > 180 ? 'You are close to the limit.' : 'Optional, but it helps the playlist feel complete.'}
              </span>
              <span>{description.length}/200</span>
            </p>
          </label>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs font-bold text-red-600">
              <span className="inline-flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </span>
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-black/[0.05] hover:bg-black/[0.09] px-5 py-3.5
                         text-xs font-black uppercase tracking-[0.18em] text-gray-600
                         transition-all duration-150 min-h-[48px]"
              id="cancel-create-modal-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[1.6] rounded-xl bg-gray-900 px-5 py-3.5
                         text-xs font-black uppercase tracking-[0.18em] text-white
                         shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]
                         disabled:opacity-50 disabled:pointer-events-none
                         transition-all duration-150 min-h-[48px]"
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
