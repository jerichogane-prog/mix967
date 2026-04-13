import Image from "next/image";
import Link from "next/link";
import FeaturedSlider from "@/components/ui/FeaturedSlider";
import Sidebar from "@/components/layout/Sidebar";
import AdSlot from "@/components/sidebar/AdSlot";
import { getRecentPosts, getAllShows, getHomepageSlider, getAdGroup, stripHtml, wpImageUrl } from "@/lib/api";
import type { WPPost, WPShow } from "@/types";

/* ============================================
   Homepage — Blog / Editorial Layout

   Classic radio station structure:
   - Featured slider at top (full width)
   - Two-column layout: main content + sidebar
   - Main: blog posts grid, trending stories
   - Sidebar: now playing, schedule, events, ads
   ============================================ */

export default async function Home() {
  const [posts, shows, sliderSlides, bannerAds] = await Promise.all([
    getRecentPosts(9),
    getAllShows(),
    getHomepageSlider(),
    getAdGroup("home-page-group"),
  ]);

  const leadPost = posts[0] ?? null;
  const gridPosts = posts.slice(1, 5);
  const trendingPosts = posts.slice(1, 6);

  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 sm:px-6">
      {/* Two-column layout */}
      <div className="flex flex-col gap-8 py-5 pb-12 lg:flex-row">
        {/* ======= MAIN CONTENT ======= */}
        <div className="min-w-0 flex-1">
          {/* SEO H1 — visually hidden but present for crawlers */}
          <h1 className="sr-only">
            Mix 96.7 FM — Northeast Nevada&apos;s #1 Hit Music Station
          </h1>

          {/* Featured Slider — inside main column */}
          <div className="mb-6">
            <FeaturedSlider slides={sliderSlides} />
          </div>

          {/* Ad — leaderboard banner */}
          <div className="mt-8">
            <AdSlot ads={bannerAds} label="Advertisement" />
          </div>

          {/* Latest News / Blog */}
          <section className="mt-8">
            <SectionHeader title="Latest News" href="/blog" />

            {/* Lead story — large card */}
            {leadPost && <LeadStory post={leadPost} />}

            {/* Post grid — 2 columns */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {gridPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Load more */}
            <div className="mt-6 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-black/[0.03]"
                style={{ borderColor: "oklch(0% 0 0 / 0.12)" }}
              >
                More News &rarr;
              </Link>
            </div>
          </section>

          {/* Trending Section */}
          <section className="mt-10">
            <SectionHeader title="Trending" />
            <div className="space-y-0 divide-y" style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}>
              {trendingPosts.map((post, i) => (
                <TrendingRow key={post.id} index={i + 1} post={post} />
              ))}
            </div>
          </section>

          {/* Ad — leaderboard banner */}
          <div className="mt-8">
            <AdSlot ads={bannerAds} label="Advertisement" />
          </div>

          {/* Featured Video */}
          <section className="mt-10">
            <SectionHeader title="Watch" />
            <div
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
            >
              <div className="relative aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/uh95BL-Gi2o"
                  title="Mix 96.7 FM Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-none"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          {/* Shows Section */}
          {shows.length > 0 && (
            <section className="mt-10">
              <SectionHeader title="Mix Crew" href="/mix-crew" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {shows.slice(0, 6).map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ======= SIDEBAR ======= */}
        <Sidebar />
      </div>
    </div>
  );
}

/* ============================================
   Sub-components
   ============================================ */

function SectionHeader({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  return (
    <div
      className="mb-4 flex items-center justify-between border-b pb-3"
      style={{ borderColor: "oklch(0% 0 0 / 0.08)" }}
    >
      <h2 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-wide">
        <span
          className="mr-2 inline-block h-4 w-1 rounded-full"
          style={{ background: "var(--color-primary)" }}
        />
        {title}
      </h2>
      {href && (
        <a
          href={href}
          className="text-xs font-semibold transition-colors hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          View All &rarr;
        </a>
      )}
    </div>
  );
}

function LeadStory({ post }: { post: WPPost }) {
  const category = post.categories.nodes[0];
  const imgUrl = wpImageUrl(post.featuredImage?.node.sourceUrl);

  return (
    <article
      className="group overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      {imgUrl ? (
        <div className="relative aspect-[2/1] sm:aspect-[5/2] overflow-hidden">
          <Image
            src={imgUrl}
            alt={post.featuredImage?.node.altText || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 700px"
            priority
          />
        </div>
      ) : (
        <div
          className="aspect-[2/1] sm:aspect-[5/2]"
          style={{ background: "var(--color-surface-sunken)" }}
        />
      )}
      <div className="p-5">
        <div className="flex items-center gap-2">
          {category && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase"
              style={{
                background: "oklch(60% 0.26 350 / 0.1)",
                color: "var(--color-primary)",
              }}
            >
              {category.name}
            </span>
          )}
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {formatDate(post.date)}
          </span>
        </div>
        <h3
          className="mt-2 font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight"
          style={{ fontSize: "var(--text-xl)" }}
        >
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p
          className="mt-2 line-clamp-2 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {stripHtml(post.excerpt)}
        </p>
      </div>
    </article>
  );
}

function PostCard({ post }: { post: WPPost }) {
  const category = post.categories.nodes[0];
  const imgUrl = wpImageUrl(post.featuredImage?.node.sourceUrl);

  return (
    <article
      className="group overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      {imgUrl ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={imgUrl}
            alt={post.featuredImage?.node.altText || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 340px"
          />
        </div>
      ) : (
        <div
          className="aspect-[16/10]"
          style={{ background: "var(--color-surface-sunken)" }}
        />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2">
          {category && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: "var(--color-primary)" }}
            >
              {category.name}
            </span>
          )}
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            {formatDate(post.date)}
          </span>
        </div>
        <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-sm font-bold leading-tight tracking-tight">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p
          className="mt-1 line-clamp-2 text-xs leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {stripHtml(post.excerpt)}
        </p>
      </div>
    </article>
  );
}

function TrendingRow({ index, post }: { index: number; post: WPPost }) {
  const category = post.categories.nodes[0];
  const imgUrl = wpImageUrl(post.featuredImage?.node.sourceUrl);

  return (
    <article className="flex items-center gap-4 py-3 transition-colors hover:bg-black/[0.01]">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-display)] text-sm font-bold"
        style={{
          background: "var(--color-surface-sunken)",
          color: "var(--color-text-muted)",
        }}
      >
        {String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {category && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: "var(--color-primary)" }}
            >
              {category.name}
            </span>
          )}
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            {formatDate(post.date)}
          </span>
        </div>
        <h3 className="truncate text-sm font-semibold">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
      </div>
      {imgUrl && (
        <div className="relative hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg sm:block">
          <Image
            src={imgUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      )}
    </article>
  );
}

function ShowCard({ show }: { show: WPShow }) {
  const imgUrl = wpImageUrl(show.showAvatar || show.featuredImage?.node.sourceUrl);

  return (
    <Link
      href={`/shows/${show.slug}`}
      className="group block overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      {imgUrl ? (
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imgUrl}
            alt={show.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 220px"
          />
        </div>
      ) : (
        <div
          className="flex aspect-square items-center justify-center text-2xl font-bold"
          style={{ background: "var(--color-surface-sunken)", color: "var(--color-text-muted)" }}
        >
          {show.title.charAt(0)}
        </div>
      )}
      <div className="p-2 sm:p-3">
        <h3 className="font-[family-name:var(--font-display)] text-xs font-bold tracking-tight sm:text-sm">
          {show.title}
        </h3>
      </div>
    </Link>
  );
}

/* ---------- Utilities ---------- */

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
