import { Radio, Sparkles } from "lucide-react";

const announcements = [
  "Registrations open for the next Viva Sports edition",
  "Follow live scores, fixtures and match results",
  "Celebrating local cricket on a professional stage",
  "Tournament updates published throughout the season",
];

export default function ScrollingAnnouncementBanner() {
  const repeatedAnnouncements = [...announcements, ...announcements];

  return (
    <aside aria-label="Viva Sports announcements" className="mt-6 overflow-hidden border-y border-[#d4af37]/20 bg-[#0b1d3d]">
      <div className="mx-auto flex max-w-[1400px] items-stretch">
        <div className="relative z-10 hidden shrink-0 items-center gap-2 bg-[#d4af37] px-6 text-xs font-black tracking-[0.16em] text-[#07152e] uppercase shadow-[16px_0_30px_rgba(7,21,46,.45)] sm:flex">
          <Radio aria-hidden="true" className="size-4" /> Latest
        </div>
        <div className="min-w-0 flex-1 overflow-hidden py-4">
          <div className="flex w-max animate-[viva-premium-marquee_34s_linear_infinite] motion-reduce:animate-none">
            {repeatedAnnouncements.map((announcement, index) => (
              <span className="flex items-center gap-3 pr-10 text-sm font-black tracking-[0.08em] text-slate-100 uppercase" key={`${announcement}-${index}`}>
                <Sparkles aria-hidden="true" className="size-4 text-[#d4af37]" /> {announcement}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
