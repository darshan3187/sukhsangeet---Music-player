import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, ListMusic, ChevronDown } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useState, useEffect } from 'react';

const NowPlayingView = ({ onOpenQueue, onClose, layout = 'split' }) => {
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

  /* Sync playhead */
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

  /* Reset on track change */
  useEffect(() => { setCurrentTime(0); }, [currentTrack?.youtubeId]);

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
      className="flex flex-col h-full min-w-0 animate-fade-in-up"
      role="region"
      aria-label="Now Playing"
    >
      {/* ── Top bar ── */}
      <div className="h-20 md:h-24 px-8 md:px-12 flex items-center justify-between shrink-0">
        <button
          onClick={onClose}
          className="touch-target rounded-xl surface-raised text-gray-400 hover:text-gray-900 hover:bg-black/5 transition-all group lg:hidden"
          aria-label="Close now playing"
          id="now-playing-close-btn"
        >
          <ChevronDown size={22} className="group-hover:translate-y-0.5 transition-transform" />
        </button>

        <span className="text-label tracking-[0.35em]">Now Playing</span>

        <button
          onClick={onOpenQueue}
          className="touch-target rounded-xl surface-raised text-gray-400 hover:text-gray-900 hover:bg-black/5 transition-all group"
          aria-label="Open queue"
          id="now-playing-queue-btn"
        >
          <ListMusic size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* ── Main content ── */}
      <div
        className={
          layout === 'stacked'
            ? 'flex-1 flex flex-col items-center justify-center overflow-hidden min-w-0 px-8 md:px-12 lg:px-16 py-6 gap-8 md:gap-10'
            : 'flex-1 flex flex-col md:flex-row items-center justify-center overflow-hidden min-w-0 px-8 md:px-12 lg:px-20 py-6 gap-10 md:gap-14 lg:gap-20'
        }
      >

        {/* Album Art */}
        <div className={layout === 'stacked' ? 'relative group w-full max-w-[320px] md:max-w-[420px] aspect-square shrink-0' : 'relative group w-full max-w-[280px] sm:max-w-[320px] md:max-w-md lg:max-w-lg aspect-square shrink-0'}>
          {/* Blurred glow */}
          <div
            className="absolute inset-[-16px] rounded-[3.5rem] blur-[72px] opacity-30 scale-95 transition-all duration-1000 group-hover:opacity-50 group-hover:scale-100"
            style={{ backgroundImage: `url(${currentTrack.poster})`, backgroundSize: 'cover' }}
            aria-hidden="true"
          />

          {/* Art frame */}
          <div className="relative z-10 w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-[6px] border-white transition-transform duration-500 group-hover:scale-[1.02]">
            <img
              src={currentTrack.poster}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Buffering spinner */}
          {isBuffering && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/15 backdrop-blur-sm rounded-[2rem] md:rounded-[3rem]">
              <div className="w-10 h-10 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Info + Controls */}
        <div className={layout === 'stacked' ? 'flex-1 flex flex-col justify-center items-center text-center w-full max-w-[420px] min-w-0 space-y-7 md:space-y-8' : 'flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left w-full max-w-md min-w-0 space-y-8 md:space-y-10'}>

          {/* Track info */}
          <div className="space-y-2 w-full">
            <h2
              className="font-black text-gray-900 tracking-tight w-full"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 3.25rem)',
                lineHeight: 1.1,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
              }}
            >
              {currentTrack.title}
            </h2>
            <p
              className="font-semibold text-gray-500 uppercase tracking-[0.18em] opacity-70"
              style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.875rem)' }}
            >
              {currentTrack.artist || 'Unknown Artist'}
            </p>
          </div>

          {/* Progress */}
          <div className="w-full space-y-3">
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
            <div className="flex justify-between text-[11px] font-bold text-gray-400/70 tabular-nums tracking-widest px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-between w-full">

            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`
                touch-target rounded-xl transition-all
                ${isShuffleOn
                  ? 'text-gray-900 bg-gray-900/8'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-black/5'}
              `}
              aria-label={`Shuffle ${isShuffleOn ? 'on' : 'off'}`}
              aria-pressed={isShuffleOn}
              id="shuffle-btn"
            >
              <Shuffle size={19} />
              {isShuffleOn && (
                <span className="block w-1 h-1 rounded-full bg-gray-900 mt-0.5 mx-auto" aria-hidden="true" />
              )}
            </button>

            {/* Prev / Play / Next cluster */}
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={prev}
                className="touch-target rounded-xl text-gray-700 hover:bg-black/5 active:scale-90 transition-all"
                aria-label="Previous track"
                id="prev-track-btn"
              >
                <SkipBack size={26} fill="currentColor" />
              </button>

              <button
                onClick={isPlaying ? pause : play}
                className="
                  w-18 h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center
                  rounded-[1.75rem] md:rounded-[2rem] lg:rounded-[2.5rem]
                  bg-gray-900 text-white shadow-xl hover:shadow-2xl
                  hover:scale-105 active:scale-95 transition-all duration-200
                  ring-6 ring-white focus-visible:outline-2 focus-visible:outline-gray-900
                "
                style={{ width: 'clamp(4rem, 5vw, 6rem)', height: 'clamp(4rem, 5vw, 6rem)' }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                id="now-playing-play-btn"
              >
                {isPlaying
                  ? <Pause size={28} fill="currentColor" />
                  : <Play size={28} fill="currentColor" className="translate-x-0.5" />}
              </button>

              <button
                onClick={next}
                className="touch-target rounded-xl text-gray-700 hover:bg-black/5 active:scale-90 transition-all"
                aria-label="Next track"
                id="next-track-btn"
              >
                <SkipForward size={26} fill="currentColor" />
              </button>
            </div>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              className={`
                touch-target rounded-xl transition-all flex flex-col items-center
                ${isRepeatOn
                  ? 'text-gray-900 bg-gray-900/8'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-black/5'}
              `}
              aria-label={`Repeat ${repeatMode}`}
              aria-pressed={isRepeatOn}
              id="repeat-btn"
            >
              {repeatMode === 'one'
                ? <Repeat1 size={19} />
                : <Repeat size={19} />}
              {isRepeatOn && (
                <span className="block w-1 h-1 rounded-full bg-gray-900 mt-0.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingView;
