import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Music, Zap, Shield, Heart } from 'lucide-react';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Sukh Sangeet - Personal Audio Workspace</title>
        <meta
          name="description"
          content="Learn about Sukh Sangeet's mission to provide a distraction-free, algorithm-free YouTube playlist manager and music player for deep work and studying."
        />
        <link rel="canonical" href="https://www.sukhsangeet.tech/about-us" />
        <meta property="og:title" content="About Us | Sukh Sangeet" />
        <meta property="og:description" content="Discover why we built Sukh Sangeet to eliminate visual clutter and algorithmic distractions for focused audio listening." />
        <meta property="og:url" content="https://www.sukhsangeet.tech/about-us" />
      </Helmet>

      <div className="min-h-screen bg-[#fafafa] text-[#171717] antialiased selection:bg-[#171717] selection:text-white flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-[#ebebeb] bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="SukhSangeet home">
              <img
                src="/logo-sukhsangeet.webp"
                alt="SukhSangeet"
                width="36"
                height="36"
                className="h-9 w-9 object-contain rounded-lg shadow-sm"
              />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717]">
                SukhSangeet
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/" className="btn-vercel-secondary text-xs h-9 px-4">
                <ArrowLeft size={14} />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8" id="main-content">
          <div className="mb-12 text-center sm:text-left">
            <span className="mono-eyebrow mb-2">OUR MISSION</span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#171717] mt-1">
              Built for Deep Work & Focused Audio.
            </h1>
            <p className="text-base text-[#4d4d4d] mt-4 max-w-2xl leading-relaxed">
              Sukh Sangeet was created out of a simple necessity: to listen to YouTube music without endless feeds, recommended videos, or algorithmic distractions.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 mb-12">
            <article className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
              <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                <Zap size={18} />
              </div>
              <h2 className="text-base font-semibold text-[#171717]">Zero Distractions</h2>
              <p className="text-xs text-[#4d4d4d] leading-relaxed">
                Standard video streaming platforms rely on recommendation algorithms that pull your attention away. Sukh Sangeet strips away video sidebars and comment sections so you can concentrate.
              </p>
            </article>

            <article className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
              <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                <Music size={18} />
              </div>
              <h2 className="text-base font-semibold text-[#171717]">Curated Playlists</h2>
              <p className="text-xs text-[#4d4d4d] leading-relaxed">
                Easily search YouTube's catalog directly inside the app, build custom playlists for study, coding, or relaxation, and organize your tracks with drag-and-drop ordering.
              </p>
            </article>

            <article className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
              <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                <Shield size={18} />
              </div>
              <h2 className="text-base font-semibold text-[#171717]">Privacy Focused</h2>
              <p className="text-xs text-[#4d4d4d] leading-relaxed">
                We respect your personal data. We do not sell user metrics, track browsing behavior outside the app, or serve intrusive algorithmic recommendation feeds.
              </p>
            </article>

            <article className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
              <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                <Heart size={18} />
              </div>
              <h2 className="text-base font-semibold text-[#171717]">Free & Accessible</h2>
              <p className="text-xs text-[#4d4d4d] leading-relaxed">
                Sukh Sangeet is free to use. Our lightweight architecture ensures fast loading times, minimal CPU utilization, and smooth audio playback across all devices.
              </p>
            </article>
          </div>

          <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-3 space-y-4">
            <span className="mono-eyebrow">CREATOR & PLATFORM</span>
            <h2 className="text-xl font-semibold text-[#171717]">The Story Behind Sukh Sangeet</h2>
            <p className="text-sm text-[#4d4d4d] leading-relaxed">
              "Sukh Sangeet" translates to "Peaceful Music" or "Music of Bliss". It was engineered by Darshan with a vision to build a clean personal audio interface for developers, students, writers, and professionals who demand a focused listening environment.
            </p>
            <div className="pt-2">
              <Link to="/register" className="btn-vercel-primary text-xs h-10 px-6">
                <span>Try Sukh Sangeet Now</span>
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#ebebeb] bg-[#fafafa] py-8 font-mono text-xs text-[#888888] mt-12">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            <p>© 2026 Sukh Sangeet Inc.</p>
            <div className="flex items-center gap-4 text-[#4d4d4d]">
              <Link to="/how-it-works" className="hover:text-[#171717]">How It Works</Link>
              <Link to="/about-us" className="hover:text-[#171717] font-semibold text-[#171717]">About Us</Link>
              <Link to="/privacy-policy" className="hover:text-[#171717]">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-[#171717]">Terms</Link>
              <Link to="/contact-us" className="hover:text-[#171717]">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default About;
