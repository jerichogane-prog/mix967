"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/* ============================================
   Header — matches WordPress header menu
   structure exactly, with dropdown submenus.
   ============================================ */

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
}

const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "News", href: "/blog" },
  {
    label: "Mix Crew",
    href: "/shows",
    children: [
      { label: "Sandy Beeler", href: "/shows/sandy-beeler" },
      { label: "Jen Austin", href: "/shows/jen-austin" },
      { label: "Jamie Roberts", href: "/shows/jamie-roberts" },
      { label: "Izaak Freeman", href: "/shows/izaak-freeman" },
      { label: "American Top 40 with Ryan Seacrest", href: "/shows/american-top-40-with-ryan-seacrest" },
    ],
  },
  { label: "Contests", href: "/contests" },
  { label: "VIP Listener", href: "/vip-listener" },
  {
    label: "Events",
    href: "/events",
    children: [
      { label: "What's Happening", href: "/events" },
      { label: "Health and Fitness 2025", href: "https://elkohealth.com/", external: true },
      { label: "Elko Family Fun Day", href: "https://elkofamilyfun.com/", external: true },
    ],
  },
  {
    label: "Connect",
    href: "#",
    children: [
      { label: "Advertise", href: "/advertise" },
      { label: "Careers", href: "https://global1media.com/index.php/career-opportunities/", external: true },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    label: "Podcast",
    href: "#",
    children: [
      { label: "Backstage with Sandy Beeler", href: "https://elkobackstage.com/", external: true },
      { label: "Community Conversation", href: "https://elkoconversation.com/", external: true },
      { label: "Nevada Now with Curtis Calder", href: "https://nevadacast.com/", external: true },
      { label: "Tips to Happiness with EC Stilson", href: "https://ecstilson.global1media.com/", external: true },
    ],
  },
  {
    label: "Channels",
    href: "#",
    children: [
      { label: "Radio Santa", href: "https://radio-santa.com/", external: true },
      { label: 'Ron Ananian "Car Doctor Show"', href: "https://cardoctorshow.com/", external: true },
    ],
  },
  {
    label: "Games",
    href: "#",
    children: [
      { label: "Solitaire", href: "/solitaire" },
      { label: "Mahjong", href: "/mahjong" },
      { label: "Galaga", href: "/galaga" },
      { label: "Pong", href: "/pong" },
      { label: "War Brokers", href: "/wordle" },
      { label: "Wings.io", href: "/wings-io" },
      { label: "Qbert", href: "/qbert" },
      { label: "Pacman", href: "/pacman" },
      { label: "Space Invaders", href: "/space-invaders" },
      { label: "Minesweeper", href: "/minesweeper" },
    ],
  },
];

export default function Header() {
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
        <div className="mx-auto flex h-16 max-w-[var(--content-wide)] items-center justify-between px-4 sm:px-6 lg:h-20">
          {/* Logo + Tagline */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <Image
              src="https://mix967fm.com/wp-content/uploads/2023/04/Logo@2x-768x285-1.png"
              alt="Mix 96.7 FM"
              width={768}
              height={285}
              className="h-10 w-auto lg:h-14"
              priority
            />
            <span
              className="hidden text-base font-bold leading-tight tracking-tight sm:block lg:text-xl"
              style={{ color: "var(--color-text-secondary)" }}
            >
              The #1 Hit Music Station
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
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
            {PRIMARY_NAV.map((item) => (
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
            {PRIMARY_NAV.map((item) => (
              <MobileNavItem key={item.label} item={item} pathname={pathname} onClose={() => setMobileOpen(false)} />
            ))}
          </ul>
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
