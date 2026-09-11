"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NowPlaying } from "@/types";
import { RADIO_PLAY_EVENT } from "./radio-events";

/* ============================================
   RadioPlayer — Persistent sticky player bar

   - Auto-plays on page load (when the browser allows it)
   - Single-instance across tabs via BroadcastChannel
   - When a new tab plays, other tabs stop
   - ICY metadata polling via /api/now-playing
   - Other components start it via requestRadioPlay()
   ============================================ */

const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL ?? "";
const METADATA_POLL_INTERVAL = 15_000;
const CHANNEL_NAME = "mix967-radio-player";
const STREAM_ERROR_MESSAGE = "Stream unavailable right now — please try again.";

type ChannelMessage =
  | { type: "PLAYING"; tabId: string }
  | { type: "STOPPED"; tabId: string }
  | { type: "PING" }
  | { type: "PONG"; tabId: string };

export default function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);

  const tabIdRef = useRef(Math.random().toString(36).slice(2, 10));
  const channelRef = useRef<BroadcastChannel | null>(null);
  const autoPlayAttempted = useRef(false);

  // Detach the stream and close the connection without firing an
  // "error" event (setting src = "" does fire one)
  const releaseStream = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }, []);

  // Start playback
  const startPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !STREAM_URL) return;

    setIsLoading(true);
    setStreamError(null);
    audio.src = STREAM_URL;
    try {
      await audio.play();
      setIsPlaying(true);
      // Notify other tabs
      channelRef.current?.postMessage({
        type: "PLAYING",
        tabId: tabIdRef.current,
      } satisfies ChannelMessage);
    } catch (err) {
      const reason = err instanceof DOMException ? err.name : "";
      // AbortError: a newer play/stop call superseded this one — leave it be
      if (reason === "AbortError") return;
      releaseStream();
      setIsPlaying(false);
      // NotAllowedError: browser blocked autoplay — listener just presses play.
      // Anything else (e.g. stream rejected the request) is shown to the user.
      if (reason !== "NotAllowedError") setStreamError(STREAM_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }, [releaseStream]);

  // Stop playback
  const stopPlayback = useCallback(() => {
    releaseStream();
    setIsPlaying(false);
  }, [releaseStream]);

  // Stream failures after playback started (e.g. connection dropped)
  const handleAudioError = useCallback(() => {
    if (!audioRef.current?.getAttribute("src")) return;
    releaseStream();
    setIsPlaying(false);
    setStreamError(STREAM_ERROR_MESSAGE);
  }, [releaseStream]);

  // Toggle
  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      stopPlayback();
      channelRef.current?.postMessage({
        type: "STOPPED",
        tabId: tabIdRef.current,
      } satisfies ChannelMessage);
    } else {
      await startPlayback();
    }
  }, [isPlaying, startPlayback, stopPlayback]);

  // BroadcastChannel setup — single-instance coordination
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<ChannelMessage>) => {
      const msg = event.data;

      switch (msg.type) {
        case "PLAYING":
          // Another tab started playing — stop this one
          if (msg.tabId !== tabIdRef.current) {
            stopPlayback();
          }
          break;

        case "PING":
          // Another tab is checking if anyone is playing
          if (isPlaying) {
            channel.postMessage({
              type: "PONG",
              tabId: tabIdRef.current,
            } satisfies ChannelMessage);
          }
          break;
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [isPlaying, stopPlayback]);

  // Auto-play on mount — check other tabs first
  useEffect(() => {
    if (autoPlayAttempted.current || !STREAM_URL) return;
    autoPlayAttempted.current = true;

    if (typeof BroadcastChannel === "undefined") {
      // No BroadcastChannel support — just auto-play
      startPlayback();
      return;
    }

    // Ask other tabs if they're already playing
    const checkChannel = new BroadcastChannel(CHANNEL_NAME);
    let otherTabPlaying = false;

    checkChannel.onmessage = (event: MessageEvent<ChannelMessage>) => {
      if (event.data.type === "PONG") {
        otherTabPlaying = true;
      }
    };

    checkChannel.postMessage({ type: "PING" } satisfies ChannelMessage);

    // Wait a short moment for responses, then decide
    const timer = setTimeout(() => {
      checkChannel.close();
      // Skip if another tab is playing, or the listener already hit "Listen Live"
      if (!otherTabPlaying && audioRef.current?.paused !== false) {
        startPlayback();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      checkChannel.close();
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Let other components (header "Listen Live", sidebar widget) start playback
  useEffect(() => {
    const handlePlayRequest = () => {
      // Already playing or connecting — nothing to do
      if (audioRef.current?.paused === false) return;
      startPlayback();
    };
    window.addEventListener(RADIO_PLAY_EVENT, handlePlayRequest);
    return () => window.removeEventListener(RADIO_PLAY_EVENT, handlePlayRequest);
  }, [startPlayback]);

  // Fetch now-playing metadata
  const fetchMetadata = useCallback(async () => {
    try {
      const res = await fetch("/api/now-playing", { cache: "no-store" });
      if (res.ok) {
        const data: NowPlaying = await res.json();
        if (data.title) {
          setNowPlaying(data);
        }
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

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur-xl"
      style={{
        background: "var(--color-surface-overlay)",
        borderColor: "oklch(100% 0 0 / 0.08)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[var(--content-wide)] items-center gap-4 px-4 sm:px-6">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          disabled={isLoading || !STREAM_URL}
          aria-label={isPlaying ? "Pause radio" : "Play radio"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
          style={{ background: "var(--color-primary)" }}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </button>

        {/* Now Playing Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center gap-2">
            {isPlaying && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider"
                style={{
                  background: "var(--color-live)",
                  color: "var(--color-text-inverse)",
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-live" />
                Live
              </span>
            )}
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Mix 967 FM
            </span>
          </div>
          <p
            className="truncate text-sm font-medium"
            style={{
              color: streamError
                ? "var(--color-accent-light)"
                : "var(--color-text-inverse)",
            }}
            aria-live="polite"
          >
            {streamError || nowPlaying?.title || "Tune in to Mix 967 FM"}
          </p>
        </div>

        {/* Volume Slider */}
        <div className="hidden items-center gap-2 sm:flex">
          <VolumeIcon muted={volume === 0} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
            className="h-1 w-24 cursor-pointer appearance-none rounded-full accent-[var(--color-primary)]"
            style={{ background: "oklch(100% 0 0 / 0.2)" }}
          />
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" onError={handleAudioError} />
    </div>
  );
}

/* --- Icons --- */

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 2.5L15 9L4 15.5V2.5Z" fill="white" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="2" width="4" height="14" rx="1" fill="white" />
      <rect x="11" y="2" width="4" height="14" rx="1" fill="white" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="12"
      />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ color: "var(--color-text-muted)" }}
    >
      <path
        d="M8 2L4 5.5H1V10.5H4L8 14V2Z"
        fill="currentColor"
      />
      {!muted && (
        <>
          <path
            d="M10.5 5.5C11.3 6.3 11.8 7.6 11.8 9C11.8 10.4 11.3 11.7 10.5 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12.5 3.5C14 5 15 7 15 9C15 11 14 13 12.5 14.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
