/* ============================================
   Sidebar — reusable sticky sidebar with
   now playing, schedule, ads, events, social.
   ============================================ */

import NowPlayingWidget from "@/components/sidebar/NowPlayingWidget";
import UpcomingShowsWidget from "@/components/sidebar/UpcomingShowsWidget";
import EventsWidget from "@/components/sidebar/EventsWidget";
import AdSlot from "@/components/sidebar/AdSlot";
import SocialFeedWidget from "@/components/sidebar/SocialFeedWidget";
import { getAllShows, getUpcomingEvents, getAdGroup } from "@/lib/api";

export default async function Sidebar() {
  const [shows, events, squareAds] = await Promise.all([
    getAllShows(),
    getUpcomingEvents(5),
    getAdGroup("square-ad-group"),
  ]);

  return (
    <aside
      className="w-full shrink-0 lg:sticky lg:top-[calc(var(--header-height,7.5rem)+1rem)] lg:max-h-[calc(100vh-var(--header-height,7.5rem)-2rem)] lg:w-80 lg:overflow-y-auto xl:w-[22rem]"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="space-y-6 pb-20">
        <NowPlayingWidget />
        <UpcomingShowsWidget shows={shows} />
        <AdSlot ads={squareAds} label="Sponsored" />
        <EventsWidget events={events} />
        <SocialFeedWidget />
        <AdSlot ads={squareAds.slice().reverse()} label="Sponsored" />
      </div>
    </aside>
  );
}
