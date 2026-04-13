import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.mix967.fm",
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
      {
        protocol: "https",
        hostname: "mix967fm.com",
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
    ];
  },
};

export default nextConfig;
