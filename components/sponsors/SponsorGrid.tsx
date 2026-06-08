"use client";

import { memo, useCallback, useState } from "react";

import type { Sponsor } from "@/Lib/sponsors";

import SponsorCard from "./SponsorCard";
import SponsorLightbox from "./SponsorLightbox";

interface SponsorGridProps {
  sponsors: Sponsor[];
  className?: string;
  compact?: boolean;
}

function SponsorGrid({
  sponsors,
  className = "",
  compact = false,
}: SponsorGridProps) {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const closeLightbox = useCallback(() => setSelectedSponsor(null), []);

  if (!sponsors.length) {
    return (
      <div className={`rounded-2xl border border-dashed border-[#D8B45A]/25 bg-[#07101F]/80 p-8 text-center text-sm font-bold text-slate-400 ${className}`}>
        No sponsors available
      </div>
    );
  }

  return (
    <>
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
        {sponsors.map((sponsor, index) => (
          <SponsorCard
            key={sponsor.id}
            sponsor={sponsor}
            compact={compact}
            priority={index < 2}
            onSelect={setSelectedSponsor}
          />
        ))}
      </div>
      <SponsorLightbox sponsor={selectedSponsor} onClose={closeLightbox} />
    </>
  );
}

export default memo(SponsorGrid);
