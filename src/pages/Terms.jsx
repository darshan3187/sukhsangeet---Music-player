import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { generateWebPageSchema, generateBreadcrumbSchema } from '../utils/seoUtils';

const Terms = () => {
  const canonicalUrl = 'https://www.sukhsangeet.tech/terms-and-conditions';
  const pageSchema = generateWebPageSchema('Terms & Conditions | Sukh Sangeet', 'Read the official Terms and Conditions governing your use of Sukh Sangeet personal audio workspace and publication hub.', canonicalUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Terms & Conditions', url: '/terms-and-conditions' }
  ]);

  return (
    <>
      <Helmet>
        <title>Terms & Conditions - Terms of Service | Sukh Sangeet</title>
        <meta
          name="description"
          content="Read the official Terms and Conditions of Service governing your use of Sukh Sangeet (sukhsangeet.tech) audio workspace, YouTube API integration, and content hub."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Terms & Conditions | Sukh Sangeet" />
        <meta property="og:description" content="Read the Terms and Conditions governing your use of Sukh Sangeet website and audio player software." />
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
            <span className="mono-eyebrow mb-2">LEGAL TERMS OF SERVICE</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] mt-1 leading-tight">
              Terms & Conditions.
            </h1>
            <p className="font-mono text-xs text-[#888888] mt-3">
              Effective & Last Updated: August 14, 2026
            </p>
          </div>

          <div className="space-y-8 text-sm text-[#4d4d4d] leading-relaxed">
            
            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">1. Acceptance of Terms</h2>
              <p>
                By accessing or using <strong>Sukh Sangeet</strong> ("the Service"), operated at <a href="https://www.sukhsangeet.tech" className="text-[#0066cc] hover:underline font-mono">https://www.sukhsangeet.tech</a>, you agree to comply with and be legally bound by these Terms and Conditions. If you do not agree with any portion of these terms, you must discontinue using the Service immediately.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">2. User Accounts & Security Responsibilities</h2>
              <p>
                To utilize custom playlist creation features and saved workspaces, you may register for an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted under your account. You agree to notify us immediately of any unauthorized account access.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">3. YouTube API Services & Intellectual Property Rights</h2>
              <p>
                Sukh Sangeet utilizes official YouTube API Services to retrieve public audio track metadata and stream content within embedded web player components. All audio tracks, music recordings, artist imagery, trademarks, and associated media remain the exclusive intellectual property of their respective copyright owners, record labels, and creators.
              </p>
              <p>
                Sukh Sangeet does not claim ownership over any third-party audio content streamed through YouTube API embeds. All site branding, application code, database structures, and written publications remain the intellectual property of Sukh Sangeet Technologies.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">4. Prohibited Uses & Acceptable Use Policy</h2>
              <p>When using Sukh Sangeet, you explicitly agree NOT to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Attempt to bypass, disable, or interfere with security features of the application or third-party APIs.</li>
                <li>Use automated scripts, bots, spiders, or scrapers to extract data or raw content without explicit authorization.</li>
                <li>Rip, download, or convert proprietary audio streams in violation of YouTube Terms of Service or copyright laws.</li>
                <li>Attempt unauthorized access to server infrastructure or compromise user data integrity.</li>
              </ul>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">5. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. We do not guarantee uninterrupted server availability, error-free API responses, or continuous third-party streaming server uptime.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">6. Limitation of Liability</h2>
              <p>
                In no event shall Sukh Sangeet, its founder, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-bold text-[#171717]">7. Contact & Legal Support</h2>
              <p>
                For legal questions, copyright inquiries, or clarification regarding these Terms & Conditions, please contact us at <a href="mailto:darshanrajgor73@gmail.com" className="font-mono text-[#0066cc] hover:underline">darshanrajgor73@gmail.com</a> or visit our <Link to="/contact-us" className="text-[#0066cc] hover:underline font-semibold">Contact Page</Link>.
              </p>
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
              <Link to="/privacy-policy" className="hover:text-[#171717]">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-[#171717] font-semibold text-[#171717]">Terms</Link>
              <Link to="/contact-us" className="hover:text-[#171717]">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Terms;

