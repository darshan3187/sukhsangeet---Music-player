import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

/**
 * PlayerControls – standalone bottom-bar playback controls.
 * Currently a reserved/legacy component; kept in sync with the design system.
 */
export default function PlayerControls() {
  const {
    appReady,
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
  const resetFrameRef = useRef(0);

  useEffect(() => {
    window.cancelAnimationFrame(resetFrameRef.current);
    resetFrameRef.current = window.requestAnimationFrame(() => {
      setCurrentTime(0);
    });

    return () => window.cancelAnimationFrame(resetFrameRef.current);
  }, [currentTrack?.youtubeId]);

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

  const formatTime = (s) => {
    if (isNaN(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-3 w-full" role="region" aria-label="Player controls">

      {/* Playback buttons */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleShuffle}
          disabled={!appReady}
          className={`
            touch-target rounded-xl transition-all
            ${shuffle ? 'text-gray-900 bg-black/[0.06]' : 'text-gray-400 hover:text-gray-700 hover:bg-black/5'}
            disabled:opacity-30
          `}
          aria-label={`Shuffle ${shuffle ? 'on' : 'off'}`}
          aria-pressed={shuffle}
        >
          <Shuffle size={18} />
        </button>

        <button
          onClick={prev}
          disabled={!appReady}
          className="touch-target rounded-xl text-gray-700 hover:bg-black/5 active:scale-90 transition-all disabled:opacity-30"
          aria-label="Previous track"
        >
          <SkipBack size={20} fill="currentColor" />
        </button>

        <button
          onClick={isPlaying ? pause : play}
          disabled={!appReady}
          className="
            w-14 h-14 flex items-center justify-center rounded-2xl
            bg-gray-900 text-white shadow-lg hover:shadow-xl
            hover:scale-105 active:scale-95 transition-all
            disabled:opacity-50 disabled:pointer-events-none
          "
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isBuffering
            ? <Loader2 size={22} className="animate-spin" />
            : isPlaying
              ? <Pause size={22} fill="currentColor" />
              : <Play size={22} fill="currentColor" className="translate-x-0.5" />
          }
        </button>

        <button
          onClick={next}
          disabled={!appReady}
          className="touch-target rounded-xl text-gray-700 hover:bg-black/5 active:scale-90 transition-all disabled:opacity-30"
          aria-label="Next track"
        >
          <SkipForward size={20} fill="currentColor" />
        </button>

        <button
          onClick={toggleRepeat}
          disabled={!appReady}
          className={`
            touch-target rounded-xl transition-all
            ${repeatMode !== 'off' ? 'text-gray-900 bg-black/[0.06]' : 'text-gray-400 hover:text-gray-700 hover:bg-black/5'}
            disabled:opacity-30
          `}
          aria-label={`Repeat ${repeatMode}`}
          aria-pressed={repeatMode !== 'off'}
        >
          {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 w-full" role="group" aria-label="Seek bar">
        <span className="text-[11px] font-bold tabular-nums text-gray-400 w-10 text-right select-none">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min={0}
          max={Math.max(Math.floor(duration), 0)}
          value={Math.min(Math.floor(currentTime), Math.max(Math.floor(duration), 0))}
          step={1}
          onChange={(e) => {
            const val = Number(e.target.value);
            seekTo(val);
            setCurrentTime(val);
          }}
          disabled={!appReady}
          className="seek-bar flex-1"
          style={{ '--progress': `${progress}%` }}
          aria-label="Seek position"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(currentTime)}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />

        <span className="text-[11px] font-bold tabular-nums text-gray-400 w-10 select-none">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
