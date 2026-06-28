import { ArrowUpRight, Radio } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type Announcement = {
  title: string;
  description: string;
  status: string;
  image: string;
  cta?: string;
  href?: string;
};

export const defaultAnnouncements: Announcement[] = [
  { title: "United Cricket Fest", description: "Register before July 20", status: "Registrations Open", image: "/highlights/champions.png", cta: "Register", href: "/register" },
  { title: "Moosarambagh vs United Nalgonda", description: "Follow the match from the official live center", status: "Live Now", image: "/highlights/match-night.png", cta: "Watch Live", href: "/live" },
  { title: "Semi Final Highlights", description: "Relive the decisive moments", status: "Match Highlights", image: "/highlights/champions.png", cta: "Watch Now", href: "/gallery" },
  { title: "Next Tournament", description: "August 2026", status: "Coming Soon", image: "/highlights/match-night.png", cta: "Explore", href: "/seasons" },
];

export default function ScrollingAnnouncementBanner({ announcements = defaultAnnouncements }: { announcements?: Announcement[] }) {
  const items = announcements.length ? announcements : defaultAnnouncements;
  const repeatedAnnouncements = [...items, ...items];

  return (
    <aside aria-label="Viva Sports announcements" className="group mt-6 h-20 overflow-hidden border-y border-[#d4af37]/20 bg-[#0b1d3d]">
      <div className="mx-auto flex h-full max-w-[1400px] items-stretch">
        <div className="relative z-10 hidden shrink-0 items-center gap-2 bg-[#d4af37] px-6 text-xs font-black tracking-[0.16em] text-[#07152e] uppercase shadow-[16px_0_30px_rgba(7,21,46,.45)] sm:flex">
          <Radio aria-hidden="true" className="size-4" /> Latest
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex h-full w-max animate-[viva-premium-marquee_38s_linear_infinite] items-center motion-reduce:animate-none group-hover:[animation-play-state:paused]">
            {repeatedAnnouncements.map((announcement, index) => (
              <TickerItem announcement={announcement} key={`${announcement.title}-${index}`} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function TickerItem({ announcement }: { announcement: Announcement }) {
  const content = <>
    <span className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#07152e]">
      <Image alt="" className="object-cover" fill loading="lazy" sizes="48px" src={safeImage(announcement.image)} />
    </span>
    <span className="min-w-0">
      <span className="flex items-center gap-2">
        <b className="max-w-40 truncate text-sm font-black text-white sm:max-w-56">{announcement.title}</b>
        <span className="shrink-0 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-2 py-0.5 text-[.58rem] font-black tracking-[.1em] text-[#e5c158] uppercase">{announcement.status}</span>
      </span>
      <span className="mt-1 block max-w-72 truncate text-xs text-slate-400">{announcement.description}</span>
    </span>
    {announcement.cta && <span className="hidden shrink-0 items-center gap-1 text-xs font-black text-[#e5c158] uppercase sm:flex">{announcement.cta}<ArrowUpRight className="size-3.5" /></span>}
  </>;

  const className = "flex h-full min-w-[330px] items-center gap-3 border-r border-white/8 px-4 sm:min-w-[430px] sm:px-6";
  return announcement.href ? <Link className={`${className} transition hover:bg-white/4`} href={announcement.href}>{content}</Link> : <div className={className}>{content}</div>;
}

function safeImage(src: string) {
  if (src.startsWith("/")) return src;
  try {
    const hostname = new URL(src).hostname;
    if (hostname === "firebasestorage.googleapis.com" || hostname.endsWith(".googleusercontent.com")) return src;
  } catch {}
  return "/highlights/match-night.png";
}
