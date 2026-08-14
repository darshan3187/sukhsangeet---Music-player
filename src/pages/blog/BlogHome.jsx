import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogHeader from '../../components/blog/BlogHeader';
import BlogFooter from '../../components/blog/BlogFooter';
import ArticleCard from '../../components/blog/ArticleCard';
import { BLOG_POSTS, CATEGORIES, TAGS, getFeaturedPost, getPopularPosts, searchPosts } from '../../data/blogData';
import { generateBreadcrumbSchema, generateOrganizationSchema, generateWebPageSchema } from '../../utils/seoUtils';
import { Sparkles, TrendingUp, Filter, Tag as TagIcon } from 'lucide-react';

export default function BlogHome() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const featuredPost = useMemo(() => getFeaturedPost(), []);
  const popularPosts = useMemo(() => getPopularPosts(), []);

  const filteredPosts = useMemo(() => {
    if (query) return searchPosts(query);
    return BLOG_POSTS;
  }, [query]);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' }
  ];

  const canonicalUrl = 'https://www.sukhsangeet.tech/blog';
  const orgSchema = generateOrganizationSchema();
  const pageSchema = generateWebPageSchema(
    'Music Articles, Artist Guides & Audio Education | Sukh Sangeet Content Hub',
    'Explore in-depth playback singer breakdowns, workout & study playlists, audio bitrate guides, and cultural music history on Sukh Sangeet Content Hub.',
    canonicalUrl
  );
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <Helmet>
        <title>Music Articles, Artist Guides & Audio Education | Sukh Sangeet Content Hub</title>
        <meta
          name="description"
          content="Explore in-depth playback singer breakdowns, workout & study playlists, audio bitrate guides, and cultural music history on Sukh Sangeet Content Hub."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Music Articles & Audio Guides | Sukh Sangeet Hub" />
        <meta
          property="og:description"
          content="Comprehensive music guides, artist analysis, focus audio recommendations, and sound engineering education."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.sukhsangeet.tech/logo-sukhsangeet.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {orgSchema && (
          <script type="application/ld+json">
            {JSON.stringify(orgSchema)}
          </script>
        )}
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

      <div className="min-h-screen bg-[#fafafa] text-[#171717] flex flex-col font-sans selection:bg-[#171717] selection:text-white">
        <BlogHeader />

        {/* Hub Banner Header */}
        <section className="bg-gradient-to-b from-white to-[#fafafa] border-b border-[#ebebeb] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f0f2] text-[#171717] text-xs font-mono font-semibold uppercase tracking-wider mb-4">
                <Sparkles size={13} /> Official Music Hub
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight leading-tight mb-4">
                Music Discovery, Vocal Analysis & Audio Engineering
              </h1>
              <p className="text-base sm:text-lg text-[#555555] leading-relaxed">
                In-depth discography breakdowns, science-backed focus playlists, cultural festival guides, and audio quality tutorials curated for music purists.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Link
                to="/blog"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#171717] text-white shadow-xs transition-colors"
              >
                All Categories
              </Link>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-white border border-[#e5e5e5] text-[#555555] hover:border-[#171717] hover:text-[#171717] transition-all shadow-2xs"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Body */}
        <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
          {query ? (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#171717] mb-2">
                Search Results for: <span className="text-[#0066cc]">"{query}"</span>
              </h2>
              <p className="text-xs text-[#666666]">Found {filteredPosts.length} article(s)</p>
            </div>
          ) : (
            /* Featured Article Hero */
            <ArticleCard post={featuredPost} featured={true} />
          )}

          {/* 2-Column Grid: Articles + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Main Posts Stream */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between border-b border-[#ebebeb] pb-4">
                <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2">
                  <Filter size={18} /> Latest Articles
                </h2>
                <span className="text-xs font-mono text-[#888888]">{filteredPosts.length} Publications</span>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center bg-white border border-[#e5e5e5] rounded-2xl">
                  <p className="text-sm text-[#666666] mb-4">No articles found matching your query.</p>
                  <Link to="/blog" className="text-xs font-semibold text-[#0066cc] underline">
                    Clear Search Filter
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map(post => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: Popular & Tags */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* Popular Articles Widget */}
              <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xs">
                <h3 className="text-base font-bold text-[#171717] mb-4 flex items-center gap-2 pb-3 border-b border-[#ebebeb]">
                  <TrendingUp size={16} className="text-[#171717]" /> Most Popular Reading
                </h3>
                <div className="space-y-4">
                  {popularPosts.slice(0, 4).map((post, idx) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="flex items-start gap-3 group"
                    >
                      <span className="font-mono text-base font-bold text-[#cccccc] group-hover:text-[#171717] transition-colors">
                        0{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-[#171717] group-hover:text-[#0066cc] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                        <span className="text-[10px] text-[#888888] font-mono mt-1 block">
                          {post.categoryLabel} &bull; {post.readingTimeMinutes} min read
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tag Cloud Widget */}
              <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xs">
                <h3 className="text-base font-bold text-[#171717] mb-4 flex items-center gap-2 pb-3 border-b border-[#ebebeb]">
                  <TagIcon size={16} className="text-[#171717]" /> Topic Index
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <Link
                      key={tag.slug}
                      to={`/tag/${tag.slug}`}
                      className="px-3 py-1.5 bg-[#f5f5f7] hover:bg-[#171717] hover:text-white text-[#444444] rounded-lg text-xs font-medium transition-all"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* App Workspace CTA Widget */}
              <div className="bg-gradient-to-br from-[#171717] to-[#333333] text-white rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-bold mb-2">Ready to Listen Distraction-Free?</h3>
                <p className="text-xs text-[#cccccc] leading-relaxed mb-4">
                  Create custom YouTube playlists, eliminate video recommendation feeds, and visualize live frequencies in real-time.
                </p>
                <Link
                  to="/find-music"
                  className="inline-block w-full text-center bg-white text-[#171717] font-semibold py-2.5 px-4 rounded-xl text-xs hover:bg-[#f0f0f2] transition-colors shadow-xs"
                >
                  Open Sukh Sangeet Workspace
                </Link>
              </div>

            </aside>
          </div>
        </main>

        <BlogFooter />
      </div>
    </>
  );
}
