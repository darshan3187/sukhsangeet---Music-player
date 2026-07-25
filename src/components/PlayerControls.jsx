import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

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
      <div className="flex items-center gap-4">
        <button
          onClick={toggleShuffle}
          disabled={!appReady}
          className={`
            w-9 h-9 rounded-md border flex items-center justify-center transition-all cursor-pointer
            ${shuffle ? 'bg-[#171717] text-white border-[#171717]' : 'bg-white text-[#888888] border-[#ebebeb] hover:text-[#171717] hover:bg-[#fafafa]'}
            disabled:opacity-30
          `}
          aria-label={`Shuffle ${shuffle ? 'on' : 'off'}`}
          aria-pressed={shuffle}
        >
          <Shuffle size={15} />
        </button>

        <button
          onClick={prev}
          disabled={!appReady}
          className="w-9 h-9 rounded-md border border-[#ebebeb] bg-white text-[#171717] hover:bg-[#fafafa] transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
          aria-label="Previous track"
        >
          <SkipBack size={16} fill="currentColor" />
        </button>

        <button
          onClick={isPlaying ? pause : play}
          disabled={!appReady}
          className="
            w-11 h-11 flex items-center justify-center rounded-full
            bg-[#171717] text-white shadow-level-2 hover:bg-black
            active:scale-95 transition-all cursor-pointer
            disabled:opacity-40 disabled:pointer-events-none
          "
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isBuffering
            ? <Loader2 size={18} className="animate-spin" />
            : isPlaying
              ? <Pause size={18} fill="currentColor" />
              : <Play size={18} fill="currentColor" className="translate-x-0.5" />
          }
        </button>

        <button
          onClick={next}
          disabled={!appReady}
          className="w-9 h-9 rounded-md border border-[#ebebeb] bg-white text-[#171717] hover:bg-[#fafafa] transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
          aria-label="Next track"
        >
          <SkipForward size={16} fill="currentColor" />
        </button>

        <button
          onClick={toggleRepeat}
          disabled={!appReady}
          className={`
            w-9 h-9 rounded-md border flex items-center justify-center transition-all cursor-pointer
            ${repeatMode !== 'off' ? 'bg-[#171717] text-white border-[#171717]' : 'bg-white text-[#888888] border-[#ebebeb] hover:text-[#171717] hover:bg-[#fafafa]'}
            disabled:opacity-30
          `}
          aria-label={`Repeat ${repeatMode}`}
          aria-pressed={repeatMode !== 'off'}
        >
          {repeatMode === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
        </button>
      </div>

      <div className="flex items-center gap-3 w-full" role="group" aria-label="Seek bar">
        <span className="font-mono text-[11px] text-[#888888] w-10 text-right select-none">
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

        <span className="font-mono text-[11px] text-[#888888] w-10 select-none">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
