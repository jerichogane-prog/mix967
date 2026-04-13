import Image from "next/image";
import { notFound } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import { getShowBySlug, stripHtml, wpImageUrl, sanitizeContent } from "@/lib/api";
import type { ShowScheduleSlot } from "@/types";
import type { Metadata } from "next";

interface ShowPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ShowPageProps): Promise<Metadata> {
  const { slug } = await params;
  const show = await getShowBySlug(slug);
  if (!show) return { title: "Show Not Found" };
  const description = show.excerpt ? stripHtml(show.excerpt).slice(0, 160) : `Listen to ${show.title} on Mix 96.7 FM`;
  const ogImage = wpImageUrl(show.showAvatar || show.featuredImage?.node.sourceUrl);

  return {
    title: show.title,
    description,
    openGraph: {
      title: `${show.title} | Mix 96.7 FM`,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { slug } = await params;
  const show = await getShowBySlug(slug);

  if (!show) notFound();

  const imgUrl = wpImageUrl(show.showAvatar || show.featuredImage?.node.sourceUrl);

  let scheduleSlots: ShowScheduleSlot[] = [];
  try {
    if (show.showSchedule) scheduleSlots = JSON.parse(show.showSchedule);
  } catch { /* ignore */ }
  const activeSlots = scheduleSlots.filter((s) => s.disabled !== "yes");

  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          {/* Back */}
          <a
            href="/shows"
            className="mb-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            &larr; All Shows
          </a>

          <BannerAd className="mb-6" />

          {/* Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {imgUrl && (
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl">
                <Image src={imgUrl} alt={show.title} fill className="object-cover" sizes="128px" priority />
              </div>
            )}
            <div>
              <h1
                className="font-[family-name:var(--font-display)] font-bold tracking-tight"
                style={{ fontSize: "var(--text-3xl)" }}
              >
                {show.title}
              </h1>
              {activeSlots.length > 0 && (
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {formatSchedule(activeSlots)}
                </p>
              )}
            </div>
          </div>

          {/* Schedule table */}
          {activeSlots.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wide">
                Schedule
              </h2>
              <div
                className="overflow-hidden rounded-lg border"
                style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "var(--color-surface-sunken)" }}>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Day</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "oklch(0% 0 0 / 0.04)" }}>
                    {activeSlots.map((slot, i) => (
                      <tr key={i} className="hover:bg-black/[0.01]">
                        <td className="px-4 py-2.5 font-medium">{slot.day}</td>
                        <td className="px-4 py-2.5" style={{ color: "var(--color-text-secondary)" }}>
                          {fmtTime(slot.start_hour, slot.start_min, slot.start_meridian)} &ndash; {fmtTime(slot.end_hour, slot.end_min, slot.end_meridian)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Content — extract only the biography from WP Radio Station plugin output */}
          {show.content && (() => {
            const bio = extractShowBio(show.content);
            if (!bio) return null;
            return (
              <div
                className="prose mt-8 max-w-none"
                dangerouslySetInnerHTML={{
                  __html: sanitizeContent(bio, show.featuredImage?.node.sourceUrl),
                }}
              />
            );
          })()}

          <BannerAd className="mt-8" />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
  Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

function formatSchedule(slots: ShowScheduleSlot[]): string {
  const days = [...new Set(slots.map((s) => s.day))];
  const indices = days.map((d) => DAY_ORDER.indexOf(d)).sort((a, b) => a - b);
  const sample = slots[0];
  const start = fmtTime(sample.start_hour, sample.start_min, sample.start_meridian);
  const end = fmtTime(sample.end_hour, sample.end_min, sample.end_meridian);

  let dayStr: string;
  if (indices.length >= 3 && indices.every((v, i) => i === 0 || v === indices[i - 1] + 1)) {
    dayStr = `${DAY_SHORT[DAY_ORDER[indices[0]]]} - ${DAY_SHORT[DAY_ORDER[indices[indices.length - 1]]]}`;
  } else {
    dayStr = days.map((d) => DAY_SHORT[d] ?? d).join(", ");
  }
  return `${dayStr}, ${start} - ${end}`;
}

function fmtTime(h: string, m: string, mer: string): string {
  return m.padStart(2, "0") === "00" ? `${h}${mer.toUpperCase()}` : `${h}:${m.padStart(2, "0")}${mer.toUpperCase()}`;
}

/**
 * Extract just the biography text from the Radio Station plugin's HTML output.
 * The plugin wraps everything in a show-content div with avatar, schedule table,
 * buttons, and JavaScript — we only want the description paragraphs.
 */
function extractShowBio(html: string): string | null {
  // Try to extract from <div class="show-desc-content">...</div>
  const descMatch = html.match(/<div[^>]*class="show-desc-content"[^>]*>([\s\S]*?)<\/div>/i);
  if (descMatch) return descMatch[1].trim() || null;

  // Fallback: try <div id="show-description"...>...</div>
  const idMatch = html.match(/<div[^>]*id="show-description"[^>]*>([\s\S]*?)<\/div>/i);
  if (idMatch) return idMatch[1].trim() || null;

  // Last fallback: if content doesn't have the plugin wrapper at all, return as-is
  if (!html.includes("show-content") && !html.includes("show-info")) {
    return html;
  }

  return null;
}
