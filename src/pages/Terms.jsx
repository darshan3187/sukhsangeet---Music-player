import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Sukh Sangeet</title>
        <meta
          name="description"
          content="Terms and Conditions of Service for using Sukh Sangeet personal music player and YouTube playlist manager."
        />
        <link rel="canonical" href="https://www.sukhsangeet.tech/terms-and-conditions" />
        <meta property="og:title" content="Terms & Conditions | Sukh Sangeet" />
        <meta property="og:description" content="Read the Terms and Conditions governing your use of Sukh Sangeet website and audio player software." />
        <meta property="og:url" content="https://www.sukhsangeet.tech/terms-and-conditions" />
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
            <span className="mono-eyebrow mb-2">TERMS OF SERVICE</span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#171717] mt-1">
              Terms & Conditions.
            </h1>
            <p className="font-mono text-xs text-[#888888] mt-3">
              Last Updated: July 25, 2026
            </p>
          </div>

          <div className="space-y-8 text-sm text-[#4d4d4d] leading-relaxed">
            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Sukh Sangeet ("the Service"), operated at <a href="https://www.sukhsangeet.tech" className="text-[#0070f3] hover:underline font-mono">https://www.sukhsangeet.tech</a>, you agree to comply with and be legally bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue using the Service.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">2. User Accounts & Security</h2>
              <p>
                To utilize custom playlist creation features, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities occurring under your account. You agree to notify us immediately of any unauthorized account activity.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">3. YouTube API & Intellectual Property</h2>
              <p>
                Sukh Sangeet uses official YouTube API Services to retrieve public audio track metadata and stream content. All streaming content, album art, trademarks, and media remain the exclusive intellectual property of their respective copyright owners and creators. Sukh Sangeet does not claim ownership over any third-party audio content streamed through YouTube embed components.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">4. Prohibited Uses</h2>
              <p>When using Sukh Sangeet, you agree NOT to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Attempt to bypass, disable, or reverse engineer any security features of the application or third-party APIs.</li>
                <li>Use automated bots, scripts, or web scrapers to access the Service without explicit written permission.</li>
                <li>Attempt to download or extract raw proprietary audio streams in violation of YouTube Terms of Service.</li>
                <li>Use the platform for any illegal or unauthorized activities under applicable laws.</li>
              </ul>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">5. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. We do not guarantee uninterrupted server availability, error-free API responses, or continuous third-party streaming reliability.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">6. Limitation of Liability</h2>
              <p>
                In no event shall Sukh Sangeet, its creators, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service.
              </p>
            </section>

            <section className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-2 space-y-4">
              <h2 className="text-lg font-semibold text-[#171717]">7. Contact & Support</h2>
              <p>
                For questions regarding these Terms & Conditions, please contact us at <a href="mailto:darshanrajgor73@gmail.com" className="font-mono text-[#0070f3] hover:underline">darshanrajgor73@gmail.com</a> or visit our <Link to="/contact-us" className="text-[#0070f3] hover:underline font-medium">Contact Page</Link>.
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
