import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BLOG_POSTS, CATEGORIES, TAGS, getPostsByTag } from '../src/data/blogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.sukhsangeet.tech';
const TODAY = new Date().toISOString().split('T')[0];

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
  { url: '/find-music', priority: '0.9', changefreq: 'daily' },
  { url: '/how-it-works', priority: '0.8', changefreq: 'weekly' },
  { url: '/about-us', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact-us', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.5', changefreq: 'monthly' },
  { url: '/terms-and-conditions', priority: '0.5', changefreq: 'monthly' }
];

// --- 1. CHILD SITEMAP: sitemap-pages.xml (Static Pages + Category Hubs) ---
let pageUrls = [];

staticPages.forEach(page => {
  pageUrls.push(`  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
});

CATEGORIES.forEach(cat => {
  pageUrls.push(`  <url>
    <loc>${BASE_URL}/category/${cat.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
});

const sitemapPagesContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageUrls.join('\n')}
</urlset>
`;

// --- 2. CHILD SITEMAP: sitemap-posts.xml (Blog Articles + High-Value Tags) ---
let postUrls = [];

BLOG_POSTS.forEach(post => {
  postUrls.push(`  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.updatedDate || post.publishedDate || TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
});

let includedTagCount = 0;
TAGS.forEach(tag => {
  const posts = getPostsByTag(tag.slug);
  const isHighValue = posts.length >= 3 || tag.longDescriptionHtml;
  if (isHighValue) {
    includedTagCount++;
    postUrls.push(`  <url>
    <loc>${BASE_URL}/tag/${tag.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }
});

const sitemapPostsContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${postUrls.join('\n')}
</urlset>
`;

// --- 3. PARENT SITEMAP INDEX: sitemap.xml ---
const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-posts.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>
`;

// Write all 3 sitemap files into public/
const publicDir = path.join(__dirname, '../public');

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndexContent, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'sitemap-pages.xml'), sitemapPagesContent, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'sitemap-posts.xml'), sitemapPostsContent, 'utf-8');

console.log(`✅ Parent Sitemap Index generated: public/sitemap.xml`);
console.log(`   └─ Child 1: public/sitemap-pages.xml (${pageUrls.length} URLs)`);
console.log(`   └─ Child 2: public/sitemap-posts.xml (${postUrls.length} URLs - ${includedTagCount} tag pages)`);
