import React, { useState } from 'react';
import { Share2, Link2, Check } from 'lucide-react';

const TwitterIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
  </svg>
);

export default function SocialShare({ title, url }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const shareTitle = title || 'Check out this article on Sukh Sangeet!';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="flex items-center gap-2 py-4 my-6 border-y border-[#ebebeb]">
      <span className="text-xs font-mono font-semibold uppercase text-[#777777] flex items-center gap-1 mr-2">
        <Share2 size={13} /> Share:
      </span>

      <a
        href={twitterShare}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-[#f5f5f7] hover:bg-[#171717] hover:text-white text-[#555555] rounded-lg transition-colors"
        aria-label="Share on Twitter / X"
      >
        <TwitterIcon />
      </a>

      <a
        href={facebookShare}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-[#f5f5f7] hover:bg-[#4267b2] hover:text-white text-[#555555] rounded-lg transition-colors"
        aria-label="Share on Facebook"
      >
        <FacebookIcon />
      </a>

      <a
        href={linkedinShare}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-[#f5f5f7] hover:bg-[#0a66c2] hover:text-white text-[#555555] rounded-lg transition-colors"
        aria-label="Share on LinkedIn"
      >
        <LinkedinIcon />
      </a>

      <button
        onClick={handleCopy}
        className="p-2 bg-[#f5f5f7] hover:bg-[#171717] hover:text-white text-[#555555] rounded-lg transition-colors relative"
        aria-label="Copy Article Link"
      >
        {copied ? <Check size={14} className="text-green-500" /> : <Link2 size={14} />}
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#171717] text-white text-[10px] py-0.5 px-2 rounded shadow-xs font-mono whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
