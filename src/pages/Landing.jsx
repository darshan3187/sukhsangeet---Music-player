import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Music,
  ListMusic,
  Waves,
  BookOpen,
  Briefcase,
  ChevronRight,
  Zap,
  CheckCircle2,
  HelpCircle,
  Play,
  ShieldCheck,
  User,
  Star
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
    <div className="relative min-h-screen overflow-hidden bg-[#fbfaf7] text-gray-900 antialiased [font-family:ui-sans-serif,system-ui,-apple-system,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,'Noto_Sans',sans-serif]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_30%),radial-gradient(circle_at_20%_20%,_rgba(245,158,11,0.12),_transparent_22%),radial-gradient(circle_at_80%_12%,_rgba(17,24,39,0.06),_transparent_26%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
      />
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="SukhSangeet home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_rgba(17,24,39,0.08)] ring-1 ring-gray-200 sm:h-12 sm:w-12">
              <img
                src="/logo-sukhsangeet.webp"
                alt="SukhSangeet"
                className="h-7 w-7 object-contain sm:h-9 sm:w-9"
                loading="eager"
              />
            </span>
            <span className="hidden font-bold tracking-tight text-gray-900 sm:block">Sukh Sangeet</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            <a href="#how-to" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">How to Organize</a>
            <a href="#features" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Features</a>
            <a href="#comparison" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Compare</a>
            <a href="#faq" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">FAQ</a>
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
        {/* AEO Optimized Hero Section */}
        <section className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8" aria-labelledby="hero-title">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 text-[0.85rem] font-bold tracking-[0.2em] text-emerald-700 sm:mb-6 sm:text-[1rem]">
              YOUTUBE PLAYLIST MANAGER
            </p>
            <h1
              id="hero-title"
              className="mx-auto max-w-4xl text-[2.2rem] font-black leading-[1.1] tracking-[-0.03em] text-gray-950 sm:text-5xl lg:text-6xl"
            >
              What is Sukh Sangeet? A YouTube Playlist Manager for Focused Listening
            </h1>
            
            {/* Direct Answer Block for AEO */}
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100 text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
              <p className="text-[1.05rem] leading-relaxed text-gray-800 font-medium">
                <strong>Sukh Sangeet</strong> is a dedicated personal music player and YouTube playlist manager. It allows you to search YouTube, create custom playlists, and organize your favorite tracks for deep work. Enjoy a distraction-free audio experience designed to improve focus without algorithm recommendations.
              </p>
            </div>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:mt-12 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(17,24,39,0.18)] transition-all hover:-translate-y-0.5 hover:bg-black sm:w-auto sm:px-8 sm:py-4 sm:text-base"
              >
                Start Organizing Now
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* How to Use / Questions Format */}
        <section id="how-to" className="border-y border-gray-100 bg-gray-50/40" aria-labelledby="how-to-title">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mb-12 sm:mb-16 max-w-3xl">
              <h2 id="how-to-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                How do I organize my YouTube music playlists?
              </h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                Organizing YouTube music into cohesive playlists is simple with Sukh Sangeet. Follow these four straightforward steps to build your custom music collection without leaving the app.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {howToSteps.map((step, index) => (
                <article key={step.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="features-title">
          <div className="mb-12 max-w-3xl text-center mx-auto">
            <h2 id="features-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What are the core features of this music player?
            </h2>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              Sukh Sangeet provides specialized tools for audio playback and music organization. Here are the primary features that make it the best playlist manager for focused listening.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-gray-200 bg-white p-8 hover:border-emerald-200 transition-colors">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor}`}>
                  <feature.icon className={`${feature.color} h-7 w-7`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Comparison Table Section for Featured Snippets */}
        <section id="comparison" className="border-y border-gray-100 bg-white" aria-labelledby="comparison-title">
          <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="comparison-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Sukh Sangeet vs. Standard Platforms
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Why choose a dedicated YouTube playlist manager instead of regular streaming apps? Compare the benefits below.
              </p>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-left text-sm text-gray-600 min-w-[600px]">
                <thead className="bg-gray-50 text-gray-900 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-5 font-bold text-base">Feature Comparison</th>
                    <th className="px-6 py-5 font-bold text-base text-emerald-700 bg-emerald-50/50">Sukh Sangeet</th>
                    <th className="px-6 py-5 font-bold text-base">YouTube App</th>
                    <th className="px-6 py-5 font-bold text-base">Spotify (Free)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Distraction-Free Interface</td>
                    <td className="px-6 py-4 bg-emerald-50/30 font-medium text-emerald-800 flex items-center gap-2"><CheckCircle2 size={16}/> Yes</td>
                    <td className="px-6 py-4">No (Recommended Videos)</td>
                    <td className="px-6 py-4">Yes</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Free Custom Playlists</td>
                    <td className="px-6 py-4 bg-emerald-50/30 font-medium text-emerald-800 flex items-center gap-2"><CheckCircle2 size={16}/> Yes</td>
                    <td className="px-6 py-4">Yes</td>
                    <td className="px-6 py-4">No (Forced Shuffle)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Direct YouTube Search</td>
                    <td className="px-6 py-4 bg-emerald-50/30 font-medium text-emerald-800 flex items-center gap-2"><CheckCircle2 size={16}/> Yes</td>
                    <td className="px-6 py-4">Yes</td>
                    <td className="px-6 py-4">No</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">No Algorithmic Feeds</td>
                    <td className="px-6 py-4 bg-emerald-50/30 font-medium text-emerald-800 flex items-center gap-2"><CheckCircle2 size={16}/> Yes</td>
                    <td className="px-6 py-4">No</td>
                    <td className="px-6 py-4">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* E-E-A-T and Trust Section */}
        <section className="bg-gray-50/40 py-16 sm:py-24" aria-labelledby="trust-title">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="trust-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Built for Listeners, By Listeners
              </h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center p-6">
                <div className="bg-emerald-100 p-3 rounded-full mb-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Privacy First</h3>
                <p className="mt-2 text-sm text-gray-600">Your playlist data is secure. We never track or sell your listening habits to third parties.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="bg-emerald-100 p-3 rounded-full mb-4">
                  <Star className="w-8 h-8 text-emerald-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">High Performance</h3>
                <p className="mt-2 text-sm text-gray-600">Engineered with React and YouTube IFrame API for instant track switching without lag.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="bg-emerald-100 p-3 rounded-full mb-4">
                  <User className="w-8 h-8 text-emerald-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Indie Developed</h3>
                <p className="mt-2 text-sm text-gray-600">Created by Darshan to solve a real problem: finding focus in a noisy digital environment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Answer Engine Optimization */}
        <section id="faq" className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="faq-title">
          <div className="mb-12 text-center">
            <h2 id="faq-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions (People Also Ask)
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to know about our personal music player.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 flex gap-3 items-start">
                  <HelpCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed ml-9">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-24" aria-labelledby="cta-title">
          <h2 id="cta-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to Focus Better?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Create your free account and start building your perfect listening setup.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-700/20 transition-all hover:bg-emerald-800 hover:-translate-y-1"
          >
            <Play fill="currentColor" size={18} />
            Create Free Account
          </Link>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-4 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo-sukhsangeet.webp" alt="Sukh Sangeet Icon" className="h-6 w-6 grayscale opacity-60" />
            <p className="font-medium">© 2026 Sukh Sangeet. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-emerald-700 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-emerald-700 transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-emerald-700 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: Music,
    title: "Direct YouTube Search",
    description: "Find tracks quickly using our built-in YouTube search engine. Add songs to your library without ever opening a new tab or seeing an ad banner.",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50"
  },
  {
    icon: ListMusic,
    title: "Custom Playlist Management",
    description: "Create unlimited playlists for studying, working out, or relaxing. Organize your music with intuitive drag-and-drop track reordering.",
    color: "text-amber-700",
    bgColor: "bg-amber-50"
  },
  {
    icon: Waves,
    title: "Smooth Audio Player",
    description: "Experience reliable playback with controls built for long listening sessions. Features an audio visualizer and instant track switching.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  {
    icon: BookOpen,
    title: "Deep Work Optimized",
    description: "Our distraction-free interface hides video recommendations, comments, and shorts so you can focus entirely on your tasks.",
    color: "text-rose-600",
    bgColor: "bg-rose-50"
  },
  {
    icon: Briefcase,
    title: "Cloud Sync",
    description: "Log in from any device to access your organized music collection instantly. Your playlists are always synced and safely stored.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50"
  },
  {
    icon: Zap,
    title: "Lightweight & Fast",
    description: "Built as a high-performance web app that loads instantly and consumes minimal memory compared to heavy desktop clients.",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

const howToSteps = [
  {
    title: "1. Create an Account",
    description: "Sign up securely with your email to get started. It takes less than a minute and is completely free."
  },
  {
    title: "2. Build a Playlist",
    description: "Click 'New Playlist' in your dashboard and give it a descriptive name like 'Deep Focus' or 'Lofi Study'."
  },
  {
    title: "3. Search & Add Music",
    description: "Use the integrated search bar to find YouTube songs and add them directly to your new custom playlist."
  },
  {
    title: "4. Press Play",
    description: "Hit play and enjoy your curated music in our distraction-free, visually appealing audio player interface."
  }
];

const faqs = [
  {
    question: "What is Sukh Sangeet?",
    answer: "Sukh Sangeet is a dedicated personal music player and YouTube playlist manager. It helps you organize YouTube tracks into custom playlists for a focused and distraction-free listening experience."
  },
  {
    question: "How do I create a custom YouTube playlist?",
    answer: "To create a custom YouTube playlist, sign up on Sukh Sangeet, click 'New Playlist', search for your favorite YouTube songs directly within the app, and add them instantly."
  },
  {
    question: "Is Sukh Sangeet a free music player?",
    answer: "Yes, Sukh Sangeet is a free-to-use application that leverages the YouTube player to give you a customized audio streaming experience without subscription fees."
  },
  {
    question: "Can I organize music for studying or deep work?",
    answer: "Absolutely. Sukh Sangeet is specifically designed for deep work. By removing algorithm-driven video recommendations, it allows you to concentrate solely on your study or work tracks."
  },
  {
    question: "Does it support YouTube search directly?",
    answer: "Yes, the app has a built-in search feature that queries YouTube's database, allowing you to find and add any public song or video track without leaving the application."
  },
  {
    question: "How is Sukh Sangeet different from the standard YouTube app?",
    answer: "Unlike standard YouTube, Sukh Sangeet removes visual clutter, recommended video sidebars, and infinite scrolling feeds. It acts purely as a streamlined audio player focused on your curated playlists."
  },
  {
    question: "Do I need an account to use the playlist manager?",
    answer: "Yes, creating a free account ensures that your custom playlists and track organization are saved securely and can be accessed across different devices."
  },
  {
    question: "Will it recommend random videos to me?",
    answer: "No. A core feature of Sukh Sangeet is its strict lack of algorithmic recommendations. You only listen to the tracks you have explicitly searched for and added."
  },
  {
    question: "Is my music data and playlist organization saved securely?",
    answer: "Yes, all your playlist data is securely stored in your personal account database. We prioritize data privacy and do not track or share your listening habits."
  },
  {
    question: "Can I reorder tracks in my custom playlist?",
    answer: "Yes, Sukh Sangeet includes drag-and-drop playlist management, letting you easily reorder tracks, move songs between playlists, and curate the perfect sequence."
  }
];

export default Landing;
