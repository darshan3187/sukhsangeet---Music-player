import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import {
  Music,
  ListMusic,
  Waves,
  BookOpen,
  Briefcase,
  Sparkles,
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
  const { isAuthenticated } = useAuth();
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <>
      <Helmet>

        <title>
          Sukh Sangeet | Personal Music Player & YouTube Playlist Manager
        </title>

        <meta
          name="description"
          content="Create playlists from YouTube tracks, organize music and enjoy distraction-free listening with Sukh Sangeet."
        />

        <link
          rel="canonical"
          href="https://www.sukhsangeet.tech"
        />

        <meta
          property="og:title"
          content="Sukh Sangeet | Personal Music Player"
        />

        <meta
          property="og:description"
          content="Create and organize YouTube playlists for study, work and focused listening."
        />

        <meta
          property="og:url"
          content="https://www.sukhsangeet.tech"
        />

      </Helmet>

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
                width="36"
                height="36"
                fetchPriority="high"
                className="h-7 w-7 object-contain sm:h-9 sm:w-9"
                loading="eager"
              />
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            <a href="#how-to-title" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">How to Use</a>
            <a href="#features" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Features</a>
            <a href="#comparison" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Comparison</a>
            <a href="#faq" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">FAQ</a>
            <a href="#use-cases" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Use Cases</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(17,24,39,0.18)] transition-all hover:-translate-y-0.5 hover:bg-black sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
              >
                Continue Listening
                <ChevronRight size={18} />
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(17,24,39,0.18)] transition-all hover:-translate-y-0.5 hover:bg-black sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
              >
                Start Now
                <ChevronRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8" aria-labelledby="hero-title">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 text-[0.8rem] font-semibold tracking-[0.18em] text-gray-500 sm:mb-4 sm:text-[1.25rem] sm:tracking-[0.38em]">
              SukhSangeet-A Personal Music Player
            </p>
            <h1
              id="hero-title"
              className="mx-auto max-w-4xl text-[2rem] font-black leading-[0.98] tracking-[-0.05em] text-gray-950 sm:text-5xl lg:text-7xl"
            >
              Build Better Focus with
              <span className="block text-gray-900">
                Clean, <span className="text-emerald-700">Curated</span> Playlists
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[0.8rem] leading-6 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
              Create playlists from YouTube tracks, organize what you listen to, and keep your listening experience clean and consistent.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(17,24,39,0.18)] transition-all hover:-translate-y-0.5 hover:bg-black sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
              >
                Start Now
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-gray-100 bg-gray-50/40" aria-labelledby="how-to-title">
          <div className="mx-auto w-full max-w-6xl px-4 py-18 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-12 text-center sm:mb-14">
              <h2 id="how-to-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How to Use</h2>
              <p className="mx-auto mt-3 max-w-2xl text-gray-600">Get started in four simple steps and build your first playlist in minutes.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {howToSteps.map((step, index) => (
                <article key={step.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 sm:p-10">
              <h3 className="text-xl font-semibold text-gray-900">Pro Tips</h3>
              <ul className="mt-5 space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="text-emerald-700 font-semibold">•</span>
                  <span>Use the audio visualizer to see your music in action while you listen</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-700 font-semibold">•</span>
                  <span>Organize tracks by dragging them to reorder your playlist exactly how you want</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-700 font-semibold">•</span>
                  <span>Create multiple playlists for different moods—study, relaxation, workout, and more</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-700 font-semibold">•</span>
                  <span>Your playlists are saved automatically, so you can pick up where you left off anytime</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-gray-100 bg-gray-50/40" aria-labelledby="features-title">
          <div className="mx-auto w-full max-w-6xl px-4 py-18 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-12 text-center sm:mb-14">
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
                    <td className="px-6 py-4 bg-emerald-50/30 font-medium text-emerald-800 flex items-center gap-2"><CheckCircle2 size={16} /> Yes</td>
                    <td className="px-6 py-4">No (Recommended Videos)</td>
                    <td className="px-6 py-4">Yes</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Free Custom Playlists</td>
                    <td className="px-6 py-4 bg-emerald-50/30 font-medium text-emerald-800 flex items-center gap-2"><CheckCircle2 size={16} /> Yes</td>
                    <td className="px-6 py-4">Yes</td>
                    <td className="px-6 py-4">No (Forced Shuffle)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Direct YouTube Search</td>
                    <td className="px-6 py-4 bg-emerald-50/30 font-medium text-emerald-800 flex items-center gap-2"><CheckCircle2 size={16} /> Yes</td>
                    <td className="px-6 py-4">Yes</td>
                    <td className="px-6 py-4">No</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">No Algorithmic Feeds</td>
                    <td className="px-6 py-4 bg-emerald-50/30 font-medium text-emerald-800 flex items-center gap-2"><CheckCircle2 size={16} /> Yes</td>
                    <td className="px-6 py-4">No</td>
                    <td className="px-6 py-4">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

          <section
            id="faq"
            className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8"
            aria-labelledby="faq-title"
          >

            <div className="mb-12 text-center">
              <h2
                id="faq-title"
                className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              >
                Frequently Asked Questions
              </h2>

              <p className="mt-3 text-gray-600">
                Common questions about Sukh Sangeet
              </p>
            </div>

            <div className="space-y-4">

              {faqItems.map((faq, index) => (

                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all"
                >

                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >

                    <h3 className="pr-5 text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>

                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${openFAQ === index ? "rotate-180" : ""
                        }`}
                    />

                  </button>

                  <div
                    className={`grid transition-all duration-300 ${openFAQ === index
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                      }`}
                  >

                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-gray-600 leading-7">
                        {faq.answer}
                      </p>
                    </div>

                  </div>

                </div>

              ))}

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
    </>
  );
};

const faqItems = [
  {
    question: "What is Sukh Sangeet?",
    answer:
      "Sukh Sangeet is a personal music player and YouTube playlist manager that helps users create, organize, and play custom playlists for study, work, focus, and distraction-free listening."
  },
  {
    question: "How do I create a custom YouTube playlist?",
    answer:
      "Sign up on Sukh Sangeet, click New Playlist, search YouTube songs directly inside the app, and add them instantly."
  },
  {
    question: "Is Sukh Sangeet a free music player?",
    answer:
      "Yes. Sukh Sangeet is free to use and provides a customized listening experience."
  },
  {
    question: "Can I organize music for studying or deep work?",
    answer:
      "Yes. Create playlists for studying, deep work, productivity, and focus sessions."
  },
  {
    question: "Does it support YouTube search directly?",
    answer:
      "Yes. Built-in YouTube search lets you discover and add public tracks."
  },
  {
    question: "How is Sukh Sangeet different from standard YouTube?",
    answer:
      "Sukh Sangeet removes distractions like recommended videos and endless feeds."
  },
  {
    question: "Do I need an account?",
    answer:
      "Yes. Accounts keep playlists synchronized and securely saved."
  },
  {
    question: "Will it recommend random videos?",
    answer:
      "No. You only listen to tracks you intentionally add."
  },
  {
    question: "Is my playlist data secure?",
    answer:
      "Yes. Playlist data is stored securely and not shared."
  },
  {
    question: "Can I reorder tracks?",
    answer:
      "Yes. Drag-and-drop playlist management lets you customize order."
  }
];

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
    description: "Reliable playback with controls built for long listening sessions.",
    color: "text-green-600",
    bgColor: "bg-green-50"
  }
];

const useCases = [
  {
    icon: BookOpen,
    title: "Calm Listening",
    description: "Keep your listening steady with distraction-free playlists."
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

const howToSteps = [
  {
    title: "Create Account",
    description: "Sign up with your email to get started. Takes less than a minute."
  },
  {
    title: "Create a Playlist",
    description: "Click 'New Playlist' and give it a name that matches your vibe."
  },
  {
    title: "Search & Add Tracks",
    description: "Search for songs on YouTube and add them directly to your playlist."
  },
  {
    title: "Start Playing",
    description: "Hit play and enjoy your curated music with full player controls."
  }
];

export default Landing;
