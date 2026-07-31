import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Music, Disc, Radio, Sparkles } from 'lucide-react';

export default function InternalLinkWidget({ links = [] }) {
  if (!links || links.length === 0) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'artist':
        return <Radio size={14} className="text-[#0066cc]" />;
      case 'playlist':
        return <Disc size={14} className="text-[#10b981]" />;
      case 'song':
        return <Music size={14} className="text-[#8b5cf6]" />;
      default:
        return <Sparkles size={14} className="text-[#f59e0b]" />;
    }
  };

  return (
    <aside className="my-10 p-6 bg-gradient-to-br from-[#fafafa] to-[#f5f5f7] border border-[#e5e5e5] rounded-2xl">
      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#171717] mb-4 flex items-center gap-2">
        <Music size={14} /> Recommended Music & Related Reading
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link, idx) => (
          <Link
            key={idx}
            to={link.url}
            className="flex items-start gap-3 p-3 bg-white border border-[#e5e5e5] rounded-xl hover:border-[#171717] hover:shadow-xs transition-all group"
          >
            <div className="p-2 bg-[#f5f5f7] rounded-lg group-hover:bg-[#171717] group-hover:text-white transition-colors shrink-0">
              {getTypeIcon(link.type)}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#171717] group-hover:text-[#0066cc] transition-colors leading-snug flex items-center gap-1">
                {link.title}
                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              {link.description && (
                <p className="text-[11px] text-[#666666] mt-0.5 line-clamp-1">
                  {link.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#ebebeb] flex items-center justify-between">
        <span className="text-xs text-[#555555]">Want to listen without visual ads?</span>
        <Link
          to="/find-music"
          className="text-xs font-semibold text-[#171717] hover:text-[#0066cc] underline flex items-center gap-1"
        >
          Open Sukh Sangeet Workspace &rarr;
        </Link>
      </div>
    </aside>
  );
}
