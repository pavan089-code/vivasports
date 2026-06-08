"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import type { Sponsor } from "@/Lib/sponsors";

import SponsorCard from "./SponsorCard";
import SponsorLightbox from "./SponsorLightbox";

interface SponsorCarouselProps {
  sponsors: Sponsor[];
  className?: string;
  intervalMs?: number;
}

function SponsorCarousel({
  sponsors,
  className = "",
  intervalMs = 5000,
}: SponsorCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const hasSponsors = sponsors.length > 0;
  const closeLightbox = useCallback(() => setSelectedSponsor(null), []);

  const activeSponsor = useMemo(
    () => (hasSponsors ? sponsors[activeIndex % sponsors.length] : null),
    [activeIndex, hasSponsors, sponsors]
  );

  useEffect(() => {
    if (sponsors.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % sponsors.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, sponsors.length]);

  const goTo = useCallback((offset: number) => {
    if (!sponsors.length) return;
    setActiveIndex((index) => (index + offset + sponsors.length) % sponsors.length);
  }, [sponsors.length]);

  if (!activeSponsor) {
    return (
      <div className={`rounded-2xl border border-dashed border-[#D8B45A]/25 bg-[#07101F]/80 p-8 text-center text-sm font-bold text-slate-400 ${className}`}>
        No sponsors available
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <SponsorCard sponsor={activeSponsor} priority onSelect={setSelectedSponsor} />

        {sponsors.length > 1 && (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goTo(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D8B45A]/25 bg-[#07101F] text-white transition hover:border-[#D8B45A]/50 hover:text-[#F1D58A] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label="Previous sponsor"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {sponsors.map((sponsor, index) => (
                <button
                  key={sponsor.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                    index === activeIndex
                      ? "w-7 bg-[#D8B45A]"
                      : "w-2.5 bg-white/25 hover:bg-white/45"
                  }`}
                  aria-label={`Show ${sponsor.name}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D8B45A]/25 bg-[#07101F] text-white transition hover:border-[#D8B45A]/50 hover:text-[#F1D58A] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label="Next sponsor"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      <SponsorLightbox sponsor={selectedSponsor} onClose={closeLightbox} />
    </>
  );
}

export default memo(SponsorCarousel);
