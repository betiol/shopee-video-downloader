"use client";

import { useEffect, useState } from "react";

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

export default function AdSenseAd({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
}: AdSenseAdProps) {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Only load ads after the page content is fully rendered
    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined" && (window as any).adsbygoogle) {
          (window as any).adsbygoogle.push({});
          setAdLoaded(true);
        }
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }, 1000); // Wait 1 second to ensure content is rendered

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-[280px] flex items-center justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: "280px" }}
        data-ad-client="ca-pub-5771662142995562"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}
