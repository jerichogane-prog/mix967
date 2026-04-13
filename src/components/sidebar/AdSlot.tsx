"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { AdvancedAd } from "@/types";
import { wpImageUrl } from "@/lib/api";

/* ============================================
   Ad Slot — displays rotating ads from
   Advanced Ads groups. Auto-rotates through
   the provided ads array.
   ============================================ */

interface AdSlotProps {
  ads?: AdvancedAd[];
  label?: string;
  rotateInterval?: number;
}

export default function AdSlot({
  ads,
  label = "Advertisement",
  rotateInterval = 8000,
}: AdSlotProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const advance = useCallback(() => {
    if (!ads || ads.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % ads.length);
  }, [ads]);

  useEffect(() => {
    if (!ads || ads.length <= 1) return;
    const timer = setInterval(advance, rotateInterval);
    return () => clearInterval(timer);
  }, [advance, ads, rotateInterval]);

  // Fallback placeholder when no ads are loaded
  if (!ads || ads.length === 0) {
    return (
      <div
        className="flex items-center justify-center overflow-hidden rounded-xl border"
        style={{
          borderColor: "oklch(0% 0 0 / 0.06)",
          background: "var(--color-surface-sunken)",
          aspectRatio: "300 / 250",
        }}
      >
        <span
          className="text-[10px] font-medium uppercase tracking-widest"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </span>
      </div>
    );
  }

  const ad = ads[activeIndex];
  const imgUrl = wpImageUrl(ad.imageUrl);

  if (!imgUrl) return null;

  return (
    <div className="overflow-hidden rounded-xl">
      <div
        className="relative text-center text-[9px] uppercase tracking-widest"
        style={{ color: "var(--color-text-muted)" }}
      >
        <span className="mb-1 inline-block">{label}</span>
        <a
          href={ad.linkUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block overflow-hidden rounded-lg transition-opacity hover:opacity-90"
        >
          <Image
            src={imgUrl}
            alt={ad.title.replace(/&#\d+;/g, "")}
            width={ad.width}
            height={ad.height}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 350px"
          />
        </a>
      </div>
    </div>
  );
}
