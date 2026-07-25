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
  ChevronRight,
  Zap,
  CheckCircle2,
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

    <div className="relative min-h-screen bg-[#fafafa] text-[#171717] antialiased selection:bg-[#171717] selection:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-[#ebebeb] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="SukhSangeet home">
            <img
              src="/logo-sukhsangeet.webp"
              alt="SukhSangeet"
              width="36"
              height="36"
              fetchPriority="high"
              className="h-9 w-9 object-contain rounded-lg shadow-sm"
              loading="eager"
            />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717]">
              SukhSangeet
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            <a href="#how-to-title" className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-[#4d4d4d] transition-colors hover:bg-[#f5f5f5] hover:text-[#171717]">How to Use</a>
            <a href="#features" className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-[#4d4d4d] transition-colors hover:bg-[#f5f5f5] hover:text-[#171717]">Features</a>
            <a href="#comparison" className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-[#4d4d4d] transition-colors hover:bg-[#f5f5f5] hover:text-[#171717]">Comparison</a>
            <a href="#faq" className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-[#4d4d4d] transition-colors hover:bg-[#f5f5f5] hover:text-[#171717]">FAQ</a>
            <a href="#use-cases" className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-[#4d4d4d] transition-colors hover:bg-[#f5f5f5] hover:text-[#171717]">Use Cases</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAuthenticated ? (
              <Link
                to="/find-music"
                className="btn-vercel-primary whitespace-nowrap"
              >
                <span>Continue Listening</span>
                <ChevronRight size={14} />
              </Link>
            ) : (
              <Link
                to="/register"
                className="btn-vercel-primary whitespace-nowrap"
              >
                <span>Start Now</span>
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Vercel Hero Section with Mesh Gradient Backdrop */}
        <section className="relative overflow-hidden border-b border-[#ebebeb] bg-white py-16 sm:py-24 lg:py-32" aria-labelledby="hero-title">
          {/* Atmospheric Mesh Gradient Backdrop */}
          <div
            aria-hidden="true"
            className="vercel-mesh-gradient pointer-events-none absolute inset-0 opacity-70"
          />
          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ebebeb] bg-white/80 px-4 py-1.5 backdrop-blur-sm shadow-level-1 max-w-full">
              <span className="h-2 w-2 rounded-full bg-[#0070f3] shrink-0" />
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#4d4d4d] whitespace-normal sm:whitespace-nowrap text-center">
                SukhSangeet // Personal Audio Workspace
              </span>
            </div>

            <h1
              id="hero-title"
              className="mx-auto mt-6 max-w-4xl font-sans text-3xl font-semibold leading-tight tracking-tight text-[#171717] sm:text-5xl lg:text-6xl sm:tracking-tighter"
            >
              Build better focus with clean, curated playlists.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-normal text-[#4d4d4d] sm:text-base md:text-lg leading-relaxed">
              Create custom playlists from YouTube tracks, eliminate visual feed clutter, and maintain deep concentration for study and work.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/register"
                className="btn-vercel-primary text-sm px-6 h-11 w-full sm:w-auto"
              >
                <span>Start Free Workspace</span>
                <ChevronRight size={16} />
              </Link>
              <a
                href="#features"
                className="btn-vercel-secondary text-sm px-6 h-11 w-full sm:w-auto"
              >
                <span>Explore Features</span>
              </a>
            </div>
          </div>
        </section>

        {/* How To Section */}
        <section className="border-b border-[#ebebeb] bg-[#fafafa] py-16 sm:py-24" aria-labelledby="how-to-title">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="mono-eyebrow mb-2">01 // HOW IT WORKS</span>
              <h2 id="how-to-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">How to Use.</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-[#4d4d4d]">Get started in four simple steps and organize your listening workflow in minutes.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {howToSteps.map((step, index) => (
                <article key={step.title} className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2">
                  <div className="mb-3 font-mono text-xs font-medium text-[#888888]">
                    0{index + 1}
                  </div>
                  <h3 className="text-base font-semibold text-[#171717]">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#4d4d4d]">{step.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2">
              <span className="mono-eyebrow mb-2">WORKFLOW HINTS</span>
              <h3 className="text-lg font-semibold text-[#171717]">Pro Tips for Focused Listening</h3>
              <ul className="mt-4 grid gap-3 text-xs text-[#4d4d4d] sm:grid-cols-2">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-[#0070f3] font-semibold">→</span>
                  <span>Use the audio visualizer to track your playback state in real-time.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-[#0070f3] font-semibold">→</span>
                  <span>Drag-and-drop tracks to reorder your playlist sequence precisely.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-[#0070f3] font-semibold">→</span>
                  <span>Create dedicated playlists for deep work, study, and relaxing routines.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-[#0070f3] font-semibold">→</span>
                  <span>Your tracks and playlists automatically sync across sessions.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-b border-[#ebebeb] bg-white py-16 sm:py-24" aria-labelledby="features-title">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="mono-eyebrow mb-2">02 // SYSTEM CAPABILITIES</span>
              <h2 id="features-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">Core Features.</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-[#4d4d4d]">Purpose-built tools for an unencumbered audio experience.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-xl border border-[#ebebeb] bg-[#fafafa] p-6 shadow-level-2 transition-all hover:bg-white hover:shadow-level-3">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#ebebeb] bg-white text-[#171717]">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#171717]">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#4d4d4d]">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section id="comparison" className="border-b border-[#ebebeb] bg-[#fafafa] py-16 sm:py-24" aria-labelledby="comparison-title">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="mono-eyebrow mb-2">03 // BENCHMARK</span>
              <h2 id="comparison-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                Sukh Sangeet vs. Standard Platforms.
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-[#4d4d4d]">
                Compare the advantages of a dedicated distraction-free YouTube playlist manager.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#ebebeb] bg-white shadow-level-3">
              <table className="w-full text-left text-xs text-[#4d4d4d] min-w-[600px]">
                <thead className="bg-[#fafafa] border-b border-[#ebebeb] font-mono uppercase text-[11px] text-[#171717]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Feature Benchmark</th>
                    <th className="px-6 py-4 font-semibold text-[#0070f3] bg-[#0070f3]/[0.04]">Sukh Sangeet</th>
                    <th className="px-6 py-4 font-semibold">YouTube App</th>
                    <th className="px-6 py-4 font-semibold">Spotify (Free)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb] font-sans">
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#171717]">Distraction-Free Interface</td>
                    <td className="px-6 py-4 bg-[#0070f3]/[0.02] font-semibold text-[#0070f3] flex items-center gap-1.5"><CheckCircle2 size={14} /> Yes</td>
                    <td className="px-6 py-4">No (Feed clutter)</td>
                    <td className="px-6 py-4">Yes</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#171717]">Free Custom Playlists</td>
                    <td className="px-6 py-4 bg-[#0070f3]/[0.02] font-semibold text-[#0070f3] flex items-center gap-1.5"><CheckCircle2 size={14} /> Yes</td>
                    <td className="px-6 py-4">Yes</td>
                    <td className="px-6 py-4">No (Forced Shuffle)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#171717]">Direct YouTube Search</td>
                    <td className="px-6 py-4 bg-[#0070f3]/[0.02] font-semibold text-[#0070f3] flex items-center gap-1.5"><CheckCircle2 size={14} /> Yes</td>
                    <td className="px-6 py-4">Yes</td>
                    <td className="px-6 py-4">No</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#171717]">No Algorithmic Feeds</td>
                    <td className="px-6 py-4 bg-[#0070f3]/[0.02] font-semibold text-[#0070f3] flex items-center gap-1.5"><CheckCircle2 size={14} /> Yes</td>
                    <td className="px-6 py-4">No</td>
                    <td className="px-6 py-4">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="border-b border-[#ebebeb] bg-white py-16 sm:py-24"
          aria-labelledby="faq-title"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="mono-eyebrow mb-2">04 // KNOWLEDGE BASE</span>
              <h2
                id="faq-title"
                className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]"
              >
                Frequently Asked Questions.
              </h2>
              <p className="mt-2 text-sm text-[#4d4d4d]">
                Common questions about Sukh Sangeet architecture and usage.
              </p>
            </div>

            <div className="space-y-3">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[#ebebeb] bg-white shadow-level-1 transition-all"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-medium text-[#171717] cursor-pointer"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#888888] shrink-0 transition-transform duration-200 ${
                        openFAQ === index ? "rotate-180 text-[#171717]" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-200 ${
                      openFAQ === index
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-xs leading-relaxed text-[#4d4d4d]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
          
        {/* Use Cases Section */}
        <section id="use-cases" className="border-b border-[#ebebeb] bg-[#fafafa] py-16 sm:py-24" aria-labelledby="use-cases-title">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="mono-eyebrow mb-2">05 // APPLICATIONS</span>
              <h2 id="use-cases-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">Built for Real Work.</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-[#4d4d4d]">Deploy Sukh Sangeet during moments when attention matters most.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((useCase) => (
                <article key={useCase.title} className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2">
                  <useCase.icon className="h-5 w-5 text-[#171717]" />
                  <h3 className="mt-4 text-base font-semibold text-[#171717]">{useCase.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#4d4d4d]">{useCase.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-16 text-center sm:py-24" aria-labelledby="cta-title">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <span className="mono-eyebrow mb-3">GET STARTED TODAY</span>
            <h2 id="cta-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
              Ready to focus better?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#4d4d4d]">
              Create your account now and start building your custom personal audio workspace.
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="btn-vercel-primary text-sm px-8 h-12"
              >
                <Zap size={16} />
                <span>Create Workspace Account</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Vercel Footer */}
      <footer className="border-t border-[#ebebeb] bg-[#fafafa] py-8 font-mono text-xs text-[#888888]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Sukh Sangeet Inc.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[#4d4d4d]">
            <Link to="/about-us" className="hover:text-[#171717] transition-colors">About Us</Link>
            <Link to="/privacy-policy" className="hover:text-[#171717] transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-[#171717] transition-colors">Terms & Conditions</Link>
            <Link to="/contact-us" className="hover:text-[#171717] transition-colors">Contact Us</Link>
          </div>
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
    description: "Find tracks quickly from YouTube and add them to your playlists."
  },
  {
    icon: ListMusic,
    title: "Playlist Management",
    description: "Create and organize playlists for different moods and tasks."
  },
  {
    icon: Waves,
    title: "Smooth Player",
    description: "Reliable playback with controls built for long listening sessions."
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
