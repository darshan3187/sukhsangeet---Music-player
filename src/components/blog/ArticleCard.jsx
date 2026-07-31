import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/textUtils';

export default function ArticleCard({ post, featured = false }) {
  if (!post) return null;

  if (featured) {
    return (
      <article className="group relative bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0 mb-12">
        <div className="lg:col-span-7 aspect-video lg:aspect-auto relative overflow-hidden bg-[#171717]">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            loading="lazy"
            decoding="async"
            width="800"
            height="450"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-[#171717]/90 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-white/20">
              Featured Article
            </span>
          </div>
        </div>
        
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link
                to={`/category/${post.category}`}
                className="text-xs font-semibold text-[#0066cc] uppercase tracking-wider hover:underline"
              >
                {post.categoryLabel}
              </Link>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-[#171717] group-hover:text-[#0066cc] transition-colors leading-tight mb-3">
              <Link to={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            
            <p className="text-sm text-[#555555] line-clamp-3 leading-relaxed mb-6">
              {post.summary}
            </p>
          </div>

          <div className="pt-4 border-t border-[#ebebeb] flex items-center justify-between text-xs text-[#777777]">
            <div className="flex items-center gap-2">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                loading="lazy"
                decoding="async"
                width="24"
                height="24"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="font-medium text-[#333333]">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(post.publishedDate)}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {post.readingTimeMinutes} min</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col bg-white border border-[#e5e5e5] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
      <Link to={`/blog/${post.slug}`} className="aspect-video relative overflow-hidden bg-[#f0f0f2]">
        <img
          src={post.featuredImage}
          alt={post.featuredImageAlt}
          loading="lazy"
          decoding="async"
          width="640"
          height="360"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-xs text-[#171717] text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md shadow-2xs">
            {post.categoryLabel}
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-[#171717] group-hover:text-[#0066cc] transition-colors leading-snug mb-2 line-clamp-2">
            <Link to={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed mb-4">
            {post.summary}
          </p>
        </div>

        <div className="pt-3 border-t border-[#ebebeb] flex items-center justify-between text-[11px] text-[#888888] font-mono">
          <span>{formatDate(post.publishedDate)}</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {post.readingTimeMinutes} min read</span>
        </div>
      </div>
    </article>
  );
}
