import Image from "next/image";
import Link from "next/link";

const STATION_LINKS = [
  { label: "Shows", href: "/shows" },
  { label: "Schedule", href: "/schedule" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/blog" },
  { label: "Contests", href: "/contests" },
] as const;

const COMPANY_LINKS = [
  { label: "Advertise", href: "/advertise" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Careers", href: "/careers" },
  { label: "Sister Stations", href: "https://global1media.com/" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "FCC Public File", href: "https://publicfiles.fcc.gov/fm-profile/KHIX" },
  { label: "EEO", href: "https://publicfiles.fcc.gov/api/manager/download/6e0e4d1e-50e1-bc9d-134f-3ff9a4a1617e/9ac405cc-2343-4e51-a050-af86c2f58fc7.pdf" },
] as const;

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/elkosmix96.7/",
    icon: (
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    ),
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com/elkosmix967",
    icon: (
      <path d="M4 4l6.5 8L4 20h2l5.25-6.5L15 20h5l-6.85-8.4L19.5 4h-2l-4.9 6L8.5 4H4z" />
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/elkosmix96.7/",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" />
      </>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@elkosmix96.7",
    icon: (
      <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
    ),
  },
] as const;

export default function Footer() {
  return (
    <footer
      className="border-t pb-20"
      style={{
        background: "var(--color-surface-sunken)",
        borderColor: "oklch(0% 0 0 / 0.06)",
      }}
    >
      <div className="mx-auto max-w-[var(--content-wide)] px-4 py-12 sm:px-6">
        {/* Top section: logos + nav */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            {/* Station logo */}
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image
                src="https://mix967fm.com/wp-content/uploads/2023/04/Logo@2x-768x285-1.png"
                alt="Mix 96.7 FM"
                width={768}
                height={285}
                className="h-12 w-auto"
              />
            </Link>

            <p
              className="mt-3 max-w-xs text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Northeast Nevada&apos;s #1 Hit Music Station. Broadcasting 24/7 with the best mix of hits.
            </p>

            {/* Social icons */}
            <div className="mt-4 flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-black/[0.06]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-4 space-y-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
              <p>
                Phone:{" "}
                <a href="tel:7757771196" className="font-medium hover:underline" style={{ color: "var(--color-text-secondary)" }}>
                  (775) 777-1196
                </a>
              </p>
              <p>
                Email:{" "}
                <a href="mailto:info@global1media.com" className="font-medium hover:underline" style={{ color: "var(--color-text-secondary)" }}>
                  info@global1media.com
                </a>
              </p>
            </div>
          </div>

          {/* Station links */}
          <div className="lg:col-span-2">
            <h3
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Station
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {STATION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="lg:col-span-2">
            <h3
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Company
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors hover:underline"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:underline"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Parent company */}
          <div className="lg:col-span-4">
            <h3
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              A station of
            </h3>
            <a
              href="https://global1media.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block transition-opacity hover:opacity-80"
            >
              <Image
                src="https://mix967fm.com/wp-content/uploads/2023/04/G1M-Logo-768x345.png"
                alt="Global One Media Inc."
                width={768}
                height={345}
                className="h-16 w-auto"
              />
            </a>
            <p
              className="mt-2 max-w-xs text-xs leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Global One Media Inc. — broadcasting across Northeast Nevada.
            </p>

            {/* App download links */}
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://apps.apple.com/us/app/global-one-media/id6446038326?uo=2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-black/[0.04]"
                style={{ borderColor: "oklch(0% 0 0 / 0.1)", color: "var(--color-text-secondary)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.globalonemedia1.app&pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-black/[0.04]"
                style={{ borderColor: "oklch(0% 0 0 / 0.1)", color: "var(--color-text-secondary)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.49a2.75 2.75 0 01-.87-2.07V2.58c0-.73.3-1.44.86-2.08L12 9.31 3.18 23.49zM17.45 14l-3.83-3.83 3.83-3.83L21 8.36c1.08.63 1.08 1.66 0 2.28L17.45 14zM4 24l8.83-5.17L8.5 14.5 4 24zM4 0l4.5 9.5 4.33-4.33L4 0z" /></svg>
                Google Play
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center"
          style={{
            borderColor: "oklch(0% 0 0 / 0.06)",
          }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            &copy; {new Date().getFullYear()} Mix 96.7 FM &middot; Global One Media Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-xs transition-colors hover:underline"
                style={{ color: "var(--color-text-muted)" }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
