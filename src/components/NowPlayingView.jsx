import { useMemo, useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, ListMusic, ChevronDown, Plus } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { getCleanTrackDetails } from '../utils/playerTrackAdapter';

/**
 * Formats seconds into M:SS time string.
 */
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
};

const NowPlayingView = ({ onOpenQueue, onClose, onAddToPlaylist }) => {
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

  // Poll current playback position while active
  useEffect(() => {
    let intervalId;
    if (isPlaying && duration > 0) {
      intervalId = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          setCurrentTime(playerRef.current.getCurrentTime() || 0);
        }
      }, 500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, duration, playerRef]);

  // Synchronously reset position on track switch
  useEffect(() => {
    setCurrentTime(0);
  }, [currentTrack?.youtubeId]);

  // Memoize cleaned title and artist details to prevent regex re-evaluations during 500ms time polls
  const { title: cleanTitle, artist: cleanArtist } = useMemo(
    () => getCleanTrackDetails(currentTrack?.title, currentTrack?.artist),
    [currentTrack?.title, currentTrack?.artist]
  );

  // Memoize playback progress percentage
  const progress = useMemo(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  // Stable callbacks for user control handlers
  const handleSeek = useCallback(
    (e) => {
      const val = Number(e.target.value);
      seekTo(val);
      setCurrentTime(val);
    },
    [seekTo]
  );

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const handleAddToPlaylist = useCallback(() => {
    onAddToPlaylist?.(currentTrack);
  }, [onAddToPlaylist, currentTrack]);

  if (!currentTrack) return null;

  const isShuffleOn = shuffle;
  const isRepeatOn = repeatMode !== 'off';
  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);

  return (
    <div
      className="flex flex-col h-full min-w-0 bg-[#fafafa] select-none overflow-y-auto"
      role="region"
      aria-label="Now Playing"
    >
      {/* ── Top Header ── */}
      <div className="h-16 px-6 py-4 flex items-center justify-between shrink-0 border-b border-[#ebebeb] bg-white sticky top-0 z-30">
        <button
          onClick={onClose}
          className="p-2 rounded-lg border border-[#ebebeb] bg-[#fafafa] text-[#666666] hover:text-[#171717] hover:bg-[#f5f5f5] transition-all cursor-pointer"
          aria-label="Close now playing"
          id="now-playing-close-btn"
        >
          <ChevronDown size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#888888] font-semibold">
            NOW PLAYING
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToPlaylist}
            className="p-2 rounded-lg border border-[#ebebeb] bg-[#fafafa] text-[#666666] hover:text-[#171717] hover:bg-[#f5f5f5] transition-all cursor-pointer"
            aria-label="Add to playlist"
            title="Add to playlist"
            id="now-playing-add-playlist-btn"
          >
            <Plus size={18} />
          </button>

          <button
            onClick={onOpenQueue}
            className="p-2 rounded-lg border border-[#ebebeb] bg-[#fafafa] text-[#666666] hover:text-[#171717] hover:bg-[#f5f5f5] transition-all cursor-pointer"
            aria-label="Open queue"
            id="now-playing-queue-btn"
          >
            <ListMusic size={18} />
          </button>
        </div>
      </div>

      {/* ── Main Vertical Stack (centered, gap: 24px) ── */}
      <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-4 sm:px-6 py-6 w-full max-w-[800px] mx-auto my-auto gap-6">
        
        {/* Widescreen Video Viewport Card (Constrained max-width 800px & 16:9 ratio) */}
        <div className="relative group w-full max-w-[800px] aspect-video rounded-2xl overflow-hidden shadow-xl border border-neutral-200 bg-black shrink-0">
          <div id="yt-player-main" className="w-full h-full"></div>

          {/* Buffering Overlay */}
          {isBuffering && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-2xl">
              <div className="w-9 h-9 border-3 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Track Title & Artist (Hierarchy & Clean Artist) */}
        <div className="text-center space-y-1 w-full px-2">
          <h2
            className="text-[20px] sm:text-[24px] font-bold text-[#171717] tracking-tight leading-tight line-clamp-2"
            title={cleanTitle}
          >
            {cleanTitle}
          </h2>
          <p className="text-[14px] sm:text-[16px] font-medium text-[#737373] truncate">
            {cleanArtist}
          </p>
        </div>

        {/* Progress Bar (Centered directly below title & artist) */}
        <div className="w-full max-w-[640px] space-y-1.5 px-1">
          <input
            type="range"
            min={0}
            max={Math.max(Math.floor(duration), 0)}
            value={Math.min(Math.floor(currentTime), Math.max(Math.floor(duration), 0))}
            onChange={handleSeek}
            className="seek-bar w-full cursor-pointer h-2 accent-[#171717]"
            style={{ '--progress': `${progress}%` }}
            aria-label="Seek position"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(currentTime)}
            aria-valuetext={`${formattedCurrentTime} of ${formattedDuration}`}
          />
          <div className="flex justify-between font-mono text-[11px] font-medium text-[#888888]">
            <span>{formattedCurrentTime}</span>
            <span>{formattedDuration}</span>
          </div>
        </div>

        {/* Media Controls Row (Immediately following progress bar) */}
        <div className="flex items-center justify-between w-full max-w-sm px-2">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`
              w-11 h-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer active:scale-95
              ${isShuffleOn
                ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                : 'bg-white text-[#888888] border-[#ebebeb] hover:text-[#171717] hover:bg-[#fafafa]'}
            `}
            aria-label={`Shuffle ${isShuffleOn ? 'on' : 'off'}`}
            aria-pressed={isShuffleOn}
            id="shuffle-btn"
          >
            <Shuffle size={18} />
          </button>

          {/* Previous Track */}
          <button
            onClick={prev}
            className="w-11 h-11 rounded-xl border border-[#ebebeb] bg-white text-[#171717] hover:bg-[#fafafa] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            aria-label="Previous track"
            id="prev-track-btn"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          {/* Big Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            className="
              w-16 h-16 rounded-full bg-[#171717] text-white
              flex items-center justify-center shadow-lg hover:bg-black
              active:scale-95 transition-all duration-150 cursor-pointer
            "
            aria-label={isPlaying ? 'Pause' : 'Play'}
            id="now-playing-play-btn"
          >
            {isPlaying
              ? <Pause size={24} fill="currentColor" />
              : <Play size={24} fill="currentColor" className="translate-x-0.5" />}
          </button>

          {/* Next Track */}
          <button
            onClick={next}
            className="w-11 h-11 rounded-xl border border-[#ebebeb] bg-white text-[#171717] hover:bg-[#fafafa] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            aria-label="Next track"
            id="next-track-btn"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`
              w-11 h-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer active:scale-95
              ${isRepeatOn
                ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                : 'bg-white text-[#888888] border-[#ebebeb] hover:text-[#171717] hover:bg-[#fafafa]'}
            `}
            aria-label={`Repeat ${repeatMode}`}
            aria-pressed={isRepeatOn}
            id="repeat-btn"
          >
            {repeatMode === 'one'
              ? <Repeat1 size={18} />
              : <Repeat size={18} />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NowPlayingView;
