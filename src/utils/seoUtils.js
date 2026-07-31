/**
 * SEO & Schema.org JSON-LD Generators for Sukhsangeet Blog
 */

const BASE_URL = 'https://www.sukhsangeet.tech';
const ORG_NAME = 'Sukh Sangeet';
const LOGO_URL = `${BASE_URL}/logo-sukhsangeet.webp`;

/**
 * Generates JSON-LD schema for BlogPosting
 */
export function generateBlogPostingSchema(post) {
  if (!post) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${BASE_URL}/blog/${post.slug}#blogposting`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`
    },
    'headline': post.title,
    'description': post.metaDescription,
    'image': post.featuredImage ? `${BASE_URL}${post.featuredImage}` : LOGO_URL,
    'datePublished': post.publishedDate,
    'dateModified': post.updatedDate || post.publishedDate,
    'author': {
      '@type': 'Person',
      'name': post.author?.name || 'Sukh Sangeet Editorial Team',
      'jobTitle': post.author?.role || 'Music Critic & Content Editor'
    },
    'publisher': {
      '@type': 'Organization',
      'name': ORG_NAME,
      'url': BASE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': LOGO_URL
      }
    },
    'keywords': post.primaryKeywords ? post.primaryKeywords.join(', ') : '',
    'articleSection': post.categoryLabel || 'Music Articles',
    'inLanguage': 'en-US'
  };
}

/**
 * Generates JSON-LD schema for Breadcrumbs
 */
export function generateBreadcrumbSchema(items) {
  if (!items || !items.length) return null;

  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.name,
    'item': item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': itemListElement
  };
}

/**
 * Generates JSON-LD schema for FAQPage
 */
export function generateFAQSchema(faqs) {
  if (!faqs || !faqs.length) return null;

  const mainEntity = faqs.map(faq => ({
    '@type': 'Question',
    'name': faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer
    }
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': mainEntity
  };
}
