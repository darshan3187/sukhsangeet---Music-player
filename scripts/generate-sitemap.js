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

let allUrls = [];

// 1. Static Pages
staticPages.forEach(page => {
  allUrls.push(`  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
});

// 2. Category Hubs
CATEGORIES.forEach(cat => {
  allUrls.push(`  <url>
    <loc>${BASE_URL}/category/${cat.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
});

// 3. Blog Articles
BLOG_POSTS.forEach(post => {
  allUrls.push(`  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.updatedDate || post.publishedDate || TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
});

// 4. High-Value Tags
TAGS.forEach(tag => {
  const posts = getPostsByTag(tag.slug);
  const isHighValue = posts.length >= 3 || tag.longDescriptionHtml;
  if (isHighValue) {
    allUrls.push(`  <url>
    <loc>${BASE_URL}/tag/${tag.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`);
  }
});

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.join('\n')}
</urlset>
`;

const publicDir = path.join(__dirname, '../public');

// Write the single sitemap.xml
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8');

// Remove extra child sitemaps if present to maintain strictly ONE sitemap file
['sitemap-pages.xml', 'sitemap-posts.xml'].forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});

console.log(`✅ Single unified sitemap generated: public/sitemap.xml (${allUrls.length} total URLs)`);
