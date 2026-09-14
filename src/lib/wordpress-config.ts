/* ============================================
   WordPress (headless CMS) location — the one
   place server and client modules read it from.
   ============================================ */

const DEFAULT_WORDPRESS_URL = "https://cms.mix967fm.com";

/** Base URL of the WordPress install, without a trailing slash. */
export const WORDPRESS_URL = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL || DEFAULT_WORDPRESS_URL
).replace(/\/+$/, "");

export const WORDPRESS_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || `${WORDPRESS_URL}/graphql`;

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* Origins whose links belong to this site: the configured CMS, the CMS and
   old WordPress domains, and the local dev install */
const WORDPRESS_ORIGIN = new RegExp(
  `^(?:${escapeRegExp(WORDPRESS_URL)}|https?://(?:(?:www\\.|cms\\.)?mix967fm\\.com|mix-967\\.local))(?=[/?#]|$)`,
  "i"
);

/** Turn an absolute WordPress URL into a site-relative path; other URLs are returned unchanged. */
export function toSitePath(url: string): string {
  if (!WORDPRESS_ORIGIN.test(url)) return url;
  const path = url.replace(WORDPRESS_ORIGIN, "");
  return path.startsWith("/") ? path : `/${path}`;
}
