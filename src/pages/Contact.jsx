import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const inputCls = `
  w-full rounded-md border border-[#ebebeb] bg-[#fafafa]
  px-3.5 py-2.5 text-sm font-sans text-[#171717]
  outline-none transition-all duration-150
  placeholder:text-[#888888] placeholder:font-normal
  focus:bg-white focus:border-[#171717] focus:ring-1 focus:ring-[#171717]
  h-[40px]
`;

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Trigger mailto link directly to darshanrajgor73@gmail.com
    const mailtoSubject = encodeURIComponent(subject || `Sukh Sangeet Inquiry from ${name}`);
    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:darshanrajgor73@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Sukh Sangeet</title>
        <meta
          name="description"
          content="Get in touch with the Sukh Sangeet team for support, feature requests, feedback, or business inquiries."
        />
        <link rel="canonical" href="https://www.sukhsangeet.tech/contact-us" />
        <meta property="og:title" content="Contact Us | Sukh Sangeet" />
        <meta property="og:description" content="Reach out to Sukh Sangeet for support, feedback, or general questions about our personal music player." />
        <meta property="og:url" content="https://www.sukhsangeet.tech/contact-us" />
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
            <span className="mono-eyebrow mb-2">SUPPORT & FEEDBACK</span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#171717] mt-1">
              Contact Us.
            </h1>
            <p className="text-sm text-[#4d4d4d] mt-3 max-w-xl">
              Have questions, feedback, or feature ideas? Send us a message and we will respond promptly.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_1.3fr]">
            {/* Info Cards */}
            <div className="space-y-4">
              <div className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
                <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <h2 className="text-base font-semibold text-[#171717]">Direct Support Email</h2>
                <p className="text-xs text-[#4d4d4d]">For general questions, account assistance, or feedback:</p>
                <a
                  href="mailto:darshanrajgor73@gmail.com"
                  className="font-mono text-xs font-semibold text-[#0070f3] hover:underline block break-all"
                >
                  darshanrajgor73@gmail.com
                </a>
              </div>

              <div className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
                <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                  <MessageSquare size={18} />
                </div>
                <h2 className="text-base font-semibold text-[#171717]">Response Commitment</h2>
                <p className="text-xs text-[#4d4d4d] leading-relaxed">
                  We review user messages daily and strive to reply to all inquiries within 24 to 48 hours.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-3">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#fafafa] border border-[#ebebeb] text-[#0070f3] flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                  <span className="mono-eyebrow">MESSAGE READY</span>
                  <h3 className="text-xl font-semibold text-[#171717]">Thank you for reaching out!</h3>
                  <p className="text-xs text-[#4d4d4d] max-w-sm mx-auto leading-relaxed">
                    Your response is directed to <strong className="text-[#171717]">darshanrajgor73@gmail.com</strong>. Your mail client should open automatically to send.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }}
                    className="btn-vercel-secondary text-xs h-9 px-4 mt-2 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4d4d4d] mb-1 block" htmlFor="contact-name">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputCls}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4d4d4d] mb-1 block" htmlFor="contact-email">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                      placeholder="name@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4d4d4d] mb-1 block" htmlFor="contact-subject">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={inputCls}
                      placeholder="Feedback / Support Inquiry"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4d4d4d] mb-1 block" htmlFor="contact-message">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${inputCls} h-[110px] resize-none py-2.5`}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-vercel-primary text-xs h-10 mt-2 cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Send to darshanrajgor73@gmail.com</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#ebebeb] bg-[#fafafa] py-8 font-mono text-xs text-[#888888] mt-12">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            <p>© 2026 Sukh Sangeet Inc.</p>
            <div className="flex items-center gap-4 text-[#4d4d4d]">
              <Link to="/about-us" className="hover:text-[#171717]">About Us</Link>
              <Link to="/privacy-policy" className="hover:text-[#171717]">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-[#171717]">Terms</Link>
              <Link to="/contact-us" className="hover:text-[#171717] font-semibold text-[#171717]">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Contact;
