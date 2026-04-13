/* ============================================
   Social Feed Widget — latest social posts
   from the station's accounts.
   ============================================ */

const PLACEHOLDER_POSTS = [
  {
    platform: "X",
    handle: "@mix967fm",
    text: "Happy Friday! What song do you want to hear this afternoon? Drop it below! 🎵",
    time: "2h ago",
  },
  {
    platform: "X",
    handle: "@mix967fm",
    text: "Congrats to Maria for winning tickets to Summer Fest! Keep listening for more chances!",
    time: "5h ago",
  },
  {
    platform: "X",
    handle: "@mix967fm",
    text: "New music alert: Check out the latest track from @artist on the Morning Drive today!",
    time: "8h ago",
  },
];

export default function SocialFeedWidget() {
  return (
    <div
      className="rounded-xl border"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      <div
        className="border-b px-4 py-3"
        style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
      >
        <h3 className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wide">
          Social Feed
        </h3>
      </div>
      <ul className="divide-y" style={{ borderColor: "oklch(0% 0 0 / 0.04)" }}>
        {PLACEHOLDER_POSTS.map((post, i) => (
          <li key={i} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {post.handle}
              </span>
              <span
                className="text-[10px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {post.time}
              </span>
            </div>
            <p
              className="mt-1 text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {post.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
