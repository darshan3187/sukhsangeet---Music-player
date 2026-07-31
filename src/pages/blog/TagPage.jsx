import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogHeader from '../../components/blog/BlogHeader';
import BlogFooter from '../../components/blog/BlogFooter';
import ArticleCard from '../../components/blog/ArticleCard';
import FAQAccordion from '../../components/blog/FAQAccordion';
import { TAGS, getPostsByTag } from '../../data/blogData';
import { generateBreadcrumbSchema, generateFAQSchema } from '../../utils/seoUtils';
import { Tag as TagIcon, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';

export default function TagPage() {
  const { tag: tagSlug } = useParams();
  const tagMeta = TAGS.find(t => t.slug === tagSlug);

  if (!tagMeta) {
    return <Navigate to="/blog" replace />;
  }

  const posts = getPostsByTag(tagSlug);

  // Dynamic Noindex Rule: If fewer than 3 posts and no custom long description, set noindex to prevent thin content rejection
  const isThinTag = posts.length < 3 && !tagMeta.longDescriptionHtml;
  const robotsDirective = isThinTag ? 'noindex, follow' : 'index, follow';

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: `#${tagMeta.name}`, url: `/tag/${tagSlug}` }
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const faqSchema = tagMeta.faqs ? generateFAQSchema(tagMeta.faqs) : null;

  const canonicalUrl = `https://www.sukhsangeet.tech/tag/${tagSlug}`;

  return (
    <>
      <Helmet>
        <title>{`#${tagMeta.name} Articles & Music Guides | Sukh Sangeet`}</title>
        <meta name="description" content={tagMeta.description} />
        <meta name="robots" content={robotsDirective} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={`#${tagMeta.name} | Sukh Sangeet Hub`} />
        <meta property="og:description" content={tagMeta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />

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
        <BlogHeader />

        {/* Tag Header Banner */}
        <section className="bg-gradient-to-b from-white to-[#fafafa] border-b border-[#ebebeb] py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-xs font-mono text-[#0066cc] hover:underline mb-4"
            >
              <ArrowLeft size={12} /> Back to all articles
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-[#171717] text-white rounded-2xl shadow-xs">
                <TagIcon size={22} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0066cc]">Topic Tag</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717]">
                  #{tagMeta.name}
                </h1>
              </div>
            </div>
            <p className="text-sm sm:text-base text-[#555555] max-w-2xl leading-relaxed">
              {tagMeta.description}
            </p>
          </div>
        </section>

        {/* Articles Grid & Standalone Content */}
        <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          
          {/* Optional Tag Guide */}
          {tagMeta.longDescriptionHtml && (
            <article className="bg-white border border-[#e5e5e5] rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#171717] mb-4 pb-3 border-b border-[#ebebeb]">
                <BookOpen size={15} />
                <span>Topic Overview & Acoustic Context</span>
              </div>
              <div
                className="prose prose-slate max-w-none text-sm text-[#4d4d4d]"
                dangerouslySetInnerHTML={{ __html: tagMeta.longDescriptionHtml }}
              />
            </article>
          )}

          {/* Posts Stream */}
          <div>
            <h2 className="text-xl font-bold text-[#171717] mb-6">
              Tagged Articles ({posts.length})
            </h2>

            {posts.length === 0 ? (
              <div className="p-12 text-center bg-white border border-[#e5e5e5] rounded-2xl">
                <p className="text-sm text-[#666666]">No publications currently tagged with #{tagMeta.name}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Optional Tag FAQs */}
          {tagMeta.faqs && tagMeta.faqs.length > 0 && (
            <FAQAccordion faqs={tagMeta.faqs} />
          )}
        </main>

        <BlogFooter />
      </div>
    </>
  );
}
