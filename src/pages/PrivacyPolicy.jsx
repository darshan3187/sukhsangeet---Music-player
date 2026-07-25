import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ShieldCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Sukh Sangeet</title>
        <meta
          name="description"
          content="Read the Privacy Policy for Sukh Sangeet. Learn how we handle your data, playlist organization, YouTube API usage, and user privacy securely."
        />
        <link rel="canonical" href="https://www.sukhsangeet.tech/privacy-policy" />
        <meta property="og:title" content="Privacy Policy | Sukh Sangeet" />
        <meta property="og:description" content="Learn how Sukh Sangeet respects and protects your personal data and audio workspace privacy." />
        <meta property="og:url" content="https://www.sukhsangeet.tech/privacy-policy" />
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

        {/* Content */}
        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8" id="main-content">
          <div className="mb-10 text-center sm:text-left">
            <span className="mono-eyebrow mb-2">LEGAL DOCUMENTATION</span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#171717] mt-1">
              Privacy Policy.
            </h1>
            <p className="font-mono text-xs text-[#888888] mt-3">
              Last Updated: July 25, 2026
            </p>
          </div>

          <div className="space-y-8 text-sm text-[#4d4d4d] leading-relaxed">
            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">1. Introduction</h2>
              <p>
                At <strong>Sukh Sangeet</strong> ("we", "our", or "us"), accessible from <a href="https://www.sukhsangeet.tech" className="text-[#0070f3] hover:underline font-mono">https://www.sukhsangeet.tech</a>, we prioritize the privacy of our visitors and users. This Privacy Policy details the types of information we collect, how we process and protect it, and your rights regarding your data when using our personal audio workspace and playlist management application.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">2. Information We Collect</h2>
              <p>We collect minimal data required to provide you with a distraction-free audio player experience:</p>
              <ul className="list-disc pl-5 space-y-2 font-sans">
                <li>
                  <strong className="text-[#171717]">Account Data:</strong> When you register for an account, we collect your email address, username, and password credentials (securely hashed and encrypted).
                </li>
                <li>
                  <strong className="text-[#171717]">Playlist Data:</strong> Custom playlists, track IDs, playlist titles, and track ordering created within your workspace are stored securely in our database.
                </li>
                <li>
                  <strong className="text-[#171717]">Usage & Technical Data:</strong> Browser type, operating system, device characteristics, and standard log information for diagnostic and security monitoring.
                </li>
              </ul>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">3. YouTube API Services & Third-Party Content</h2>
              <p>
                Sukh Sangeet uses YouTube API Services to allow users to search for public audio tracks and create custom playlists. By using YouTube feature integration in Sukh Sangeet, you agree to be bound by:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-[#0070f3] hover:underline font-medium">YouTube Terms of Service</a>
                </li>
                <li>
                  <a href="http://www.google.com/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0070f3] hover:underline font-medium">Google Privacy Policy</a>
                </li>
              </ul>
              <p>
                We do not store private YouTube account credentials or sell your YouTube viewing metrics.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">4. Cookies & Local Storage</h2>
              <p>
                We use cookies and browser Local Storage to preserve active authentication sessions, remember user preferences (such as playback volume and library sidebar states), and ensure uninterrupted playback functionality across navigation.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">5. How We Use Your Information</h2>
              <p>Your information is used strictly for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To provide, operate, and maintain the Sukh Sangeet platform.</li>
                <li>To synchronize your custom playlists securely across your devices.</li>
                <li>To troubleshoot technical errors and improve system performance.</li>
                <li>To protect our application against spam, unauthorized access, and security threats.</li>
              </ul>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">6. Data Security</h2>
              <p>
                We employ industry-standard encryption protocols (HTTPS/TLS) and secure database storage mechanisms to safeguard your personal data against unauthorized access, disclosure, or destruction.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">7. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us via our <Link to="/contact-us" className="text-[#0070f3] hover:underline font-medium">Contact Page</Link> or email us at <a href="mailto:darshanrajgor73@gmail.com" className="font-mono text-[#0070f3] hover:underline">darshanrajgor73@gmail.com</a>.
              </p>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#ebebeb] bg-[#fafafa] py-8 font-mono text-xs text-[#888888] mt-12">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            <p>© 2026 Sukh Sangeet Inc.</p>
            <div className="flex items-center gap-4 text-[#4d4d4d]">
              <Link to="/about-us" className="hover:text-[#171717]">About Us</Link>
              <Link to="/privacy-policy" className="hover:text-[#171717] font-semibold text-[#171717]">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-[#171717]">Terms</Link>
              <Link to="/contact-us" className="hover:text-[#171717]">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PrivacyPolicy;
