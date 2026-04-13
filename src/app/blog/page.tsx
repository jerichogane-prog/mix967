import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import { getPostsPage, getPostCount, searchPosts, stripHtml, wpImageUrl } from "@/lib/api";
import type { WPPost } from "@/types";
import type { Metadata } from "next";

const POSTS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: "News",
  description: "Latest news, music updates, and stories from Mix 96.7 FM.",
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const searchQuery = params.q?.trim() ?? "";

  // Search mode or paginated browse
  let posts: WPPost[];
  let totalPages = 1;
  let hasNextPage = false;

  if (searchQuery) {
    posts = await searchPosts(searchQuery);
    totalPages = 1;
  } else {
    const [result, totalPosts] = await Promise.all([
      getPostsPage(currentPage, POSTS_PER_PAGE),
      getPostCount(),
    ]);
    posts = result.posts;
    hasNextPage = result.pageInfo.hasNextPage;
    totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  }

  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="font-[family-name:var(--font-display)] font-bold tracking-tight"
          style={{ fontSize: "var(--text-3xl)" }}
        >
          {searchQuery ? `Search: "${searchQuery}"` : "Latest News"}
        </h1>
        {searchQuery && (
          <a
            href="/blog"
            className="text-sm font-semibold transition-colors hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Clear search
          </a>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          <BannerAd className="mb-6" />
          {posts.length === 0 ? (
            <p className="py-12 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
              {searchQuery ? `No results found for "${searchQuery}".` : "No posts found."}
            </p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Numbered pagination (only in browse mode) */}
          {!searchQuery && totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} hasNextPage={hasNextPage} />
          )}

          <BannerAd className="mt-8" />
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}

/* ---------- Post row ---------- */

function PostRow({ post }: { post: WPPost }) {
  const category = post.categories.nodes[0];
  const imgUrl = wpImageUrl(post.featuredImage?.node.sourceUrl);

  return (
    <article
      className="group flex flex-col gap-4 border-b pb-6 sm:flex-row"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      {imgUrl && (
        <a href={`/blog/${post.slug}`} className="shrink-0">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg sm:w-48">
            <Image
              src={imgUrl}
              alt={post.featuredImage?.node.altText || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 192px"
            />
          </div>
        </a>
      )}
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
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-base font-bold leading-snug tracking-tight sm:text-lg">
          <a href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </a>
        </h2>
        <p
          className="mt-1 line-clamp-2 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {stripHtml(post.excerpt)}
        </p>
      </div>
    </article>
  );
}

/* ---------- Numbered pagination ---------- */

function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}) {
  // Build page numbers to show: always show first, last, current, and neighbors
  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Blog pagination">
      {/* Prev */}
      {currentPage > 1 ? (
        <PageLink page={currentPage - 1} label="Previous">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="9,2 4,7 9,12" />
          </svg>
        </PageLink>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg opacity-30">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="9,2 4,7 9,12" />
          </svg>
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === null ? (
          <span key={`ellipsis-${i}`} className="flex h-9 w-5 items-center justify-center text-sm" style={{ color: "var(--color-text-muted)" }}>
            ...
          </span>
        ) : (
          <PageLink key={p} page={p} active={p === currentPage}>
            {p}
          </PageLink>
        )
      )}

      {/* Next */}
      {hasNextPage ? (
        <PageLink page={currentPage + 1} label="Next">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="5,2 10,7 5,12" />
          </svg>
        </PageLink>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg opacity-30">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="5,2 10,7 5,12" />
          </svg>
        </span>
      )}
    </nav>
  );
}

function PageLink({
  page,
  active,
  label,
  children,
}: {
  page: number;
  active?: boolean;
  label?: string;
  children: React.ReactNode;
}) {
  const href = page === 1 ? "/blog" : `/blog?page=${page}`;

  return (
    <a
      href={href}
      aria-label={label ?? `Page ${page}`}
      aria-current={active ? "page" : undefined}
      className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2 text-sm font-semibold tabular-nums transition-colors"
      style={{
        background: active ? "var(--color-primary)" : "transparent",
        color: active ? "white" : "var(--color-text-secondary)",
      }}
    >
      {children}
    </a>
  );
}

/** Build array of page numbers with ellipsis (null) for gaps */
function buildPageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | null)[] = [];
  const addPage = (p: number) => { if (!pages.includes(p)) pages.push(p); };

  // Always show first
  addPage(1);

  // Show neighbors of current
  const rangeStart = Math.max(2, current - 1);
  const rangeEnd = Math.min(total - 1, current + 1);

  if (rangeStart > 2) pages.push(null);
  for (let i = rangeStart; i <= rangeEnd; i++) addPage(i);
  if (rangeEnd < total - 1) pages.push(null);

  // Always show last
  addPage(total);

  return pages;
}
