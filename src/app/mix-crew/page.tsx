import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import { getAllShows, stripHtml, wpImageUrl } from "@/lib/api";
import type { WPShow, ShowScheduleSlot } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mix Crew",
  description:
    "Meet the Mix Crew — the DJs and personalities behind Mix 96.7 FM, Northeast Nevada's #1 hit music station.",
};

export default async function MixCrewPage() {
  const shows = await getAllShows();

  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="mb-8 text-center sm:text-left">
        <h1
          className="font-[family-name:var(--font-display)] font-bold tracking-tight"
          style={{ fontSize: "var(--text-3xl)" }}
        >
          Meet the Mix Crew
        </h1>
        <p
          className="mx-auto mt-2 max-w-lg text-sm leading-relaxed sm:mx-0"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The voices behind Northeast Nevada&apos;s #1 hit music station.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          <BannerAd className="mb-6" />

          {/* Crew grid */}
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
            {shows.map((show) => (
              <CrewCard key={show.id} show={show} />
            ))}
          </div>

          <BannerAd className="mt-8" />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}

function CrewCard({ show }: { show: WPShow }) {
  const imgUrl = wpImageUrl(
    show.showAvatar || show.featuredImage?.node.sourceUrl
  );
  const schedule = getScheduleSummary(show);
  const bio = show.excerpt ? stripHtml(show.excerpt) : null;

  return (
    <Link
      href={`/shows/${show.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      {/* Avatar */}
      {imgUrl ? (
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imgUrl}
            alt={show.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
          />
          {/* Gradient overlay at bottom for text readability */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                "linear-gradient(to top, oklch(0% 0 0 / 0.55), transparent)",
            }}
          />
          {/* Name overlay on image — mobile */}
          <div className="absolute inset-x-0 bottom-0 p-3 sm:hidden">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-bold leading-tight tracking-tight text-white">
              {show.title}
            </h2>
          </div>
        </div>
      ) : (
        <div
          className="flex aspect-square items-center justify-center text-3xl font-bold"
          style={{
            background: "var(--color-surface-sunken)",
            color: "var(--color-text-muted)",
          }}
        >
          {show.title.charAt(0)}
        </div>
      )}

      {/* Info — hidden on small mobile where name overlays the image */}
      <div className="hidden p-3 sm:block sm:p-4">
        <h2 className="font-[family-name:var(--font-display)] text-sm font-bold tracking-tight sm:text-base">
          {show.title}
        </h2>
        {schedule && (
          <p
            className="mt-1 text-xs leading-snug"
            style={{ color: "var(--color-text-muted)" }}
          >
            {schedule}
          </p>
        )}
        {bio && (
          <p
            className="mt-1.5 line-clamp-2 text-xs leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {bio}
          </p>
        )}
      </div>

      {/* Minimal info row on mobile (below image, when no overlay needed for schedule) */}
      <div className="p-2.5 sm:hidden">
        {schedule && (
          <p
            className="text-[11px] leading-snug"
            style={{ color: "var(--color-text-muted)" }}
          >
            {schedule}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ---------- Schedule helpers ---------- */

function getScheduleSummary(show: WPShow): string | null {
  if (!show.showSchedule) return null;
  try {
    const slots: ShowScheduleSlot[] = JSON.parse(show.showSchedule);
    const active = slots.filter((s) => s.disabled !== "yes");
    if (active.length === 0) return null;

    const sample = active[0];
    const days = condenseDays(active.map((s) => s.day));
    const start = fmtTime(
      sample.start_hour,
      sample.start_min,
      sample.start_meridian
    );
    const end = fmtTime(
      sample.end_hour,
      sample.end_min,
      sample.end_meridian
    );
    return `${days}, ${start} - ${end}`;
  } catch {
    return null;
  }
}

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const DAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

function condenseDays(days: string[]): string {
  const unique = [...new Set(days)];
  const indices = unique
    .map((d) => DAY_ORDER.indexOf(d))
    .sort((a, b) => a - b);
  if (
    indices.length >= 3 &&
    indices.every((v, i) => i === 0 || v === indices[i - 1] + 1)
  ) {
    return `${DAY_SHORT[DAY_ORDER[indices[0]]]} - ${DAY_SHORT[DAY_ORDER[indices[indices.length - 1]]]}`;
  }
  return unique.map((d) => DAY_SHORT[d] ?? d).join(", ");
}

function fmtTime(h: string, m: string, mer: string): string {
  return m.padStart(2, "0") === "00"
    ? `${h}${mer.toUpperCase()}`
    : `${h}:${m.padStart(2, "0")}${mer.toUpperCase()}`;
}
