import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2, ShieldAlert, FileText, HelpCircle } from 'lucide-react';
import { generateContactPageSchema, generateBreadcrumbSchema, generateFAQSchema } from '../utils/seoUtils';
import FAQAccordion from '../components/blog/FAQAccordion';

const inputCls = `
  w-full rounded-md border border-[#ebebeb] bg-[#fafafa]
  px-3.5 py-2.5 text-sm font-sans text-[#171717]
  outline-none transition-all duration-150
  placeholder:text-[#888888] placeholder:font-normal
  focus:bg-white focus:border-[#171717] focus:ring-1 focus:ring-[#171717]
  h-[40px]
`;

const CONTACT_FAQS = [
  {
    question: 'How quickly does the Sukh Sangeet team respond to support inquiries?',
    answer: 'We review user messages daily and strive to reply to all general support inquiries, bug reports, and feedback within 24 to 48 business hours.'
  },
  {
    question: 'Who should I contact for editorial pitches or music article corrections?',
    answer: 'For content suggestions, editorial corrections, or artist guide feature requests, email our Content Desk directly at darshanrajgor73@gmail.com with the subject line "Editorial Desk Inquiry".'
  },
  {
    question: 'How do I submit a copyright notice or legal inquiry?',
    answer: 'All copyright notifications, trademark inquiries, or legal notices should be sent directly to darshanrajgor73@gmail.com. We take intellectual property rights seriously and respond within 24 hours.'
  },
  {
    question: 'Who is the designated Data Protection & Grievance Officer for India (DPDP Act 2023)?',
    answer: 'Our designated Grievance Officer is Darshan Rajgor (Email: grievance@sukhsangeet.tech / darshanrajgor73@gmail.com, Gujarat, India).'
  },
  {
    question: 'Is Sukh Sangeet free to use for personal listening?',
    answer: 'Yes! Sukh Sangeet is completely free for individual users seeking a clean, distraction-free YouTube audio workspace and playlist manager.'
  },
  {
    question: 'Can I request custom features or report playback bugs?',
    answer: 'Absolutely. Use the contact form on this page or email darshanrajgor73@gmail.com with your device model, browser version, and issue description.'
  }
];

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact-us' }
  ];

  const contactSchema = generateContactPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const faqSchema = generateFAQSchema(CONTACT_FAQS);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const mailtoSubject = encodeURIComponent(subject || `Sukh Sangeet Inquiry from ${name}`);
    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:darshanrajgor73@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Support, Editorial & Grievance Officer | Sukh Sangeet</title>
        <meta
          name="description"
          content="Get in touch with Sukh Sangeet (sukhsangeet.tech). Contact our support team, editorial desk, copyright officers, or designated Grievance Officer."
        />
        <link rel="canonical" href="https://www.sukhsangeet.tech/contact-us" />
        <meta property="og:title" content="Contact Us - Support & Editorial Desk | Sukh Sangeet" />
        <meta property="og:description" content="Reach out to Sukh Sangeet for support, editorial inquiries, copyright issues, or general feedback." />
        <meta property="og:url" content="https://www.sukhsangeet.tech/contact-us" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.sukhsangeet.tech/logo-sukhsangeet.webp" />

        {contactSchema && (
          <script type="application/ld+json">
            {JSON.stringify(contactSchema)}
          </script>
        )}
        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
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

        {/* Main Content */}
        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12" id="main-content">
          
          <div className="text-center sm:text-left">
            <span className="mono-eyebrow mb-2">SUPPORT, EDITORIAL & LEGAL INQUIRIES</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] mt-1 leading-tight">
              Get in Touch with Sukh Sangeet.
            </h1>
            <p className="text-sm sm:text-base text-[#4d4d4d] mt-3 max-w-2xl leading-relaxed">
              Have questions about our audio workspace, feature requests, editorial feedback, or privacy concerns? We are committed to open communication and prompt response times.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
            {/* Info Cards Column */}
            <div className="space-y-4">
              
              <div className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
                <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <h2 className="text-base font-semibold text-[#171717]">Direct Support Email</h2>
                <p className="text-xs text-[#4d4d4d]">For user support, account queries, and general feedback:</p>
                <a
                  href="mailto:darshanrajgor73@gmail.com"
                  className="font-mono text-xs font-semibold text-[#0066cc] hover:underline block break-all"
                >
                  darshanrajgor73@gmail.com
                </a>
              </div>

              <div className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
                <div className="w-9 h-9 rounded-md bg-[#171717] text-white flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <h2 className="text-base font-semibold text-[#171717]">Editorial & Research Desk</h2>
                <p className="text-xs text-[#4d4d4d] leading-relaxed">
                  For song analysis corrections, artist guide pitches, or music education contributions:
                </p>
                <a
                  href="mailto:darshanrajgor73@gmail.com?subject=Editorial%20Desk%20Inquiry"
                  className="font-mono text-xs font-semibold text-[#0066cc] hover:underline block break-all"
                >
                  editorial@sukhsangeet.tech
                </a>
              </div>

              <div className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-level-2 space-y-3">
                <span className="mono-eyebrow text-[10px]">DPDP ACT 2023 COMPLIANCE</span>
                <h2 className="text-base font-semibold text-[#171717]">Grievance Officer (India)</h2>
                <p className="text-xs text-[#4d4d4d]">Designated Data Protection & Grievance Officer:</p>
                <div className="font-mono text-xs text-[#171717] bg-[#fafafa] p-3 rounded-lg border border-[#ebebeb] space-y-1">
                  <p><strong>Officer:</strong> Darshan Rajgor</p>
                  <p><strong>Role:</strong> Grievance Officer & Data Controller</p>
                  <p><strong>Location:</strong> Gujarat, India</p>
                  <p><strong>Email:</strong> <a href="mailto:darshanrajgor73@gmail.com" className="text-[#0066cc] hover:underline">grievance@sukhsangeet.tech</a></p>
                </div>
              </div>

            </div>

            {/* Contact Form Column */}
            <div className="rounded-xl border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-level-3">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#fafafa] border border-[#ebebeb] text-[#0066cc] flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                  <span className="mono-eyebrow">MESSAGE READY TO SEND</span>
                  <h3 className="text-xl font-bold text-[#171717]">Thank you for reaching out!</h3>
                  <p className="text-xs text-[#4d4d4d] max-w-sm mx-auto leading-relaxed">
                    Your inquiry is addressed to <strong className="text-[#171717]">darshanrajgor73@gmail.com</strong>. Your mail app will open to finalize delivery.
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
                  <h2 className="text-lg font-bold text-[#171717] mb-2">Send a Message</h2>
                  
                  <div>
                    <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4d4d4d] mb-1 block" htmlFor="contact-name">
                      Your Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Rahul Sharma"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4d4d4d] mb-1 block" htmlFor="contact-email">
                      Email Address *
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
                      Inquiry Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Feature Suggestion / Support Request"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4d4d4d] mb-1 block" htmlFor="contact-message">
                      Detailed Message *
                    </label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${inputCls} h-[110px] resize-none py-2.5`}
                      placeholder="Write your message here..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-vercel-primary text-xs h-10 mt-2 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>Send Message to darshanrajgor73@gmail.com</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact & Support FAQs */}
          <section className="pt-6 border-t border-[#ebebeb]">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle size={20} className="text-[#171717]" />
              <h2 className="text-2xl font-bold text-[#171717]">Contact & Support FAQ</h2>
            </div>
            <FAQAccordion faqs={CONTACT_FAQS} />
          </section>

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

