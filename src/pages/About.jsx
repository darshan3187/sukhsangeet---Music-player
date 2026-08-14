import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Music, Zap, Shield, Heart, Award, BookOpen, CheckCircle2, UserCheck, Code } from 'lucide-react';
import { generateAboutPageSchema, generateBreadcrumbSchema } from '../utils/seoUtils';

const About = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about-us' }
  ];

  const aboutSchema = generateAboutPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <Helmet>
        <title>About Us - Mission, Vision & Editorial Guidelines | Sukh Sangeet</title>
        <meta
          name="description"
          content="Learn about Sukh Sangeet (sukhsangeet.tech)—our mission to eliminate audio streaming distractions, our acoustic research methodology, E-E-A-T editorial standards, and founder story."
        />
        <link rel="canonical" href="https://www.sukhsangeet.tech/about-us" />
        <meta property="og:title" content="About Us - Mission, Vision & Editorial Guidelines | Sukh Sangeet" />
        <meta property="og:description" content="Discover why we built Sukh Sangeet to eliminate visual clutter and algorithmic distractions for focused audio listening and acoustic research." />
        <meta property="og:url" content="https://www.sukhsangeet.tech/about-us" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.sukhsangeet.tech/logo-sukhsangeet.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Sukh Sangeet" />
        <meta name="twitter:description" content="Sukh Sangeet: The distraction-free personal audio workspace and acoustic research publication hub." />

        {aboutSchema && (
          <script type="application/ld+json">
            {JSON.stringify(aboutSchema)}
          </script>
        )}
        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen bg-[#fafafa] text-[#171717] antialiased selection:bg-[#171717] selection:text-white flex flex-col font-sans">
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

            <div className="flex items-center gap-4">
              <Link to="/blog" className="text-xs font-semibold text-[#171717] hover:text-[#0066cc] transition-colors">
                Content Hub
              </Link>
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
            <span className="mono-eyebrow mb-2">OUR MISSION & E-E-A-T PRINCIPLES</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] mt-1 leading-tight">
              Engineered for Deep Work & Distraction-Free Audio.
            </h1>
            <p className="text-base text-[#4d4d4d] mt-4 max-w-3xl leading-relaxed">
              <strong>Sukh Sangeet</strong> (<em>sukhsangeet.tech</em>) was founded to solve a fundamental problem in modern digital media consumption: the overwhelming visual clutter, algorithmic rabbit holes, and intrusive advertisement loops of mainstream video streaming platforms when users simply want to listen to music.
            </p>
          </div>

          {/* Mission & Vision Pillars */}
          <section className="mb-14 space-y-6">
            <h2 className="text-2xl font-bold text-[#171717] border-b border-[#ebebeb] pb-3">
              1. Platform Vision & Product Purpose
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <article className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
                <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                  <Zap size={18} />
                </div>
                <h3 className="text-base font-semibold text-[#171717]">Zero Visual Distractions</h3>
                <p className="text-xs text-[#4d4d4d] leading-relaxed">
                  Traditional video recommendation feeds rely on aggressive engagement algorithms designed to hijack attention. Sukh Sangeet strips away video recommendation sidebars, comment sections, and trending noise so your mind remains focused on productive work.
                </p>
              </article>

              <article className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
                <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                  <Music size={18} />
                </div>
                <h3 className="text-base font-semibold text-[#171717]">Personalized Workspace Queues</h3>
                <p className="text-xs text-[#4d4d4d] leading-relaxed">
                  Search public audio tracks directly, build custom listening workspaces for coding, writing, workouts, or meditation, and re-order queues using drag-and-drop mechanics.
                </p>
              </article>

              <article className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
                <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <h3 className="text-base font-semibold text-[#171717]">Privacy & Data Integrity</h3>
                <p className="text-xs text-[#4d4d4d] leading-relaxed">
                  We respect user privacy unconditionally. We do not track listening habits across external web pages, sell user behavioral telemetry, or run covert profiling engines.
                </p>
              </article>

              <article className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
                <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                  <Heart size={18} />
                </div>
                <h3 className="text-base font-semibold text-[#171717]">Lightweight & PWA Enabled</h3>
                <p className="text-xs text-[#4d4d4d] leading-relaxed">
                  Built as a Progressive Web App (PWA) using Vite, React, and Web Audio API technology, Sukh Sangeet loads in sub-second speeds with minimal CPU utilization across mobile and desktop devices.
                </p>
              </article>
            </div>
          </section>

          {/* Target Audience & Use Cases */}
          <section className="mb-14 space-y-6">
            <h2 className="text-2xl font-bold text-[#171717] border-b border-[#ebebeb] pb-3">
              2. Designed for Focused Communities
            </h2>
            <p className="text-sm text-[#4d4d4d] leading-relaxed">
              Our platform serves distinct communities who rely on continuous audio for cognitive enhancement:
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-5 bg-white border border-[#ebebeb] rounded-xl shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066cc]">
                  <Code size={16} /> Software Engineers
                </div>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Eliminate visual rabbit holes during intense programming sprints with lyric-free lo-fi, ambient binaural beats, and classical sitar ragas.
                </p>
              </div>

              <div className="p-5 bg-white border border-[#ebebeb] rounded-xl shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066cc]">
                  <BookOpen size={16} /> Students & Researchers
                </div>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Maintain deep academic concentration without algorithmic notifications competing for working memory during exam preparation.
                </p>
              </div>

              <div className="p-5 bg-white border border-[#ebebeb] rounded-xl shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066cc]">
                  <UserCheck size={16} /> Audio Purists & Critics
                </div>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Explore in-depth acoustic breakdowns, vocal range analysis, raga foundations, and digital audio engineering tutorials on our Content Hub.
                </p>
              </div>
            </div>
          </section>

          {/* Editorial Standards & E-E-A-T Methodology */}
          <section className="mb-14 space-y-6">
            <h2 className="text-2xl font-bold text-[#171717] border-b border-[#ebebeb] pb-3">
              3. Editorial Standards & Acoustic Research Methodology
            </h2>
            <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 sm:p-8 shadow-level-2 space-y-4">
              <p className="text-sm text-[#4d4d4d] leading-relaxed">
                At Sukh Sangeet, we adhere to strict Google Quality & E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) standards across all published articles, artist guides, and technical tutorials:
              </p>
              <ul class="space-y-3 text-xs text-[#4d4d4d]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#0066cc] shrink-0 mt-0.5" />
                  <span><strong>100% Originality & Research Rigor:</strong> Every publication is authored by verified human music researchers and audio engineers. We reject AI-generated fluff, clickbait listicles, and copied content.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#0066cc] shrink-0 mt-0.5" />
                  <span><strong>Acoustic & Musical Precision:</strong> Song reviews and artist guides feature accurate tempo metrics (BPM), musical key signatures, Indian raga foundations, and studio recording microphone details.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#0066cc] shrink-0 mt-0.5" />
                  <span><strong>Technical Transparency:</strong> Audio engineering articles provide exact mathematical formulas (such as Nyquist-Shannon sampling rates and Fast Fourier Transform algorithms) to educate purists and developers alike.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#0066cc] shrink-0 mt-0.5" />
                  <span><strong>Continuous Fact-Checking & Updates:</strong> Our editorial desk regularly audits and updates published articles with new discography releases and verified acoustic metrics.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Founder & Leadership */}
          <section className="rounded-2xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-3 space-y-4">
            <span className="mono-eyebrow">CREATOR & PLATFORM LEADERSHIP</span>
            <div className="flex flex-col sm:flex-row items-start gap-6 pt-2">
              <img
                src="/logo-sukhsangeet.webp"
                alt="Darshan Rajgor"
                width="80"
                height="80"
                className="w-20 h-20 rounded-2xl object-cover border border-[#ebebeb] shadow-sm shrink-0"
              />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#171717]">Darshan Rajgor</h3>
                <p className="text-xs font-mono text-[#0066cc]">Founder & Lead Architect at Sukh Sangeet</p>
                <p className="text-xs text-[#555555] leading-relaxed">
                  "Sukh Sangeet" translates to "Peaceful Music" or "Music of Bliss". Engineered by Darshan Rajgor—a software developer, music researcher, and audio engineering enthusiast—the platform was built to combine clean software design with deep acoustic education.
                </p>
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link to="/register" className="btn-vercel-primary text-xs h-9 px-5">
                    <span>Try Sukh Sangeet Workspace</span>
                  </Link>
                  <Link to="/contact-us" className="btn-vercel-secondary text-xs h-9 px-4">
                    <span>Contact Editorial Desk</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="border-t border-[#ebebeb] bg-[#fafafa] py-8 font-mono text-xs text-[#888888] mt-12">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            <p>© 2026 Sukh Sangeet Inc.</p>
            <div className="flex items-center gap-4 text-[#4d4d4d]">
              <Link to="/blog" className="hover:text-[#171717] font-semibold text-[#171717]">Content Hub</Link>
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

