import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You",
};

const FORM_MESSAGES: Record<string, { title: string; message: string }> = {
  "1": {
    title: "You're Subscribed!",
    message: "Welcome to the Mix 96.7 FM family. You'll be the first to know about contests, events, and exclusive content.",
  },
  "2": {
    title: "Welcome, VIP Listener!",
    message: "You're now part of our VIP Listener club. Stay tuned for exclusive perks, early access to events, and special prizes.",
  },
  "3": {
    title: "Thanks for Your Interest!",
    message: "Our advertising team will review your inquiry and get back to you within 1-2 business days. We look forward to helping your business grow.",
  },
  "4": {
    title: "Message Received!",
    message: "Thanks for reaching out. Our team will get back to you as soon as possible.",
  },
};

interface ThankYouPageProps {
  searchParams: Promise<{ form?: string }>;
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const formId = params.form ?? "";
  const msg = FORM_MESSAGES[formId] ?? {
    title: "Thank You!",
    message: "Your submission has been received. We'll be in touch soon.",
  };

  return (
    <div className="mx-auto max-w-[var(--content-narrow)] px-4 py-16 sm:px-6 text-center">
      {/* Checkmark icon */}
      <div
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ background: "oklch(85% 0.15 145 / 0.2)" }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="oklch(55% 0.2 145)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="12,20 18,26 28,14" />
        </svg>
      </div>

      <h1
        className="font-[family-name:var(--font-display)] font-bold tracking-tight"
        style={{ fontSize: "var(--text-3xl)" }}
      >
        {msg.title}
      </h1>

      <p
        className="mx-auto mt-4 max-w-md text-base leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {msg.message}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:scale-[1.02]"
          style={{ background: "var(--color-primary)", color: "white" }}
        >
          Back to Home
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:bg-black/[0.03]"
          style={{ borderColor: "oklch(0% 0 0 / 0.12)" }}
        >
          Read Latest News
        </Link>
      </div>
    </div>
  );
}
