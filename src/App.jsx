import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import { PlayerProvider } from './context/PlayerContext';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PlaylistWorkspace = lazy(() => import('./components/PlaylistWorkspace'));
const PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt'));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#fbfaf7]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent"></div>
  </div>
);

const PlayerAppShell = () => (
  <PlayerProvider>
    <PlaylistWorkspace />
  </PlayerProvider>
);

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/find-music" element={<PlayerAppShell />} />
            <Route path="/find-music/playlist/:id" element={<PlayerAppShell />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <PWAInstallPrompt />
      </Suspense>
    </>
  );
}

export default App;
