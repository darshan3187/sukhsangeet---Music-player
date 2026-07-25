import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ListMusic, Plus, Library, Play, Pause, X, LogOut, PanelLeftOpen, SkipBack, SkipForward } from 'lucide-react';
import PlaylistSidebar from './PlaylistSidebar';
import PlaylistTracksPanel from './PlaylistTracksPanel';
import CreatePlaylistModal from './CreatePlaylistModal';
import AddToPlaylistModal from './AddToPlaylistModal';
import TrackDrawer from './TrackDrawer';
import NowPlayingView from './NowPlayingView';
import { usePlaylists } from '../hooks/usePlaylists';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { importPlaylist, addTrackByYoutubeId } from '../api/playlists';

const PlaylistWorkspace = () => {
  const navigate = useNavigate();
  const { id: routePlaylistId = '' } = useParams();
  const { playlists, isLoading, createPlaylist, deletePlaylist } = usePlaylists();
  const { currentTrack, isPlaying, play, pause, next, prev, queue, currentTrackIndex } = usePlayer();
  const { logout, user } = useAuth();
  const [isLibraryOpen, setIsLibraryOpen] = useState(() => window.innerWidth >= 1024);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNowPlayingFull, setIsNowPlayingFull] = useState(false);
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState(null);
  const [pendingTrackForNewPlaylist, setPendingTrackForNewPlaylist] = useState(null);
  const nowPlayingResetRef = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsLibraryOpen(true);
        if (currentTrack) {
          setIsNowPlayingFull(true);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentTrack]);

  useEffect(() => {
    if (!currentTrack) {
      return undefined;
    }

    window.cancelAnimationFrame(nowPlayingResetRef.current);
    nowPlayingResetRef.current = window.requestAnimationFrame(() => {
      setIsNowPlayingFull(true);
    });

    return () => window.cancelAnimationFrame(nowPlayingResetRef.current);
  }, [currentTrack]);

  const selectedPlaylist = useMemo(
    () => playlists.find((item) => item.id?.toString() === routePlaylistId?.toString()),
    [playlists, routePlaylistId],
  );

  const selectedPlaylistLabel = selectedPlaylist?.name || 'All Playlists';

  const handleCreatePlaylist = useCallback(async (name, description) => {
    const created = await createPlaylist(name, description);
    if (created?.id) {
      if (pendingTrackForNewPlaylist) {
        const targetYoutubeId = pendingTrackForNewPlaylist.youtubeId || pendingTrackForNewPlaylist.youtube_id || pendingTrackForNewPlaylist.id;
        try {
          await addTrackByYoutubeId(created.id, targetYoutubeId);
        } catch (err) {
          console.error('Failed to auto-add track to newly created playlist:', err);
        }
        setPendingTrackForNewPlaylist(null);
      }
      navigate(`/find-music/playlist/${created.id}`, { replace: true });
    }
    setIsCreateOpen(false);
    return created;
  }, [createPlaylist, navigate, pendingTrackForNewPlaylist]);

  const handleRequestCreatePlaylist = useCallback((track) => {
    setPendingTrackForNewPlaylist(track);
    setIsCreateOpen(true);
  }, []);

  const handleSelectPlaylist = useCallback((id) => {
    navigate(`/find-music/playlist/${id}`);
    if (window.innerWidth < 1024) setIsLibraryOpen(false);
  }, [navigate]);

  const handleDeletePlaylist = useCallback(async (id) => {
    try {
      if (routePlaylistId === id.toString()) navigate('/find-music', { replace: true });
      await deletePlaylist(id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }, [deletePlaylist, navigate, routePlaylistId]);

  const handleOpenLibrary = useCallback(() => {
    setIsLibraryOpen(true);
  }, []);

  const handleImportPlaylist = useCallback(async (youtubePlaylistUrl) => {
    try {
      const result = await importPlaylist(youtubePlaylistUrl);
      const newPlaylistId = result?.playlist?.id;
      if (newPlaylistId) {
        navigate(`/find-music/playlist/${newPlaylistId}`, { replace: false });
      }
    } catch (err) {
      console.error('Playlist import failed:', err);
      throw err;
    }
  }, [navigate]);

  return (
    <div className="relative h-dvh w-full overflow-hidden flex min-h-0 bg-[#fafafa] font-sans text-[#171717] selection:bg-[#171717] selection:text-white">

      {/* ── Sidebar – Library ── */}
      <aside
        id="library-sidebar"
        className={`
          fixed inset-y-0 left-0 z-[100] lg:z-50
          w-72 xl:w-80
          bg-white border-r border-[#ebebeb]
          transition-all duration-300 ease-in-out
          flex flex-col
          lg:relative lg:translate-x-0
          ${isLibraryOpen ? 'translate-x-0 shadow-level-5 lg:shadow-none' : '-translate-x-full'}
          ${!isLibraryOpen ? 'lg:w-0 lg:min-w-0 lg:max-w-0 lg:overflow-hidden lg:opacity-0 lg:pointer-events-none lg:border-r-0' : ''}
        `}
        aria-label="Library sidebar"
      >
        {/* Sidebar header */}
        <div className="px-5 pt-6 pb-5 flex items-center justify-between shrink-0 border-b border-[#ebebeb]">
          <Link to="/find-music" className="flex items-center gap-3 group" aria-label="Go to landing page">
            <img
              src="/logo-sukhsangeet.webp"
              alt="Sukh Sangeet"
              className="w-8 h-8 rounded-lg object-contain shadow-xs"
            />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717]">
              SukhSangeet
            </span>
          </Link>
          <button
            onClick={() => setIsLibraryOpen(false)}
            className="p-1.5 text-[#888888] hover:text-[#171717] hover:bg-[#f5f5f5] rounded-md transition-all cursor-pointer"
            aria-label="Close library"
          >
            <X size={18} />
          </button>
        </div>

        {/* Library list */}
        <div className="flex-1 overflow-y-auto px-4 pt-5 custom-scrollbar">
          <div className="px-1 mb-4 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#888888]">Your Library</span>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="w-7 h-7 rounded-md bg-[#fafafa] border border-[#ebebeb] text-[#171717] hover:bg-[#171717] hover:text-white hover:border-[#171717]
                         transition-all flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Create new playlist"
              id="create-playlist-btn"
            >
              <Plus size={15} strokeWidth={2} />
            </button>
          </div>

          <PlaylistSidebar
            playlists={playlists}
            isLoading={isLoading}
            selectedPlaylistId={routePlaylistId}
            onSelectPlaylist={handleSelectPlaylist}
            onDeletePlaylist={handleDeletePlaylist}
          />
        </div>

        {/* User Profile */}
        <div className="px-4 pb-5 pt-4 mt-auto border-t border-[#ebebeb] shrink-0 bg-white">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-[#ebebeb] bg-[#fafafa] mb-3">
            <div
              className="w-8 h-8 rounded-md bg-[#171717] text-white flex items-center justify-center
                         font-mono text-xs font-semibold shrink-0"
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-[#171717]">
                {user?.username || 'User'}
              </p>
              <p className="font-mono text-[10px] text-[#888888] truncate">Active Session</p>
            </div>
          </div>

          <button
            onClick={logout}
            id="logout-btn"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[#4d4d4d]
                       hover:bg-[#f7d4d6]/40 hover:text-[#ee0000] transition-all font-mono text-xs font-medium cursor-pointer"
          >
            <LogOut size={15} className="shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main id="main-content" className="flex-1 flex flex-col relative overflow-hidden min-h-0 bg-[#fafafa]" tabIndex={-1}>
        {!isLibraryOpen && (
          <button
            onClick={handleOpenLibrary}
            className="hidden lg:flex absolute left-6 top-6 z-40 items-center gap-2 px-3.5 py-2 rounded-md bg-white border border-[#ebebeb] text-[#171717] hover:border-[#a1a1a1] shadow-level-2 transition-all cursor-pointer"
            aria-label="Open library sidebar"
            id="open-library-desktop-btn"
          >
            <PanelLeftOpen size={16} />
            <span className="font-mono text-xs font-medium uppercase tracking-wider">Library</span>
          </button>
        )}
        <header className="lg:hidden px-4 py-3 border-b border-[#ebebeb] bg-white">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#888888] block">Workspace</span>
              <p className="truncate text-sm font-semibold text-[#171717]" aria-live="polite">
                {selectedPlaylistLabel}
              </p>
            </div>
            <button
              onClick={handleOpenLibrary}
              className="p-2 rounded-md text-[#4d4d4d] hover:text-[#171717] hover:bg-[#f5f5f5]"
              aria-label="Open library"
            >
              <Library size={18} />
            </button>
          </div>
        </header>
        <div
          className={`
            flex-1 min-h-0 overflow-hidden
            lg:mx-auto lg:w-full lg:max-w-[1480px]
            ${!isLibraryOpen ? 'lg:pt-16' : ''}
          `}
        >
          {currentTrack && isNowPlayingFull ? (
            <div className="h-full min-h-0">
              <NowPlayingView
                onOpenQueue={() => setIsQueueOpen(true)}
                onClose={() => setIsNowPlayingFull(false)}
                onAddToPlaylist={setAddToPlaylistTrack}
              />
            </div>
          ) : (
            <PlaylistTracksPanel
              playlistId={routePlaylistId}
              onRequestOpenLibrary={handleOpenLibrary}
              onImportPlaylist={handleImportPlaylist}
              onAddToPlaylist={setAddToPlaylistTrack}
            />
          )}
        </div>
      </main>

      {/* ── Floating Mini-Player / Nav Bar (Mobile) ── */}
      <div
        className="fixed bottom-3 right-3 left-3 md:bottom-6 md:right-6 md:left-auto md:w-[400px] z-50 lg:hidden"
        style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
        role="region"
        aria-label="Now playing controls"
      >
        {!currentTrack ? (
          /* Mobile bottom nav – no track */
          <div className="lg:hidden bg-white border border-[#ebebeb] shadow-level-4 rounded-xl p-2 flex items-center gap-1">
            <button
              onClick={handleOpenLibrary}
              className="flex-1 flex flex-col items-center gap-1 text-[#4d4d4d] py-1.5 hover:text-[#171717] transition-colors min-h-[40px]"
              aria-label="Open library"
            >
              <Library size={18} />
              <span className="font-mono text-[9px] uppercase tracking-wider">Library</span>
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="w-11 h-11 rounded-full bg-[#171717] text-white flex items-center justify-center
                         shadow-level-3 -mt-6 border-2 border-white hover:scale-105 active:scale-95 transition-all"
              aria-label="Create new playlist"
            >
              <Plus size={20} strokeWidth={2} />
            </button>
            <button
              onClick={() => setIsQueueOpen(true)}
              className="flex-1 flex flex-col items-center gap-1 text-[#4d4d4d] py-1.5 hover:text-[#171717] transition-colors min-h-[40px]"
              aria-label="Open queue"
            >
              <ListMusic size={18} />
              <span className="font-mono text-[9px] uppercase tracking-wider">Queue</span>
            </button>
          </div>
        ) : !isNowPlayingFull ? (
          /* Mini player */
          <div
            className="bg-white border border-[#ebebeb] shadow-level-4 rounded-xl p-3 flex items-center gap-3.5 cursor-pointer"
            onClick={() => setIsNowPlayingFull(true)}
            role="button"
            tabIndex={0}
            aria-label="Expand now playing"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsNowPlayingFull(true);
              }
            }}
            id="mini-player"
          >
            {/* Album art */}
            <img
              src={currentTrack.poster}
              alt={currentTrack.title}
              loading="lazy"
              className="w-12 h-12 rounded-md object-cover border border-[#ebebeb] shrink-0"
            />

            {/* Track info */}
            <div className="flex-1 min-w-0 py-0.5" role="presentation">
              <p className="text-xs font-semibold truncate text-[#171717]">
                {currentTrack.title}
              </p>
              <p className="font-mono text-[10px] text-[#888888] mt-0.5 truncate">
                Up Next: {queue[currentTrackIndex + 1]?.title || 'End of Queue'}
              </p>
            </div>

            {/* Play/Pause */}
            <button
              onClick={(e) => { e.stopPropagation(); isPlaying ? pause() : play(); }}
              className="w-10 h-10 rounded-md bg-[#171717] text-white flex items-center justify-center
                         hover:bg-black active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              id="mini-player-play-btn"
            >
              {isPlaying
                ? <Pause size={18} fill="currentColor" />
                : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
          </div>
        ) : null}
      </div>

      {/* Desktop mini player dock */}
      {currentTrack && !isNowPlayingFull && (
        <div
          className="hidden lg:flex fixed right-8 bottom-8 z-50 w-[min(600px,calc(100vw-4rem))]
                     items-center gap-4 rounded-xl bg-white border border-[#ebebeb]
                     shadow-level-4 p-3"
          role="region"
          aria-label="Desktop now playing dock"
        >
          <img
            src={currentTrack.poster}
            alt={currentTrack.title}
            loading="lazy"
            className="w-12 h-12 rounded-md object-cover shrink-0 border border-[#ebebeb]"
          />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate text-[#171717]">{currentTrack.title}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#888888] truncate mt-0.5">
              {currentTrack.artist || 'Unknown Artist'}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={prev}
              className="p-2 rounded-md text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717] transition-all cursor-pointer"
              aria-label="Previous track"
              id="desktop-mini-prev-btn"
            >
              <SkipBack size={16} fill="currentColor" />
            </button>

            <button
              onClick={isPlaying ? pause : play}
              className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center hover:bg-black active:scale-95 transition-all cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              id="desktop-mini-play-btn"
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="translate-x-0.5" />}
            </button>

            <button
              onClick={next}
              className="p-2 rounded-md text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717] transition-all cursor-pointer"
              aria-label="Next track"
              id="desktop-mini-next-btn"
            >
              <SkipForward size={16} fill="currentColor" />
            </button>

            <button
              onClick={() => setAddToPlaylistTrack(currentTrack)}
              className="p-2 rounded-md text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717] transition-all cursor-pointer"
              aria-label="Add to playlist"
              title="Add to playlist"
              id="desktop-mini-add-playlist-btn"
            >
              <Plus size={16} />
            </button>

            <button
              onClick={() => setIsQueueOpen(true)}
              className="p-2 rounded-md text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717] transition-all cursor-pointer"
              aria-label="Open queue"
              id="desktop-mini-queue-btn"
            >
              <ListMusic size={16} />
            </button>

            <button
              onClick={() => setIsNowPlayingFull(true)}
              className="px-3 h-8 rounded-md bg-[#fafafa] border border-[#ebebeb] hover:bg-[#f5f5f5] text-[#171717] font-mono text-[11px] font-medium uppercase tracking-wider transition-all cursor-pointer"
              aria-label="Open full player"
              id="desktop-mini-open-btn"
            >
              Open
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isLibraryOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[90] bg-black/30 backdrop-blur-xs transition-opacity"
          onClick={() => setIsLibraryOpen(false)}
          aria-hidden="true"
        />
      )}

      <TrackDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      <CreatePlaylistModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setPendingTrackForNewPlaylist(null);
        }}
        onCreate={handleCreatePlaylist}
      />
      <AddToPlaylistModal
        isOpen={Boolean(addToPlaylistTrack)}
        onClose={() => setAddToPlaylistTrack(null)}
        track={addToPlaylistTrack}
        onRequestCreatePlaylist={handleRequestCreatePlaylist}
      />
    </div>
  );
};

export default PlaylistWorkspace;
