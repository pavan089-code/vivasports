"use client";

import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";

import type { Sponsor } from "@/Lib/sponsors";

import SponsorLightbox from "./SponsorLightbox";

interface FeaturedSponsorCarouselProps {
  sponsors: Sponsor[];
  className?: string;
}

function FeaturedSponsorCarousel({
  sponsors,
  className = "",
}: FeaturedSponsorCarouselProps) {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const featuredSponsor = useMemo(
    () => sponsors.find((sponsor) => sponsor.id === "sp1") || sponsors[0] || null,
    [sponsors]
  );
  const closeLightbox = useCallback(() => setSelectedSponsor(null), []);

  if (!featuredSponsor) {
    return (
      <div className={`rounded-2xl border border-dashed border-[#D8B45A]/25 bg-[#07101F]/80 p-8 text-center text-sm font-bold text-slate-400 ${className}`}>
        No sponsors available
      </div>
    );
  }

  return (
    <>
      <section
        className={`overflow-hidden rounded-2xl border border-[#D8B45A]/25 bg-[#050914] shadow-2xl shadow-black/35 ${className}`}
        aria-label="Featured sponsor"
      >
        <button
          type="button"
          onClick={() => setSelectedSponsor(featuredSponsor)}
          className="group grid w-full gap-5 p-4 text-left transition-all duration-300 hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 md:grid-cols-[1fr_0.42fr] md:p-6 lg:p-8"
          aria-label={`View ${featuredSponsor.name} sponsor image`}
        >
          <div className="relative flex aspect-[16/9] min-h-56 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:min-h-72 lg:min-h-80">
            <Image
              src={featuredSponsor.image}
              alt={`${featuredSponsor.name} sponsor image`}
              fill
              sizes="(max-width: 768px) 100vw, 820px"
              className="object-contain opacity-100 transition-all duration-500 group-hover:scale-[1.03]"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D8B45A]">
              🏆 Featured Sponsor
            </p>
            <h3 className="mt-3 text-3xl font-black uppercase leading-tight text-white transition-colors duration-300 group-hover:text-yellow-400 sm:text-4xl">
              {featuredSponsor.name}
            </h3>
            <p className="mt-3 w-fit rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300">
              {featuredSponsor.category}
            </p>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
              Official title sponsors supporting the Viva Sports T20 Cricket
              Tournament 2026 and helping grow community cricket across the USA
              and India.
            </p>
          </div>
        </button>
      </section>

      <SponsorLightbox sponsor={selectedSponsor} onClose={closeLightbox} />
    </>
  );
}

export default memo(FeaturedSponsorCarousel);
