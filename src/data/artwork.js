/**
 * Generates lightweight SVG cover artwork (as data URLs) per category.
 * Used for seeded events and the "Generate a cover" button.
 */
import { CATEGORY_THEMES } from './data.js';

export { CATEGORY_THEMES };

export function themeFor(category) {
  return CATEGORY_THEMES[category] || CATEGORY_THEMES.Workshop;
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function generateCover(category, title = '') {
  const t = themeFor(category);
  const h = hashString(`${category}-${title}`);
  const cx1 = 150 + (h % 600);
  const cy1 = 120 + ((h >> 8) % 500);
  const cx2 = 100 + ((h >> 4) % 700);
  const cy2 = 300 + ((h >> 12) % 500);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.from}"/><stop offset="1" stop-color="${t.to}"/></linearGradient>
<radialGradient id="r" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.55"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1000" height="1000" fill="url(#g)"/>
<circle cx="${cx1}" cy="${cy1}" r="360" fill="url(#r)"/>
<circle cx="${cx2}" cy="${cy2}" r="260" fill="url(#r)"/>
<text x="500" y="590" font-size="360" text-anchor="middle" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">${t.emoji}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}