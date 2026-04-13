"use client";

/* ============================================
   Events Page Content — full-page events with
   toggle between list view and calendar view.
   ============================================ */

import { useState, useMemo } from "react";
import type { WPEvent } from "@/types";
import { stripHtml } from "@/lib/api";

interface Props {
  events: WPEvent[];
}

export default function EventsPageContent({ events }: Props) {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div>
      {/* Header + toggle */}
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="font-[family-name:var(--font-display)] font-bold tracking-tight"
          style={{ fontSize: "var(--text-3xl)" }}
        >
          Events
        </h1>
        <div
          className="flex overflow-hidden rounded-lg border"
          style={{ borderColor: "oklch(0% 0 0 / 0.1)" }}
        >
          <ToggleBtn active={view === "list"} onClick={() => setView("list")} label="List view">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="1" y1="3" x2="15" y2="3" /><line x1="1" y1="8" x2="15" y2="8" /><line x1="1" y1="13" x2="15" y2="13" />
            </svg>
            <span className="hidden sm:inline">List</span>
          </ToggleBtn>
          <ToggleBtn active={view === "calendar"} onClick={() => setView("calendar")} label="Calendar view">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="1" y="2.5" width="14" height="12" rx="1.5" /><line x1="1" y1="6.5" x2="15" y2="6.5" /><line x1="5" y1="0.5" x2="5" y2="4.5" /><line x1="11" y1="0.5" x2="11" y2="4.5" />
            </svg>
            <span className="hidden sm:inline">Calendar</span>
          </ToggleBtn>
        </div>
      </div>

      {view === "list" ? <EventList events={events} /> : <EventCalendar events={events} />}
    </div>
  );
}

function ToggleBtn({
  active, onClick, label, children,
}: {
  active: boolean; onClick: () => void; label: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors"
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

function EventList({ events }: { events: WPEvent[] }) {
  return (
    <div className="space-y-0 divide-y" style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}>
      {events.map((event) => {
        const date = event.startDate ? new Date(event.startDate) : null;
        return (
          <article key={event.id} className="flex items-start gap-4 py-4 transition-colors hover:bg-black/[0.01]">
            {date && (
              <div
                className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg"
                style={{ background: "var(--color-primary)", color: "white" }}
              >
                <span className="text-[10px] font-semibold uppercase leading-none">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="text-lg font-bold leading-none">{date.getDate()}</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="font-[family-name:var(--font-display)] text-base font-bold tracking-tight">
                <a href={`/events/${event.slug}`} className="hover:underline">{event.title}</a>
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                {date && (
                  <span>{date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                )}
                {event.startDate && event.endDate && (() => {
                  const s = new Date(event.startDate!);
                  const e = new Date(event.endDate!);
                  const st = s.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                  const et = e.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                  if (st === "12:00 AM" && et === "11:59 PM") return null;
                  return <span>{st} &ndash; {et}</span>;
                })()}
              </div>
              {event.venueName && (
                <p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {stripHtml(event.venueName)}{event.venueCity ? `, ${event.venueCity}` : ""}
                </p>
              )}
            </div>
          </article>
        );
      })}
      {events.length === 0 && (
        <p className="py-12 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
          No upcoming events at this time.
        </p>
      )}
    </div>
  );
}

/* ---------- Calendar View ---------- */

function EventCalendar({ events }: { events: WPEvent[] }) {
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

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Events for current month
  const monthEvents = events.filter((e) => {
    if (!e.startDate) return false;
    const d = new Date(e.startDate);
    return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
  });

  return (
    <div>
      {/* Month nav */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} aria-label="Previous month" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/[0.04]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9,1 4,7 9,13" /></svg>
        </button>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold">{monthLabel}</h2>
        <button onClick={nextMonth} aria-label="Next month" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/[0.04]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="5,1 10,7 5,13" /></svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d} className="py-2">{d}</span>
        ))}
      </div>

      {/* Days grid */}
      <div
        className="grid grid-cols-7 border-t border-l"
        style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
      >
        {cells.map((day, i) => {
          const key = day ? `${viewYear}-${viewMonth}-${day}` : null;
          const dayEvents = key ? eventsByDay.get(key) ?? [] : [];
          const isToday = day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();

          return (
            <div
              key={i}
              className="min-h-[4.5rem] border-b border-r p-1.5 sm:min-h-[5.5rem]"
              style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
            >
              {day !== null && (
                <>
                  <span
                    className="mb-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
                    style={{
                      background: isToday ? "var(--color-primary)" : "transparent",
                      color: isToday ? "white" : "var(--color-text-secondary)",
                    }}
                  >
                    {day}
                  </span>
                  {dayEvents.slice(0, 2).map((ev) => (
                    <a
                      key={ev.id}
                      href={`/events/${ev.slug}`}
                      className="mb-0.5 block truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight transition-colors hover:opacity-80"
                      style={{ background: "oklch(60% 0.26 350 / 0.1)", color: "var(--color-primary)" }}
                    >
                      {ev.title}
                    </a>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="px-1 text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Below-calendar list for the month */}
      {monthEvents.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wide">
            Events in {new Date(viewYear, viewMonth).toLocaleDateString("en-US", { month: "long" })}
          </h3>
          <div className="space-y-0 divide-y" style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}>
            {monthEvents.map((event) => {
              const d = event.startDate ? new Date(event.startDate) : null;
              return (
                <div key={event.id} className="flex items-center gap-3 py-3">
                  {d && (
                    <div
                      className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg"
                      style={{ background: "var(--color-primary)", color: "white" }}
                    >
                      <span className="text-[9px] font-semibold uppercase leading-none">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                      <span className="text-sm font-bold leading-none">{d.getDate()}</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <a href={`/events/${event.slug}`} className="text-sm font-semibold hover:underline">{event.title}</a>
                    {event.venueName && (
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {stripHtml(event.venueName)}{event.venueCity ? `, ${event.venueCity}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
