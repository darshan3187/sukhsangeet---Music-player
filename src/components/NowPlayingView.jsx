import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, ListMusic, ChevronDown, Plus } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useState, useEffect, useRef } from 'react';

const NowPlayingView = ({ onOpenQueue, onClose, onAddToPlaylist, layout = 'split' }) => {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    duration,
    shuffle,
    repeatMode,
    play,
    pause,
    next,
    prev,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    playerRef,
  } = usePlayer();

  const [currentTime, setCurrentTime] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const currentTrackId = currentTrack?.youtubeId || '';
  const imageError = Boolean(imageErrors[currentTrackId]);
  const resetFrameRef = useRef(0);

  useEffect(() => {
    let interval;
    if (isPlaying && duration > 0) {
      interval = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          setCurrentTime(playerRef.current.getCurrentTime() || 0);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playerRef]);

  useEffect(() => { 
    window.cancelAnimationFrame(resetFrameRef.current);
    resetFrameRef.current = window.requestAnimationFrame(() => {
      setCurrentTime(0);
    });

    return () => window.cancelAnimationFrame(resetFrameRef.current);
  }, [currentTrack]);

  const handleImageError = () => {
    setImageErrors((current) => ({ ...current, [currentTrackId]: true }));
  };

  const formatTime = (s) => {
    if (isNaN(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) return null;

  const isShuffleOn = shuffle;
  const isRepeatOn  = repeatMode !== 'off';

  return (
    <div
      className="flex flex-col h-full min-w-0 bg-[#fafafa]"
      role="region"
      aria-label="Now Playing"
    >
      <div className={layout === 'stacked' ? 'h-14 px-5 flex items-center justify-between shrink-0 border-b border-[#ebebeb] bg-white' : 'h-16 px-8 flex items-center justify-between shrink-0 border-b border-[#ebebeb] bg-white'}>
        <button
          onClick={onClose}
          className="p-2 rounded-md border border-[#ebebeb] bg-[#fafafa] text-[#888888] hover:text-[#171717] hover:bg-[#f5f5f5] transition-all cursor-pointer lg:hidden"
          aria-label="Close now playing"
          id="now-playing-close-btn"
        >
          <ChevronDown size={18} />
        </button>

        <span className="mono-eyebrow">NOW PLAYING</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddToPlaylist?.(currentTrack)}
            className="p-2 rounded-md border border-[#ebebeb] bg-[#fafafa] text-[#888888] hover:text-[#171717] hover:bg-[#f5f5f5] transition-all cursor-pointer"
            aria-label="Add to playlist"
            title="Add to playlist"
            id="now-playing-add-playlist-btn"
          >
            <Plus size={18} />
          </button>

          <button
            onClick={onOpenQueue}
            className="p-2 rounded-md border border-[#ebebeb] bg-[#fafafa] text-[#888888] hover:text-[#171717] hover:bg-[#f5f5f5] transition-all cursor-pointer"
            aria-label="Open queue"
            id="now-playing-queue-btn"
          >
            <ListMusic size={18} />
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        className={
          layout === 'stacked'
            ? 'flex-1 flex flex-col items-center justify-start overflow-hidden min-w-0 px-5 pt-4 pb-4 gap-4'
            : 'flex-1 flex flex-col md:flex-row items-center justify-center overflow-hidden min-w-0 px-8 md:px-14 lg:px-20 py-6 gap-8 md:gap-12 lg:gap-16'
        }
      >
        {/* Album Art Frame */}
        <div className={layout === 'stacked' ? 'relative group w-full max-w-[220px] sm:max-w-[260px] aspect-square shrink-0' : 'relative group w-full max-w-[260px] sm:max-w-[300px] md:max-w-md aspect-square shrink-0'}>
          <div className="relative z-10 w-full h-full rounded-xl overflow-hidden shadow-level-4 border border-[#ebebeb] flex items-center justify-center bg-[#fafafa]">
            {imageError || !currentTrack.poster ? (
              <div className="flex flex-col items-center justify-center text-[#888888]">
                <span className="font-mono text-6xl font-semibold">♪</span>
              </div>
            ) : (
              <img
                src={currentTrack.poster}
                alt={currentTrack.title}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Buffering spinner */}
          {isBuffering && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-xs rounded-xl">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Info + Controls */}
        <div className={layout === 'stacked' ? 'flex-1 flex flex-col justify-center items-center text-center w-full max-w-[340px] min-w-0 space-y-4' : 'flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left w-full max-w-md min-w-0 space-y-6'}>
          {/* Track info */}
          <div className="space-y-1.5 w-full">
            <h2
              className="font-semibold text-[#171717] tracking-tight w-full"
              style={{
                fontSize: layout === 'stacked' ? 'clamp(1.1rem, 2vw, 1.8rem)' : 'clamp(1.4rem, 3vw, 2.5rem)',
                lineHeight: 1.15,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
              }}
            >
              {currentTrack.title}
            </h2>
            <p
              className="font-mono text-xs text-[#888888] uppercase tracking-wider"
            >
              {currentTrack.artist || 'Unknown Artist'}
            </p>
          </div>

          {/* Progress */}
          <div className="w-full space-y-2">
            <input
              type="range"
              min={0}
              max={Math.max(Math.floor(duration), 0)}
              value={Math.min(Math.floor(currentTime), Math.max(Math.floor(duration), 0))}
              onChange={(e) => {
                const val = Number(e.target.value);
                seekTo(val);
                setCurrentTime(val);
              }}
              className="seek-bar w-full"
              style={{ '--progress': `${progress}%` }}
              aria-label="Seek position"
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration)}
              aria-valuenow={Math.floor(currentTime)}
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            />
            <div className="flex justify-between font-mono text-[11px] text-[#888888] px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback controls */}
          <div className={layout === 'stacked' ? 'flex items-center justify-center gap-3 w-full flex-nowrap' : 'flex items-center justify-between w-full'}>
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`
                w-10 h-10 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0
                ${isShuffleOn
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-white text-[#888888] border-[#ebebeb] hover:text-[#171717] hover:bg-[#fafafa]'}
              `}
              aria-label={`Shuffle ${isShuffleOn ? 'on' : 'off'}`}
              aria-pressed={isShuffleOn}
              id="shuffle-btn"
            >
              <Shuffle size={16} />
            </button>

            {/* Prev / Play / Next cluster */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-md border border-[#ebebeb] bg-white text-[#171717] hover:bg-[#fafafa] transition-all flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Previous track"
                id="prev-track-btn"
              >
                <SkipBack size={18} fill="currentColor" />
              </button>

              <button
                onClick={isPlaying ? pause : play}
                className="
                  w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#171717] text-white
                  flex items-center justify-center shadow-level-2 hover:bg-black
                  active:scale-95 transition-all duration-150 cursor-pointer
                "
                aria-label={isPlaying ? 'Pause' : 'Play'}
                id="now-playing-play-btn"
              >
                {isPlaying
                  ? <Pause size={20} fill="currentColor" />
                  : <Play size={20} fill="currentColor" className="translate-x-0.5" />}
              </button>

              <button
                onClick={next}
                className="w-10 h-10 rounded-md border border-[#ebebeb] bg-white text-[#171717] hover:bg-[#fafafa] transition-all flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Next track"
                id="next-track-btn"
              >
                <SkipForward size={18} fill="currentColor" />
              </button>
            </div>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              className={`
                w-10 h-10 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0
                ${isRepeatOn
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-white text-[#888888] border-[#ebebeb] hover:text-[#171717] hover:bg-[#fafafa]'}
              `}
              aria-label={`Repeat ${repeatMode}`}
              aria-pressed={isRepeatOn}
              id="repeat-btn"
            >
              {repeatMode === 'one'
                ? <Repeat1 size={16} />
                : <Repeat size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingView;
