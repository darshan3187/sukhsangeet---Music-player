import { useState } from 'react';
import { Plus, Link as LinkIcon, Loader2, Download } from 'lucide-react';

const isYouTubeUrl = (value) =>
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(value.trim());

const isPlaylistUrl = (value) => {
  const params = new URL(value, 'https://youtube.com').searchParams;
  return params.has('list');
};

const AddTrackInput = ({ onAddTrack, onImportPlaylist, isLoading = false }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = value.trim();

    if (!url) { setError('Paste a YouTube URL first.'); return; }
    if (!isYouTubeUrl(url)) { setError('That doesn\'t look like a YouTube URL.'); return; }

    setError('');
    setIsSubmitting(true);
    try {
      if (isPlaylistUrl(url)) {
        await onImportPlaylist(url);
      } else {
        await onAddTrack(url);
      }
      setValue('');
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to add track.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showLoading = isSubmitting || isLoading;
  const url = value.trim();
  const isPlaylist = url && isYouTubeUrl(url) && isPlaylistUrl(url);

  return (
    <div className="w-full" role="search" aria-label="Add track or import playlist">
      <form onSubmit={handleSubmit} className="relative group" noValidate>
        {/* Leading icon */}
        <div
          className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none
                     text-gray-400 group-focus-within:text-gray-700 transition-colors duration-200"
          aria-hidden="true"
        >
          <LinkIcon size={18} />
        </div>

        {/* Input */}
        <input
          id="add-track-input"
          value={value}
          onChange={(e) => { setValue(e.target.value); if (error) setError(''); }}
          placeholder="Paste a YouTube link to add a track…"
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

        {/* Submit button */}
        <div className="absolute inset-y-2 right-2">
          <button
            type="submit"
            disabled={showLoading}
            className="
              h-full px-5 bg-gray-900 text-white rounded-lg
              text-[10px] font-black uppercase tracking-[0.18em]
              flex items-center gap-2
              shadow-md hover:shadow-lg active:scale-95
              disabled:opacity-50 disabled:pointer-events-none
              transition-all duration-200
              min-w-[100px]
            "
            aria-label={showLoading ? (isPlaylist ? 'Importing playlist' : 'Adding track') : (isPlaylist ? 'Import playlist' : 'Add track')}
            id="add-track-submit-btn"
          >
            {showLoading
              ? <Loader2 size={15} className="animate-spin shrink-0" />
              : isPlaylist
              ? <Download size={15} strokeWidth={3} className="shrink-0" />
              : <Plus size={15} strokeWidth={3} className="shrink-0" />
            }
            <span>{showLoading ? (isPlaylist ? 'Importing…' : 'Adding…') : (isPlaylist ? 'Import' : 'Add Track')}</span>
          </button>
        </div>
      </form>

      {/* Error message */}
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
    </div>
  );
};

export default AddTrackInput;
