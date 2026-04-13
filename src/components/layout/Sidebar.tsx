/* ============================================
   Sidebar — reusable sticky sidebar with
   now playing, schedule, ads, events, social.
   ============================================ */

import NowPlayingWidget from "@/components/sidebar/NowPlayingWidget";
import UpcomingShowsWidget from "@/components/sidebar/UpcomingShowsWidget";
import EventsWidget from "@/components/sidebar/EventsWidget";
import AdSlot from "@/components/sidebar/AdSlot";
import SidebarSocialFeeds from "@/components/social/SidebarSocialFeeds";
import { getAllShows, getUpcomingEvents, getAdGroup } from "@/lib/api";

export default async function Sidebar() {
  const [shows, events, squareAds] = await Promise.all([
    getAllShows(),
    getUpcomingEvents(5),
    getAdGroup("square-ad-group"),
  ]);

  return (
    <aside className="w-full shrink-0 lg:w-80 xl:w-[22rem]">
      <div className="space-y-6">
        <NowPlayingWidget />
        <UpcomingShowsWidget shows={shows} />
        <AdSlot ads={squareAds} label="Sponsored" />
        <EventsWidget events={events} />
        <SidebarSocialFeeds />
        <AdSlot ads={squareAds.slice().reverse()} label="Sponsored" />
      </div>
    </aside>
  );
}
