import { useState } from 'react';
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
  ChevronDown,
  ShieldCheck,
  WifiOff,
  Sparkles,
  Laptop,
  Smartphone,
  Headphones,
  Code2,
  Dumbbell,
  Moon,
  Search,
  Sliders,
  Lock,
  RefreshCw,
  Cpu,
  Globe,
  Radio,
  Check,
  Layers,
  Flame,
} from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <>
      <Helmet>
        <title>
          Sukh Sangeet | Personal Audio Workspace & YouTube Playlist Manager
        </title>

        <meta
          name="description"
          content="Create custom playlists from YouTube tracks, organize music for study and deep work, enjoy real-time visualizers, and listen distraction-free with Sukh Sangeet."
        />

        <link
          rel="canonical"
          href="https://www.sukhsangeet.tech"
        />

        <meta
          property="og:title"
          content="Sukh Sangeet | Personal Audio Workspace & Playlist Manager"
        />

        <meta
          property="og:description"
          content="Organize YouTube tracks into clean, distraction-free playlists for study, work, and focus with PWA offline support."
        />

        <meta
          property="og:url"
          content="https://www.sukhsangeet.tech"
        />
      </Helmet>

      <div className="relative min-h-screen bg-[#fafafa] text-[#171717] antialiased selection:bg-[#171717] selection:text-white">
        {/* Sticky Header Navigation */}
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
                  <span>Start Workspace</span>
                  <ChevronRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section with Mesh Gradient Backdrop */}
          <section className="relative overflow-hidden border-b border-[#ebebeb] bg-white py-16 sm:py-24 lg:py-28" aria-labelledby="hero-title">
            <div
              aria-hidden="true"
              className="vercel-mesh-gradient pointer-events-none absolute inset-0 opacity-70"
            />
            <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ebebeb] bg-white/80 px-4 py-1.5 backdrop-blur-sm shadow-level-1 max-w-full">
                <span className="h-2 w-2 rounded-full bg-[#0070f3] shrink-0 animate-pulse" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#4d4d4d] whitespace-normal sm:whitespace-nowrap text-center">
                  SukhSangeet // Personal Audio Workspace & Playlist Engine
                </span>
              </div>

              <h1
                id="hero-title"
                className="mx-auto mt-6 max-w-4xl font-sans text-3xl font-semibold leading-tight tracking-tight text-[#171717] sm:text-5xl lg:text-6xl sm:tracking-tighter"
              >
                Build better focus with clean, curated YouTube playlists.
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-sm font-normal text-[#4d4d4d] sm:text-base md:text-lg leading-relaxed">
                Sukh Sangeet transforms how you listen to music online. Search YouTube tracks directly, create organized playlists, eliminate algorithmic feed distractions, and experience real-time audio visualization with PWA offline support.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                {isAuthenticated ? (
                  <Link
                    to="/find-music"
                    className="btn-vercel-primary text-sm px-6 h-11 w-full sm:w-auto"
                  >
                    <span>Open Music Workspace</span>
                    <ChevronRight size={16} />
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="btn-vercel-primary text-sm px-6 h-11 w-full sm:w-auto"
                  >
                    <span>Start Free Workspace</span>
                    <ChevronRight size={16} />
                  </Link>
                )}
                <a
                  href="#services"
                  className="btn-vercel-secondary text-sm px-6 h-11 w-full sm:w-auto"
                >
                  <span>Explore Capabilities</span>
                </a>
              </div>

              {/* Key Platform Highlights Bar */}
              <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 text-left">
                <div className="rounded-xl border border-[#ebebeb] bg-white/90 p-4 shadow-level-1 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#0070f3] font-semibold">
                    <ShieldCheck size={14} /> 100% CLEAN
                  </div>
                  <p className="mt-1 text-xs text-[#171717] font-medium">Zero Feed Distractions</p>
                  <p className="text-[11px] text-[#888888] leading-tight mt-0.5">No comments or recommended rabbit holes.</p>
                </div>

                <div className="rounded-xl border border-[#ebebeb] bg-white/90 p-4 shadow-level-1 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#0070f3] font-semibold">
                    <Search size={14} /> DIRECT YOUTUBE
                  </div>
                  <p className="mt-1 text-xs text-[#171717] font-medium">Instant Song Discovery</p>
                  <p className="text-[11px] text-[#888888] leading-tight mt-0.5">Search millions of public audio tracks.</p>
                </div>

                <div className="rounded-xl border border-[#ebebeb] bg-white/90 p-4 shadow-level-1 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#0070f3] font-semibold">
                    <WifiOff size={14} /> PWA READY
                  </div>
                  <p className="mt-1 text-xs text-[#171717] font-medium">Offline Playback Sync</p>
                  <p className="text-[11px] text-[#888888] leading-tight mt-0.5">Install on desktop & mobile devices.</p>
                </div>

                <div className="rounded-xl border border-[#ebebeb] bg-white/90 p-4 shadow-level-1 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#0070f3] font-semibold">
                    <Waves size={14} /> VISUALIZER
                  </div>
                  <p className="mt-1 text-xs text-[#171717] font-medium">Live Frequency Feedback</p>
                  <p className="text-[11px] text-[#888888] leading-tight mt-0.5">Real-time canvas waveform effects.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 01: Platform Services & Capabilities */}
          <section id="services" className="border-b border-[#ebebeb] bg-[#fafafa] py-16 sm:py-24" aria-labelledby="services-title">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <span className="mono-eyebrow mb-2">01 // SERVICES & CAPABILITIES</span>
                <h2 id="services-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                  What Sukh Sangeet Delivers.
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-sm text-[#4d4d4d]">
                  A purpose-built suite of music management services designed to simplify audio curation and protect your focus.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {platformServices.map((service) => (
                  <article key={service.title} className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 transition-all hover:shadow-level-3">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#ebebeb] bg-[#fafafa] text-[#171717]">
                      <service.icon className="h-5 w-5 text-[#0070f3]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#171717]">{service.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#4d4d4d]">{service.description}</p>
                    
                    <ul className="mt-4 space-y-1.5 border-t border-[#ebebeb] pt-4 text-[11px] text-[#4d4d4d]">
                      {service.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check size={12} className="text-[#0070f3] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Section 02: How to Use & Workflow Guide */}
          <section id="how-it-works" className="border-b border-[#ebebeb] bg-white py-16 sm:py-24" aria-labelledby="how-to-title">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <span className="mono-eyebrow mb-2">02 // STEP-BY-STEP WORKFLOW</span>
                <h2 id="how-to-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                  How to Use Sukh Sangeet.
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-[#4d4d4d]">
                  Set up your personalized music workspace in four quick, intuitive steps.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {howToSteps.map((step, index) => (
                  <article key={step.title} className="relative rounded-xl border border-[#ebebeb] bg-[#fafafa] p-6 shadow-level-2">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[#0070f3]">
                        STEP 0{index + 1}
                      </span>
                      <step.icon size={18} className="text-[#888888]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#171717]">{step.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#4d4d4d]">{step.description}</p>
                    <div className="mt-4 rounded-md border border-[#ebebeb] bg-white p-2 text-[11px] font-mono text-[#888888]">
                      Tip: {step.proTip}
                    </div>
                  </article>
                ))}
              </div>

              {/* Pro Tips Box */}
              <div className="mt-8 rounded-xl border border-[#ebebeb] bg-[#fafafa] p-6 sm:p-8 shadow-level-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#0070f3]" />
                  <span className="mono-eyebrow">POWER USER HINTS</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-[#171717]">Maximized Efficiency for Daily Listening</h3>
                <ul className="mt-4 grid gap-3 text-xs text-[#4d4d4d] sm:grid-cols-2 lg:grid-cols-3">
                  <li className="flex items-start gap-2.5 rounded-lg border border-[#ebebeb] bg-white p-3">
                    <span className="font-mono text-[#0070f3] font-semibold shrink-0">01.</span>
                    <span><strong>Drag-and-Drop Order:</strong> Drag tracks to reorder your playback sequence instantly.</span>
                  </li>
                  <li className="flex items-start gap-2.5 rounded-lg border border-[#ebebeb] bg-white p-3">
                    <span className="font-mono text-[#0070f3] font-semibold shrink-0">02.</span>
                    <span><strong>Live Visualizer Canvas:</strong> Toggle the audio visualizer for active frequency feedback.</span>
                  </li>
                  <li className="flex items-start gap-2.5 rounded-lg border border-[#ebebeb] bg-white p-3">
                    <span className="font-mono text-[#0070f3] font-semibold shrink-0">03.</span>
                    <span><strong>PWA Home Screen:</strong> Install Sukh Sangeet on iOS/Android for native app feel.</span>
                  </li>
                  <li className="flex items-start gap-2.5 rounded-lg border border-[#ebebeb] bg-white p-3">
                    <span className="font-mono text-[#0070f3] font-semibold shrink-0">04.</span>
                    <span><strong>Session Recovery:</strong> Your active track position and queue persist across browser tabs.</span>
                  </li>
                  <li className="flex items-start gap-2.5 rounded-lg border border-[#ebebeb] bg-white p-3">
                    <span className="font-mono text-[#0070f3] font-semibold shrink-0">05.</span>
                    <span><strong>Task-Specific Lists:</strong> Maintain separate playlists for Deep Work, Gym, and Chill routines.</span>
                  </li>
                  <li className="flex items-start gap-2.5 rounded-lg border border-[#ebebeb] bg-white p-3">
                    <span className="font-mono text-[#0070f3] font-semibold shrink-0">06.</span>
                    <span><strong>Offline Caching:</strong> Cache your favorite playlists for listening without internet connectivity.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 03: Versatile Applications & Use Cases */}
          <section id="use-cases" className="border-b border-[#ebebeb] bg-[#fafafa] py-16 sm:py-24" aria-labelledby="use-cases-title">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <span className="mono-eyebrow mb-2">03 // APPLICATIONS & USE CASES</span>
                <h2 id="use-cases-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                  Designed for Every Focus Scenario.
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-[#4d4d4d]">
                  Discover how professionals, students, creators, and commuters use Sukh Sangeet daily.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {useCases.map((useCase) => (
                  <article key={useCase.title} className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 transition-all hover:shadow-level-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg border border-[#ebebeb] bg-[#fafafa]">
                        <useCase.icon className="h-5 w-5 text-[#0070f3]" />
                      </div>
                      <h3 className="text-base font-semibold text-[#171717]">{useCase.title}</h3>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[#4d4d4d]">{useCase.description}</p>
                    <div className="mt-4 border-t border-[#ebebeb] pt-3 text-[11px] font-mono text-[#888888]">
                      Ideal audio: <span className="text-[#171717] font-sans font-medium">{useCase.idealAudio}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Section 04: System Architecture & Performance */}
          <section id="architecture" className="border-b border-[#ebebeb] bg-white py-16 sm:py-24" aria-labelledby="architecture-title">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <span className="mono-eyebrow mb-2">04 // UNDER THE HOOD</span>
                <h2 id="architecture-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                  Modern Full-Stack Architecture.
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-sm text-[#4d4d4d]">
                  Engineered with a high-performance React frontend and Django backend for speed, security, and offline resilience.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-[#ebebeb] bg-[#fafafa] p-6 shadow-level-2">
                  <Cpu className="h-6 w-6 text-[#0070f3] mb-3" />
                  <h3 className="text-sm font-semibold text-[#171717]">React + Vite Frontend</h3>
                  <p className="mt-2 text-xs text-[#4d4d4d] leading-relaxed">
                    Ultra-fast single-page application rendering with sub-second route changes and responsive component architecture.
                  </p>
                </div>

                <div className="rounded-xl border border-[#ebebeb] bg-[#fafafa] p-6 shadow-level-2">
                  <Globe className="h-6 w-6 text-[#0070f3] mb-3" />
                  <h3 className="text-sm font-semibold text-[#171717]">Django REST Framework</h3>
                  <p className="mt-2 text-xs text-[#4d4d4d] leading-relaxed">
                    Robust REST API managing user profiles, encrypted tokens, playlists, and track metadata seamlessly.
                  </p>
                </div>

                <div className="rounded-xl border border-[#ebebeb] bg-[#fafafa] p-6 shadow-level-2">
                  <WifiOff className="h-6 w-6 text-[#0070f3] mb-3" />
                  <h3 className="text-sm font-semibold text-[#171717]">Service Worker Cache</h3>
                  <p className="mt-2 text-xs text-[#4d4d4d] leading-relaxed">
                    PWA offline capabilities enable listening to cached audio and playlists without an active internet connection.
                  </p>
                </div>

                <div className="rounded-xl border border-[#ebebeb] bg-[#fafafa] p-6 shadow-level-2">
                  <Lock className="h-6 w-6 text-[#0070f3] mb-3" />
                  <h3 className="text-sm font-semibold text-[#171717]">Token Authentication</h3>
                  <p className="mt-2 text-xs text-[#4d4d4d] leading-relaxed">
                    Secure user login with token persistence protecting personal playlists and custom audio configurations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 05: Benchmark & Comparison Table */}
          <section id="comparison" className="border-b border-[#ebebeb] bg-[#fafafa] py-16 sm:py-24" aria-labelledby="comparison-title">
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <span className="mono-eyebrow mb-2">05 // PLATFORM BENCHMARK</span>
                <h2 id="comparison-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                  Sukh Sangeet vs. Alternative Music Platforms.
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-[#4d4d4d]">
                  Compare the advantages of a dedicated distraction-free YouTube playlist manager.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#ebebeb] bg-white shadow-level-3">
                <table className="w-full text-left text-xs text-[#4d4d4d] min-w-[650px]">
                  <thead className="bg-[#fafafa] border-b border-[#ebebeb] font-mono uppercase text-[11px] text-[#171717]">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Platform Feature</th>
                      <th className="px-6 py-4 font-semibold text-[#0070f3] bg-[#0070f3]/[0.04]">Sukh Sangeet</th>
                      <th className="px-6 py-4 font-semibold">YouTube App</th>
                      <th className="px-6 py-4 font-semibold">Spotify (Free)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebebeb] font-sans">
                    <tr>
                      <td className="px-6 py-4 font-medium text-[#171717]">Distraction-Free Focus Mode</td>
                      <td className="px-6 py-4 bg-[#0070f3]/[0.02] font-semibold text-[#0070f3] flex items-center gap-1.5"><CheckCircle2 size={14} /> Yes (Zero feed clutter)</td>
                      <td className="px-6 py-4">No (Feed & comments)</td>
                      <td className="px-6 py-4">Partial</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-[#171717]">Free Custom YouTube Playlists</td>
                      <td className="px-6 py-4 bg-[#0070f3]/[0.02] font-semibold text-[#0070f3] flex items-center gap-1.5"><CheckCircle2 size={14} /> Yes (Unlimited)</td>
                      <td className="px-6 py-4">Yes</td>
                      <td className="px-6 py-4">No (Forced Shuffle)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-[#171717]">Direct YouTube Track Search</td>
                      <td className="px-6 py-4 bg-[#0070f3]/[0.02] font-semibold text-[#0070f3] flex items-center gap-1.5"><CheckCircle2 size={14} /> Yes (Integrated API)</td>
                      <td className="px-6 py-4">Yes</td>
                      <td className="px-6 py-4">No</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-[#171717]">Drag-and-Drop Track Sorting</td>
                      <td className="px-6 py-4 bg-[#0070f3]/[0.02] font-semibold text-[#0070f3] flex items-center gap-1.5"><CheckCircle2 size={14} /> Yes</td>
                      <td className="px-6 py-4">Limited</td>
                      <td className="px-6 py-4">Premium only</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-[#171717]">Real-Time Audio Visualizer</td>
                      <td className="px-6 py-4 bg-[#0070f3]/[0.02] font-semibold text-[#0070f3] flex items-center gap-1.5"><CheckCircle2 size={14} /> Yes (Live Canvas)</td>
                      <td className="px-6 py-4">No</td>
                      <td className="px-6 py-4">No</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-[#171717]">PWA Mobile & Desktop Install</td>
                      <td className="px-6 py-4 bg-[#0070f3]/[0.02] font-semibold text-[#0070f3] flex items-center gap-1.5"><CheckCircle2 size={14} /> Yes</td>
                      <td className="px-6 py-4">Native app only</td>
                      <td className="px-6 py-4">Native app only</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-[#171717]">Offline Music Caching</td>
                      <td className="px-6 py-4 bg-[#0070f3]/[0.02] font-semibold text-[#0070f3] flex items-center gap-1.5"><CheckCircle2 size={14} /> Yes (Supported)</td>
                      <td className="px-6 py-4">Paid Premium only</td>
                      <td className="px-6 py-4">Paid Premium only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 06: Knowledge Base & FAQ */}
          <section
            id="faq"
            className="border-b border-[#ebebeb] bg-white py-16 sm:py-24"
            aria-labelledby="faq-title"
          >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <span className="mono-eyebrow mb-2">06 // KNOWLEDGE BASE & HELP</span>
                <h2
                  id="faq-title"
                  className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]"
                >
                  Frequently Asked Questions.
                </h2>
                <p className="mt-2 text-sm text-[#4d4d4d]">
                  Everything you need to know about Sukh Sangeet services, functionality, and security.
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

          {/* Call to Action Section */}
          <section className="bg-white py-16 text-center sm:py-24" aria-labelledby="cta-title">
            <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
              <span className="mono-eyebrow mb-3">GET STARTED TODAY</span>
              <h2 id="cta-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                Ready for a distraction-free audio workspace?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-[#4d4d4d]">
                Create your account now to build custom YouTube playlists, enjoy live audio visualizers, and maintain deep focus.
              </p>
              <div className="mt-8">
                {isAuthenticated ? (
                  <Link
                    to="/find-music"
                    className="btn-vercel-primary text-sm px-8 h-12"
                  >
                    <Zap size={16} />
                    <span>Go to Music Workspace</span>
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="btn-vercel-primary text-sm px-8 h-12"
                  >
                    <Zap size={16} />
                    <span>Create Free Account</span>
                  </Link>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#ebebeb] bg-[#fafafa] py-8 font-mono text-xs text-[#888888]">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            <p>© 2026 Sukh Sangeet Inc. All rights reserved.</p>
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

const platformServices = [
  {
    icon: Search,
    title: "Direct YouTube Search & Import",
    description: "Search public YouTube songs directly inside the app without video feeds, recommended sidebars, or comments pulling your attention away.",
    highlights: ["In-app YouTube API integration", "Instant song & duration extraction", "No video feed clutter"]
  },
  {
    icon: ListMusic,
    title: "Custom Playlist Management",
    description: "Create, rename, organize, and delete custom playlists tailored for study, coding, gym, or relaxation routines.",
    highlights: ["Unlimited playlists creation", "Drag-and-drop track reordering", "Instant track deletion"]
  },
  {
    icon: Music,
    title: "Distraction-Free Audio Player",
    description: "Enjoy a streamlined player with full scrub, seek bar, volume control, track loop, next/previous controls, and continuous playback.",
    highlights: ["Minimalist controls", "Progress seek bar", "Continuous playback mode"]
  },
  {
    icon: Waves,
    title: "Real-Time Audio Visualizer",
    description: "Experience dynamic live canvas audio frequency visualizer animations during playback for an immersive music environment.",
    highlights: ["Live frequency bar visualizer", "Responsive animation effects", "Atmospheric background glow"]
  },
  {
    icon: WifiOff,
    title: "PWA & Offline Capability",
    description: "Install Sukh Sangeet as a Progressive Web App on mobile or desktop and sync playlists for offline access anywhere.",
    highlights: ["Installable on iOS, Android & PC", "Service Worker caching", "Offline playback capability"]
  },
  {
    icon: Lock,
    title: "Secure Auth & Device Sync",
    description: "User authentication with token security keeps your playlists synchronized across desktop browsers, tablets, and phones.",
    highlights: ["Encrypted account storage", "Cross-device automatic sync", "Private workspace isolation"]
  }
];

const howToSteps = [
  {
    icon: Lock,
    title: "Create Account",
    description: "Sign up with your email and password to create your private audio library.",
    proTip: "Authentication keeps your playlists safe and synced across devices."
  },
  {
    icon: ListMusic,
    title: "Create Playlist",
    description: "Click 'New Playlist' and enter a title for your dedicated music collection.",
    proTip: "Name playlists by activity like 'Deep Coding', 'Lo-Fi Study', or 'Chill'."
  },
  {
    icon: Search,
    title: "Search & Add Tracks",
    description: "Use the integrated YouTube search bar to find songs and add them instantly.",
    proTip: "Search by artist name, track title, or full song keywords."
  },
  {
    icon: Music,
    title: "Curate & Play",
    description: "Drag tracks to reorder your sequence, launch the player, and enjoy focus.",
    proTip: "Enable the audio visualizer for live frequency feedback during playback."
  }
];

const useCases = [
  {
    icon: BookOpen,
    title: "Academic & Deep Study",
    description: "Maintain focus during long study sessions without YouTube recommendation feeds or video sidebars breaking your concentration.",
    idealAudio: "Lo-Fi Beats, Classical, Instrumental Study Packs"
  },
  {
    icon: Code2,
    title: "Software Engineering",
    description: "Stream multi-hour focus tracks continuously during coding sprints and debugging sessions without algorithm interruptions.",
    idealAudio: "Synthwave, Ambient Electronic, Chillstep"
  },
  {
    icon: Briefcase,
    title: "Content Creation & Writing",
    description: "Curate immersive background audio tailored for writing, designing, researching, and creative work flows.",
    idealAudio: "Piano Solos, Nature Sounds, Ambient Textures"
  },
  {
    icon: Dumbbell,
    title: "Fitness & Workout Routines",
    description: "Set up high-energy workout playlists that play continuously through gym routines or yoga flows without ads.",
    idealAudio: "EDM, Upbeat Remixes, High-BPM Playlists"
  },
  {
    icon: Headphones,
    title: "Lectures & Audiobooks",
    description: "Queue educational talks, podcasts, and long-form YouTube lectures into structured study lists for sequential listening.",
    idealAudio: "Educational Podcasts, Tech Talks, Audiobooks"
  },
  {
    icon: Smartphone,
    title: "Travel & Offline Commuting",
    description: "Install as a PWA on your smartphone for listening during flights, subway commutes, or areas with poor internet connection.",
    idealAudio: "Offline Cached Playlists & Favorite Tracks"
  }
];

const faqItems = [
  {
    question: "What is Sukh Sangeet?",
    answer:
      "Sukh Sangeet is a modern personal audio workspace and YouTube playlist manager. It lets you create custom playlists from YouTube tracks, play them in a clean, distraction-free interface, visualize audio frequencies in real-time, and install the app for PWA offline listening."
  },
  {
    question: "How does the direct YouTube search work?",
    answer:
      "Our built-in search connects directly to YouTube's catalog. You can search for songs, ambient audio, or lectures inside Sukh Sangeet and add them to your playlists with one click without opening the clutter of youtube.com."
  },
  {
    question: "Is Sukh Sangeet free to use?",
    answer:
      "Yes! Sukh Sangeet is completely free to use. You can create unlimited playlists, add your favorite tracks, and enjoy distraction-free music management."
  },
  {
    question: "Can I reorder tracks inside my playlist?",
    answer:
      "Yes. Sukh Sangeet features drag-and-drop track reordering so you can arrange your track queue in whatever sequence best fits your listening workflow."
  },
  {
    question: "Does Sukh Sangeet work offline?",
    answer:
      "Yes. Sukh Sangeet is built as a Progressive Web App (PWA) with Service Worker caching capabilities. Once installed, you can access your workspace and cached tracks even when offline."
  },
  {
    question: "How does Sukh Sangeet eliminate distractions?",
    answer:
      "Standard YouTube surrounds music with recommended video grids, comments, and algorithmic rabbit holes. Sukh Sangeet strips away all visual clutter, giving you a clean audio player dedicated solely to your curated tracks."
  },
  {
    question: "Do I need an account to use Sukh Sangeet?",
    answer:
      "Yes. Creating a free account ensures your playlists, track sequences, and audio preferences are securely stored and synced across all your devices."
  },
  {
    question: "What is the Audio Visualizer feature?",
    answer:
      "The Audio Visualizer renders real-time audio frequency waveforms on a canvas element while music plays, creating a subtle, aesthetic visual backdrop for your workspace."
  },
  {
    question: "Can I install Sukh Sangeet on my phone?",
    answer:
      "Yes! On mobile devices (iOS Safari or Android Chrome), tap 'Add to Home Screen' or use the app install prompt to install Sukh Sangeet as a standalone PWA application."
  },
  {
    question: "Is my personal data and playlist information safe?",
    answer:
      "Yes. All user accounts and playlists are encrypted and authenticated using token security standards. Your data is isolated to your account and never sold or shared."
  }
];

export default Landing;

