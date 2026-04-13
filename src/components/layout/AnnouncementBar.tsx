"use client";

import { useEffect, useState } from "react";

/* ============================================
   Announcement Bar — scrolling ticker at the
   very top of the page. Contests, breaking
   news, promos. Classic radio station feel.
   ============================================ */

const ANNOUNCEMENTS = [
  "Win tickets to Summer Fest 2026 — Listen for the cue to call!",
  "New Show Alert: The Afternoon Vibe starts Monday at 2 PM",
  "Download the Mix 967 App — Available on iOS & Android",
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative z-50 overflow-hidden"
      style={{
        background: "var(--gradient-brand)",
        color: "var(--color-text-inverse)",
      }}
    >
      <div className="mx-auto flex h-9 max-w-[var(--content-wide)] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-hidden">
          <span
            className="shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{
              background: "oklch(100% 0 0 / 0.2)",
            }}
          >
            Hot
          </span>
          <p
            className="truncate text-xs font-medium transition-opacity duration-300"
            key={currentIndex}
          >
            {ANNOUNCEMENTS[currentIndex]}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-1 sm:flex">
          {ANNOUNCEMENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Announcement ${i + 1}`}
              className="h-1.5 w-1.5 rounded-full transition-opacity"
              style={{
                background: "var(--color-text-inverse)",
                opacity: i === currentIndex ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
