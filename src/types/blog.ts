/**
 * Type definitions for Sukhsangeet.tech Blog Architecture and SEO Content Hub
 */

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface InternalLinkItem {
  title: string;
  type: 'artist' | 'playlist' | 'genre' | 'article' | 'song';
  url: string;
  description?: string;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  summary: string;
  category: 'artist-guides' | 'playlist-articles' | 'festival-music' | 'music-education' | 'music-reviews' | 'trending-music';
  categoryLabel: string;
  tags: string[];
  author: Author;
  publishedDate: string; // ISO format YYYY-MM-DD
  updatedDate: string;   // ISO format YYYY-MM-DD
  readingTimeMinutes: number;
  featuredImage: string;
  featuredImageAlt: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  tableOfContents: TableOfContentsItem[];
  primaryKeywords: string[];
  secondaryKeywords: string[];
  contentHtml: string;
  faqs: FAQItem[];
  internalLinks: InternalLinkItem[];
  relatedSlugs: string[];
}

export interface CategoryMeta {
  slug: string;
  name: string;
  description: string;
  iconName: string;
}

export interface TagMeta {
  slug: string;
  name: string;
  description: string;
}
