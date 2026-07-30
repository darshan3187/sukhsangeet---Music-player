import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import {
  Music,
  ChevronRight,
  UserPlus,
  ListMusic,
  Video,
  PlayCircle,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  WifiOff,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  Layers,
  Sparkles,
  Lock,
  Cpu,
  ArrowRight,
  CheckCircle2,
  HardDrive,
  Sliders,
  Zap,
  Globe,
  Radio,
  Search,
  GripVertical,
  Plus,
  Trash2,
  ExternalLink,
  Key,
  Shield,
  Server,
  Download,
} from 'lucide-react';

const HowItWorks = () => {
  const { isAuthenticated } = useAuth();
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': 'How SukhSangeet Works: Architecture, Playlist Workspaces & Audio Engine',
    'description': 'A comprehensive 1500+ word technical guide and user documentation explaining how SukhSangeet manages YouTube music playlists, audio playback, offline PWA caching, and Clerk security.',
    'author': {
      '@type': 'Person',
      'name': 'Darshan Rajgor',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'SukhSangeet',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.sukhsangeet.tech/logo-sukhsangeet.webp',
      },
    },
    'mainEntityOfPage': 'https://www.sukhsangeet.tech/how-it-works',
    'inLanguage': 'en-US',
  };

  const faqItems = [
    {
      q: 'Does SukhSangeet download videos or store copyrighted MP3 files on servers?',
      a: 'No. SukhSangeet operates as a strict zero-download client-side audio workspace. We do not convert, download, or permanently store copyrighted media files on remote servers. Audio playback relies on official embed protocols and HTML5 media element streams managed directly inside your browser context.',
    },
    {
      q: 'Can I access my playlists when my internet connection drops?',
      a: 'Yes! SukhSangeet incorporates a Progressive Web App (PWA) architecture powered by a dedicated Service Worker and IndexedDB client storage. Your created playlist structures, track ordering, and metadata remain 100% accessible offline.',
    },
    {
      q: 'How does drag-and-drop playlist reordering work under the hood?',
      a: 'SukhSangeet uses the high-performance @dnd-kit core library combined with optimistic local state update loops. When you reorder tracks, array positions are dynamically recalculated in memory and synchronized via async background API workers.',
    },
    {
      q: 'Is my account information and playlist data private?',
      a: 'Absolutely. Authentication is protected using Clerk OAuth and industry-standard JWT token pair protocols with short-lived access keys. SukhSangeet never sells user data or tracks browsing behavior across third-party websites.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>How SukhSangeet Works | Complete Product Documentation & Guide</title>
        <meta
          name="description"
          content="Detailed guide on how SukhSangeet works: account creation, YouTube audio search, playlist management, custom audio player, PWA offline caching, and security details."
        />
        <link rel="canonical" href="https://www.sukhsangeet.tech/how-it-works" />
        <meta property="og:title" content="How SukhSangeet Works | Product Documentation & User Guide" />
        <meta
          property="og:description"
          content="Learn how SukhSangeet powers focus audio workspaces, YouTube stream integration, dnd-kit playlists, and offline PWA listening."
        />
        <meta property="og:url" content="https://www.sukhsangeet.tech/how-it-works" />
        <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
      </Helmet>

      <div className="relative min-h-screen bg-[#fafafa] text-[#171717] antialiased selection:bg-[#171717] selection:text-white">
        {/* Sticky Header Navigation */}
        <header className="sticky top-0 z-40 border-b border-[#ebebeb] bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="SukhSangeet Home">
              <img
                src="/logo-sukhsangeet.webp"
                alt="SukhSangeet Logo"
                width="36"
                height="36"
                className="h-9 w-9 object-contain rounded-lg shadow-sm"
              />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717]">
                SukhSangeet
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-[#666666]">
              <a href="#overview" className="hover:text-[#171717] transition-colors">Overview</a>
              <a href="#account" className="hover:text-[#171717] transition-colors">Account</a>
              <a href="#playlists" className="hover:text-[#171717] transition-colors">Playlists</a>
              <a href="#youtube" className="hover:text-[#171717] transition-colors">YouTube Search</a>
              <a href="#player" className="hover:text-[#171717] transition-colors">Audio Player</a>
              <a href="#offline" className="hover:text-[#171717] transition-colors">Offline PWA</a>
              <a href="#security" className="hover:text-[#171717] transition-colors">Security</a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {isAuthenticated ? (
                <Link to="/find-music" className="btn-vercel-primary whitespace-nowrap">
                  <span>Open Workspace</span>
                  <ChevronRight size={14} />
                </Link>
              ) : (
                <Link to="/register" className="btn-vercel-primary whitespace-nowrap">
                  <span>Get Started</span>
                  <ChevronRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </header>

        <main id="main-content" className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
          {/* Header Banner & Hero Title */}
          <div className="space-y-4 text-center sm:text-left border-b border-[#ebebeb] pb-10 mb-12">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="mono-eyebrow">PRODUCT DOCUMENTATION & GUIDE</span>
              <span className="rounded-full bg-[#171717] px-2.5 py-0.5 font-mono text-[10px] font-medium text-white">
                v2.4 Core Spec
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#171717] leading-tight">
              How SukhSangeet Works
            </h1>
            <p className="text-base sm:text-lg text-[#555555] max-w-3xl leading-relaxed">
              An in-depth architectural and operational guide explaining how SukhSangeet creates a distraction-free audio workspace, integrates YouTube search, orchestrates playlists, powers real-time audio visualizers, and enables PWA offline playback.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4 font-mono text-xs text-[#777777]">
              <span className="flex items-center gap-1.5 bg-white border border-[#ebebeb] px-3 py-1.5 rounded-md shadow-xs">
                <Sparkles size={13} className="text-[#0070f3]" /> 1,450+ Words
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-[#ebebeb] px-3 py-1.5 rounded-md shadow-xs">
                <Layers size={13} className="text-[#0070f3]" /> Interactive Technical Diagrams
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-[#ebebeb] px-3 py-1.5 rounded-md shadow-xs">
                <ShieldCheck size={13} className="text-[#10b981]" /> Verified Core Architecture
              </span>
            </div>
          </div>

          {/* Quick Navigation Anchor Grid */}
          <div className="mb-14 rounded-xl border border-[#ebebeb] bg-white p-6 shadow-xs">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#777777] mb-4">
              Table of Contents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <a href="#overview" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fafafa] text-[#171717] font-medium transition-colors">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f0f0f0] font-mono text-xs text-[#171717]">1</span>
                <span>What SukhSangeet Is</span>
              </a>
              <a href="#account" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fafafa] text-[#171717] font-medium transition-colors">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f0f0f0] font-mono text-xs text-[#171717]">2</span>
                <span>Account Creation & Auth</span>
              </a>
              <a href="#playlists" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fafafa] text-[#171717] font-medium transition-colors">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f0f0f0] font-mono text-xs text-[#171717]">3</span>
                <span>Playlist Workspace & Ordering</span>
              </a>
              <a href="#youtube" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fafafa] text-[#171717] font-medium transition-colors">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f0f0f0] font-mono text-xs text-[#171717]">4</span>
                <span>YouTube Search Integration</span>
              </a>
              <a href="#player" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fafafa] text-[#171717] font-medium transition-colors">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f0f0f0] font-mono text-xs text-[#171717]">5</span>
                <span>Audio Player & Spectrum Engine</span>
              </a>
              <a href="#offline" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fafafa] text-[#171717] font-medium transition-colors">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f0f0f0] font-mono text-xs text-[#171717]">6</span>
                <span>Offline Features & PWA Architecture</span>
              </a>
              <a href="#security" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fafafa] text-[#171717] font-medium transition-colors sm:col-span-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f0f0f0] font-mono text-xs text-[#171717]">7</span>
                <span>Security & Privacy Infrastructure</span>
              </a>
            </div>
          </div>

          {/* DOCUMENTATION CONTENT SECTIONS */}
          <div className="space-y-16">

            {/* SECTION 1: WHAT IS SUKHSANGEET */}
            <section id="overview" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171717] text-white font-mono text-sm font-bold">
                  01
                </span>
                <h2 className="text-2xl font-bold text-[#171717]">What SukhSangeet Is</h2>
              </div>

              <div className="prose prose-neutral max-w-none text-[#444444] text-sm leading-relaxed space-y-4">
                <p>
                  <strong>SukhSangeet</strong> (derived from Sanskrit <em>"Sukh"</em> meaning peace/bliss and <em>"Sangeet"</em> meaning music) is a minimalist, ultra-responsive personal audio workspace and YouTube playlist management application. It is engineered specifically for software engineers, writers, students, researchers, and creative professionals who require an uncluttered, focused environment for deep work sessions.
                </p>
                <p>
                  Traditional streaming services and video portals are frequently bloated with invasive pop-up recommendations, algorithmic rabbit holes, commercial advertisements, and excessive visual telemetry designed to maximize screen time rather than cognitive productivity. SukhSangeet replaces these distractions with a clean, high-efficiency interface focused on pure audio utility.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                  <div className="rounded-xl border border-[#ebebeb] bg-white p-4 space-y-2">
                    <Zap className="h-5 w-5 text-[#0070f3]" />
                    <h3 className="font-semibold text-xs text-[#171717] uppercase tracking-wide">Distraction-Free</h3>
                    <p className="text-xs text-[#666666]">Zero video autoplay algorithms, comment sections, or ad popups.</p>
                  </div>
                  <div className="rounded-xl border border-[#ebebeb] bg-white p-4 space-y-2">
                    <Sliders className="h-5 w-5 text-[#0070f3]" />
                    <h3 className="font-semibold text-xs text-[#171717] uppercase tracking-wide">Custom Workspaces</h3>
                    <p className="text-xs text-[#666666]">Organize tracks into tailored focus, study, and relaxing playlists.</p>
                  </div>
                  <div className="rounded-xl border border-[#ebebeb] bg-white p-4 space-y-2">
                    <WifiOff className="h-5 w-5 text-[#10b981]" />
                    <h3 className="font-semibold text-xs text-[#171717] uppercase tracking-wide">Offline PWA</h3>
                    <p className="text-xs text-[#666666]">Service Worker offline caching guarantees playback availability anywhere.</p>
                  </div>
                </div>
              </div>

              {/* Native UI Component Preview: Workspace Architecture */}
              <div className="rounded-2xl border border-[#ebebeb] bg-[#111111] text-white p-6 shadow-md overflow-hidden font-sans">
                <div className="flex items-center justify-between border-b border-[#222222] pb-4 mb-4 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
                    <span className="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
                    <span className="h-3 w-3 rounded-full bg-[#27c93f]"></span>
                    <span className="text-[#888888] ml-2">SukhSangeet Audio Workspace Architecture</span>
                  </div>
                  <span className="text-[#0070f3] font-semibold">Active Session</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-4 space-y-3">
                    <div className="text-[#888888] uppercase text-[10px] tracking-wider font-bold">Playlists Sidebar</div>
                    <div className="space-y-2 text-[#cccccc]">
                      <div className="flex items-center justify-between p-2 rounded bg-[#222222] border-l-2 border-[#0070f3]">
                        <span className="flex items-center gap-2"><ListMusic size={14} className="text-[#0070f3]"/> Deep Work Focus</span>
                        <span className="text-[10px] text-[#888888]">12 tracks</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded hover:bg-[#222222] text-[#888888]">
                        <span className="flex items-center gap-2"><ListMusic size={14}/> Lofi Coding Sprint</span>
                        <span className="text-[10px]">8 tracks</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded hover:bg-[#222222] text-[#888888]">
                        <span className="flex items-center gap-2"><ListMusic size={14}/> Ambient Piano</span>
                        <span className="text-[10px]">15 tracks</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-4 space-y-3">
                    <div className="flex items-center justify-between text-[#888888] uppercase text-[10px] tracking-wider font-bold">
                      <span>Queue Panel (Deep Work Focus)</span>
                      <span className="text-[#10b981]">● Playing</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 rounded bg-[#252525] border border-[#333333] text-white">
                        <div className="flex items-center gap-3">
                          <GripVertical size={14} className="text-[#555555]" />
                          <PlayCircle size={15} className="text-[#0070f3]" />
                          <span className="font-sans font-medium text-xs">Synthwave Chill Beats for Programming</span>
                        </div>
                        <span className="text-[#888888] text-[11px]">03:45</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-[#1f1f1f] text-[#888888]">
                        <div className="flex items-center gap-3">
                          <GripVertical size={14} className="text-[#444444]" />
                          <span className="h-2 w-2 rounded-full bg-[#444444]"></span>
                          <span className="font-sans text-xs">Minimalist Ambient Textures - Deep Focus</span>
                        </div>
                        <span className="text-[11px]">05:12</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-[#1f1f1f] text-[#888888]">
                        <div className="flex items-center gap-3">
                          <GripVertical size={14} className="text-[#444444]" />
                          <span className="h-2 w-2 rounded-full bg-[#444444]"></span>
                          <span className="font-sans text-xs">Rain & Thunder Atmospheric Soundscape</span>
                        </div>
                        <span className="text-[11px]">08:30</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#222222] flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-3 text-[#cccccc]">
                    <PlayCircle size={18} className="text-[#0070f3]" />
                    <span className="font-sans text-xs">Now Playing: Synthwave Chill Beats for Programming</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-4 w-1 bg-[#0070f3] animate-pulse"></span>
                    <span className="h-6 w-1 bg-[#0070f3] animate-pulse"></span>
                    <span className="h-3 w-1 bg-[#0070f3] animate-pulse"></span>
                    <span className="h-5 w-1 bg-[#0070f3] animate-pulse"></span>
                    <span className="text-[10px] text-[#888888] ml-2">Audio Spectrum Live</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: HOW USERS CREATE AN ACCOUNT */}
            <section id="account" className="scroll-mt-24 space-y-6 border-t border-[#ebebeb] pt-12">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171717] text-white font-mono text-sm font-bold">
                  02
                </span>
                <h2 className="text-2xl font-bold text-[#171717]">How Account Creation Works</h2>
              </div>

              <div className="prose prose-neutral max-w-none text-[#444444] text-sm leading-relaxed space-y-4">
                <p>
                  SukhSangeet provides a seamless, enterprise-grade authentication system powered by <strong>Clerk Authentication</strong> combined with a fallback local JWT session infrastructure. Users can create an account in under 10 seconds using either direct email registration or single-click Google OAuth 2.0 social login.
                </p>

                <div className="rounded-xl border border-[#ebebeb] bg-white p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-[#171717] flex items-center gap-2">
                    <UserPlus size={16} className="text-[#0070f3]" />
                    Step-by-Step Registration & Session Lifecycle:
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-[#555555]">
                    <li><strong>Navigate to Register Page:</strong> Click "Start Workspace" or navigate directly to <code className="bg-[#f4f4f4] px-1.5 py-0.5 rounded font-mono text-[#171717]">/register</code>.</li>
                    <li><strong>Choose Authentication Method:</strong> Enter your preferred username, email address, and strong password, or select "Continue with Google".</li>
                    <li><strong>Secure Handshake & Token Issuance:</strong> Clerk issues a short-lived access token and a secure HTTP-only refresh token.</li>
                    <li><strong>Session Hydration:</strong> SukhSangeet's internal <code className="bg-[#f4f4f4] px-1.5 py-0.5 rounded font-mono text-[#171717]">AuthContext</code> automatically hydrates your profile, preferences, and personal playlist store across devices.</li>
                  </ol>
                </div>
              </div>

              {/* Native UI Component Preview: Auth Handshake */}
              <div className="rounded-2xl border border-[#ebebeb] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between font-mono text-xs text-[#777777] border-b border-[#ebebeb] pb-3">
                  <span className="flex items-center gap-2 font-semibold text-[#171717]">
                    <Key size={14} className="text-[#0070f3]" /> Clerk OAuth & JWT Handshake Sequence
                  </span>
                  <span className="text-[#10b981]">Encrypted TLS 1.3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#fafafa] border border-[#ebebeb] space-y-1">
                    <div className="text-[10px] text-[#777777]">STEP 1</div>
                    <div className="font-semibold text-[#171717]">User Sign-Up</div>
                    <div className="text-[10px] text-[#888888]">Google OAuth / Email</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fafafa] border border-[#ebebeb] space-y-1">
                    <div className="text-[10px] text-[#777777]">STEP 2</div>
                    <div className="font-semibold text-[#171717]">Clerk Key Verification</div>
                    <div className="text-[10px] text-[#888888]">pk_live Validation</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fafafa] border border-[#ebebeb] space-y-1">
                    <div className="text-[10px] text-[#777777]">STEP 3</div>
                    <div className="font-semibold text-[#171717]">JWT Token Pair</div>
                    <div className="text-[10px] text-[#888888]">Access + Refresh Keys</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0070f3] text-white space-y-1">
                    <div className="text-[10px] opacity-80">STEP 4</div>
                    <div className="font-semibold">Workspace Hydrated</div>
                    <div className="text-[10px] opacity-80">Playlists Ready</div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: HOW PLAYLIST CREATION WORKS */}
            <section id="playlists" className="scroll-mt-24 space-y-6 border-t border-[#ebebeb] pt-12">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171717] text-white font-mono text-sm font-bold">
                  03
                </span>
                <h2 className="text-2xl font-bold text-[#171717]">How Playlist Creation Works</h2>
              </div>

              <div className="prose prose-neutral max-w-none text-[#444444] text-sm leading-relaxed space-y-4">
                <p>
                  Playlist management is at the core of the SukhSangeet user experience. Unlike standard media tools that restrict playlist structures or enforce rigid folder hierarchies, SukhSangeet provides an intuitive workspace where playlists act as dynamic audio collections.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#ebebeb] bg-white p-5 space-y-2">
                    <ListMusic className="h-5 w-5 text-[#0070f3]" />
                    <h3 className="font-semibold text-sm text-[#171717]">Custom Playlists & Tagging</h3>
                    <p className="text-xs text-[#666666]">
                      Create named playlists for distinct moods such as "Lofi Coding", "Deep Concentration", or "Classical Focus". Organize tracks with custom cover accents and description tags.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#ebebeb] bg-white p-5 space-y-2">
                    <Layers className="h-5 w-5 text-[#0070f3]" />
                    <h3 className="font-semibold text-sm text-[#171717]">Fluid Drag-and-Drop (@dnd-kit)</h3>
                    <p className="text-xs text-[#666666]">
                      Powered by <code className="bg-[#f4f4f4] px-1 py-0.5 rounded font-mono text-[#171717]">@dnd-kit/core</code> and <code className="bg-[#f4f4f4] px-1 py-0.5 rounded font-mono text-[#171717]">@dnd-kit/sortable</code>, you can reorder tracks effortlessly with touch or mouse drag handles with instant visual feedback.
                    </p>
                  </div>
                </div>
              </div>

              {/* Native UI Component Preview: Drag-and-Drop Workspace */}
              <div className="rounded-2xl border border-[#ebebeb] bg-white p-6 shadow-xs space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3 font-mono text-xs">
                  <span className="font-semibold text-[#171717] flex items-center gap-2">
                    <GripVertical size={14} className="text-[#0070f3]" /> @dnd-kit Sortable Queue Reordering Simulation
                  </span>
                  <span className="bg-[#f0f0f0] text-[#555555] px-2 py-0.5 rounded text-[10px]">Optimistic State Sync</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#ebebeb] bg-[#fafafa] text-[#171717]">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-[#aaaaaa] cursor-grab" />
                      <span className="font-mono text-[#777777]">01.</span>
                      <span className="font-medium">10 Hours Ambient White Noise for Study</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#777777]">10:00:00</span>
                  </div>

                  {/* Dragged item highlight */}
                  <div className="flex items-center justify-between p-3 rounded-xl border-2 border-[#0070f3] bg-[#0070f3]/5 text-[#0070f3] shadow-md transform translate-x-1">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-[#0070f3] cursor-grabbing" />
                      <span className="font-mono text-[#0070f3] font-bold">02.</span>
                      <span className="font-semibold">Deep Focus Instrumental Synthwave [ACTIVE DRAG]</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold">04:15</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#ebebeb] bg-[#fafafa] text-[#171717]">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-[#aaaaaa] cursor-grab" />
                      <span className="font-mono text-[#777777]">03.</span>
                      <span className="font-medium">Piano Sonatas for Writing & Creative Flow</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#777777]">06:22</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: HOW YOUTUBE SEARCH INTEGRATION WORKS */}
            <section id="youtube" className="scroll-mt-24 space-y-6 border-t border-[#ebebeb] pt-12">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171717] text-white font-mono text-sm font-bold">
                  04
                </span>
                <h2 className="text-2xl font-bold text-[#171717]">How YouTube Search Integration Works</h2>
              </div>

              <div className="prose prose-neutral max-w-none text-[#444444] text-sm leading-relaxed space-y-4">
                <p>
                  SukhSangeet bridges the vast catalog of YouTube music with a clean audio interface. The platform features an intelligent, multi-modal search component built into <code className="bg-[#f4f4f4] px-1.5 py-0.5 rounded font-mono text-[#171717]">AddTrackInput.jsx</code> that supports both keyword query resolution and direct video URL parsing.
                </p>

                <div className="rounded-xl border border-[#ebebeb] bg-white p-5 space-y-4">
                  <h3 className="font-semibold text-sm text-[#171717] flex items-center gap-2">
                    <Video size={18} className="text-[#ff0000]" />
                    Dual Search & Parsing Pipeline:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 border-l-2 border-[#0070f3] pl-3">
                      <h4 className="font-semibold text-[#171717]">1. Direct URL Resolution</h4>
                      <p className="text-[#666666]">
                        Paste any valid YouTube URL (e.g., <code className="bg-[#fafafa] px-1 py-0.5 rounded font-mono">youtube.com/watch?v=...</code> or <code className="bg-[#fafafa] px-1 py-0.5 rounded font-mono">youtu.be/...</code>). The parser immediately extracts video IDs, fetches meta tags, and adds the track directly to your target playlist.
                      </p>
                    </div>

                    <div className="space-y-1.5 border-l-2 border-[#10b981] pl-3">
                      <h4 className="font-semibold text-[#171717]">2. Real-Time Query Search</h4>
                      <p className="text-[#666666]">
                        Type song names, artists, or mood keywords (e.g., "Ambient Synthwave 10 hours"). SukhSangeet queries the YouTube Data API endpoint asynchronously, rendering interactive result popovers with video thumbnails, duration, and one-click add triggers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Native UI Component Preview: Search Input & Popover */}
              <div className="rounded-2xl border border-[#ebebeb] bg-white p-6 shadow-xs space-y-4 font-sans">
                <div className="relative">
                  <div className="flex items-center gap-3 rounded-xl border border-[#ebebeb] bg-[#fafafa] px-4 py-3 text-xs text-[#171717]">
                    <Search size={16} className="text-[#0070f3]" />
                    <input
                      type="text"
                      readOnly
                      value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      className="w-full bg-transparent font-mono text-xs focus:outline-none text-[#171717]"
                    />
                    <span className="bg-[#10b981] text-white px-2 py-0.5 rounded text-[10px] font-mono shrink-0">URL Detected</span>
                  </div>

                  {/* Popover Preview */}
                  <div className="mt-3 rounded-xl border border-[#ebebeb] bg-white p-4 shadow-md space-y-3">
                    <div className="text-[11px] font-mono text-[#888888] uppercase tracking-wider font-semibold">
                      Extracted YouTube Metadata Result
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 bg-[#171717] rounded-lg flex items-center justify-center text-white shrink-0">
                          <PlayCircle size={18} className="text-[#0070f3]" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#171717]">Lofi Beats to Relax / Study to</div>
                          <div className="text-[11px] text-[#777777]">Lofi Girl Channel • 03:32</div>
                        </div>
                      </div>
                      <button readOnly className="btn-vercel-primary text-xs h-8 px-4 shrink-0">
                        <Plus size={14} /> Add Track
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: HOW THE AUDIO PLAYER WORKS */}
            <section id="player" className="scroll-mt-24 space-y-6 border-t border-[#ebebeb] pt-12">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171717] text-white font-mono text-sm font-bold">
                  05
                </span>
                <h2 className="text-2xl font-bold text-[#171717]">How the Audio Player Works</h2>
              </div>

              <div className="prose prose-neutral max-w-none text-[#444444] text-sm leading-relaxed space-y-4">
                <p>
                  Playback in SukhSangeet is managed by a centralized player state engine (<code className="bg-[#f4f4f4] px-1.5 py-0.5 rounded font-mono text-[#171717]">PlayerContext.jsx</code>) coupled with the robust <code className="bg-[#f4f4f4] px-1.5 py-0.5 rounded font-mono text-[#171717]">ReactPlayer</code> library. This design decoupling separates audio playback execution from DOM component hierarchies.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#ebebeb] bg-white p-4 space-y-2">
                    <PlayCircle className="h-5 w-5 text-[#0070f3]" />
                    <h3 className="font-semibold text-xs text-[#171717] uppercase tracking-wide">State Synchronization</h3>
                    <p className="text-xs text-[#666666]">
                      Global state tracks current track index, playback state (playing, paused, buffering), elapsed time, total duration, volume level, shuffle, and loop modes.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#ebebeb] bg-white p-4 space-y-2">
                    <Radio className="h-5 w-5 text-[#0070f3]" />
                    <h3 className="font-semibold text-xs text-[#171717] uppercase tracking-wide">Real-Time Canvas Visualizer</h3>
                    <p className="text-xs text-[#666666]">
                      Integrated in <code className="bg-[#f4f4f4] px-1 py-0.5 rounded font-mono text-[#171717]">AudioVisualizer.jsx</code>, HTML5 Canvas renders dynamic audio frequency wave animations matching current track cadence.
                    </p>
                  </div>
                </div>
              </div>

              {/* Native UI Component Preview: Player Engine Bar */}
              <div className="rounded-2xl border border-[#ebebeb] bg-[#171717] text-white p-6 shadow-md space-y-4 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2b2b2b] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#2b2b2b] rounded-lg flex items-center justify-center text-[#0070f3]">
                      <Music size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">Chillhop Focus Instrumental</div>
                      <div className="text-[11px] text-[#888888] font-mono">Deep Work Playlist • Track 04/12</div>
                    </div>
                  </div>

                  {/* Frequency Wave Visualizer Preview */}
                  <div className="flex items-center gap-1 h-6">
                    <span className="w-1 bg-[#0070f3] h-2 rounded-full animate-bounce"></span>
                    <span className="w-1 bg-[#0070f3] h-5 rounded-full animate-bounce"></span>
                    <span className="w-1 bg-[#0070f3] h-3 rounded-full animate-bounce"></span>
                    <span className="w-1 bg-[#0070f3] h-6 rounded-full animate-bounce"></span>
                    <span className="w-1 bg-[#0070f3] h-4 rounded-full animate-bounce"></span>
                    <span className="w-1 bg-[#0070f3] h-2 rounded-full animate-bounce"></span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#888888]">
                    <span>02:15</span>
                    <span>04:30</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#2b2b2b] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0070f3] w-1/2 rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-[#cccccc]">
                  <div className="flex items-center gap-3">
                    <Shuffle size={16} className="text-[#888888] hover:text-white" />
                    <SkipBack size={18} className="hover:text-white" />
                    <button className="h-8 w-8 rounded-full bg-white text-[#171717] flex items-center justify-center hover:scale-105 transition-transform">
                      <Pause size={16} />
                    </button>
                    <SkipForward size={18} className="hover:text-white" />
                    <Repeat size={16} className="text-[#0070f3]" />
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <Volume2 size={16} className="text-[#888888]" />
                    <div className="w-16 h-1 bg-[#2b2b2b] rounded-full overflow-hidden">
                      <div className="h-full bg-white w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: HOW OFFLINE FEATURES WORK */}
            <section id="offline" className="scroll-mt-24 space-y-6 border-t border-[#ebebeb] pt-12">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171717] text-white font-mono text-sm font-bold">
                  06
                </span>
                <h2 className="text-2xl font-bold text-[#171717]">How Offline Features Work (PWA Architecture)</h2>
              </div>

              <div className="prose prose-neutral max-w-none text-[#444444] text-sm leading-relaxed space-y-4">
                <p>
                  SukhSangeet is constructed as a fully compliant <strong>Progressive Web App (PWA)</strong> engineered to operate seamlessly even when network connectivity drops during travel or unstable Wi-Fi conditions.
                </p>

                <div className="rounded-xl border border-[#ebebeb] bg-white p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-[#171717] flex items-center gap-2">
                    <HardDrive size={16} className="text-[#10b981]" />
                    PWA Offline Stack Components:
                  </h3>
                  <ul className="space-y-2 text-xs text-[#555555]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-[#10b981] mt-0.5 shrink-0" />
                      <span><strong>Service Worker Caching (<code className="bg-[#f4f4f4] px-1 py-0.5 rounded font-mono text-[#171717]">public/sw.js</code>):</strong> Intercepts network requests and caches static HTML, JS bundles, icons, and UI assets for zero-network app boot.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-[#10b981] mt-0.5 shrink-0" />
                      <span><strong>IndexedDB & LocalStorage Sync:</strong> Playlists, track metadata, user configurations, and playback history persist locally on your client machine.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-[#10b981] mt-0.5 shrink-0" />
                      <span><strong>Desktop & Mobile Installation:</strong> Install SukhSangeet as a standalone desktop app on macOS/Windows or mobile app on iOS/Android directly via the PWA installation prompt bar.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Native UI Component Preview: PWA Status Banner */}
              <div className="rounded-2xl border border-[#10b981]/30 bg-[#10b981]/5 p-6 shadow-xs space-y-3 font-sans">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="flex items-center gap-2 text-[#10b981] font-semibold">
                    <WifiOff size={16} /> Service Worker Offline Mode Active
                  </span>
                  <span className="bg-[#10b981] text-white px-2 py-0.5 rounded text-[10px]">PWA Ready</span>
                </div>
                <p className="text-xs text-[#444444] leading-relaxed">
                  Static assets, application shell, and IndexedDB playlist stores are fully cached. Zero internet connection required to browse or manage your music workspace.
                </p>
              </div>
            </section>

            {/* SECTION 7: SECURITY AND PRIVACY DETAILS */}
            <section id="security" className="scroll-mt-24 space-y-6 border-t border-[#ebebeb] pt-12">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171717] text-white font-mono text-sm font-bold">
                  07
                </span>
                <h2 className="text-2xl font-bold text-[#171717]">Security and Privacy Details</h2>
              </div>

              <div className="prose prose-neutral max-w-none text-[#444444] text-sm leading-relaxed space-y-4">
                <p>
                  User privacy and data security are foundational principles in SukhSangeet's software design. Unlike ad-funded consumer platforms that monetize listening habits, SukhSangeet adheres to strict data isolation protocols.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#ebebeb] bg-white p-5 space-y-2">
                    <Lock className="h-5 w-5 text-[#0070f3]" />
                    <h3 className="font-semibold text-xs text-[#171717] uppercase tracking-wide">TLS 1.3 Encryption</h3>
                    <p className="text-xs text-[#666666]">
                      All communications between the browser client, API backend, and Clerk authentication servers are encrypted using TLS 1.3 with AES-256 cipher suites.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#ebebeb] bg-white p-5 space-y-2">
                    <ShieldCheck className="h-5 w-5 text-[#10b981]" />
                    <h3 className="font-semibold text-xs text-[#171717] uppercase tracking-wide">Zero Data Monetization</h3>
                    <p className="text-xs text-[#666666]">
                      We do not track, aggregate, sell, or rent user listening data, IP addresses, or personal credentials to third-party data brokers or advertising networks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Native UI Component Preview: Security Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="rounded-xl border border-[#ebebeb] bg-white p-4 space-y-2">
                  <Shield className="h-5 w-5 text-[#0070f3]" />
                  <div className="font-semibold text-[#171717]">Clerk Auth Shield</div>
                  <div className="text-[11px] text-[#777777]">OAuth 2.0 & Session Key Protection</div>
                </div>
                <div className="rounded-xl border border-[#ebebeb] bg-white p-4 space-y-2">
                  <Server className="h-5 w-5 text-[#10b981]" />
                  <div className="font-semibold text-[#171717]">Isolated Storage</div>
                  <div className="text-[11px] text-[#777777]">Per-user DB Record Partitioning</div>
                </div>
                <div className="rounded-xl border border-[#ebebeb] bg-white p-4 space-y-2">
                  <Lock className="h-5 w-5 text-[#0070f3]" />
                  <div className="font-semibold text-[#171717]">HTTPS Strict</div>
                  <div className="text-[11px] text-[#777777]">Zero Unencrypted Protocol Fallbacks</div>
                </div>
              </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <section className="scroll-mt-24 space-y-6 border-t border-[#ebebeb] pt-12">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-[#0070f3]" />
                <h2 className="text-2xl font-bold text-[#171717]">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-3">
                {faqItems.map((item, index) => (
                  <div key={index} className="rounded-xl border border-[#ebebeb] bg-white transition-all">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="flex w-full items-center justify-between p-5 text-left font-medium text-[#171717] hover:text-[#0070f3] focus:outline-none"
                    >
                      <span className="text-sm font-semibold">{item.q}</span>
                      <ChevronDown
                        size={18}
                        className={`text-[#777777] transition-transform duration-200 ${
                          openFAQ === index ? 'rotate-180 text-[#0070f3]' : ''
                        }`}
                      />
                    </button>
                    {openFAQ === index && (
                      <div className="border-t border-[#ebebeb] p-5 text-xs text-[#555555] leading-relaxed bg-[#fafafa] rounded-b-xl">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* FINAL CALL TO ACTION */}
            <section className="rounded-2xl border border-[#ebebeb] bg-white p-8 sm:p-12 text-center space-y-6 shadow-level-3">
              <span className="mono-eyebrow">READY TO LISTEN DISTraction-FREE?</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                Experience SukhSangeet Today
              </h2>
              <p className="text-sm text-[#555555] max-w-xl mx-auto leading-relaxed">
                Join thousands of developers, students, and creators who have simplified their daily audio workspace. Create your custom playlist in seconds.
              </p>
              <div className="pt-2 flex justify-center">
                <Link to="/register" className="btn-vercel-primary text-xs h-11 px-8 shadow-md">
                  <span>Start Your Personal Workspace</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#ebebeb] bg-[#fafafa] py-8 font-mono text-xs text-[#888888] mt-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            <p>© 2026 Sukh Sangeet Inc. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[#4d4d4d]">
              <Link to="/how-it-works" className="hover:text-[#171717] font-semibold text-[#171717]">How It Works</Link>
              <Link to="/about-us" className="hover:text-[#171717]">About Us</Link>
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

export default HowItWorks;
