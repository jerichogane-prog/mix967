import type { MetadataRoute } from "next";
import { getRecentPosts, getAllShows, getUpcomingEvents } from "@/lib/api";

const SITE_URL = "https://mix967fm.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, shows, events] = await Promise.all([
    getRecentPosts(500),
    getAllShows(),
    getUpcomingEvents(100),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/shows`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/events`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/schedule`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contests`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/vip-listener`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/advertise`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact-us`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const showUrls: MetadataRoute.Sitemap = shows.map((show) => ({
    url: `${SITE_URL}/shows/${show.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const eventUrls: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${SITE_URL}/events/${event.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticPages, ...postUrls, ...showUrls, ...eventUrls];
}
