import Image from "next/image";
import { notFound } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import { getEventBySlug, stripHtml, wpImageUrl, sanitizeContent } from "@/lib/api";
import type { Metadata } from "next";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.excerpt ? stripHtml(event.excerpt).slice(0, 160) : `${event.title} — Mix 96.7 FM`,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const imgUrl = wpImageUrl(event.featuredImage?.node.sourceUrl);
  const startDate = event.startDate ? new Date(event.startDate) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;

  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          {/* Back */}
          <a
            href="/events"
            className="mb-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            &larr; All Events
          </a>

          <BannerAd className="mb-6" />

          {/* Title */}
          <h1
            className="font-[family-name:var(--font-display)] font-bold tracking-tight"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {event.title}
          </h1>

          {/* Date & Venue info */}
          <div
            className="mt-4 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:gap-6"
            style={{ borderColor: "oklch(0% 0 0 / 0.08)", background: "var(--color-surface-sunken)" }}
          >
            {startDate && (
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "var(--color-primary)" }}>
                  <rect x="2" y="3" width="12" height="11" rx="1.5" />
                  <line x1="2" y1="6.5" x2="14" y2="6.5" />
                  <line x1="5" y1="1" x2="5" y2="4" />
                  <line x1="11" y1="1" x2="11" y2="4" />
                </svg>
                <span className="text-sm font-medium">
                  {startDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
            )}
            {startDate && endDate && (() => {
              const startTime = startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
              const endTime = endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
              if (startTime === "12:00 AM" && endTime === "11:59 PM") return null;
              return (
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "var(--color-primary)" }}>
                    <circle cx="8" cy="8" r="6" />
                    <polyline points="8,4 8,8 11,10" />
                  </svg>
                  <span className="text-sm">{startTime} &ndash; {endTime}</span>
                </div>
              );
            })()}
            {event.venueName && (
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "var(--color-primary)" }}>
                  <path d="M8 1C5.2 1 3 3.2 3 6c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5z" />
                  <circle cx="8" cy="6" r="1.5" />
                </svg>
                <span className="text-sm">
                  {stripHtml(event.venueName)}{event.venueCity ? `, ${event.venueCity}` : ""}
                </span>
              </div>
            )}
          </div>

          {/* Featured image */}
          {imgUrl && (
            <div className="relative mt-6 aspect-[2/1] overflow-hidden rounded-xl">
              <Image src={imgUrl} alt={event.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 720px" />
            </div>
          )}

          {/* Content */}
          {event.content && (
            <div
              className="prose mt-8 max-w-none"
              dangerouslySetInnerHTML={{
                __html: sanitizeContent(event.content, event.featuredImage?.node.sourceUrl),
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
