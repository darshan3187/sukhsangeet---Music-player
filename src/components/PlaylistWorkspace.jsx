import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListMusic, Plus, Library, Play, Pause, X, LogOut, PanelLeftOpen, SkipBack, SkipForward } from 'lucide-react';
import PlaylistSidebar from './PlaylistSidebar';
import PlaylistTracksPanel from './PlaylistTracksPanel';
import CreatePlaylistModal from './CreatePlaylistModal';
import TrackDrawer from './TrackDrawer';
import NowPlayingView from './NowPlayingView';
import { usePlaylists } from '../hooks/usePlaylists';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

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
    if (currentTrack) setIsNowPlayingFull(true);
  }, [currentTrack?.youtubeId]);

  const selectedPlaylist = useMemo(
    () => playlists.find((item) => item.id?.toString() === routePlaylistId?.toString()),
    [playlists, routePlaylistId],
  );

  const selectedPlaylistLabel = selectedPlaylist?.name || 'All Playlists';

  const handleCreatePlaylist = useCallback(async (name, description) => {
    const created = await createPlaylist(name, description);
    if (created?.id) navigate(`/app/playlist/${created.id}`, { replace: true });
    setIsCreateOpen(false);
    return created;
  }, [createPlaylist, navigate]);

  const handleSelectPlaylist = useCallback((id) => {
    navigate(`/app/playlist/${id}`);
    if (window.innerWidth < 1024) setIsLibraryOpen(false);
  }, [navigate]);

  const handleDeletePlaylist = useCallback(async (id) => {
    try {
      if (routePlaylistId === id.toString()) navigate('/app', { replace: true });
      await deletePlaylist(id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }, [deletePlaylist, navigate, routePlaylistId]);

  const handleOpenLibrary = useCallback(() => {
    setIsLibraryOpen(true);
  }, []);

  return (
    <div className="relative h-dvh w-full overflow-hidden flex min-h-0 bg-gray-50 font-sans selection:bg-gray-200">

      {/* ── Sidebar – Library ── */}
      <aside
        id="library-sidebar"
        className={`
          fixed inset-y-0 left-0 z-[100] lg:z-50
          w-72 xl:w-80
          bg-white lg:bg-white/70 backdrop-blur-3xl
          border-r border-black/[0.04]
          transition-all duration-500 ease-in-out
          flex flex-col
          lg:relative lg:translate-x-0
          ${isLibraryOpen ? 'translate-x-0' : '-translate-x-full'}
          ${!isLibraryOpen ? 'lg:w-0 lg:min-w-0 lg:max-w-0 lg:overflow-hidden lg:opacity-0 lg:pointer-events-none lg:border-r-0' : ''}
        `}
        aria-label="Library sidebar"
      >
        {/* Sidebar header */}
        <div className="px-6 pt-8 pb-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <img
              src="/logo-sukhsangeet.webp"
              alt="Sukh Sangeet"
              className="w-10 h-10 rounded-xl object-cover shadow-md transition-transform duration-200 hover:scale-110"
            />
            <h1 className="text-xl font-black tracking-tight text-gray-900">Platform</h1>
          </div>
          <button
            onClick={() => setIsLibraryOpen(false)}
            className="touch-target text-gray-400 hover:text-gray-900 hover:bg-black/5 rounded-xl transition-all"
            aria-label="Close library"
          >
            <X size={20} />
          </button>
        </div>

        {/* Library list */}
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <div className="px-2 mb-5 flex items-center justify-between">
            <span className="text-label">Your Library</span>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="w-9 h-9 rounded-full surface-raised hover:bg-gray-900 hover:text-white
                         transition-all flex items-center justify-center text-gray-500 active:scale-90
                         focus-visible:outline-2 focus-visible:outline-gray-900"
              aria-label="Create new playlist"
              id="create-playlist-btn"
            >
              <Plus size={17} strokeWidth={2.5} />
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
        <div className="px-4 pb-6 pt-4 mt-auto border-t border-black/[0.04] shrink-0">
          <div className="flex items-center gap-3 p-3.5 surface-raised rounded-2xl mb-3 group hover-lift">
            <div
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center
                         text-gray-700 font-black text-sm shadow-xs ring-2 ring-gray-200/70 shrink-0"
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate text-gray-900 tracking-tight leading-tight">
                {user?.username || 'User'}
              </p>
              <p className="text-caption mt-0.5">Premium Account</p>
            </div>
          </div>

          <button
            onClick={logout}
            id="logout-btn"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-500
                       hover:bg-red-50 hover:text-red-600 transition-all font-semibold text-sm
                       group min-h-[44px]"
          >
            <LogOut size={17} className="group-hover:translate-x-0.5 transition-transform shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main id="main-content" className="flex-1 flex flex-col relative overflow-hidden min-h-0 bg-gray-50/80" tabIndex={-1}>
        {!isLibraryOpen && (
          <button
            onClick={handleOpenLibrary}
            className="hidden lg:flex absolute left-6 top-6 z-40 items-center gap-2.5 px-4 py-2.5 rounded-xl surface-raised text-gray-700 hover:text-gray-900 hover:shadow-md transition-all"
            aria-label="Open library sidebar"
            id="open-library-desktop-btn"
          >
            <PanelLeftOpen size={18} />
            <span className="text-xs font-black uppercase tracking-[0.14em]">Library</span>
          </button>
        )}
        <header className="lg:hidden px-4 pt-4 pb-2 border-b border-black/[0.04] bg-white/70 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-label mb-1">Music Hub</p>
              <p className="truncate text-sm font-black tracking-tight text-gray-900" aria-live="polite">
                {selectedPlaylistLabel}
              </p>
            </div>
            <button
              onClick={handleOpenLibrary}
              className="touch-target rounded-xl text-gray-500 hover:text-gray-900 hover:bg-black/5"
              aria-label="Open library"
            >
              <Library size={19} />
            </button>
          </div>
        </header>
        <div
          className={`
            flex-1 min-h-0 overflow-hidden relative flex flex-col
            lg:mx-auto lg:w-full lg:max-w-[1480px]
            ${!isLibraryOpen ? 'lg:pt-16' : ''}
          `}
        >
          {currentTrack && isNowPlayingFull ? (
            <div className="h-full min-h-0">
              <NowPlayingView
                onOpenQueue={() => setIsQueueOpen(true)}
                onClose={() => setIsNowPlayingFull(false)}
              />
            </div>
          ) : (
            <PlaylistTracksPanel playlistId={routePlaylistId} onRequestOpenLibrary={handleOpenLibrary} />
          )}
        </div>
      </main>

      {/* ── Floating Mini-Player / Nav Bar ── */}
      <div
        className="fixed bottom-3 right-3 left-3 md:bottom-8 md:right-8 md:left-8 md:left-auto md:right-12 md:w-[400px] z-50 lg:hidden"
        style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
        role="region"
        aria-label="Now playing controls"
      >
        {!currentTrack ? (
          /* Mobile bottom nav – no track */
          <div className="lg:hidden glass-card rounded-[2.5rem] p-2.5 flex items-center gap-1">
            <button
              onClick={handleOpenLibrary}
              className="flex-1 flex flex-col items-center gap-1.5 text-gray-500 py-2 hover:text-gray-900 transition-colors min-h-[44px]"
              aria-label="Open library"
            >
              <Library size={22} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Library</span>
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center
                         shadow-2xl -mt-12 border-[5px] border-gray-50 hover:scale-110 active:scale-90 transition-all"
              aria-label="Create new playlist"
            >
              <Plus size={28} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setIsQueueOpen(true)}
              className="flex-1 flex flex-col items-center gap-1.5 text-gray-500 py-2 hover:text-gray-900 transition-colors min-h-[44px]"
              aria-label="Open queue"
            >
              <ListMusic size={22} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Queue</span>
            </button>
          </div>
        ) : !isNowPlayingFull ? (
          /* Mini player */
          <div
            className="glass-card rounded-[2rem] p-3.5 flex items-center gap-4 animate-fade-in-up group cursor-pointer"
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
            <div className="relative w-14 h-14 shrink-0">
              <div className="absolute inset-0 rounded-xl blur-xl bg-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src={currentTrack.poster}
                alt={currentTrack.title}
                loading="lazy"
                className="relative z-10 w-full h-full rounded-xl object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0 py-0.5" role="presentation">
              <p className="text-sm font-black truncate text-gray-900 tracking-tight leading-tight">
                {currentTrack.title}
              </p>
              <p className="text-caption mt-1 truncate">
                Up Next: {queue[currentTrackIndex + 1]?.title || 'End of Queue'}
              </p>
            </div>

            {/* Play/Pause */}
            <button
              onClick={(e) => { e.stopPropagation(); isPlaying ? pause() : play(); }}
              className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center
                         hover:scale-110 active:scale-95 transition-all shadow-lg hover:shadow-xl shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              id="mini-player-play-btn"
            >
              {isPlaying
                ? <Pause size={20} fill="currentColor" />
                : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>
          </div>
        ) : null}
      </div>

      {/* Desktop mini player dock */}
      {currentTrack && !isNowPlayingFull && (
        <div
          className="hidden lg:flex fixed right-8 bottom-8 z-50 w-[min(620px,calc(100vw-4rem))]
                     items-center gap-4 rounded-2xl bg-white/90 backdrop-blur-2xl border border-black/[0.06]
                     shadow-[0_24px_80px_-24px_rgba(0,0,0,0.3)] p-3.5"
          role="region"
          aria-label="Desktop now playing dock"
        >
          <img
            src={currentTrack.poster}
            alt={currentTrack.title}
            loading="lazy"
            className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-sm"
          />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-black truncate text-gray-900 tracking-tight">{currentTrack.title}</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 truncate mt-1">
              {currentTrack.artist || 'Unknown Artist'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={prev}
              className="touch-target rounded-xl text-gray-600 hover:bg-black/5 hover:text-gray-900 transition-all"
              aria-label="Previous track"
              id="desktop-mini-prev-btn"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>

            <button
              onClick={isPlaying ? pause : play}
              className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              id="desktop-mini-play-btn"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="translate-x-0.5" />}
            </button>

            <button
              onClick={next}
              className="touch-target rounded-xl text-gray-600 hover:bg-black/5 hover:text-gray-900 transition-all"
              aria-label="Next track"
              id="desktop-mini-next-btn"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>

            <button
              onClick={() => setIsQueueOpen(true)}
              className="touch-target rounded-xl text-gray-600 hover:bg-black/5 hover:text-gray-900 transition-all"
              aria-label="Open queue"
              id="desktop-mini-queue-btn"
            >
              <ListMusic size={18} />
            </button>

            <button
              onClick={() => setIsNowPlayingFull(true)}
              className="px-3.5 h-10 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-gray-800 text-[11px] font-black uppercase tracking-[0.12em] transition-all"
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
          className="lg:hidden fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsLibraryOpen(false)}
          aria-hidden="true"
        />
      )}

      <TrackDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      <CreatePlaylistModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </div>
  );
};

export default PlaylistWorkspace;
