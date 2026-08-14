import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogHeader from '../../components/blog/BlogHeader';
import BlogFooter from '../../components/blog/BlogFooter';
import TableOfContents from '../../components/blog/TableOfContents';
import SocialShare from '../../components/blog/SocialShare';
import FAQAccordion from '../../components/blog/FAQAccordion';
import InternalLinkWidget from '../../components/blog/InternalLinkWidget';
import ArticleCard from '../../components/blog/ArticleCard';
import { getPostBySlug, getRelatedPosts } from '../../data/blogData';
import { formatDate } from '../../utils/textUtils';
import { generateBlogPostingSchema, generateBreadcrumbSchema, generateFAQSchema, generateOrganizationSchema } from '../../utils/seoUtils';
import { Calendar, Clock, ArrowLeft, Tag as TagIcon, CheckCircle } from 'lucide-react';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = getRelatedPosts(post.slug);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.categoryLabel, url: `/category/${post.category}` },
    { name: post.title, url: `/blog/${post.slug}` }
  ];

  const orgSchema = generateOrganizationSchema();
  const blogPostingSchema = generateBlogPostingSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const faqSchema = generateFAQSchema(post.faqs);

  const canonicalUrl = `https://www.sukhsangeet.tech/blog/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>{post.seoTitle || post.title}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={post.featuredImage.startsWith('http') ? post.featuredImage : `https://www.sukhsangeet.tech${post.featuredImage}`} />
        <meta property="og:site_name" content="Sukh Sangeet" />
        <meta property="article:published_time" content={post.publishedDate} />
        <meta property="article:modified_time" content={post.updatedDate || post.publishedDate} />
        <meta property="article:section" content={post.categoryLabel} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={post.featuredImage.startsWith('http') ? post.featuredImage : `https://www.sukhsangeet.tech${post.featuredImage}`} />

        {/* JSON-LD Schemas */}
        {orgSchema && (
          <script type="application/ld+json">
            {JSON.stringify(orgSchema)}
          </script>
        )}
        {blogPostingSchema && (
          <script type="application/ld+json">
            {JSON.stringify(blogPostingSchema)}
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

      <div className="min-h-screen bg-[#fafafa] text-[#171717] flex flex-col font-sans selection:bg-[#171717] selection:text-white">
        <BlogHeader currentCategory={post.category} />

        {/* Breadcrumb Header */}
        <div className="bg-white border-b border-[#ebebeb] py-3 text-xs text-[#666666]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <nav className="flex items-center gap-1.5 flex-wrap font-mono">
              <Link to="/" className="hover:text-[#171717]">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-[#171717]">Blog</Link>
              <span>/</span>
              <Link to={`/category/${post.category}`} className="hover:text-[#171717] text-[#0066cc]">
                {post.categoryLabel}
              </Link>
              <span>/</span>
              <span className="text-[#999999] truncate max-w-[200px]">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Article Container */}
        <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-10">
          
          <article>
            {/* Header Header */}
            <header className="mb-8">
              <Link
                to={`/category/${post.category}`}
                className="inline-block px-3 py-1 rounded-full bg-[#f0f0f2] text-[#0066cc] text-xs font-mono font-bold uppercase tracking-wider mb-4 hover:bg-[#0066cc] hover:text-white transition-colors"
              >
                {post.categoryLabel}
              </Link>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight leading-tight mb-6">
                {post.h1 || post.title}
              </h1>

              {/* Author & Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#ebebeb] text-xs text-[#666666]">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#e5e5e5]"
                  />
                  <div>
                    <strong className="block text-[#171717] font-semibold text-sm">
                      {post.author.name}
                    </strong>
                    <span className="text-[11px] text-[#777777]">{post.author.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> Published: {formatDate(post.publishedDate)}
                  </span>
                  {post.updatedDate && (
                    <span className="flex items-center gap-1 text-[#0066cc]">
                      <CheckCircle size={13} /> Updated: {formatDate(post.updatedDate)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {post.readingTimeMinutes} min read
                  </span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden mb-10 bg-[#171717] border border-[#e5e5e5] shadow-sm">
              <img
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                width="1200"
                height="675"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Layout Grid (TOC Sidebar + Content) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sticky TOC Sidebar */}
              <aside className="lg:col-span-4 lg:order-2">
                <div className="lg:sticky lg:top-24">
                  <TableOfContents items={post.tableOfContents} />
                </div>
              </aside>

              {/* Main Content Column */}
              <div className="lg:col-span-8 lg:order-1">
                
                {/* Social Share Bar Top */}
                <SocialShare title={post.title} url={canonicalUrl} />

                {/* HTML Body */}
                <div
                  className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-[#171717] prose-p:leading-relaxed prose-p:text-[#333333] prose-a:text-[#0066cc] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#171717]"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />

                {/* Internal Linking Opportunities */}
                {post.internalLinks && post.internalLinks.length > 0 && (
                  <InternalLinkWidget links={post.internalLinks} />
                )}

                {/* FAQ Accordion Section */}
                {post.faqs && post.faqs.length > 0 && (
                  <FAQAccordion faqs={post.faqs} />
                )}

                {/* Tags Cloud */}
                <div className="mt-8 pt-6 border-t border-[#ebebeb] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase text-[#777777] flex items-center gap-1 mr-2">
                    <TagIcon size={13} /> Article Tags:
                  </span>
                  {post.tags.map(tagSlug => (
                    <Link
                      key={tagSlug}
                      to={`/tag/${tagSlug}`}
                      className="px-3 py-1 bg-[#f5f5f7] hover:bg-[#171717] hover:text-white text-[#444444] rounded-lg text-xs font-medium transition-colors"
                    >
                      #{tagSlug}
                    </Link>
                  ))}
                </div>

                {/* Author Bio Box */}
                <div className="mt-10 p-6 bg-white border border-[#e5e5e5] rounded-2xl flex flex-col sm:flex-row items-start gap-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-14 h-14 rounded-full object-cover border border-[#e5e5e5] shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#171717]">Written by {post.author.name}</h3>
                    <p className="text-xs font-mono text-[#0066cc] mb-2">{post.author.role}</p>
                    <p className="text-xs text-[#555555] leading-relaxed">{post.author.bio}</p>
                  </div>
                </div>

              </div>
            </div>

          </article>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-10 border-t border-[#ebebeb]">
              <h3 className="text-2xl font-bold text-[#171717] mb-6">Related Publications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedPosts.map(relPost => (
                  <ArticleCard key={relPost.id} post={relPost} />
                ))}
              </div>
            </section>
          )}

        </main>

        <BlogFooter />
      </div>
    </>
  );
}
