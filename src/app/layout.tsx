import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RadioPlayer from "@/components/radio-player/RadioPlayer";
import { getMenu } from "@/lib/api";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mix 96.7 FM — Northeast Nevada's #1 Hit Music Station",
    template: "%s | Mix 96.7 FM",
  },
  description:
    "Mix 96.7 FM is Northeast Nevada's #1 Hit Music Station. Listen live to the best mix of today's hits, local shows, contests, events, and community news from Elko, Nevada.",
  keywords: [
    "Mix 96.7",
    "Mix 967",
    "KHIX",
    "radio",
    "Elko",
    "Nevada",
    "hit music",
    "listen live",
  ],
  openGraph: {
    type: "website",
    siteName: "Mix 96.7 FM",
    title: "Mix 96.7 FM — Northeast Nevada's #1 Hit Music Station",
    description:
      "Listen live to the best mix of today's hits, local shows, contests, and events.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@elkosmix967",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/favicon-192x192.jpg", sizes: "192x192", type: "image/jpeg" },
    ],
    apple: [
      { url: "/apple-touch-icon.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = await getMenu("header-menu");

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)]">
        <AnnouncementBar />
        <Header menuItems={menuItems} />
        <main className="flex-1 pb-16">{children}</main>
        <Footer />
        <RadioPlayer />
      </body>
    </html>
  );
}
