import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import EventsPageContent from "@/components/events/EventsPageContent";
import { getUpcomingEvents } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events and happenings around Mix 96.7 FM.",
};

export default async function EventsPage() {
  const events = await getUpcomingEvents(50);

  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <BannerAd className="mb-6" />
          <EventsPageContent events={events} />
          <BannerAd className="mt-8" />
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
