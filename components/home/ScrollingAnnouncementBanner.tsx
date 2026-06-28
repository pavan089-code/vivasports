import { Radio } from "lucide-react";

export const defaultAnnouncements = [
  { type: "🔥 Live Match", message: "Follow every ball from the Viva Live Center" },
  { type: "🏆 Registrations Open", message: "Team entries are open for the next Viva Sports edition" },
  { type: "📺 Watch Live", message: "Streaming links activate from the official match center" },
  { type: "📍 Venue Update", message: "Matchday venue updates are published with the fixtures" },
  { type: "🎉 Champion Announcement", message: "Relive every title winner in the Viva Legacy archive" },
  { type: "⚠ Weather Update", message: "Schedule changes will be announced here first" },
];

export default function ScrollingAnnouncementBanner({ announcements = defaultAnnouncements }: { announcements?: typeof defaultAnnouncements }) {
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
              <span className="flex items-center gap-3 pr-10 text-sm font-black tracking-[0.06em] text-slate-100 uppercase" key={`${announcement.type}-${index}`}>
                <b className="text-[#e5c158]">{announcement.type}</b><span className="text-slate-300">{announcement.message}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
