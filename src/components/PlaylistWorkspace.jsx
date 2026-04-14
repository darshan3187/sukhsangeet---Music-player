import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListMusic, Plus, Music2, Library, Play, Pause, X, LogOut, House, Menu } from 'lucide-react';
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
  const { currentTrack, isPlaying, play, pause, queue, currentTrackIndex } = usePlayer();
  const { logout, user } = useAuth();
  const [isLibraryOpen, setIsLibraryOpen] = useState(() => window.innerWidth >= 1024);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNowPlayingFull, setIsNowPlayingFull] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsLibraryOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (created?.id) navigate(`/playlist/${created.id}`, { replace: true });
    setIsCreateOpen(false);
    return created;
  }, [createPlaylist, navigate]);

  const handleSelectPlaylist = useCallback((id) => {
    navigate(`/playlist/${id}`);
    if (window.innerWidth < 1024) setIsLibraryOpen(false);
  }, [navigate]);

  const handleDeletePlaylist = useCallback(async (id) => {
    try {
      if (routePlaylistId === id.toString()) navigate('/', { replace: true });
      await deletePlaylist(id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }, [deletePlaylist, navigate, routePlaylistId]);

  return (
    <div className="app-shell app-background relative h-dvh w-full overflow-hidden selection:bg-gray-200">
      <div className="mx-auto flex h-full w-full max-w-[1536px] overflow-hidden">
        <aside
          id="library-sidebar"
          className={
            `
              fixed inset-y-0 left-0 z-[120] lg:static lg:z-40
              w-[min(88vw,20rem)] lg:w-[18.5rem] xl:w-[20rem]
              modal-surface lg:page-surface
              flex flex-col
              transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
              ${isLibraryOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0
            `
          }
          aria-label="Library sidebar"
        >
          <div className="px-5 pt-6 pb-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div
                className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shadow-md transition-transform duration-200 hover:scale-105"
                aria-hidden="true"
              >
                <Music2 size={20} />
              </div>
              <div>
                <p className="text-caption mb-1">Music Hub</p>
                <h1 className="text-[clamp(1.15rem,2vw,1.5rem)] font-black tracking-tight text-gray-900">Platform</h1>
              </div>
            </div>
            <button
              onClick={() => setIsLibraryOpen(false)}
              className="lg:hidden touch-target rounded-xl text-gray-400 hover:text-gray-900 hover:bg-black/5"
              aria-label="Close library"
              title="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
            <div className="px-2 mb-5 flex items-center justify-between gap-3">
              <span className="text-label">Your Library</span>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="tooltip w-11 h-11 rounded-full surface-raised hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center text-gray-500 active:scale-90 focus-visible:outline-2 focus-visible:outline-gray-900"
                data-tooltip="Create playlist"
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

          <div className="px-4 pb-6 pt-4 mt-auto border-t border-black/[0.04] shrink-0">
            <div className="flex items-center gap-3 p-3.5 surface-raised rounded-2xl mb-3 group hover-lift">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 font-black text-sm shadow-xs ring-2 ring-gray-200/70 shrink-0">
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
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-semibold text-sm group min-h-[44px]"
            >
              <LogOut size={17} className="group-hover:translate-x-0.5 transition-transform shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        <main id="main-content" className="flex-1 flex min-h-0 flex-col relative overflow-hidden" tabIndex={-1}>
          <header className="lg:hidden px-4 pt-3 pb-2">
            <div className="page-surface rounded-[1.5rem] px-3 py-3 flex items-center gap-3">
              <button
                onClick={() => setIsLibraryOpen((value) => !value)}
                className="touch-target rounded-xl text-gray-500 hover:text-gray-900 hover:bg-black/5"
                aria-label="Open navigation menu"
                aria-expanded={isLibraryOpen}
                aria-controls="library-sidebar"
                title="Menu"
              >
                <Menu size={19} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-caption mb-1">Music Hub</p>
                <p className="truncate text-sm font-black tracking-tight text-gray-900" aria-live="polite">
                  {selectedPlaylistLabel}
                </p>
              </div>
            </div>
          </header>

          <div className="flex-1 min-h-0 overflow-hidden relative">
            {currentTrack && isNowPlayingFull ? (
              <div className="h-full flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-black/[0.03]">
                <div className="flex-1 overflow-hidden">
                  <NowPlayingView
                    onOpenQueue={() => setIsQueueOpen(true)}
                    onClose={() => setIsNowPlayingFull(false)}
                  />
                </div>
                <div className="hidden 2xl:block w-[420px] bg-black/[0.01] overflow-hidden">
                  <PlaylistTracksPanel playlistId={routePlaylistId} />
                </div>
              </div>
            ) : (
              <PlaylistTracksPanel playlistId={routePlaylistId} />
            )}
          </div>
        </main>

        <div
          className="fixed bottom-3 right-3 left-3 md:bottom-8 md:right-8 md:left-auto md:w-[400px] z-50"
          style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
          role="region"
          aria-label="Now playing controls"
        >
          {!currentTrack ? (
            <nav className="lg:hidden mobile-nav-shell rounded-[2rem] p-2.5 flex items-center gap-1" aria-label="Primary navigation">
              <button
                onClick={() => navigate('/')}
                className="tooltip flex-1 flex flex-col items-center gap-1.5 text-gray-500 py-2 hover:text-gray-900 transition-colors min-h-[44px]"
                data-tooltip="Home"
                aria-label="Go to home"
              >
                <House size={20} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Home</span>
              </button>
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="tooltip flex-1 flex flex-col items-center gap-1.5 text-gray-500 py-2 hover:text-gray-900 transition-colors min-h-[44px]"
                data-tooltip="Library"
                aria-label="Open library"
              >
                <Library size={22} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Library</span>
              </button>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-2xl -mt-12 border-[5px] border-gray-50 hover:scale-110 active:scale-90 transition-all"
                aria-label="Create new playlist"
                title="Create playlist"
              >
                <Plus size={28} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setIsQueueOpen(true)}
                className="tooltip flex-1 flex flex-col items-center gap-1.5 text-gray-500 py-2 hover:text-gray-900 transition-colors min-h-[44px]"
                data-tooltip="Queue"
                aria-label="Open queue"
              >
                <ListMusic size={22} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Queue</span>
              </button>
            </nav>
          ) : !isNowPlayingFull ? (
            <div
              className="mobile-nav-shell rounded-[2rem] p-3.5 flex items-center gap-4 animate-fade-in-up group cursor-pointer"
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
              <div className="relative w-14 h-14 shrink-0">
                <div className="absolute inset-0 rounded-xl blur-xl bg-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={currentTrack.poster}
                  alt={currentTrack.title}
                  loading="lazy"
                  className="relative z-10 w-full h-full rounded-xl object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 min-w-0 py-0.5" role="presentation">
                <p className="text-sm font-black truncate text-gray-900 tracking-tight leading-tight">
                  {currentTrack.title}
                </p>
                <p className="text-caption mt-1 truncate">
                  Up Next: {queue[currentTrackIndex + 1]?.title || 'End of Queue'}
                </p>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); isPlaying ? pause() : play(); }}
                className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg hover:shadow-xl shrink-0"
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

        {isLibraryOpen && (
          <div
            className="lg:hidden fixed inset-0 z-[110] bg-black/25 backdrop-blur-sm animate-fade-in-up"
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
    </div>
  );
};

export default PlaylistWorkspace;
