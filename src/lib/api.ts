/* ============================================
   Data Fetching — typed wrappers around GraphQL
   ============================================ */

import { fetchGraphQL, fetchGraphQLSafe } from "./graphql/client";
import {
  GET_RECENT_POSTS,
  GET_POSTS_PAGINATED,
  GET_POST_BY_SLUG,
  GET_ALL_SHOWS,
  GET_SHOW_BY_SLUG,
  GET_UPCOMING_EVENTS,
  GET_EVENT_BY_SLUG,
  GET_PAGE_BY_SLUG,
  GET_HOMEPAGE_SLIDER,
  GET_AD_GROUP,
  SEARCH_POSTS,
  GET_POST_COUNT,
} from "./graphql/queries";
import type {
  PostsResponse,
  PaginatedPostsResponse,
  SinglePostResponse,
  ShowsResponse,
  SingleShowResponse,
  EventsResponse,
  SingleEventResponse,
  PageResponse,
  SliderResponse,
  AdGroupResponse,
  WPPost,
  WPShow,
  WPEvent,
  WPPage,
  WPPageInfo,
  SliderSlide,
  AdvancedAd,
} from "@/types";

/* ---------- Posts ---------- */

export async function getRecentPosts(count = 6): Promise<WPPost[]> {
  const data = await fetchGraphQLSafe<PostsResponse>(
    GET_RECENT_POSTS,
    { first: count },
    { revalidate: 60, tags: ["posts"] }
  );
  return data?.posts.nodes ?? [];
}

export async function getPaginatedPosts(
  perPage = 12,
  after: string | null = null
): Promise<{ posts: WPPost[]; pageInfo: WPPageInfo }> {
  const data = await fetchGraphQL<PaginatedPostsResponse>(
    GET_POSTS_PAGINATED,
    { first: perPage, after },
    { revalidate: 60, tags: ["posts"] }
  );
  return { posts: data.posts.nodes, pageInfo: data.posts.pageInfo };
}

/**
 * Fetch a specific "page" by offset. WPGraphQL uses cursor pagination,
 * so to get page N we need to skip (N-1)*perPage items via sequential cursor fetches.
 * For efficiency, we fetch cursors in a compact query.
 */
export async function getPostsPage(
  page: number,
  perPage = 12
): Promise<{ posts: WPPost[]; pageInfo: WPPageInfo; totalFetched: number }> {
  if (page <= 1) {
    const result = await getPaginatedPosts(perPage, null);
    return { ...result, totalFetched: result.posts.length };
  }

  // Skip pages by fetching just cursors
  let cursor: string | null = null;
  for (let i = 1; i < page; i++) {
    type SkipResult = { posts: { pageInfo: { endCursor: string | null; hasNextPage: boolean } } };
    const skip: SkipResult = await fetchGraphQL<SkipResult>(
      `query SkipPosts($first: Int!, $after: String) {
        posts(first: $first, after: $after, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
          pageInfo { endCursor hasNextPage }
        }
      }`,
      { first: perPage, after: cursor },
      { revalidate: 60, tags: ["posts"] }
    );
    cursor = skip.posts.pageInfo.endCursor;
    if (!skip.posts.pageInfo.hasNextPage && i < page - 1) {
      return { posts: [], pageInfo: { hasNextPage: false, hasPreviousPage: true, endCursor: null, startCursor: null }, totalFetched: 0 };
    }
  }

  const result = await getPaginatedPosts(perPage, cursor);
  return { ...result, totalFetched: result.posts.length };
}

export async function searchPosts(query: string): Promise<WPPost[]> {
  const data = await fetchGraphQL<PostsResponse>(
    SEARCH_POSTS,
    { search: query, first: 20 },
    { revalidate: 0 }
  );
  return data.posts.nodes;
}

export async function getPostCount(): Promise<number> {
  const data = await fetchGraphQLSafe<{ postCount: number }>(
    GET_POST_COUNT,
    {},
    { revalidate: 300, tags: ["posts"] }
  );
  return data?.postCount ?? 0;
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const data = await fetchGraphQLSafe<SinglePostResponse>(
    GET_POST_BY_SLUG,
    { slug },
    { revalidate: 60, tags: ["posts"] }
  );
  return data?.post ?? null;
}

/* ---------- Shows ---------- */

export async function getAllShows(): Promise<WPShow[]> {
  const data = await fetchGraphQLSafe<ShowsResponse>(
    GET_ALL_SHOWS,
    {},
    { revalidate: 300, tags: ["shows"] }
  );
  return data?.shows.nodes.filter((s) => s.showActive) ?? [];
}

export async function getShowBySlug(slug: string): Promise<WPShow | null> {
  const data = await fetchGraphQLSafe<SingleShowResponse>(
    GET_SHOW_BY_SLUG,
    { slug },
    { revalidate: 300, tags: ["shows"] }
  );
  return data?.show ?? null;
}

/* ---------- Events ---------- */

export async function getUpcomingEvents(count = 8): Promise<WPEvent[]> {
  const data = await fetchGraphQLSafe<EventsResponse>(
    GET_UPCOMING_EVENTS,
    { first: count },
    { revalidate: 120, tags: ["events"] }
  );
  return data?.events.nodes ?? [];
}

export async function getEventBySlug(slug: string): Promise<WPEvent | null> {
  const data = await fetchGraphQLSafe<SingleEventResponse>(
    GET_EVENT_BY_SLUG,
    { slug },
    { revalidate: 120, tags: ["events"] }
  );
  return data?.event ?? null;
}

/* ---------- Pages ---------- */

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const data = await fetchGraphQLSafe<PageResponse>(
    GET_PAGE_BY_SLUG,
    { slug },
    { revalidate: 300, tags: ["pages"] }
  );
  return data?.page ?? null;
}

/* ---------- Homepage Slider ---------- */

export async function getHomepageSlider(): Promise<SliderSlide[]> {
  const data = await fetchGraphQLSafe<SliderResponse>(
    GET_HOMEPAGE_SLIDER,
    {},
    { revalidate: 300, tags: ["slider"] }
  );
  return data?.homepageSlider ?? [];
}

/* ---------- Advanced Ads ---------- */

export async function getAdGroup(group: string): Promise<AdvancedAd[]> {
  const data = await fetchGraphQLSafe<AdGroupResponse>(
    GET_AD_GROUP,
    { group },
    { revalidate: 120, tags: ["ads"] }
  );
  return data?.adGroup ?? [];
}

/* ---------- Helpers ---------- */

/** Strip HTML tags and clean up WP excerpt strings */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&hellip;/g, "...")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/Published by\s+[\w\s]+from\s+[\w\s.]+Inc\.\s*/i, "")
    .trim();
}

/** Rewrite mix-967.local URLs to localhost:10003 for dev */
export function wpImageUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  return url.replace("http://mix-967.local", process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://localhost:10003");
}

/**
 * Sanitize WP post content:
 * - Rewrite mix-967.local image URLs
 * - Remove the first image/figure if it matches the featured image (avoid duplicate)
 * - Remove empty paragraphs
 * - Fix internal links
 */
export function sanitizeContent(
  html: string,
  featuredImageUrl?: string | null
): string {
  let content = html;

  // Rewrite all WP image URLs
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://localhost:10003";
  content = content.replace(/http:\/\/mix-967\.local/g, wpUrl);

  // Remove the first <figure> if its image matches the featured image
  if (featuredImageUrl) {
    // Extract core filename: "shutterstock_1677948136" from "shutterstock_1677948136-scaled.jpg"
    const baseName = featuredImageUrl
      .replace(/.*\//, "")           // strip path
      .replace(/-scaled/, "")        // strip -scaled
      .replace(/-\d+x\d+/, "")      // strip -1024x683
      .replace(/\.[^.]+$/, "");      // strip extension

    if (baseName) {
      const escaped = baseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Remove the first <figure> containing an <img> with this base name
      content = content.replace(
        new RegExp(`<figure[^>]*>[\\s\\S]*?<img[^>]*${escaped}[^>]*\\/?>\\s*(?:<\\/figure>)`, "i"),
        ""
      );
    }
  }

  // Remove empty paragraphs
  content = content.replace(/<p>\s*<\/p>/g, "");
  content = content.replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, "");

  // Fix internal links: /show/ → /shows/
  content = content.replace(/href="http:\/\/mix-967\.local/g, `href="`);
  content = content.replace(/href="\/show\//g, 'href="/shows/');

  return content;
}
