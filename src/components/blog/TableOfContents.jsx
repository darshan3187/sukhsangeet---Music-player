import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export default function TableOfContents({ items = [] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const headings = items.map(item => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].offsetTop <= scrollPosition) {
          setActiveId(items[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <nav className="bg-[#fafafa] border border-[#e5e5e5] rounded-xl p-5 mb-8 shadow-xs">
      <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#171717] mb-3 pb-2 border-b border-[#ebebeb]">
        <List size={14} />
        <span>Table of Contents</span>
      </div>
      <ul className="space-y-1.5 text-xs">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: item.level === 3 ? '1rem' : '0' }}
          >
            <a
              href={`#${item.id}`}
              className={`block py-1 hover:text-[#0066cc] transition-colors leading-snug ${
                activeId === item.id
                  ? 'text-[#0066cc] font-semibold'
                  : 'text-[#555555]'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
