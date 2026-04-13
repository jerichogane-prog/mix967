import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import { getAllShows, wpImageUrl } from "@/lib/api";
import type { WPShow, ShowScheduleSlot } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our DJs & Shows",
  description: "Meet the DJs and shows on Mix 96.7 FM.",
};

export default async function ShowsPage() {
  const shows = await getAllShows();

  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <h1
        className="mb-6 font-[family-name:var(--font-display)] font-bold tracking-tight"
        style={{ fontSize: "var(--text-3xl)" }}
      >
        Our DJs &amp; Shows
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <BannerAd className="mb-6" />
          <div className="grid gap-6 sm:grid-cols-2">
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>

          <BannerAd className="mt-8" />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}

function ShowCard({ show }: { show: WPShow }) {
  const imgUrl = wpImageUrl(show.showAvatar || show.featuredImage?.node.sourceUrl);
  const schedule = getScheduleSummary(show);

  return (
    <Link
      href={`/shows/${show.slug}`}
      className="group flex gap-4 overflow-hidden rounded-xl border p-4 transition-shadow hover:shadow-md"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      {imgUrl ? (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={imgUrl}
            alt={show.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      ) : (
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg text-xl font-bold"
          style={{ background: "var(--color-surface-sunken)", color: "var(--color-text-muted)" }}
        >
          {show.title.charAt(0)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="font-[family-name:var(--font-display)] text-base font-bold tracking-tight">
          {show.title}
        </h2>
        {schedule && (
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            {schedule}
          </p>
        )}
      </div>
    </Link>
  );
}

function getScheduleSummary(show: WPShow): string | null {
  if (!show.showSchedule) return null;
  try {
    const slots: ShowScheduleSlot[] = JSON.parse(show.showSchedule);
    const active = slots.filter((s) => s.disabled !== "yes");
    if (active.length === 0) return null;

    const sample = active[0];
    const days = condenseDays(active.map((s) => s.day));
    const start = fmtTime(sample.start_hour, sample.start_min, sample.start_meridian);
    const end = fmtTime(sample.end_hour, sample.end_min, sample.end_meridian);
    return `${days} (${start} - ${end})`;
  } catch {
    return null;
  }
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
  Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

function condenseDays(days: string[]): string {
  const unique = [...new Set(days)];
  const indices = unique.map((d) => DAY_ORDER.indexOf(d)).sort((a, b) => a - b);
  if (indices.length >= 3 && indices.every((v, i) => i === 0 || v === indices[i - 1] + 1)) {
    return `${DAY_SHORT[DAY_ORDER[indices[0]]]} - ${DAY_SHORT[DAY_ORDER[indices[indices.length - 1]]]}`;
  }
  return unique.map((d) => DAY_SHORT[d] ?? d).join(", ");
}

function fmtTime(h: string, m: string, mer: string): string {
  return m.padStart(2, "0") === "00" ? `${h}${mer.toUpperCase()}` : `${h}:${m.padStart(2, "0")}${mer.toUpperCase()}`;
}
