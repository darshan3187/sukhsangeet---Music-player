import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, TAGS } from '../../data/blogData';
import { Music, Globe, Shield, BookOpen, Heart } from 'lucide-react';

export default function BlogFooter() {
  return (
    <footer className="border-t border-[#ebebeb] bg-[#fafafa] pt-12 pb-8 text-xs text-[#666666]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#ebebeb]">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo-sukhsangeet.webp"
                alt="SukhSangeet"
                className="h-8 w-8 object-contain rounded-md"
              />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171717]">
                SukhSangeet
              </span>
            </Link>
            <p className="text-xs text-[#666666] leading-relaxed">
              Personal audio workspace and YouTube playlist manager. Enjoy distraction-free focus audio, music theory breakdowns, and curated playback guides.
            </p>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#171717] mb-3">
              Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-[#171717] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags Col */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#171717] mb-3">
              Popular Topics
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.slice(0, 8).map(tag => (
                <Link
                  key={tag.slug}
                  to={`/tag/${tag.slug}`}
                  className="bg-[#f0f0f2] hover:bg-[#e5e5e8] text-[#333333] px-2 py-1 rounded text-[11px] transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#171717] mb-3">
              Platform & Legal
            </h4>
            <ul className="space-y-2">
              <li><Link to="/find-music" className="hover:text-[#171717] font-medium text-[#171717]">Music Player Workspace</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#171717]">How It Works</Link></li>
              <li><Link to="/about-us" className="hover:text-[#171717]">About Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-[#171717]">Contact Support</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#171717]">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-[#171717]">Terms & Conditions</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#888888]">
          <p>© 2026 Sukh Sangeet Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built for Focus & Audio Exploration</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
