import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogHeader from '../../components/blog/BlogHeader';
import BlogFooter from '../../components/blog/BlogFooter';
import ArticleCard from '../../components/blog/ArticleCard';
import FAQAccordion from '../../components/blog/FAQAccordion';
import { CATEGORIES, getPostsByCategory } from '../../data/blogData';
import { generateBreadcrumbSchema, generateFAQSchema } from '../../utils/seoUtils';
import { Folder, ArrowLeft, Disc, Sparkles, BookOpen } from 'lucide-react';

export default function CategoryPage() {
  const { category: categorySlug } = useParams();
  const categoryMeta = CATEGORIES.find(c => c.slug === categorySlug);

  if (!categoryMeta) {
    return <Navigate to="/blog" replace />;
  }

  const posts = getPostsByCategory(categorySlug);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: categoryMeta.name, url: `/category/${categorySlug}` }
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const faqSchema = generateFAQSchema(categoryMeta.faqs);

  const canonicalUrl = `https://www.sukhsangeet.tech/category/${categorySlug}`;

  const relatedCategories = CATEGORIES.filter(c => 
    c.slug !== categorySlug && categoryMeta.relatedCategorySlugs?.includes(c.slug)
  );

  return (
    <>
      <Helmet>
        <title>{`${categoryMeta.name} Guide & Publications | Sukh Sangeet Hub`}</title>
        <meta name="description" content={categoryMeta.description} />
        <link rel="canonical" href={canonicalUrl} />
        
        <meta property="og:title" content={`${categoryMeta.name} | Sukh Sangeet Hub`} />
        <meta property="og:description" content={categoryMeta.description} />
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
        <BlogHeader currentCategory={categorySlug} />

        {/* Category Header Banner */}
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
                <Folder size={22} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0066cc]">Category Hub</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717]">
                  {categoryMeta.name}
                </h1>
              </div>
            </div>
            <p className="text-sm sm:text-base text-[#555555] max-w-3xl leading-relaxed">
              {categoryMeta.description}
            </p>
          </div>
        </section>

        {/* Main Content Hub Layout */}
        <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Main Articles Column */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Category Guide Editorial */}
              {categoryMeta.longDescriptionHtml && (
                <article className="bg-white border border-[#e5e5e5] rounded-2xl p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#171717] mb-4 pb-3 border-b border-[#ebebeb]">
                    <BookOpen size={15} />
                    <span>Comprehensive Category Guide</span>
                  </div>
                  <div
                    className="prose prose-slate max-w-none text-sm text-[#4d4d4d]"
                    dangerouslySetInnerHTML={{ __html: categoryMeta.longDescriptionHtml }}
                  />
                </article>
              )}

              {/* Articles Stream */}
              <div>
                <h2 className="text-xl font-bold text-[#171717] mb-6 flex items-center gap-2">
                  <Disc size={18} /> Category Publications ({posts.length})
                </h2>

                {posts.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-[#e5e5e5] rounded-2xl">
                    <p className="text-sm text-[#666666]">No publications currently listed under this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map(post => (
                      <ArticleCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>

              {/* Category FAQs Section */}
              {categoryMeta.faqs && categoryMeta.faqs.length > 0 && (
                <FAQAccordion faqs={categoryMeta.faqs} />
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* Category Recommendations */}
              {categoryMeta.musicRecommendations && (
                <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xs">
                  <h3 className="text-base font-bold text-[#171717] mb-4 flex items-center gap-2 pb-3 border-b border-[#ebebeb]">
                    <Sparkles size={16} className="text-[#171717]" /> Featured Recommendations
                  </h3>
                  <div className="space-y-3">
                    {categoryMeta.musicRecommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 bg-[#f5f5f7] rounded-xl border border-[#ebebeb]">
                        <strong className="text-xs font-bold text-[#171717] block">{rec.title}</strong>
                        <span className="text-[11px] font-mono text-[#0066cc] mt-0.5 block">{rec.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Categories Navigation */}
              {relatedCategories.length > 0 && (
                <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xs">
                  <h3 className="text-base font-bold text-[#171717] mb-4 pb-3 border-b border-[#ebebeb]">
                    Related Categories
                  </h3>
                  <div className="space-y-2">
                    {relatedCategories.map(cat => (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}`}
                        className="block p-3 rounded-xl bg-[#f5f5f7] hover:bg-[#171717] hover:text-white text-[#333333] transition-all text-xs font-semibold"
                      >
                        {cat.name} &rarr;
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* App Workspace CTA */}
              <div className="bg-[#171717] text-white rounded-2xl p-6 shadow-md">
                <h3 className="text-base font-bold mb-2">Listen Distraction-Free</h3>
                <p className="text-xs text-[#cccccc] leading-relaxed mb-4">
                  Stream curated music from YouTube without video feeds or visual clutter.
                </p>
                <Link
                  to="/find-music"
                  className="inline-block w-full text-center bg-white text-[#171717] font-semibold py-2.5 px-4 rounded-xl text-xs hover:bg-[#f0f0f2] transition-colors"
                >
                  Open Player Workspace
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
