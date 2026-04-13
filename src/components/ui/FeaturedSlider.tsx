"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SliderSlide } from "@/types";
import { wpImageUrl } from "@/lib/api";

/* ============================================
   Featured Slider — hero-width image slider
   pulled from the Slide Anything plugin in WP.
   Smooth crossfade transitions, auto-advances,
   dot + arrow navigation.
   ============================================ */

interface FeaturedSliderProps {
  slides: SliderSlide[];
}

export default function FeaturedSlider({ slides }: FeaturedSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const goTo = useCallback(
    (next: number) => {
      if (slides.length === 0 || next === activeIndex || isTransitioning) return;
      setPrevIndex(activeIndex);
      setActiveIndex(next);
      setIsTransitioning(true);

      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      transitionTimer.current = setTimeout(() => {
        setPrevIndex(null);
        setIsTransitioning(false);
      }, 500);
    },
    [activeIndex, slides.length, isTransitioning]
  );

  const advance = useCallback(() => {
    if (slides.length === 0) return;
    goTo((activeIndex + 1) % slides.length);
  }, [activeIndex, slides.length, goTo]);

  const goBack = useCallback(() => {
    if (slides.length === 0) return;
    goTo((activeIndex - 1 + slides.length) % slides.length);
  }, [activeIndex, slides.length, goTo]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(advance, 4500);
    return () => clearInterval(timer);
  }, [advance, slides.length, isPaused]);

  useEffect(() => {
    return () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, []);

  if (slides.length === 0) return null;

  return (
    <div
      className="group relative overflow-hidden rounded-xl"
      style={{ background: "var(--color-surface-sunken)" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide layers — crossfade */}
      <div className="relative aspect-[16/9] sm:aspect-[1000/563] w-full">
        {/* Outgoing slide (fading out) */}
        {prevIndex !== null && (
          <SlideImage
            slide={slides[prevIndex]}
            className="opacity-0 transition-opacity duration-500"
          />
        )}

        {/* Active slide (fading in) */}
        <SlideImage
          slide={slides[activeIndex]}
          className={
            isTransitioning
              ? "opacity-100 transition-opacity duration-500"
              : "opacity-100"
          }
          priority={activeIndex === 0}
        />
      </div>

      {/* Arrow navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goBack}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            style={{ background: "oklch(0% 0 0 / 0.5)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <polyline points="10,2 4,8 10,14" />
            </svg>
          </button>
          <button
            onClick={advance}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            style={{ background: "oklch(0% 0 0 / 0.5)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <polyline points="6,2 12,8 6,14" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? "1.5rem" : "0.5rem",
                background:
                  i === activeIndex
                    ? "white"
                    : "oklch(100% 0 0 / 0.4)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SlideImage({
  slide,
  className = "",
  priority = false,
}: {
  slide: SliderSlide;
  className?: string;
  priority?: boolean;
}) {
  const imgUrl = wpImageUrl(slide.imageUrl);
  if (!imgUrl) return null;

  return (
    <SlideLink href={slide.linkUrl} target={slide.linkTarget}>
      <div className={`absolute inset-0 ${className}`}>
        <Image
          src={imgUrl}
          alt={slide.altText || ""}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority={priority}
        />
      </div>
    </SlideLink>
  );
}

function SlideLink({
  href,
  target,
  children,
}: {
  href: string | null;
  target: string;
  children: React.ReactNode;
}) {
  if (!href) return <>{children}</>;

  // Rewrite internal WP links to Next.js routes
  const finalHref = href
    .replace(/https?:\/\/mix-967\.local/, "")
    .replace(/\/show\//, "/shows/");

  return (
    <a href={finalHref} target={target === "_blank" ? "_blank" : undefined} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  );
}
