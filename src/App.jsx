import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import { PlayerProvider } from './context/PlayerContext';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const About = lazy(() => import('./pages/About'));
const Terms = lazy(() => import('./pages/Terms'));
const Contact = lazy(() => import('./pages/Contact'));
const PlaylistWorkspace = lazy(() => import('./components/PlaylistWorkspace'));
const PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt'));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#fafafa]">
    <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#171717] border-t-transparent"></div>
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
          <Route path="/login/*" element={<Login />} />
          <Route path="/register/*" element={<Register />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/contact" element={<Contact />} />
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
