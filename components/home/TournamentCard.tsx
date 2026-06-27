"use client";

import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { Tournament } from "@/services/tournamentService";

const statusDesign = {
  upcoming: {
    badge: "border-[#d4af37]/35 bg-[#d4af37]/15 text-[#f4d878]",
    button: "bg-[#d4af37] text-[#07152e] hover:bg-[#e5c158]",
    fallbackButton: "Register now",
    label: "Upcoming",
  },
  live: {
    badge: "border-emerald-300/35 bg-emerald-400/15 text-emerald-200",
    button: "bg-emerald-400 text-[#041c16] hover:bg-emerald-300",
    fallbackButton: "Watch live",
    label: "Live",
  },
  completed: {
    badge: "border-slate-300/20 bg-slate-400/10 text-slate-300",
    button: "bg-slate-200 text-[#07152e] hover:bg-white",
    fallbackButton: "View results",
    label: "Completed",
  },
} as const;

export default function TournamentCard({ tournament, index }: { tournament: Tournament; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const design = statusDesign[tournament.status];
  const href = tournament.buttonLink || fallbackLink(tournament.status);
  const poster = getSafePoster(tournament.poster);
  const date = formatDateRange(tournament.startDate, tournament.endDate);

  return (
    <motion.article
      className="h-full min-w-[calc(100%-1.5rem)] snap-center sm:min-w-[78%] md:min-w-0"
      initial={false}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.21), ease: "easeOut" }}
      viewport={{ once: true, margin: "-60px" }}
      whileInView={prefersReducedMotion ? undefined : { opacity: [0, 1], y: [22, 0] }}
    >
      <motion.div className="h-full" whileHover={prefersReducedMotion ? undefined : { y: -7 }} transition={{ duration: 0.22 }}>
        <Link
          aria-label={`${tournament.title}: ${tournament.buttonText || design.fallbackButton}`}
          className="group flex h-full flex-col rounded-2xl border border-[#d4af37]/24 bg-[#0d1d3a] p-3 shadow-[0_24px_70px_rgba(0,0,0,.3)] transition duration-300 hover:border-[#d4af37]/70 hover:shadow-[0_30px_90px_rgba(0,0,0,.42),0_0_34px_rgba(212,175,55,.13)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4af37]"
          href={href}
        >
          <div className="relative aspect-video overflow-hidden rounded-xl bg-[#07152e]">
            <Image
              alt={`${tournament.title} tournament poster`}
              className="object-cover transition duration-700 group-hover:scale-105"
              fill
              sizes="(max-width: 767px) 90vw, (max-width: 1279px) 50vw, 33vw"
              src={poster}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07152e]/85 via-transparent to-transparent" />
            <span className={`absolute top-3 left-3 rounded-full border px-3 py-1 text-[0.65rem] font-black tracking-[0.14em] uppercase backdrop-blur-md ${design.badge}`}>
              {tournament.status === "live" && <span aria-hidden="true" className="mr-2 inline-block size-2 animate-pulse rounded-full bg-emerald-300 motion-reduce:animate-none" />}
              {design.label}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-3 pt-5 md:p-5 md:pt-6">
            <p className="text-xs font-black tracking-[0.18em] text-[#d4af37] uppercase">{tournament.edition || "Viva Sports"}</p>
            <h3 className="mt-2 text-2xl leading-[1.05] font-black tracking-[-0.025em] text-white uppercase">{tournament.title}</h3>
            {(tournament.subtitle || tournament.trophyName) && (
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{tournament.subtitle || tournament.trophyName}</p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-2">
              <InfoChip icon={MapPin} label={tournament.city || "Venue TBA"} />
              <InfoChip icon={CalendarDays} label={date || "Dates TBA"} />
              <InfoChip icon={Trophy} label={tournament.prizePool || "Prize pool TBA"} />
              <InfoChip icon={Users} label={tournament.teams ? `${tournament.teams} teams` : "Teams TBA"} />
            </div>

            <span className={`mt-6 inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-black uppercase transition ${design.button}`}>
              {tournament.buttonText || design.fallbackButton}
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.article>
  );
}

function InfoChip({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <span className="flex min-h-11 items-center gap-2 rounded-xl border border-white/6 bg-white/4 px-3 py-2 text-xs font-bold text-slate-300">
      <Icon aria-hidden="true" className="size-4 shrink-0 text-[#d4af37]" />
      <span className="line-clamp-2">{label}</span>
    </span>
  );
}

function fallbackLink(status: Tournament["status"]) {
  if (status === "live") return "/live";
  if (status === "completed") return "/results";
  return "/register";
}

function getSafePoster(poster: string) {
  if (poster.startsWith("/")) return poster;

  try {
    const hostname = new URL(poster).hostname;
    if (hostname === "firebasestorage.googleapis.com" || hostname.endsWith(".googleusercontent.com")) return poster;
  } catch {
    // Fall through to a stable local placeholder when Firestore contains an invalid URL.
  }

  return "/highlights/match-night.png";
}

function formatDateRange(startDate: string, endDate: string) {
  const format = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
  };

  const start = format(startDate);
  const end = format(endDate);
  return start && end ? `${start} – ${end}` : start || end;
}
