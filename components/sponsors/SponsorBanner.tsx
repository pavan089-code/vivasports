"use client";

import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import type { Sponsor } from "@/Lib/sponsors";

import SponsorLightbox from "./SponsorLightbox";

interface SponsorBannerProps {
  sponsors: Sponsor[];
  className?: string;
  intervalMs?: number;
}

function SponsorBanner({
  sponsors,
  className = "",
  intervalMs = 5000,
}: SponsorBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const activeSponsor = useMemo(
    () => (sponsors.length ? sponsors[activeIndex % sponsors.length] : null),
    [activeIndex, sponsors]
  );
  const closeLightbox = useCallback(() => setSelectedSponsor(null), []);

  useEffect(() => {
    if (sponsors.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % sponsors.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, sponsors.length]);

  if (!activeSponsor) {
    return (
      <section className={`rounded-2xl border border-dashed border-[#D8B45A]/25 bg-[#07101F]/80 p-5 text-center text-sm font-bold text-slate-400 ${className}`}>
        No sponsors available
      </section>
    );
  }

  return (
    <>
      <section
        className={`overflow-hidden rounded-2xl border border-[#D8B45A]/20 bg-[#07101F] p-4 shadow-xl shadow-black/20 ${className}`}
        aria-label="Sponsor banner"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D8B45A]">
              Sponsor Banner
            </p>
            <p className="mt-2 w-fit rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300">
              {activeSponsor.category}
            </p>
            <h2 className="mt-1 text-xl font-black text-white">
              {activeSponsor.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setSelectedSponsor(activeSponsor)}
            className="group flex h-24 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 sm:w-72"
            aria-label={`View ${activeSponsor.name} sponsor image`}
          >
            <Image
              src={activeSponsor.image}
              alt={`${activeSponsor.name} sponsor logo`}
              width={560}
              height={260}
              sizes="(max-width: 640px) 90vw, 288px"
              className="h-auto max-h-24 w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </button>
        </div>

        {sponsors.length > 1 && (
          <div className="mt-4 overflow-hidden rounded-full border border-white/10 bg-black/20 py-2">
            <div className="sponsor-marquee flex w-max items-center gap-3 px-3">
              {[...sponsors, ...sponsors].map((sponsor, index) => (
                <span
                  key={`${sponsor.id}-${index}`}
                  className="rounded-full border border-[#D8B45A]/20 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#F1D58A]"
                >
                  {sponsor.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
      <SponsorLightbox sponsor={selectedSponsor} onClose={closeLightbox} />
    </>
  );
}

export default memo(SponsorBanner);
