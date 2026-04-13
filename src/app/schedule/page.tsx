import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import { getAllShows, wpImageUrl } from "@/lib/api";
import type { WPShow, ShowScheduleSlot } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Full Schedule",
  description: "The complete weekly show schedule on Mix 96.7 FM.",
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function SchedulePage() {
  const shows = await getAllShows();
  const schedule = buildWeeklySchedule(shows);

  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <h1
        className="mb-6 font-[family-name:var(--font-display)] font-bold tracking-tight"
        style={{ fontSize: "var(--text-3xl)" }}
      >
        Weekly Schedule
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <BannerAd className="mb-6" />
          {DAYS.map((day) => {
            const daySlots = schedule.get(day);
            if (!daySlots || daySlots.length === 0) return null;

            return (
              <section key={day}>
                <h2
                  className="mb-3 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wide"
                  style={{ color: "var(--color-primary)" }}
                >
                  {day}
                </h2>
                <div
                  className="overflow-hidden rounded-lg border"
                  style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
                >
                  {daySlots.map((slot, i) => {
                    const imgUrl = wpImageUrl(slot.avatarUrl);
                    return (
                      <div
                        key={`${slot.showSlug}-${i}`}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-black/[0.02]"
                        style={i > 0 ? { borderTop: "1px solid oklch(0% 0 0 / 0.04)" } : {}}
                      >
                        {imgUrl ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                            <Image src={imgUrl} alt={slot.showTitle} fill className="object-cover" sizes="40px" />
                          </div>
                        ) : (
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                            style={{ background: "var(--color-surface-sunken)", color: "var(--color-text-muted)" }}
                          >
                            {slot.showTitle.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">
                            <a href={`/shows/${slot.showSlug}`} className="hover:underline">{slot.showTitle}</a>
                          </p>
                        </div>
                        <span
                          className="shrink-0 text-xs font-medium tabular-nums"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {slot.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <BannerAd className="mt-8" />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}

interface DaySlot {
  showTitle: string;
  showSlug: string;
  avatarUrl: string | null;
  time: string;
  startMins: number;
}

function buildWeeklySchedule(shows: WPShow[]): Map<string, DaySlot[]> {
  const map = new Map<string, DaySlot[]>();
  for (const day of DAYS) map.set(day, []);

  for (const show of shows) {
    if (!show.showSchedule) continue;
    let slots: ShowScheduleSlot[];
    try { slots = JSON.parse(show.showSchedule); } catch { continue; }

    for (const slot of slots) {
      if (slot.disabled === "yes") continue;
      const dayArr = map.get(slot.day);
      if (!dayArr) continue;

      const startMins = to24(slot.start_hour, slot.start_min, slot.start_meridian);
      const start = fmtTime(slot.start_hour, slot.start_min, slot.start_meridian);
      const end = fmtTime(slot.end_hour, slot.end_min, slot.end_meridian);

      dayArr.push({
        showTitle: show.title,
        showSlug: show.slug,
        avatarUrl: show.showAvatar || show.featuredImage?.node.sourceUrl || null,
        time: `${start} - ${end}`,
        startMins,
      });
    }
  }

  for (const [, slots] of map) slots.sort((a, b) => a.startMins - b.startMins);
  return map;
}

function to24(h: string, m: string, mer: string): number {
  let hour = parseInt(h, 10);
  if (mer === "am" && hour === 12) hour = 0;
  if (mer === "pm" && hour !== 12) hour += 12;
  return hour * 60 + parseInt(m, 10);
}

function fmtTime(h: string, m: string, mer: string): string {
  return m.padStart(2, "0") === "00" ? `${h}${mer.toUpperCase()}` : `${h}:${m.padStart(2, "0")}${mer.toUpperCase()}`;
}
