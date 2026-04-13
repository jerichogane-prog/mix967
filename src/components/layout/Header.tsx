"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/* ============================================
   Header — dynamic menu pulled from WordPress
   via WPGraphQL, with dropdown submenus.
   ============================================ */

import { HeaderWeatherBadge } from "@/components/weather/WeatherWidget";
import type { NavItem } from "@/lib/api";

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/elkosmix96.7/",
    icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
  },
  {
    label: "X",
    href: "https://twitter.com/elkosmix967",
    icon: <path d="M4 4l6.5 8L4 20h2l5.25-6.5L15 20h5l-6.85-8.4L19.5 4h-2l-4.9 6L8.5 4H4z" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/elkosmix96.7/",
    icon: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></>,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@elkosmix96.7",
    icon: <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />,
  },
];

interface HeaderProps {
  menuItems?: NavItem[];
}

const FALLBACK_NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/", external: false, children: [] },
  { id: "news", label: "News", href: "/blog", external: false, children: [] },
  { id: "shows", label: "Shows", href: "/shows", external: false, children: [] },
  { id: "events", label: "Events", href: "/events", external: false, children: [] },
  { id: "contact", label: "Contact", href: "/contact-us", external: false, children: [] },
];

export default function Header({ menuItems }: HeaderProps) {
  const nav = menuItems && menuItems.length > 0 ? menuItems : FALLBACK_NAV;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/blog?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Top row: branding + listen live */}
      <div
        className="border-b"
        style={{
          background: "var(--color-surface-raised)",
          borderColor: "oklch(0% 0 0 / 0.06)",
        }}
      >
        <div className="mx-auto flex h-20 max-w-[var(--content-wide)] items-center justify-between px-4 sm:px-6 lg:h-28">
          {/* Logo + Tagline */}
          <Link
            href="/"
            className="flex items-center gap-4 transition-opacity hover:opacity-80"
          >
            <Image
              src="https://mix967fm.com/wp-content/uploads/2023/04/Logo@2x-768x285-1.png"
              alt="Mix 96.7 FM"
              width={768}
              height={285}
              className="h-14 w-auto lg:h-[5.5rem]"
              priority
            />
            <span
              className="hidden font-[family-name:var(--font-display)] text-lg font-bold leading-tight tracking-tight sm:block lg:text-2xl"
              style={{ color: "var(--color-text-secondary)" }}
            >
              The #1 Hit Music Station
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Weather badge — desktop only */}
            <HeaderWeatherBadge />

            {/* Social icons — desktop only */}
            <div className="hidden items-center gap-1 lg:flex">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/[0.04]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>

            {/* Download App buttons — desktop only */}
            <div className="hidden items-center gap-2 lg:flex">
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

            {/* Listen Live button */}
            <button
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-transform hover:scale-105 active:scale-95 sm:px-5"
              style={{
                background: "var(--color-live)",
                color: "var(--color-text-inverse)",
                boxShadow: "0 0 16px oklch(65% 0.28 25 / 0.3)",
              }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              <span className="hidden sm:inline">Listen Live</span>
              <span className="sm:hidden">Live</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-black/[0.04] lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <line x1="4" y1="4" x2="16" y2="16" />
                    <line x1="16" y1="4" x2="4" y2="16" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="5" x2="17" y2="5" />
                    <line x1="3" y1="10" x2="17" y2="10" />
                    <line x1="3" y1="15" x2="17" y2="15" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop navigation bar */}
      <nav
        className="hidden border-b lg:block"
        style={{
          background: "var(--color-surface)",
          borderColor: "oklch(0% 0 0 / 0.06)",
        }}
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-[var(--content-wide)] items-center px-4 sm:px-6">
          <ul className="flex items-center gap-0">
            {nav.map((item) => (
              <DesktopNavItem key={item.label} item={item} pathname={pathname} />
            ))}
          </ul>

          {/* Search */}
          <div className="ml-auto relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="h-8 w-48 rounded-lg border px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                  style={{ borderColor: "oklch(0% 0 0 / 0.12)" }}
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  aria-label="Close search"
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/[0.04]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="2" y1="2" x2="12" y2="12" /><line x1="12" y1="2" x2="2" y2="12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-black/[0.04]"
                style={{ color: "var(--color-text-muted)" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="7" cy="7" r="5" /><line x1="11" y1="11" x2="14" y2="14" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div
          className="max-h-[70vh] overflow-y-auto border-b lg:hidden"
          style={{
            background: "var(--color-surface-raised)",
            borderColor: "oklch(0% 0 0 / 0.06)",
          }}
        >
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="h-9 flex-1 rounded-lg border px-3 text-sm outline-none focus:border-[var(--color-primary)]"
                style={{ borderColor: "oklch(0% 0 0 / 0.12)" }}
              />
              <button
                type="submit"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "var(--color-primary)", color: "white" }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="7" cy="7" r="5" /><line x1="11" y1="11" x2="14" y2="14" />
                </svg>
              </button>
            </div>
          </form>

          <ul className="flex flex-col px-4 py-2">
            {nav.map((item) => (
              <MobileNavItem key={item.label} item={item} pathname={pathname} onClose={() => setMobileOpen(false)} />
            ))}
          </ul>

          {/* Mobile app download links */}
          <div className="flex items-center gap-2 border-t px-4 py-3" style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}>
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Get the app:</span>
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

          {/* Mobile social icons */}
          <div className="flex items-center gap-1 border-t px-4 py-3" style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}>
            <span className="mr-2 text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Follow us:</span>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-black/[0.04]"
                style={{ color: "var(--color-text-muted)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Desktop nav item with dropdown ---------- */

function DesktopNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  const isActive = item.href === "/"
    ? pathname === "/"
    : item.href !== "#" && pathname.startsWith(item.href);

  const hasDropdown = item.children && item.children.length > 0;

  const onEnter = () => { if (timeout.current) clearTimeout(timeout.current); setOpen(true); };
  const onLeave = () => { timeout.current = setTimeout(() => setOpen(false), 150); };

  return (
    <li
      className="relative"
      onMouseEnter={hasDropdown ? onEnter : undefined}
      onMouseLeave={hasDropdown ? onLeave : undefined}
    >
      <NavLink
        href={item.href}
        external={item.external}
        className="relative flex items-center gap-1 px-3 py-3 text-sm font-semibold uppercase tracking-wide transition-colors hover:text-[var(--color-primary)] xl:px-4"
        style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)" }}
      >
        {item.label}
        {hasDropdown && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-50">
            <polyline points="2,3.5 5,6.5 8,3.5" />
          </svg>
        )}
        {isActive && (
          <span
            className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full xl:left-4 xl:right-4"
            style={{ background: "var(--color-primary)" }}
          />
        )}
      </NavLink>

      {/* Dropdown */}
      {hasDropdown && open && (
        <div
          className="absolute left-0 top-full z-50 min-w-[220px] rounded-lg border py-1.5 shadow-lg"
          style={{
            background: "var(--color-surface-raised)",
            borderColor: "oklch(0% 0 0 / 0.08)",
          }}
        >
          {item.children!.map((child) => (
            <NavLink
              key={child.label}
              href={child.href}
              external={child.external}
              className="block px-4 py-2 text-sm transition-colors hover:bg-black/[0.04] hover:text-[var(--color-primary)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </li>
  );
}

/* ---------- Mobile nav item with expandable children ---------- */

function MobileNavItem({ item, pathname, onClose }: { item: NavItem; pathname: string; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const isActive = item.href === "/"
    ? pathname === "/"
    : item.href !== "#" && pathname.startsWith(item.href);

  return (
    <li>
      <div className="flex items-center">
        <NavLink
          href={hasChildren && item.href === "#" ? undefined : item.href}
          external={item.external}
          onClick={onClose}
          className="flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-black/[0.04]"
          style={{
            color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
            background: isActive ? "oklch(60% 0.26 350 / 0.06)" : "transparent",
          }}
        >
          {item.label}
        </NavLink>
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            aria-label={`Expand ${item.label}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-black/[0.04]"
            style={{ color: "var(--color-text-muted)" }}
          >
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              className="transition-transform duration-200"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <polyline points="2,4 6,8 10,4" />
            </svg>
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <ul className="ml-4 border-l pb-1 pl-3" style={{ borderColor: "oklch(0% 0 0 / 0.08)" }}>
          {item.children!.map((child) => (
            <li key={child.label}>
              <NavLink
                href={child.href}
                external={child.external}
                onClick={onClose}
                className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-black/[0.04]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/* ---------- Smart link — internal vs external ---------- */

function NavLink({
  href,
  external,
  onClick,
  children,
  className,
  style,
}: {
  href?: string;
  external?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!href || href === "#") {
    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  }

  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style} onClick={onClick}>
      {children}
    </Link>
  );
}
