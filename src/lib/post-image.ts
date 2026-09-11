/* ============================================
   Post imagery — blog posts are syndicated
   celebrity news whose photos we aren't licensed
   to show, so every post renders a branded
   Mix 96.7 fallback and embedded photos are
   stripped from the article body.
   ============================================ */

const POST_FALLBACK_IMAGES = [
  "/images/news-fallback-1.jpg",
  "/images/news-fallback-2.jpg",
  "/images/news-fallback-3.jpg",
] as const;

export const POST_IMAGE_ALT = "Mix 96.7 FM Entertainment News";

/** Pick a fallback variant deterministically so a post always shows the same one. */
export function getPostImage(slug: string): string {
  let hash = 0;
  for (const char of slug) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return POST_FALLBACK_IMAGES[hash % POST_FALLBACK_IMAGES.length];
}

/* Innermost <figure> that contains an image (no nested figure tags inside it) */
const FIGURE_WITH_IMAGE =
  /<figure\b[^>]*>(?:(?!<\/?figure\b)[\s\S])*?<(?:img|picture)\b(?:(?!<\/?figure\b)[\s\S])*<\/figure>/gi;
const EMPTY_FIGURE = /<figure\b[^>]*>\s*<\/figure>/gi;
const LOOSE_IMAGE = /<picture\b[\s\S]*?<\/picture>|<img\b[^>]*>/gi;

/**
 * Remove every embedded photo (and its caption) from post HTML.
 * Social embeds (Instagram, X, TikTok, YouTube) contain no <img> and are kept.
 */
export function stripContentImages(html: string): string {
  let content = html;
  let previous: string;

  // Repeat so gallery blocks (figure > figure > img) collapse completely
  do {
    previous = content;
    content = content.replace(FIGURE_WITH_IMAGE, "").replace(EMPTY_FIGURE, "");
  } while (content !== previous);

  return content.replace(LOOSE_IMAGE, "");
}
