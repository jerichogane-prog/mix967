import type { NextConfig } from "next";

// Headless WordPress install (same default as src/lib/wordpress-config.ts)
const WORDPRESS_URL = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.mix967fm.com"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.mix967fm.com",
      },
      {
        protocol: "https",
        hostname: "mix967fm.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "10003",
      },
      {
        protocol: "http",
        hostname: "mix-967.local",
      },
    ],
  },
  async redirects() {
    return [
      // WordPress /show/{slug}/ → /shows/{slug}
      {
        source: "/show/:slug",
        destination: "/shows/:slug",
        permanent: true,
      },
      // WordPress /event/{slug}/ → /events/{slug}
      {
        source: "/event/:slug",
        destination: "/events/:slug",
        permanent: true,
      },
      // WordPress /category/{slug}/ → /blog (categories not implemented yet)
      {
        source: "/category/:slug",
        destination: "/blog",
        permanent: false,
      },
      // WordPress /tag/{slug}/ → /blog
      {
        source: "/tag/:slug",
        destination: "/blog",
        permanent: false,
      },
      // Uploaded media and files now live on the CMS (old image links, backlinks)
      {
        source: "/wp-content/:path*",
        destination: `${WORDPRESS_URL}/wp-content/:path*`,
        permanent: true,
      },
      // Staff logins, the RSS feed and API clients keep working after the move
      {
        source: "/wp-admin/:path*",
        destination: `${WORDPRESS_URL}/wp-admin/:path*`,
        permanent: false,
      },
      {
        source: "/wp-login.php",
        destination: `${WORDPRESS_URL}/wp-login.php`,
        permanent: false,
      },
      {
        source: "/wp-json/:path*",
        destination: `${WORDPRESS_URL}/wp-json/:path*`,
        permanent: false,
      },
      {
        source: "/feed/:path*",
        destination: `${WORDPRESS_URL}/feed/:path*`,
        permanent: false,
      },
      // Legacy WordPress archives with no equivalent page
      {
        source: "/venue/:slug*",
        destination: "/events",
        permanent: true,
      },
      {
        source: "/events/category/:slug*",
        destination: "/events",
        permanent: true,
      },
      {
        source: "/events/:view(list|month|week|day|today|photo|map)/:rest*",
        destination: "/events",
        permanent: true,
      },
      {
        source: "/author/:slug*",
        destination: "/blog",
        permanent: true,
      },
      // WordPress /page/2/ post pagination → /blog?page=2
      {
        source: "/page/:page(\\d+)",
        destination: "/blog?page=:page",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
