"use client";

import { useCallback, useEffect, useState } from "react";
import type { NowPlaying } from "@/types";

/* ============================================
   Now Playing Widget — sidebar card showing
   current track + animated visualizer bars.
   ============================================ */

const METADATA_POLL_INTERVAL = 15_000;

export default function NowPlayingWidget() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  const fetchMetadata = useCallback(async () => {
    try {
      const res = await fetch("/api/now-playing", { cache: "no-store" });
      if (res.ok) {
        const data: NowPlaying = await res.json();
        if (data.title) setNowPlaying(data);
      }
    } catch {
      /* non-critical */
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, METADATA_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchMetadata]);

  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{ background: "var(--gradient-brand)" }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(100% 0 0 / 0.8)" }}
            >
              On Air Now
            </span>
          </div>
          {/* Visualizer bars */}
          <div className="flex items-end gap-[3px]">
            {[12, 18, 10, 15, 8].map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-white/60"
                style={{
                  height: `${h}px`,
                  animation: `barBounce ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-lg font-bold leading-tight text-white">
            {nowPlaying?.title || "Mix 967 FM"}
          </p>
          <p className="mt-1 text-xs text-white/60">
            {nowPlaying?.title ? "Now Playing" : "Tune in to listen"}
          </p>
        </div>

        <button
          onClick={() => {
            // Trigger the global radio player's play button
            const playerBtn = document.querySelector<HTMLButtonElement>(
              "[aria-label='Play radio'], [aria-label='Pause radio']"
            );
            if (playerBtn) {
              playerBtn.click();
              playerBtn.scrollIntoView({ behavior: "smooth", block: "end" });
            }
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "oklch(100% 0 0 / 0.2)",
            color: "white",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M3 1L12 7L3 13V1Z" />
          </svg>
          Listen Live
        </button>
      </div>

      <style>{`
        @keyframes barBounce {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
