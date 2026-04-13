import { notFound, redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import { getPageBySlug, getPostBySlug, sanitizeContent } from "@/lib/api";
import type { Metadata } from "next";

interface WPPageProps {
  params: Promise<{ slug: string }>;
}

/* Prevent this catch-all from intercepting known routes */
const RESERVED_SLUGS = new Set([
  "blog", "shows", "events", "schedule", "api",
  "contests", "vip-listener", "advertise", "contact-us", "thank-you",
]);

/* Game pages render full-width with no sidebar */
const GAME_SLUGS = new Set([
  "solitaire", "mahjong", "galaga", "pong", "wordle",
  "wings-io", "qbert", "pacman", "space-invaders", "minesweeper",
]);

export async function generateMetadata({ params }: WPPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return {};
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Page Not Found" };
  return { title: page.title };
}

export default async function WPPage({ params }: WPPageProps) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) notFound();

  const page = await getPageBySlug(slug);

  // If not a page, check if it's a post — redirect to /blog/{slug} for SEO
  if (!page) {
    const post = await getPostBySlug(slug);
    if (post) {
      redirect(`/blog/${slug}`);
    }
    notFound();
  }

  const isGame = GAME_SLUGS.has(slug);

  // Game pages: full-width iframe, no sidebar
  if (isGame) {
    return (
      <div className="mx-auto max-w-[var(--content-wide)] px-4 py-6 sm:px-6">
        <h1
          className="mb-4 font-[family-name:var(--font-display)] font-bold tracking-tight"
          style={{ fontSize: "var(--text-2xl)" }}
        >
          {page.title}
        </h1>

        <BannerAd className="mb-4" />

        {page.content && (
          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: "oklch(0% 0 0 / 0.08)" }}
            dangerouslySetInnerHTML={{
              __html: sanitizeContent(page.content, page.featuredImage?.node.sourceUrl)
                .replace(/width="[^"]*"/, 'width="100%"')
                .replace(/height="[^"]*"/, 'height="800"')
                .replace("<iframe", '<iframe style="border:none;display:block;width:100%;min-height:80vh"'),
            }}
          />
        )}

        <BannerAd className="mt-4" />
      </div>
    );
  }

  // Regular WP pages: sidebar layout with banner ads
  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <h1
            className="mb-6 font-[family-name:var(--font-display)] font-bold tracking-tight"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {page.title}
          </h1>

          <BannerAd className="mb-6" />

          {page.content && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: sanitizeContent(page.content, page.featuredImage?.node.sourceUrl),
              }}
            />
          )}

          <BannerAd className="mt-8" />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
