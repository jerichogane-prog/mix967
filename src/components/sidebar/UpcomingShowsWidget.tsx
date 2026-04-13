/* ============================================
   Show Schedule Widget — full weekly schedule
   built from Radio Station plugin data.
   Groups consecutive days into ranges like
   "Monday - Friday (5AM - 10AM)"
   ============================================ */

import Image from "next/image";
import type { WPShow, ShowScheduleSlot } from "@/types";
import { wpImageUrl } from "@/lib/api";

interface UpcomingShowsWidgetProps {
  shows: WPShow[];
}

export default function UpcomingShowsWidget({ shows }: UpcomingShowsWidgetProps) {
  const schedule = buildFullSchedule(shows);

  if (schedule.length === 0) return null;

  return (
    <div
      className="rounded-xl border"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      <div
        className="border-b px-4 py-3"
        style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
      >
        <h3 className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wide">
          Show Schedule
        </h3>
      </div>
      <ul className="divide-y" style={{ borderColor: "oklch(0% 0 0 / 0.04)" }}>
        {schedule.map((entry) => {
          const imgUrl = wpImageUrl(entry.avatarUrl);

          return (
            <li
              key={`${entry.showSlug}-${entry.dayRange}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-black/[0.02]"
            >
              {imgUrl ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={imgUrl}
                    alt={entry.showTitle}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: "var(--color-surface-sunken)", color: "var(--color-text-muted)" }}
                >
                  {entry.showTitle.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  <a href={`/shows/${entry.showSlug}`} className="hover:underline">
                    {entry.showTitle}
                  </a>
                </p>
                <p
                  className="text-xs leading-snug"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {entry.dayRange} ({entry.timeRange})
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div
        className="border-t px-4 py-2.5"
        style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
      >
        <a
          href="/schedule"
          className="text-xs font-semibold transition-colors hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          Full Schedule &rarr;
        </a>
      </div>
    </div>
  );
}

/* ---------- Schedule helpers ---------- */

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
  Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

interface ScheduleEntry {
  showTitle: string;
  showSlug: string;
  avatarUrl: string | null;
  dayRange: string;
  timeRange: string;
  sortKey: number;
}

function buildFullSchedule(shows: WPShow[]): ScheduleEntry[] {
  const entries: ScheduleEntry[] = [];

  for (const show of shows) {
    if (!show.showSchedule) continue;

    let slots: ShowScheduleSlot[];
    try {
      slots = JSON.parse(show.showSchedule);
    } catch {
      continue;
    }

    // Filter out disabled slots
    const activeSlots = slots.filter((s) => s.disabled !== "yes");
    if (activeSlots.length === 0) continue;

    // Group slots by time (same start/end time)
    const byTime = new Map<string, ShowScheduleSlot[]>();
    for (const slot of activeSlots) {
      const timeKey = `${slot.start_hour}:${slot.start_min}${slot.start_meridian}-${slot.end_hour}:${slot.end_min}${slot.end_meridian}`;
      const group = byTime.get(timeKey) ?? [];
      group.push(slot);
      byTime.set(timeKey, group);
    }

    for (const [, groupSlots] of byTime) {
      const days = groupSlots
        .map((s) => s.day)
        .sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));

      const sample = groupSlots[0];
      const startTime = formatTime(sample.start_hour, sample.start_min, sample.start_meridian);
      const endTime = formatTime(sample.end_hour, sample.end_min, sample.end_meridian);
      const dayRange = condenseDays(days);

      // Sort key: earliest day + earliest start time
      const earliestDay = Math.min(...days.map((d) => DAY_ORDER.indexOf(d)));
      const startMins = to24Minutes(sample.start_hour, sample.start_min, sample.start_meridian);

      entries.push({
        showTitle: show.title,
        showSlug: show.slug,
        avatarUrl: show.showAvatar || show.featuredImage?.node.sourceUrl || null,
        dayRange,
        timeRange: `${startTime} - ${endTime}`,
        sortKey: earliestDay * 1440 + startMins,
      });
    }
  }

  return entries.sort((a, b) => a.sortKey - b.sortKey);
}

/** Condense ["Monday","Tuesday","Wednesday","Thursday","Friday"] → "Mon - Fri" */
function condenseDays(days: string[]): string {
  if (days.length === 0) return "";
  if (days.length === 1) return days[0];

  const indices = days.map((d) => DAY_ORDER.indexOf(d)).sort((a, b) => a - b);

  // Check if consecutive
  const isConsecutive = indices.every((val, i) =>
    i === 0 || val === indices[i - 1] + 1
  );

  if (isConsecutive && days.length >= 3) {
    return `${DAY_SHORT[DAY_ORDER[indices[0]]]} - ${DAY_SHORT[DAY_ORDER[indices[indices.length - 1]]]}`;
  }

  // Check for weekdays (Mon-Fri)
  if (
    indices.length === 5 &&
    indices[0] === 0 && indices[4] === 4
  ) {
    return "Mon - Fri";
  }

  // Check Mon-Sat
  if (
    indices.length === 6 &&
    indices[0] === 0 && indices[5] === 5
  ) {
    return "Mon - Sat";
  }

  // Non-consecutive: list them
  return days.map((d) => DAY_SHORT[d] ?? d).join(", ");
}

function to24Minutes(hour: string, min: string, meridian: string): number {
  let h = parseInt(hour, 10);
  const m = parseInt(min, 10);
  if (meridian === "am" && h === 12) h = 0;
  if (meridian === "pm" && h !== 12) h += 12;
  return h * 60 + m;
}

function formatTime(hour: string, min: string, meridian: string): string {
  const m = min.padStart(2, "0");
  if (m === "00") {
    return `${hour}${meridian.toUpperCase()}`;
  }
  return `${hour}:${m}${meridian.toUpperCase()}`;
}
