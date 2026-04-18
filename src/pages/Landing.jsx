import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/logo-sukhsangeet.webp" 
              alt="Sukh Sangeet Logo" 
              className="w-8 h-8"
            />
            <span className="font-black text-xl text-gray-900">Sukh Sangeet</span>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight">
            Your Focus,<br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Soundtrack
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Sukh Sangeet helps you build, organize, and share YouTube-powered playlists for study sessions, focus work, and creative flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              to="/register"
              className="px-8 py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-xl border-2 border-gray-900 hover:bg-gray-50 active:scale-95 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-4xl font-black text-gray-900 text-center mb-16">
          Why Choose Sukh Sangeet?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎵</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">YouTube Integration</h3>
            <p className="text-gray-600">
              Search and add YouTube tracks directly to your playlists. No limits on your music library.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Organize Playlists</h3>
            <p className="text-gray-600">
              Create multiple playlists for different moods and activities. Drag-and-drop to reorder tracks effortlessly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Audio Visualizer</h3>
            <p className="text-gray-600">
              Experience stunning real-time audio visualizations while your music plays. Pure focus immersion.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Share & Collaborate</h3>
            <p className="text-gray-600">
              Share your playlists with friends and study partners. Build collective music experiences together.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎧</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Player</h3>
            <p className="text-gray-600">
              Advanced playback controls, queue management, and track information at your fingertips.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Fully Responsive</h3>
            <p className="text-gray-600">
              Access your playlists on desktop, tablet, or mobile. Your music goes wherever you do.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl">
        <h2 className="text-4xl font-black text-gray-900 text-center mb-16">
          Perfect For
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Study Sessions</h3>
            <p className="text-gray-600">Focus better with curated lo-fi playlists</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Work Sessions</h3>
            <p className="text-gray-600">Stay productive with ambient soundtracks</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Creative Work</h3>
            <p className="text-gray-600">Find inspiration in your favorite tracks</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🧘</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Relaxation</h3>
            <p className="text-gray-600">Unwind with your perfect playlist</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-6">
          Ready to Transform Your Focus?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join thousands of users creating the perfect playlists for their workflow. Start free today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-lg hover:shadow-xl"
          >
            Create Your Playlist Now
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-xl border-2 border-gray-900 hover:bg-gray-50 active:scale-95 transition-all"
          >
            Already a Member?
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/logo-sukhsangeet.webp" 
                  alt="Sukh Sangeet Logo" 
                  className="w-6 h-6"
                />
                <span className="font-black text-lg">Sukh Sangeet</span>
              </div>
              <p className="text-gray-400 text-sm">Your focus, your soundtrack.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2026 Sukh Sangeet. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm">
                Built by <span className="font-semibold text-white">Darshan</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
