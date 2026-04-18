import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music, Zap, Share2, BarChart3 } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/logo-sukhsangeet.webp" 
              alt="Sukh Sangeet Logo" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-black text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Sukh Sangeet</span>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-semibold text-white/70 hover:text-white rounded-lg transition-colors hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl opacity-60 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 space-y-8">
          <div className="inline-block">
            <span className="text-sm font-bold text-purple-300 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30">✨ Focus  Distraction</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight">
            Your Vibe,
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Your Playlist</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stop wasting time finding music. Build, organize, and vibe with YouTube playlists designed for focus. Made for students, creators, and deep work warriors.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/register"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95 transition-all"
            >
              Start Building Now
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/40 active:scale-95 transition-all backdrop-blur-sm"
            >
              Already In?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            What Makes Us Different
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Built for real workflow. Not for demos.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 text-xl">
                🎵
              </div>
              <h3 className="text-xl font-bold mb-3">YouTube Native</h3>
              <p className="text-gray-300">
                Search millions of YouTube videos. No YouTube API hassles. Just pure playlist building.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 text-xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-300">
                Drag, reorder, play. No lag. No bloat. Just fast. Works on any device.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 text-xl">
                🎨
              </div>
              <h3 className="text-xl font-bold mb-3">Epic Visualizer</h3>
              <p className="text-gray-300">
                Watch your music come alive. Real-time audio visualizations that actually hit different.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 text-xl">
                🤝
              </div>
              <h3 className="text-xl font-bold mb-3">Share Your Vibes</h3>
              <p className="text-gray-300">
                Drop playlists to your squad. Real-time collaboration. Your music, your way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Made For Everyone</h2>
          <p className="text-lg text-gray-300">Different vibe, same focus.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="group bg-gradient-to-br from-blue-600/30 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/60 transition-all hover:scale-105">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-bold text-lg mb-2">JEE/NEET Grind</h3>
            <p className="text-sm text-gray-300">Lo-fi deep focus for exam prep</p>
          </div>
          
          <div className="group bg-gradient-to-br from-purple-600/30 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/60 transition-all hover:scale-105">
            <div className="text-4xl mb-3">💼</div>
            <h3 className="font-bold text-lg mb-2">Productivity Bro</h3>
            <p className="text-sm text-gray-300">Code, design, create in the zone</p>
          </div>
          
          <div className="group bg-gradient-to-br from-pink-600/30 to-pink-600/10 border border-pink-500/30 rounded-2xl p-6 hover:border-pink-400/60 transition-all hover:scale-105">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-lg mb-2">Creative Energy</h3>
            <p className="text-sm text-gray-300">Inspiration for any project</p>
          </div>
          
          <div className="group bg-gradient-to-br from-green-600/30 to-green-600/10 border border-green-500/30 rounded-2xl p-6 hover:border-green-400/60 transition-all hover:scale-105">
            <div className="text-4xl mb-3">🧘</div>
            <h3 className="font-bold text-lg mb-2">Just Vibe</h3>
            <p className="text-sm text-gray-300">Relax and let go</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl opacity-70"></div>
          <div className="relative bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
            <h2 className="text-5xl font-black mb-4">Ready to Focus?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands already vibing to the perfect playlist. Free forever. No credit card needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95 transition-all"
              >
                Get Started Now
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/40 active:scale-95 transition-all"
              >
                Already Have Access?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/logo-sukhsangeet.webp" 
                  alt="Sukh Sangeet Logo" 
                  className="w-6 h-6 rounded"
                />
                <span className="font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Sukh Sangeet</span>
              </div>
              <p className="text-gray-400 text-sm">Focus music, reimagined.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Info</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <p>© 2026 Sukh Sangeet. All rights reserved.</p>
              <p>Crafted with 🎵 by <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Darshan</span></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
