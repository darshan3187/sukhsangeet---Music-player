import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Music, ChevronRight, Menu, X, BookOpen } from 'lucide-react';
import { CATEGORIES } from '../../data/blogData';

export default function BlogHeader({ currentCategory = '' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#ebebeb] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="SukhSangeet home">
            <img
              src="/logo-sukhsangeet.webp"
              alt="SukhSangeet"
              width="36"
              height="36"
              fetchPriority="high"
              decoding="async"
              className="h-9 w-9 object-contain rounded-lg shadow-xs"
            />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171717]">
              SukhSangeet
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1 text-xs font-medium text-[#666666]">
            <span>/</span>
            <Link to="/blog" className="px-2 py-1 hover:text-[#171717] transition-colors font-semibold text-[#171717]">
              Content Hub
            </Link>
          </div>
        </div>

        {/* Desktop Category Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-[#555555]">
          <Link
            to="/blog"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              !currentCategory ? 'bg-[#171717] text-white font-semibold' : 'hover:bg-[#f5f5f7] hover:text-[#171717]'
            }`}
          >
            All Articles
          </Link>
          {CATEGORIES.slice(0, 4).map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                currentCategory === cat.slug
                  ? 'bg-[#171717] text-white font-semibold'
                  : 'hover:bg-[#f5f5f7] hover:text-[#171717]'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-48 lg:w-64">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#e5e5e5] rounded-full py-1.5 pl-9 pr-4 text-xs text-[#171717] placeholder-[#888888] focus:outline-none focus:border-[#171717] focus:bg-white transition-all"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          </form>

          <Link
            to="/find-music"
            className="flex items-center gap-2 bg-[#171717] hover:bg-[#333333] text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-all shadow-xs shrink-0"
          >
            <Music size={14} />
            <span className="hidden sm:inline">Launch Player</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#444444] hover:text-[#171717] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#ebebeb] bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#e5e5e5] rounded-lg py-2 pl-9 pr-4 text-xs text-[#171717]"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          </form>
          <div className="flex flex-col space-y-1 text-sm">
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-[#f5f5f7] text-[#171717] font-medium"
            >
              All Articles
            </Link>
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-[#f5f5f7] text-[#555555]"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
