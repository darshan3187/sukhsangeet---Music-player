import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Music,
  ListMusic,
  Waves,
  BookOpen,
  Briefcase,
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased [font-family:ui-sans-serif,system-ui,-apple-system,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,'Noto_Sans',sans-serif]">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Sukh Sangeet home">
            <span className="rounded-lg bg-white p-1.5 shadow-sm ring-1 ring-gray-200">
              <img
                src="/logo-sukhsangeet.webp"
                alt="Sukh Sangeet"
                className="h-6 w-6 object-contain"
                loading="eager"
              />
            </span>
            <span className="text-lg font-bold tracking-tight sm:text-xl">Sukh Sangeet</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Features</a>
            <a href="#use-cases" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Use Cases</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black sm:px-5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8" aria-labelledby="hero-title">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <Sparkles size={14} />
              Focus-friendly music player
            </p>
            <h1 id="hero-title" className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Build Better Focus with
              <span className="block text-gray-900">
                Clean, <span className="text-emerald-700">Curated</span> Playlists
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Create playlists from YouTube tracks, organize what you listen to, and stay in flow while studying, coding, or creating.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-base font-semibold text-white transition-all hover:bg-black"
              >
                Start Now
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-gray-100 bg-gray-50/40" aria-labelledby="features-title">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-10 text-center sm:mb-14">
              <h2 id="features-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Core Features</h2>
              <p className="mx-auto mt-3 max-w-2xl text-gray-600">Everything needed for a clean listening workflow without extra clutter.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor}`}>
                    <feature.icon className={`${feature.color} h-6 w-6`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="use-cases" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="use-cases-title">
          <div className="mb-10 text-center sm:mb-14">
            <h2 id="use-cases-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Built for Real Work</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">Use Sukh Sangeet in the moments where attention matters most.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <article key={useCase.title} className="rounded-2xl border border-gray-200 p-6">
                <useCase.icon className="h-6 w-6 text-emerald-700" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{useCase.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-24" aria-labelledby="cta-title">
          <h2 id="cta-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to Focus Better?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Create your account and start building your perfect listening setup.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            <Zap size={18} />
            Create Account
          </Link>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Sukh Sangeet</p>
          <p>Made for focused listening.</p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: Music,
    title: "YouTube Search",
    description: "Find tracks quickly from YouTube and add them to your playlists.",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50"
  },
  {
    icon: ListMusic,
    title: "Playlist Management",
    description: "Create and organize playlists for different moods and tasks.",
    color: "text-amber-700",
    bgColor: "bg-amber-50"
  },
  {
    icon: Waves,
    title: "Smooth Player",
    description: "Reliable playback with controls built for long focus sessions.",
    color: "text-green-600",
    bgColor: "bg-green-50"
  }
];

const useCases = [
  {
    icon: BookOpen,
    title: "Study Sessions",
    description: "Keep your concentration steady with distraction-free playlists."
  },
  {
    icon: Briefcase,
    title: "Deep Work",
    description: "Set up tracks that help you stay productive for longer stretches."
  },
  {
    icon: Music,
    title: "Creative Flow",
    description: "Build mood-based playlists to support writing, design, and ideas."
  }
];

export default Landing;
