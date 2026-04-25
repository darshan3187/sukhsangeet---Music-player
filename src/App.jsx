import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import PlaylistWorkspace from './components/PlaylistWorkspace';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { PlayerProvider } from './context/PlayerContext';

const PlayerAppShell = () => (
  <PlayerProvider>
    <PlaylistWorkspace />
  </PlayerProvider>
);


function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<PlayerAppShell />} />
          <Route path="/app/playlist/:id" element={<PlayerAppShell />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PWAInstallPrompt />
    </>
  );
}

export default App;
