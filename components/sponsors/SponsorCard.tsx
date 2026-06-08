import Image from "next/image";

import type { Sponsor } from "@/Lib/sponsors";

interface SponsorCardProps {
  sponsor: Sponsor;
  priority?: boolean;
  compact?: boolean;
  onSelect?: (sponsor: Sponsor) => void;
}

export default function SponsorCard({
  sponsor,
  priority = false,
  compact = false,
  onSelect,
}: SponsorCardProps) {
  const imageHeight = compact ? "max-h-24" : "max-h-[280px]";

  return (
    <button
      type="button"
      onClick={() => onSelect?.(sponsor)}
      className={`group flex h-full w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#07101F] text-center shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/70 hover:bg-[#0D172A] hover:shadow-xl hover:shadow-yellow-950/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/80 ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
      aria-label={`View ${sponsor.name} sponsor image`}
    >
      <div className="flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
        <Image
          src={sponsor.image}
          alt={`${sponsor.name} sponsor logo`}
          width={900}
          height={520}
          sizes={compact ? "(max-width: 768px) 70vw, 180px" : "(max-width: 768px) 90vw, 240px"}
          className={`h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.03] ${imageHeight}`}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
      </div>
      <span className="mt-4 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300 transition-colors duration-300 group-hover:border-yellow-400/70 group-hover:text-yellow-200">
        {sponsor.category}
      </span>
      <h3 className="mt-4 text-sm font-black uppercase tracking-wide text-white transition-colors duration-300 group-hover:text-yellow-400 sm:text-base">
        {sponsor.name}
      </h3>
    </button>
  );
}
