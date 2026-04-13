import AdSlot from "@/components/sidebar/AdSlot";
import { getAdGroup } from "@/lib/api";

/* ============================================
   BannerAd — full-width rotating banner ad
   from the home-page-group Advanced Ads group.
   ============================================ */

interface BannerAdProps {
  className?: string;
}

export default async function BannerAd({ className = "" }: BannerAdProps) {
  const bannerAds = await getAdGroup("home-page-group");

  if (bannerAds.length === 0) return null;

  return (
    <div className={className}>
      <AdSlot ads={bannerAds} label="Advertisement" />
    </div>
  );
}
