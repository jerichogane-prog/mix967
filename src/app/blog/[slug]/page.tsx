import Image from "next/image";
import { notFound } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import { getPostBySlug, stripHtml, wpImageUrl, sanitizeContent } from "@/lib/api";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const description = stripHtml(post.excerpt).slice(0, 160);
  const ogImage = wpImageUrl(post.featuredImage?.node.sourceUrl);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.node.name],
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const category = post.categories.nodes[0];
  const imgUrl = wpImageUrl(post.featuredImage?.node.sourceUrl);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: stripHtml(post.excerpt).slice(0, 160),
    datePublished: post.date,
    author: { "@type": "Person", name: post.author.node.name },
    publisher: {
      "@type": "Organization",
      name: "Mix 96.7 FM",
      logo: { "@type": "ImageObject", url: "https://mix967fm.com/wp-content/uploads/2023/04/Logo@2x-768x285-1.png" },
    },
    ...(imgUrl ? { image: imgUrl } : {}),
    mainEntityOfPage: `https://mix967fm.com/blog/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mix967fm.com" },
      { "@type": "ListItem", position: 2, name: "News", item: "https://mix967fm.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Article */}
        <article className="min-w-0 flex-1">
          {/* Back link */}
          <a
            href="/blog"
            className="mb-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            &larr; Back to News
          </a>

          <BannerAd className="mb-6" />

          {/* Meta */}
          <div className="flex items-center gap-3">
            {category && (
              <span
                className="rounded-full px-3 py-1 text-xs font-bold uppercase"
                style={{
                  background: "oklch(60% 0.26 350 / 0.1)",
                  color: "var(--color-primary)",
                }}
              >
                {category.name}
              </span>
            )}
            <time
              dateTime={post.date}
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          {/* Title */}
          <h1
            className="mt-4 font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {post.title}
          </h1>

          {/* Author */}
          <p
            className="mt-3 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            By {post.author.node.name}
          </p>

          {/* Featured image */}
          {imgUrl && (
            <div className="relative mt-6 aspect-[2/1] overflow-hidden rounded-xl">
              <Image
                src={imgUrl}
                alt={post.featuredImage?.node.altText || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 720px"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose mt-8 max-w-none"
            dangerouslySetInnerHTML={{
              __html: sanitizeContent(
                post.content ?? "",
                post.featuredImage?.node.sourceUrl
              ),
            }}
          />

          <BannerAd className="mt-8" />
        </article>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
    </>
  );
}
