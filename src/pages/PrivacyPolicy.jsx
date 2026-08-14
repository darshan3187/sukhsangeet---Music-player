import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { generateWebPageSchema, generateBreadcrumbSchema } from '../utils/seoUtils';

const PrivacyPolicy = () => {
  const canonicalUrl = 'https://www.sukhsangeet.tech/privacy-policy';
  const pageSchema = generateWebPageSchema('Privacy Policy | Sukh Sangeet', 'Read the Privacy Policy for Sukh Sangeet (sukhsangeet.tech). Learn how we handle your data, cookies, AdSense policies, and DPDP Act 2023 compliance.', canonicalUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy-policy' }
  ]);

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Google AdSense & DPDP Act Compliance | Sukh Sangeet</title>
        <meta
          name="description"
          content="Read the official Privacy Policy for Sukh Sangeet. Learn how we handle user data, YouTube API integration, Google AdSense cookies, and DPDP Act 2023 compliance."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Privacy Policy | Sukh Sangeet" />
        <meta property="og:description" content="Learn how Sukh Sangeet respects and protects your personal data, privacy, and audio workspace security." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.sukhsangeet.tech/logo-sukhsangeet.webp" />

        {pageSchema && (
          <script type="application/ld+json">
            {JSON.stringify(pageSchema)}
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

        {/* Content */}
        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8" id="main-content">
          <div className="mb-10 text-center sm:text-left">
            <span className="mono-eyebrow mb-2">LEGAL DOCUMENTATION & DATA PROTECTION</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] mt-1 leading-tight">
              Privacy Policy.
            </h1>
            <p className="font-mono text-xs text-[#888888] mt-3">
              Effective & Last Updated: August 14, 2026
            </p>
          </div>

          <div className="space-y-8 text-sm text-[#4d4d4d] leading-relaxed">
            
            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">1. Introduction & Overview</h2>
              <p>
                At <strong>Sukh Sangeet</strong> ("we", "our", or "us"), operating at <a href="https://www.sukhsangeet.tech" className="text-[#0066cc] hover:underline font-mono">https://www.sukhsangeet.tech</a>, protecting your personal privacy is a foundational priority. This Privacy Policy outlines the categories of data we collect, how we process and safeguard it, and your legal rights regarding your personal information when using our distraction-free personal audio workspace and publication hub.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">2. Information We Collect</h2>
              <p>We collect minimal personal data necessary to operate a secure, seamless web application:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#171717]">Account & Authentication Data:</strong> When you register for a Sukh Sangeet account, we collect your email address, username, and encrypted credentials managed via secure authentication providers.
                </li>
                <li>
                  <strong className="text-[#171717]">Custom Playlists & Workspace Preferences:</strong> Custom playlist names, track ordering, saved YouTube video IDs, and audio visualizer preferences created within your workspace are stored securely in our database.
                </li>
                <li>
                  <strong className="text-[#171717]">Technical & Diagnostic Data:</strong> IP address, browser type, operating system, device screen resolution, standard server log files, and page response latencies monitored for server performance and security defense against unauthorized access.
                </li>
              </ul>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">3. YouTube API Services & Third-Party Content Integration</h2>
              <p>
                Sukh Sangeet utilizes official YouTube API Services to allow users to search public audio metadata and stream music tracks within embedded web players. By using YouTube-powered features in Sukh Sangeet, you acknowledge and agree to be bound by:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-[#0066cc] hover:underline font-semibold">YouTube Terms of Service</a>
                </li>
                <li>
                  <a href="http://www.google.com/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0066cc] hover:underline font-semibold">Google Privacy Policy</a>
                </li>
              </ul>
              <p>
                Users can manage or revoke Sukh Sangeet's access to their YouTube data at any time via the official <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener noreferrer" className="text-[#0066cc] hover:underline font-semibold">Google Security Settings Page</a>. We do not sell your YouTube viewing metrics or store private Google account passwords.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">4. Google AdSense & Third-Party Advertising Cookies</h2>
              <p>
                Sukh Sangeet may display advertisements served by <strong>Google AdSense</strong> and vendor partners to support free access to our Content Hub and audio tools. AdSense uses cookies, Web Beacons, and device identifiers to serve advertisements based on your prior visits to our website or other sites across the Internet:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#171717]">Google's Use of Advertising Cookies:</strong> Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to Sukh Sangeet and/or other sites on the Internet.
                </li>
                <li>
                  <strong className="text-[#171717]">Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#0066cc] hover:underline font-semibold">Google Ads Settings</a> or by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#0066cc] hover:underline font-semibold">aboutads.info</a>.
                </li>
                <li>
                  <strong className="text-[#171717]">Third-Party Ad Networks:</strong> Third-party ad servers or ad networks use technology to serve advertisements directly to your browser. They automatically receive your IP address when this occurs.
                </li>
              </ul>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">5. Cookies & Local Storage Technologies</h2>
              <p>
                Sukh Sangeet uses browser <code>localStorage</code> and essential session cookies to remember your active playlist state, light/dark interface mode, and authentication tokens across browser sessions. We do not use covert cross-site tracking scripts.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">6. Your Data Protection Rights (DPDP Act 2023 & GDPR)</h2>
              <p>
                Under the Indian Digital Personal Data Protection (DPDP) Act 2023 and global privacy frameworks (GDPR / CCPA), you possess the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-[#171717]">Right to Access & Summary:</strong> Request a complete copy of personal data stored in your account.</li>
                <li><strong className="text-[#171717]">Right to Correction & Erasure:</strong> Request the deletion or updating of inaccurate account information or custom playlists.</li>
                <li><strong className="text-[#171717]">Right to Withdraw Consent:</strong> Revoke consent for processing personal data at any time.</li>
              </ul>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">7. Grievance Redressal & Contact Information</h2>
              <p>
                If you have questions, grievances, or requests regarding your privacy, data protection, or third-party ad policies, please contact our designated Grievance Officer:
              </p>
              <div className="font-mono text-xs text-[#171717] bg-[#fafafa] p-4 rounded-lg border border-[#ebebeb] space-y-1">
                <p><strong>Grievance Officer:</strong> Darshan Rajgor</p>
                <p><strong>Entity:</strong> Sukh Sangeet Technologies</p>
                <p><strong>Location:</strong> Gujarat, India</p>
                <p><strong>Email:</strong> <a href="mailto:darshanrajgor73@gmail.com" className="text-[#0066cc] hover:underline">grievance@sukhsangeet.tech</a> / <a href="mailto:darshanrajgor73@gmail.com" className="text-[#0066cc] hover:underline">darshanrajgor73@gmail.com</a></p>
              </div>
            </section>

          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#ebebeb] bg-[#fafafa] py-8 font-mono text-xs text-[#888888] mt-12">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            <p>© 2026 Sukh Sangeet Inc.</p>
            <div className="flex items-center gap-4 text-[#4d4d4d]">
              <Link to="/blog" className="hover:text-[#171717]">Content Hub</Link>
              <Link to="/how-it-works" className="hover:text-[#171717]">How It Works</Link>
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

