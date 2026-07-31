/**
 * Text and Reading Time Utilities for Sukhsangeet Blog
 */

/**
 * Calculates estimated reading time in minutes based on 200 words per minute average reading speed.
 * @param {string} text 
 * @returns {number} reading time in minutes (minimum 1)
 */
export function calculateReadingTime(text) {
  if (!text) return 1;
  const cleanText = text.replace(/<[^>]*>/g, '');
  const wordCount = cleanText.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

/**
 * Converts string into SEO-friendly URL slug
 * @param {string} str 
 * @returns {string}
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Formats ISO date string into human readable format (e.g. July 28, 2026)
 * @param {string} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Truncates text to a specified length with ellipsis
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncateText(text, maxLength = 160) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
