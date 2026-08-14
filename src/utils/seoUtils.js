/**
 * SEO & Schema.org JSON-LD Generators for Sukhsangeet Blog & Website
 */

const BASE_URL = 'https://www.sukhsangeet.tech';
const ORG_NAME = 'Sukh Sangeet';
const LOGO_URL = `${BASE_URL}/logo-sukhsangeet.webp`;

/**
 * Generates JSON-LD schema for Organization entity
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    'name': ORG_NAME,
    'url': BASE_URL,
    'logo': {
      '@type': 'ImageObject',
      'url': LOGO_URL,
      'caption': 'Sukh Sangeet Official Logo'
    },
    'founder': {
      '@type': 'Person',
      'name': 'Darshan Rajgor',
      'jobTitle': 'Founder & Lead Architect'
    },
    'sameAs': [
      'https://twitter.com',
      'https://linkedin.com',
      'https://github.com'
    ],
    'description': 'Distraction-free personal audio workspace, music discovery platform, and acoustic research hub.'
  };
}

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
    'headline': post.h1 || post.title,
    'name': post.title,
    'description': post.metaDescription,
    'image': post.featuredImage ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${BASE_URL}${post.featuredImage}`) : LOGO_URL,
    'datePublished': post.publishedDate,
    'dateModified': post.updatedDate || post.publishedDate,
    'author': {
      '@type': 'Person',
      'name': post.author?.name || 'Darshan Rajgor',
      'jobTitle': post.author?.role || 'Lead Music Researcher & Audio Engineer',
      'url': BASE_URL
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
    'inLanguage': 'en-US',
    'wordCount': post.contentHtml ? post.contentHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length : 1500
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

/**
 * Generates JSON-LD schema for WebPage
 */
export function generateWebPageSchema(title, description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    'url': url,
    'name': title,
    'description': description,
    'publisher': {
      '@type': 'Organization',
      'name': ORG_NAME,
      'url': BASE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': LOGO_URL
      }
    },
    'inLanguage': 'en-US'
  };
}

/**
 * Generates JSON-LD schema for AboutPage
 */
export function generateAboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${BASE_URL}/about-us#aboutpage`,
    'url': `${BASE_URL}/about-us`,
    'name': 'About Us - Sukh Sangeet Personal Audio Workspace',
    'description': 'Learn about Sukh Sangeet’s mission, vision, editorial standards, acoustic research methodology, and commitment to distraction-free listening.',
    'mainEntity': generateOrganizationSchema(),
    'inLanguage': 'en-US'
  };
}

/**
 * Generates JSON-LD schema for ContactPage
 */
export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${BASE_URL}/contact-us#contactpage`,
    'url': `${BASE_URL}/contact-us`,
    'name': 'Contact Us - Sukh Sangeet Support & Editorial Desk',
    'description': 'Get in touch with Sukh Sangeet for support, editorial inquiries, copyright questions, and Grievance Officer contacts.',
    'mainEntity': {
      '@type': 'Organization',
      'name': ORG_NAME,
      'url': BASE_URL,
      'email': 'darshanrajgor73@gmail.com'
    },
    'inLanguage': 'en-US'
  };
}

