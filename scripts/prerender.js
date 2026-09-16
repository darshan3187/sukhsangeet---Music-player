import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BLOG_POSTS, CATEGORIES, TAGS, getPostsByCategory, getPostsByTag, getRelatedPosts } from '../src/data/blogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');
const BASE_URL = 'https://www.sukhsangeet.tech';

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory does not exist. Run "vite build" first.');
  process.exit(1);
}

const rawHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
const baseIndexHtml = rawHtml.replace(/<div id="root">[\s\S]*?<\/div>\s*<\/body>/i, '<div id="root"></div>\n</body>');

// Shared Navigation Header for pre-rendered pages
function renderHeader() {
  return `
    <header class="sticky top-0 z-40 border-b border-[#ebebeb] bg-white/95 backdrop-blur-md">
      <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" class="flex items-center gap-3 shrink-0" aria-label="Sukh Sangeet Home">
          <img src="/logo-sukhsangeet.webp" alt="Sukh Sangeet" width="36" height="36" class="h-9 w-9 object-contain rounded-lg shadow-sm" />
          <span class="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717]">SukhSangeet</span>
        </a>
        <nav class="flex items-center gap-4 sm:gap-6 text-xs font-medium text-[#555555]">
          <a href="/find-music" class="hover:text-[#171717] transition-colors">Player</a>
          <a href="/blog" class="hover:text-[#171717] transition-colors">Blog Hub</a>
          <a href="/how-it-works" class="hover:text-[#171717] transition-colors">How It Works</a>
          <a href="/about-us" class="hover:text-[#171717] transition-colors">About</a>
          <a href="/contact-us" class="hover:text-[#171717] transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  `;
}

// Shared Footer for pre-rendered pages
function renderFooter() {
  return `
    <footer class="border-t border-[#ebebeb] bg-white py-12 text-[#666666]">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <img src="/logo-sukhsangeet.webp" alt="SukhSangeet" width="28" height="28" class="h-7 w-7 rounded-md" />
              <span class="font-mono text-xs font-bold uppercase tracking-wider text-[#171717]">SukhSangeet</span>
            </div>
            <p class="text-xs text-[#666666] leading-relaxed">
              Distraction-free personal audio workspace and acoustic research publication hub. Listen to YouTube music without visual feed clutter or algorithmic distractions.
            </p>
          </div>
          <div>
            <h4 class="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">Content Hub</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="/blog" class="hover:text-[#171717]">All Articles & Guides</a></li>
              <li><a href="/category/artist-guides" class="hover:text-[#171717]">Artist Guides</a></li>
              <li><a href="/category/playlist-articles" class="hover:text-[#171717]">Playlist Articles</a></li>
              <li><a href="/category/festival-music" class="hover:text-[#171717]">Festival Music</a></li>
              <li><a href="/category/music-education" class="hover:text-[#171717]">Music Education</a></li>
              <li><a href="/category/music-reviews" class="hover:text-[#171717]">Music Reviews</a></li>
              <li><a href="/category/trending-music" class="hover:text-[#171717]">Trending Music</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">Platform</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="/find-music" class="hover:text-[#171717]">Music Player Workspace</a></li>
              <li><a href="/how-it-works" class="hover:text-[#171717]">How It Works</a></li>
              <li><a href="/about-us" class="hover:text-[#171717]">About Us & Methodology</a></li>
              <li><a href="/contact-us" class="hover:text-[#171717]">Contact & Support</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">Legal & Topics</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="/privacy-policy" class="hover:text-[#171717]">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" class="hover:text-[#171717]">Terms and Conditions</a></li>
              <li><a href="/tag/bollywood" class="hover:text-[#171717]">Bollywood Songs</a></li>
              <li><a href="/tag/romantic-songs" class="hover:text-[#171717]">Romantic Songs</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-[#ebebeb] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#888888]">
          <p>© 2026 Sukh Sangeet (sukhsangeet.tech). Founded by Darshan Rajgor. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a href="/privacy-policy" class="hover:text-[#171717]">Privacy</a>
            <a href="/terms-and-conditions" class="hover:text-[#171717]">Terms</a>
            <a href="/contact-us" class="hover:text-[#171717]">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Smart SEO title formatter ensuring strictly <= 58 characters and no awkward cutoff
function formatSeoTitle(rawTitle) {
  let title = (rawTitle || '').replace(/\s*\|\s*Sukh Sangeet.*$/i, '').trim();
  if (title.length <= 58) return title;
  if (title.includes(':')) {
    const parts = title.split(':');
    const prefix = parts[0].trim();
    const suffix = parts.slice(1).join(':').trim();
    const combined = `${prefix}: ${suffix}`;
    if (combined.length <= 58) return combined;
    const cut = combined.substring(0, 58);
    const lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > 35) return cut.substring(0, lastSpace).trim();
  }
  const cut = title.substring(0, 58);
  const lastSpace = cut.lastIndexOf(' ');
  return lastSpace > 35 ? cut.substring(0, lastSpace).trim() : cut.trim();
}

// Generate Page HTML by injecting metadata and content into dist/index.html
function generatePageHtml({ urlPath, title, description, h1, contentBody, breadcrumbs = [] }) {
  const canonicalUrl = `${BASE_URL}${urlPath === '/' ? '' : urlPath}`;
  const cleanTitle = formatSeoTitle(title);

  let html = baseIndexHtml;

  // 1. Replace Title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${cleanTitle}</title>`);

  // 2. Replace meta description
  html = html.replace(
    /<meta\b[^>]*\bname=["']description["'][^>]*\/?>/i,
    `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`
  );

  // 3. Update or inject canonical link right before og:title
  if (html.includes('rel="canonical"')) {
    html = html.replace(
      /<link\b[^>]*\brel=["']canonical["'][^>]*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );
  } else {
    html = html.replace(
      '<meta property="og:title"',
      `<link rel="canonical" href="${canonicalUrl}" />\n    <meta property="og:title"`
    );
  }

  // 4. Update OpenGraph and Twitter tags
  html = html.replace(
    /<meta\b[^>]*\bproperty=["']og:title["'][^>]*\/?>/i,
    `<meta property="og:title" content="${cleanTitle.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\b[^>]*\bproperty=["']og:description["'][^>]*\/?>/i,
    `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\b[^>]*\bproperty=["']og:url["'][^>]*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta\b[^>]*\bname=["']twitter:title["'][^>]*\/?>/i,
    `<meta name="twitter:title" content="${cleanTitle.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\b[^>]*\bname=["']twitter:description["'][^>]*\/?>/i,
    `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />`
  );

  // 5. Build breadcrumb HTML
  let breadcrumbHtml = '';
  if (breadcrumbs.length > 0) {
    breadcrumbHtml = `
      <nav aria-label="Breadcrumb" class="mb-6">
        <ol class="flex flex-wrap items-center gap-2 text-xs text-[#777777]">
          ${breadcrumbs.map((b, i) => {
            if (i === breadcrumbs.length - 1) {
              return `<li class="font-medium text-[#171717]" aria-current="page">${b.name}</li>`;
            }
            return `<li><a href="${b.url}" class="hover:text-[#171717] underline decoration-dotted">${b.name}</a></li><li aria-hidden="true">/</li>`;
          }).join('')}
        </ol>
      </nav>
    `;
  }

  // 6. Build inside of #root
  const fullRootHtml = `
    <div class="min-h-screen bg-[#fafafa] text-[#171717] flex flex-col font-sans">
      <a href="#main-content" class="sr-only focus:not-sr-only focus:p-2 focus:bg-black focus:text-white">Skip to main content</a>
      ${renderHeader()}
      <main id="main-content" class="flex-grow mx-auto w-full max-w-4xl px-4 sm:px-6 py-10">
        ${breadcrumbHtml}
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#171717] mb-6 leading-tight">${h1}</h1>
        ${contentBody}
      </main>
      ${renderFooter()}
    </div>
  `;

  // Inject into <div id="root">
  html = html.replace(/<div id="root">[\s\S]*?<\/div>\s*<\/body>/i, `<div id="root">\n${fullRootHtml}\n</div>\n</body>`);

  return html;
}

// Write generated HTML to dist directory
function writePage(urlPath, html) {
  let targetPath;
  if (urlPath === '/' || urlPath === '') {
    targetPath = path.join(distDir, 'index.html');
  } else {
    const cleanPath = urlPath.replace(/^\//, '');
    const dir = path.join(distDir, cleanPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    targetPath = path.join(dir, 'index.html');
  }

  fs.writeFileSync(targetPath, html, 'utf-8');
}

console.log('🚀 Starting SEO Prerendering...');

// 1. Home Page (/)
const homeBody = `
  <div class="space-y-6 text-sm text-[#444444] leading-relaxed">
    <p class="text-base sm:text-lg text-[#333333]">
      Sukh Sangeet transforms how you listen to music online. Search YouTube tracks directly, create custom playlists, eliminate algorithmic feed distractions, and experience real-time audio visualization with PWA offline support.
    </p>
    <div class="flex flex-wrap gap-4 pt-2">
      <a href="/find-music" class="inline-flex items-center px-4 py-2 bg-[#171717] text-white rounded-md font-medium text-xs hover:bg-[#333333] transition-colors">
        Open Music Workspace →
      </a>
      <a href="/blog" class="inline-flex items-center px-4 py-2 bg-white border border-[#ebebeb] text-[#171717] rounded-md font-medium text-xs hover:bg-gray-50 transition-colors">
        Explore Music Blog & Guides
      </a>
    </div>

    <section class="mt-12 pt-8 border-t border-[#ebebeb]">
      <h2 class="text-xl font-bold text-[#171717] mb-4">Why Choose Sukh Sangeet?</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="p-4 bg-white rounded-lg border border-[#ebebeb]">
          <h3 class="font-bold text-[#171717] mb-1">Zero Recommendation Distractions</h3>
          <p class="text-xs text-[#666666]">Eliminate clickbait sidebars, endless video feeds, and intrusive autoplay algorithms so you can focus deeply on work, study, or relaxation.</p>
        </div>
        <div class="p-4 bg-white rounded-lg border border-[#ebebeb]">
          <h3 class="font-bold text-[#171717] mb-1">Drag-and-Drop Playlist Manager</h3>
          <p class="text-xs text-[#666666]">Easily create, reorder, and curate track sequences using our smooth drag-and-drop workspace powered by modern web audio standards.</p>
        </div>
        <div class="p-4 bg-white rounded-lg border border-[#ebebeb]">
          <h3 class="font-bold text-[#171717] mb-1">Direct YouTube Database Search</h3>
          <p class="text-xs text-[#666666]">Search millions of public audio tracks, Bollywood classics, lo-fi beats, and ambient soundscapes without ever opening another browser tab.</p>
        </div>
        <div class="p-4 bg-white rounded-lg border border-[#ebebeb]">
          <h3 class="font-bold text-[#171717] mb-1">Progressive Web App (PWA) Offline Access</h3>
          <p class="text-xs text-[#666666]">Install Sukh Sangeet onto your phone or desktop. Cache your playlists and enjoy seamless listening even when offline.</p>
        </div>
      </div>
    </section>

    <section class="mt-12 pt-8 border-t border-[#ebebeb]">
      <h2 class="text-xl font-bold text-[#171717] mb-4">Explore Our Editorial Categories</h2>
      <ul class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        ${CATEGORIES.map(c => `
          <li>
            <a href="/category/${c.slug}" class="block p-3 bg-white border border-[#ebebeb] rounded-md hover:border-[#0070f3] transition-colors">
              <span class="font-bold text-[#171717] text-xs block mb-1">${c.name}</span>
              <span class="text-[11px] text-[#666666] line-clamp-2">${c.description}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </section>
  </div>
`;

writePage('/', generatePageHtml({
  urlPath: '/',
  title: 'Sukh Sangeet | Focused YouTube Playlist Manager',
  description: 'Create custom playlists from YouTube tracks, organize music for study and deep work, enjoy real-time visualizers, and listen distraction-free with Sukh Sangeet.',
  h1: 'Build better focus with clean, curated YouTube playlists.',
  contentBody: homeBody,
  breadcrumbs: [{ name: 'Home', url: '/' }]
}));
console.log('✅ Prerendered: /');

// 2. Blog Hub (/blog)
const blogIndexBody = `
  <div class="space-y-8">
    <p class="text-base text-[#444444] leading-relaxed">
      Welcome to the <strong>Sukh Sangeet Content Hub</strong>—in-depth playback singer discographies, acoustic analyses, functional playlist collections, and music streaming technology guides.
    </p>

    <section>
      <h2 class="text-xl font-bold text-[#171717] mb-4">Browse by Category</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        ${CATEGORIES.map(c => `
          <a href="/category/${c.slug}" class="p-3 bg-white border border-[#ebebeb] rounded-lg hover:border-[#0070f3] transition-colors">
            <span class="font-bold text-xs text-[#171717] block">${c.name}</span>
            <span class="text-[11px] text-[#777777]">${getPostsByCategory(c.slug).length} Articles</span>
          </a>
        `).join('')}
      </div>
    </section>

    <section>
      <h2 class="text-xl font-bold text-[#171717] mb-4">Latest In-Depth Publications</h2>
      <div class="space-y-6">
        ${BLOG_POSTS.map(post => `
          <article class="p-5 bg-white border border-[#ebebeb] rounded-xl hover:border-gray-400 transition-colors">
            <div class="flex items-center gap-2 text-xs text-[#777777] mb-2">
              <a href="/category/${post.category}" class="font-semibold text-[#0070f3] hover:underline">${post.categoryLabel}</a>
              <span>•</span>
              <span>${post.readingTimeMinutes} min read</span>
              <span>•</span>
              <time datetime="${post.publishedDate}">${post.publishedDate}</time>
            </div>
            <h3 class="text-lg font-bold text-[#171717] mb-2">
              <a href="/blog/${post.slug}" class="hover:text-[#0070f3] transition-colors">${post.title}</a>
            </h3>
            <p class="text-xs text-[#555555] leading-relaxed mb-3">${post.summary}</p>
            <div class="flex items-center justify-between">
              <a href="/blog/${post.slug}" class="text-xs font-semibold text-[#171717] hover:underline">Read Full Guide →</a>
              <div class="flex gap-1.5">
                ${post.tags.slice(0, 2).map(t => `<a href="/tag/${t}" class="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">#${t}</a>`).join('')}
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  </div>
`;

writePage('/blog', generatePageHtml({
  urlPath: '/blog',
  title: 'Sukh Sangeet Blog | Music Guides & Playback Analysis',
  description: 'Explore expert playback music analyses, curated mood playlists, acoustic research, and audio engineering guides on the Sukh Sangeet Content Hub.',
  h1: 'Sukh Sangeet Music Publication & Audio Research Hub',
  contentBody: blogIndexBody,
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Blog Hub', url: '/blog' }
  ]
}));
console.log('✅ Prerendered: /blog');

// 3. Blog Post Pages (/blog/:slug)
BLOG_POSTS.forEach(post => {
  const related = getRelatedPosts(post.slug);
  const postBody = `
    <article class="space-y-6">
      <div class="flex flex-wrap items-center gap-3 text-xs text-[#666666] border-b border-[#ebebeb] pb-4">
        <span>By <strong>${post.author.name}</strong> (${post.author.role})</span>
        <span>•</span>
        <time datetime="${post.publishedDate}">Published: ${post.publishedDate}</time>
        ${post.updatedDate ? `<span>•</span><span>Updated: ${post.updatedDate}</span>` : ''}
        <span>•</span>
        <span>${post.readingTimeMinutes} min read</span>
      </div>

      <div class="p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5]">
        <p class="text-sm font-medium text-[#222222] italic">${post.summary}</p>
      </div>

      ${post.tableOfContents && post.tableOfContents.length > 0 ? `
        <div class="p-4 bg-white border border-[#ebebeb] rounded-lg">
          <h3 class="text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">Table of Contents</h3>
          <ul class="space-y-1 text-xs text-[#555555]">
            ${post.tableOfContents.map(toc => `
              <li class="${toc.level === 3 ? 'pl-4' : ''}">
                <a href="#${toc.id}" class="hover:text-[#0070f3] hover:underline">${toc.text}</a>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="prose prose-sm max-w-none text-[#333333] leading-relaxed space-y-4">
        ${post.contentHtml}
      </div>

      ${post.faqs && post.faqs.length > 0 ? `
        <section class="mt-10 pt-8 border-t border-[#ebebeb]">
          <h2 class="text-xl font-bold text-[#171717] mb-4">Frequently Asked Questions</h2>
          <div class="space-y-4">
            ${post.faqs.map(faq => `
              <div class="p-4 bg-white border border-[#ebebeb] rounded-lg">
                <h3 class="font-bold text-sm text-[#171717] mb-1">${faq.question}</h3>
                <p class="text-xs text-[#555555] leading-relaxed">${faq.answer}</p>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <div class="mt-8 pt-6 border-t border-[#ebebeb] flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-[#777777]">Filed under:</span>
          <a href="/category/${post.category}" class="text-xs font-medium text-[#0070f3] hover:underline">${post.categoryLabel}</a>
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${post.tags.map(t => `<a href="/tag/${t}" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded">#${t}</a>`).join('')}
        </div>
      </div>

      ${related.length > 0 ? `
        <div class="mt-10 pt-8 border-t border-[#ebebeb]">
          <h3 class="text-base font-bold text-[#171717] mb-4">Related Publications</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            ${related.map(r => `
              <a href="/blog/${r.slug}" class="block p-3 bg-white border border-[#ebebeb] rounded-lg hover:border-[#0070f3] transition-colors">
                <span class="text-xs font-bold text-[#171717] line-clamp-2 mb-1">${r.title}</span>
                <span class="text-[11px] text-[#777777]">${r.readingTimeMinutes} min read</span>
              </a>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </article>
  `;

  const pageTitle = post.seoTitle || post.title;

  writePage(`/blog/${post.slug}`, generatePageHtml({
    urlPath: `/blog/${post.slug}`,
    title: pageTitle,
    description: post.metaDescription,
    h1: post.h1 || post.title,
    contentBody: postBody,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: post.categoryLabel, url: `/category/${post.category}` },
      { name: post.title.substring(0, 30) + '...', url: `/blog/${post.slug}` }
    ]
  }));
  console.log(`✅ Prerendered: /blog/${post.slug}`);
});

// 4. Category Hubs (/category/:slug)
CATEGORIES.forEach(cat => {
  const posts = getPostsByCategory(cat.slug);
  const catBody = `
    <div class="space-y-8">
      <div class="p-5 bg-white border border-[#ebebeb] rounded-xl">
        <p class="text-sm text-[#444444] leading-relaxed mb-4">${cat.description}</p>
        <div class="prose prose-sm max-w-none text-xs text-[#555555]">
          ${cat.longDescriptionHtml}
        </div>
      </div>

      <section>
        <h2 class="text-xl font-bold text-[#171717] mb-4">Articles in this Hub (${posts.length})</h2>
        <div class="space-y-4">
          ${posts.map(p => `
            <article class="p-4 bg-white border border-[#ebebeb] rounded-lg hover:border-gray-400 transition-colors">
              <h3 class="text-base font-bold text-[#171717] mb-1">
                <a href="/blog/${p.slug}" class="hover:text-[#0070f3]">${p.title}</a>
              </h3>
              <p class="text-xs text-[#666666] mb-2">${p.summary}</p>
              <div class="flex items-center justify-between text-xs text-[#888888]">
                <span>${p.readingTimeMinutes} min read • ${p.publishedDate}</span>
                <a href="/blog/${p.slug}" class="font-semibold text-[#171717] hover:underline">Read Article →</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      ${cat.faqs && cat.faqs.length > 0 ? `
        <section class="mt-8 pt-6 border-t border-[#ebebeb]">
          <h2 class="text-lg font-bold text-[#171717] mb-3">Category FAQs</h2>
          <div class="space-y-3">
            ${cat.faqs.map(f => `
              <div class="p-3 bg-white border border-[#ebebeb] rounded-md">
                <h3 class="text-xs font-bold text-[#171717] mb-1">${f.question}</h3>
                <p class="text-xs text-[#555555]">${f.answer}</p>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <div class="pt-6 border-t border-[#ebebeb] flex items-center gap-3 text-xs text-[#666666]">
        <span>Explore other categories:</span>
        <div class="flex flex-wrap gap-2">
          ${CATEGORIES.filter(c => c.slug !== cat.slug).map(c => `
            <a href="/category/${c.slug}" class="hover:text-[#171717] underline decoration-dotted">${c.name}</a>
          `).join(', ')}
        </div>
      </div>
    </div>
  `;

  writePage(`/category/${cat.slug}`, generatePageHtml({
    urlPath: `/category/${cat.slug}`,
    title: `${cat.name} | Sukh Sangeet Music Hub`,
    description: cat.description,
    h1: `${cat.name}: Guides & Playback Analysis`,
    contentBody: catBody,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog Hub', url: '/blog' },
      { name: cat.name, url: `/category/${cat.slug}` }
    ]
  }));
  console.log(`✅ Prerendered: /category/${cat.slug}`);
});

// 5. High-Value Tag Pages (/tag/:slug)
['bollywood', 'romantic-songs'].forEach(tagSlug => {
  const tagInfo = TAGS.find(t => t.slug === tagSlug) || { name: tagSlug, description: `Articles tagged with ${tagSlug}` };
  const posts = getPostsByTag(tagSlug);
  const tagBody = `
    <div class="space-y-8">
      <div class="p-4 bg-white border border-[#ebebeb] rounded-lg text-xs text-[#555555] leading-relaxed">
        <p class="mb-2">${tagInfo.description}</p>
        ${tagInfo.longDescriptionHtml || ''}
      </div>

      <section>
        <h2 class="text-xl font-bold text-[#171717] mb-4">Tagged Publications (${posts.length})</h2>
        <div class="space-y-4">
          ${posts.map(p => `
            <article class="p-4 bg-white border border-[#ebebeb] rounded-lg hover:border-gray-400 transition-colors">
              <h3 class="text-base font-bold text-[#171717] mb-1">
                <a href="/blog/${p.slug}" class="hover:text-[#0070f3]">${p.title}</a>
              </h3>
              <p class="text-xs text-[#666666] mb-2">${p.summary}</p>
              <div class="flex items-center justify-between text-xs text-[#888888]">
                <span>${p.readingTimeMinutes} min read • ${p.publishedDate}</span>
                <a href="/blog/${p.slug}" class="font-semibold text-[#171717] hover:underline">Read Article →</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <div class="pt-6 border-t border-[#ebebeb] flex items-center gap-2 text-xs text-[#777777]">
        <span>Return to:</span>
        <a href="/blog" class="font-semibold text-[#171717] hover:underline">All Blog Publications</a>
      </div>
    </div>
  `;

  writePage(`/tag/${tagSlug}`, generatePageHtml({
    urlPath: `/tag/${tagSlug}`,
    title: `${tagInfo.name} Songs & Guides | Sukh Sangeet`,
    description: tagInfo.description,
    h1: `${tagInfo.name}: Music & Articles`,
    contentBody: tagBody,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: tagInfo.name, url: `/tag/${tagSlug}` }
    ]
  }));
  console.log(`✅ Prerendered: /tag/${tagSlug}`);
});

// 6. Static Pages (/find-music, /how-it-works, /about-us, /contact-us, /privacy-policy, /terms-and-conditions)
const staticPagesToPrerender = [
  {
    path: '/find-music',
    title: 'Find Music & Workspaces | Sukh Sangeet Audio Player',
    description: 'Search YouTube tracks directly and organize your custom audio workspaces with drag-and-drop playlists on Sukh Sangeet.',
    h1: 'Find Music & Curate Personal Audio Workspaces',
    body: `
      <div class="space-y-6 text-sm text-[#444444] leading-relaxed">
        <p class="text-base text-[#222222]">
          The <strong>Sukh Sangeet Music Workspace</strong> is built for deep focus, studying, and productivity. Search millions of tracks directly from YouTube and organize them into curated, custom audio playlists.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 bg-white border border-[#ebebeb] rounded-lg">
            <h3 class="font-bold text-[#171717] mb-1">Direct Search</h3>
            <p class="text-xs text-[#666666]">Query YouTube's massive public database directly without algorithmic feeds or video recommendations.</p>
          </div>
          <div class="p-4 bg-white border border-[#ebebeb] rounded-lg">
            <h3 class="font-bold text-[#171717] mb-1">Interactive Audio Player</h3>
            <p class="text-xs text-[#666666]">Enjoy high quality web audio streaming with real-time audio FFT visualizers and responsive controls.</p>
          </div>
        </div>
        <p class="text-xs text-[#666666]">
          Ready to listen? Sign in to save your personal workspaces across all your devices, or explore our <a href="/blog" class="text-[#0070f3] hover:underline">curated music playlists and guides</a>.
        </p>
      </div>
    `
  },
  {
    path: '/how-it-works',
    title: 'How SukhSangeet Works | Audio Architecture & User Guide',
    description: 'Detailed guide on how SukhSangeet works: account creation, YouTube audio search, playlist management, custom audio player, PWA offline caching, and security.',
    h1: 'How SukhSangeet Works: Architecture & Features',
    body: `
      <div class="space-y-6 text-sm text-[#444444] leading-relaxed">
        <p class="text-base text-[#222222]">
          Sukh Sangeet is engineered as a modern, distraction-free audio platform that lets you leverage YouTube's vast music catalog without getting trapped in infinite algorithmic recommendations.
        </p>
        <section class="space-y-4">
          <h2 class="text-lg font-bold text-[#171717]">1. YouTube Search Integration</h2>
          <p class="text-xs text-[#555555] leading-relaxed">
            Our search queries public YouTube audio stems in real-time, allowing you to quickly add tracks, instrumental covers, lo-fi beats, and podcasts into clean playlists without video distraction.
          </p>
          <h2 class="text-lg font-bold text-[#171717]">2. Drag-and-Drop Workspace</h2>
          <p class="text-xs text-[#555555] leading-relaxed">
            Organize track ordering effortlessly with dnd-kit drag-and-drop mechanics. Build your custom listening order for 2-hour study sprints or workout routines.
          </p>
          <h2 class="text-lg font-bold text-[#171717]">3. Progressive Web App (PWA) Offline Caching</h2>
          <p class="text-xs text-[#555555] leading-relaxed">
            Install Sukh Sangeet on Windows, Mac, Android, or iOS with one click. Your playlists, metadata, and app workspace remain accessible offline through IndexedDB and Service Workers.
          </p>
        </section>
        <div class="pt-4 border-t border-[#ebebeb]">
          <p class="text-xs text-[#666666]">
            Have questions? Review our <a href="/about-us" class="text-[#0070f3] hover:underline">About Us page</a> or <a href="/contact-us" class="text-[#0070f3] hover:underline">Contact our team</a>.
          </p>
        </div>
      </div>
    `
  },
  {
    path: '/about-us',
    title: 'About Us | Sukh Sangeet Mission & Acoustic Research',
    description: 'Learn about Sukh Sangeet—our mission to eliminate audio streaming distractions, our acoustic research methodology, and founder story.',
    h1: 'About Sukh Sangeet: Eliminating Audio Distractions',
    body: `
      <div class="space-y-6 text-sm text-[#444444] leading-relaxed">
        <p class="text-base text-[#222222]">
          Sukh Sangeet (sukhsangeet.tech) was founded by Darshan Rajgor with a simple, powerful mission: to restore deep focus and intentionality to online music listening.
        </p>
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-[#171717]">Our Mission & Editorial Standards</h2>
          <p class="text-xs text-[#555555] leading-relaxed">
            Modern streaming apps are designed to maximize screen time through algorithmic addiction, flashing thumbnails, and constant recommendations. Sukh Sangeet strips away all visual clutter, providing a serene audio sanctuary for coders, students, writers, and music enthusiasts.
          </p>
          <p class="text-xs text-[#555555] leading-relaxed">
            Our editorial desk publishes research-backed acoustic evaluations, vocal frequency analyses of legendary playback artists, and functional listening guides rooted in psychoacoustic science.
          </p>
        </section>
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-[#171717]">Founder & Team</h2>
          <p class="text-xs text-[#555555] leading-relaxed">
            Darshan Rajgor is the lead architect and founder of Sukh Sangeet. He is an audio engineering enthusiast and software engineer passionate about web audio performance, privacy, and minimalist software design.
          </p>
        </section>
        <div class="pt-4 border-t border-[#ebebeb] flex gap-4 text-xs">
          <a href="/blog" class="text-[#0070f3] hover:underline font-semibold">Read Our Publications →</a>
          <a href="/contact-us" class="text-[#171717] hover:underline">Get in Touch →</a>
        </div>
      </div>
    `
  },
  {
    path: '/contact-us',
    title: 'Contact Us | Sukh Sangeet Support & Editorial Desk',
    description: 'Get in touch with the Sukh Sangeet team for product inquiries, feature requests, editorial contributions, or technical support.',
    h1: 'Contact Sukh Sangeet Support & Editorial Desk',
    body: `
      <div class="space-y-6 text-sm text-[#444444] leading-relaxed">
        <p class="text-base text-[#222222]">
          We welcome your feedback, inquiries, bug reports, and suggestions. Reach out to our team directly.
        </p>
        <div class="p-5 bg-white border border-[#ebebeb] rounded-xl space-y-4">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">Direct Email</h3>
            <p class="text-xs text-[#555555]">General & Support: <a href="mailto:support@sukhsangeet.tech" class="text-[#0070f3] hover:underline">support@sukhsangeet.tech</a></p>
            <p class="text-xs text-[#555555]">Founder: <a href="mailto:darshan@sukhsangeet.tech" class="text-[#0070f3] hover:underline">darshan@sukhsangeet.tech</a></p>
          </div>
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">Response Time</h3>
            <p class="text-xs text-[#555555]">We typically respond to inquiries within 24 to 48 business hours.</p>
          </div>
        </div>
        <div class="pt-4 border-t border-[#ebebeb] text-xs text-[#666666]">
          <p>Learn more about our platform: <a href="/how-it-works" class="text-[#0070f3] hover:underline">How It Works</a> | <a href="/privacy-policy" class="text-[#0070f3] hover:underline">Privacy Policy</a></p>
        </div>
      </div>
    `
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Sukh Sangeet Security & User Privacy',
    description: 'Read Sukh Sangeet\'s privacy policy to understand how we protect user data, respect your privacy, and manage authentication securely.',
    h1: 'Sukh Sangeet Privacy Policy',
    body: `
      <div class="space-y-6 text-sm text-[#444444] leading-relaxed">
        <p class="text-xs text-[#777777]">Effective Date: July 2026 | Last Updated: August 2026</p>
        <p>
          At <strong>Sukh Sangeet</strong> (sukhsangeet.tech), accessible from https://www.sukhsangeet.tech, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Sukh Sangeet and how we use it.
        </p>
        <h2 class="text-base font-bold text-[#171717]">1. Information We Collect</h2>
        <p class="text-xs text-[#555555] leading-relaxed">
          When you register for an account using Clerk, we store only your essential authentication identity (email address, user identifier) and the custom playlist metadata you create. We do NOT store your passwords or track your browsing activity across other websites.
        </p>
        <h2 class="text-base font-bold text-[#171717]">2. How We Use Your Information</h2>
        <ul class="list-disc list-inside text-xs text-[#555555] space-y-1">
          <li>Provide, operate, and maintain our music player workspace</li>
          <li>Save and synchronize your custom playlists across devices</li>
          <li>Ensure service reliability and prevent abusive automated attacks</li>
          <li>Comply with applicable legal obligations</li>
        </ul>
        <h2 class="text-base font-bold text-[#171717]">3. Third-Party Services</h2>
        <p class="text-xs text-[#555555] leading-relaxed">
          Sukh Sangeet interacts with the YouTube IFrame API to play public videos according to YouTube’s Terms of Service. We do not download or store video files on our servers.
        </p>
        <h2 class="text-base font-bold text-[#171717]">4. Contact Us</h2>
        <p class="text-xs text-[#555555]">
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:support@sukhsangeet.tech" class="text-[#0070f3] hover:underline">support@sukhsangeet.tech</a> or visit our <a href="/contact-us" class="text-[#0070f3] hover:underline">Contact Page</a>.
        </p>
      </div>
    `
  },
  {
    path: '/terms-and-conditions',
    title: 'Terms and Conditions | Sukh Sangeet Service Agreement',
    description: 'Review the terms of service and conditions for using Sukh Sangeet\'s music player and playlist organization workspace.',
    h1: 'Terms and Conditions of Service',
    body: `
      <div class="space-y-6 text-sm text-[#444444] leading-relaxed">
        <p class="text-xs text-[#777777]">Effective Date: July 2026 | Last Updated: August 2026</p>
        <p>
          Welcome to Sukh Sangeet! By accessing this website at https://www.sukhsangeet.tech, you agree to be bound by these website Terms and Conditions of Use and agree that you are responsible for compliance with any applicable local laws.
        </p>
        <h2 class="text-base font-bold text-[#171717]">1. Use License</h2>
        <p class="text-xs text-[#555555] leading-relaxed">
          Permission is granted to temporarily use Sukh Sangeet for personal, non-commercial transitory listening. This is the grant of a license, not a transfer of title.
        </p>
        <h2 class="text-base font-bold text-[#171717]">2. YouTube Terms of Service Compliance</h2>
        <p class="text-xs text-[#555555] leading-relaxed">
          Sukh Sangeet uses YouTube API Services. By using Sukh Sangeet, users agree to be bound by the YouTube Terms of Service (https://www.youtube.com/t/terms) and Google Privacy Policy.
        </p>
        <h2 class="text-base font-bold text-[#171717]">3. Disclaimer</h2>
        <p class="text-xs text-[#555555] leading-relaxed">
          The materials on Sukh Sangeet are provided on an 'as is' basis. Sukh Sangeet makes no warranties, expressed or implied, and hereby disclaims all other warranties.
        </p>
        <p class="text-xs text-[#555555]">
          For questions regarding these terms, contact <a href="mailto:support@sukhsangeet.tech" class="text-[#0070f3] hover:underline">support@sukhsangeet.tech</a>.
        </p>
      </div>
    `
  }
];

staticPagesToPrerender.forEach(page => {
  writePage(page.path, generatePageHtml({
    urlPath: page.path,
    title: page.title,
    description: page.description,
    h1: page.h1,
    contentBody: page.body,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: page.h1, url: page.path }
    ]
  }));
  console.log(`✅ Prerendered: ${page.path}`);
});

console.log('🎉 All 26 pages successfully prerendered into dist/ with full SEO tags and static content!');
