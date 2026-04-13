"use client";

/* ============================================
   Events Widget — sidebar with toggle between
   compact list view and mini calendar view.
   ============================================ */

import { useState, useMemo } from "react";
import type { WPEvent } from "@/types";
import { stripHtml } from "@/lib/api";

interface EventsWidgetProps {
  events: WPEvent[];
}

export default function EventsWidget({ events }: EventsWidgetProps) {
  const [view, setView] = useState<"list" | "calendar">("list");

  if (events.length === 0) return null;

  return (
    <div
      className="rounded-xl border"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      {/* Header with toggle */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
      >
        <h3 className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wide">
          Upcoming Events
        </h3>
        <div
          className="flex overflow-hidden rounded-md border"
          style={{ borderColor: "oklch(0% 0 0 / 0.1)" }}
        >
          <ToggleButton active={view === "list"} onClick={() => setView("list")} label="List view">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="1" y1="3" x2="13" y2="3" />
              <line x1="1" y1="7" x2="13" y2="7" />
              <line x1="1" y1="11" x2="13" y2="11" />
            </svg>
          </ToggleButton>
          <ToggleButton active={view === "calendar"} onClick={() => setView("calendar")} label="Calendar view">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="1" y="2" width="12" height="10.5" rx="1.5" />
              <line x1="1" y1="5.5" x2="13" y2="5.5" />
              <line x1="4.5" y1="0.5" x2="4.5" y2="3.5" />
              <line x1="9.5" y1="0.5" x2="9.5" y2="3.5" />
            </svg>
          </ToggleButton>
        </div>
      </div>

      {/* Content */}
      {view === "list" ? (
        <ListView events={events} />
      ) : (
        <CalendarView events={events} />
      )}

      <div
        className="border-t px-4 py-2.5"
        style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
      >
        <a
          href="/events"
          className="text-xs font-semibold transition-colors hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          All Events &rarr;
        </a>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center transition-colors"
      style={{
        background: active ? "var(--color-primary)" : "transparent",
        color: active ? "white" : "var(--color-text-muted)",
      }}
    >
      {children}
    </button>
  );
}

/* ---------- List View ---------- */

function ListView({ events }: { events: WPEvent[] }) {
  return (
    <ul className="divide-y" style={{ borderColor: "oklch(0% 0 0 / 0.04)" }}>
      {events.map((event) => {
        const date = event.startDate ? new Date(event.startDate) : null;
        const month = date ? date.toLocaleDateString("en-US", { month: "short" }) : "";
        const day = date ? String(date.getDate()) : "";

        return (
          <li
            key={event.id}
            className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-black/[0.02]"
          >
            {date && (
              <div
                className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg"
                style={{ background: "var(--color-primary)", color: "white" }}
              >
                <span className="text-[10px] font-semibold uppercase leading-none">{month}</span>
                <span className="text-base font-bold leading-none">{day}</span>
              </div>
            )}
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold leading-tight">
                <a href={`/events/${event.slug}`} className="hover:underline">{event.title}</a>
              </p>
              {event.venueName && (
                <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {stripHtml(event.venueName)}{event.venueCity ? `, ${event.venueCity}` : ""}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Calendar View ---------- */

function CalendarView({ events }: { events: WPEvent[] }) {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const eventsByDay = useMemo(() => {
    const map = new Map<string, WPEvent[]>();
    for (const event of events) {
      if (!event.startDate) continue;
      const d = new Date(event.startDate);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) ?? [];
      arr.push(event);
      map.set(key, arr);
    }
    return map;
  }, [events]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="px-3 py-3">
      {/* Month nav */}
      <div className="mb-2 flex items-center justify-between">
        <button onClick={prevMonth} aria-label="Previous month" className="flex h-6 w-6 items-center justify-center rounded hover:bg-black/[0.04]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="8,1 3,6 8,11" /></svg>
        </button>
        <span className="text-xs font-semibold">{monthLabel}</span>
        <button onClick={nextMonth} aria-label="Next month" className="flex h-6 w-6 items-center justify-center rounded hover:bg-black/[0.04]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="4,1 9,6 4,11" /></svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center text-[10px] font-semibold" style={{ color: "var(--color-text-muted)" }}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="py-1">{d}</span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 text-center text-xs">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e-${i}`} />;

          const key = `${viewYear}-${viewMonth}-${day}`;
          const hasEvents = eventsByDay.has(key);
          const isToday = day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();

          return (
            <span
              key={i}
              className="relative flex h-8 items-center justify-center rounded-md transition-colors"
              style={{
                fontWeight: hasEvents ? 700 : 400,
                background: isToday ? "var(--color-primary)" : hasEvents ? "oklch(60% 0.26 350 / 0.08)" : "transparent",
                color: isToday ? "white" : hasEvents ? "var(--color-primary)" : "var(--color-text-secondary)",
              }}
            >
              {day}
              {hasEvents && !isToday && (
                <span
                  className="absolute bottom-1 h-1 w-1 rounded-full"
                  style={{ background: "var(--color-primary)" }}
                />
              )}
            </span>
          );
        })}
      </div>

      {/* Events this month - compact list */}
      {(() => {
        const monthEvents = events.filter((e) => {
          if (!e.startDate) return false;
          const d = new Date(e.startDate);
          return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
        });
        if (monthEvents.length === 0) return null;
        return (
          <ul className="mt-3 space-y-1.5 border-t pt-3" style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}>
            {monthEvents.slice(0, 4).map((event) => {
              const d = event.startDate ? new Date(event.startDate) : null;
              return (
                <li key={event.id} className="flex items-center gap-2 text-xs">
                  {d && (
                    <span className="w-8 shrink-0 font-semibold tabular-nums" style={{ color: "var(--color-primary)" }}>
                      {d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).replace(" ", "\u00A0")}
                    </span>
                  )}
                  <a href={`/events/${event.slug}`} className="truncate font-medium hover:underline">{event.title}</a>
                </li>
              );
            })}
          </ul>
        );
      })()}
    </div>
  );
}
