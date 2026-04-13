"use client";

import { useEffect, useState, useRef } from "react";

const FACEBOOK_PAGE_ID = "228142220552558";
const TWITTER_HANDLE = "elkosmix967";

export default function SidebarSocialFeeds() {
  return (
    <div className="space-y-6">
      <FacebookFeed />
      <TwitterFeed />
    </div>
  );
}

/* ---------- Facebook Page Plugin ---------- */

function FacebookFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const parse = () => {
      if (window.FB && containerRef.current) {
        window.FB.XFBML.parse(containerRef.current);
        setRendered(true);
      }
    };

    if (!document.getElementById("fb-sdk")) {
      const script = document.createElement("script");
      script.id = "fb-sdk";
      script.src =
        "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onload = parse;
      document.body.appendChild(script);
    } else {
      parse();
    }
  }, []);

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      <div
        className="flex items-center gap-2 border-b px-4 py-3"
        style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: "#1877F2" }}
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <h3 className="font-[family-name:var(--font-display)] text-sm font-bold">
          Facebook
        </h3>
      </div>

      {/* Skeleton — shown until SDK renders */}
      {!rendered && (
        <div
          className="flex min-h-[400px] items-center justify-center"
          style={{ background: "var(--color-surface-raised)" }}
        >
          <FeedSkeleton platform="Facebook" />
        </div>
      )}

      {/* Embed container — always in DOM for SDK to find, but hidden until ready */}
      <div
        ref={containerRef}
        className={rendered ? "overflow-hidden" : "h-0 overflow-hidden"}
      >
        <div
          className="fb-page"
          data-href={`https://www.facebook.com/${FACEBOOK_PAGE_ID}`}
          data-tabs="timeline"
          data-width=""
          data-height="400"
          data-small-header="true"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <blockquote
            cite={`https://www.facebook.com/${FACEBOOK_PAGE_ID}`}
            className="fb-xfbml-parse-ignore"
          >
            <a href={`https://www.facebook.com/${FACEBOOK_PAGE_ID}`}>
              Mix 96.7 FM
            </a>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

/* ---------- Twitter/X — follow card (no embed, avoids rate limits) ---------- */

function TwitterFeed() {
  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      <div
        className="flex items-center gap-2 border-b px-4 py-3"
        style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: "var(--color-text)" }}
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <h3 className="font-[family-name:var(--font-display)] text-sm font-bold">
          X / Twitter
        </h3>
      </div>
      <XFollowCard />
    </div>
  );
}

/* ---------- Follow card (graceful fallback) ---------- */

function XFollowCard() {
  return (
    <div
      className="flex flex-col items-center gap-4 px-6 py-8"
      style={{ background: "var(--color-surface-raised)" }}
    >
      {/* X logo */}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: "var(--color-text)" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>

      <div className="text-center">
        <p className="font-[family-name:var(--font-display)] text-sm font-bold">
          @{TWITTER_HANDLE}
        </p>
        <p
          className="mt-1 text-xs leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Follow us on X for the latest updates, contests, and music news.
        </p>
      </div>

      <a
        href={`https://x.com/${TWITTER_HANDLE}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-90"
        style={{ background: "var(--color-text)", color: "var(--color-text-inverse)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Follow on X
      </a>
    </div>
  );
}

/* ---------- Loading skeleton ---------- */

function FeedSkeleton({ platform }: { platform: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
        style={{
          borderColor: "oklch(0% 0 0 / 0.1)",
          borderTopColor: "var(--color-primary)",
        }}
      />
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        Loading {platform} feed...
      </p>
    </div>
  );
}

/* ---------- Extend Window for SDK globals ---------- */

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: (el?: HTMLElement) => void;
      };
    };
  }
}
