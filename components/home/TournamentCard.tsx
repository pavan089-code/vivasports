"use client";

import { Award, CalendarDays, MapPin, Medal, Play, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { Tournament } from "@/services/tournamentService";

const statusDesign = {
  upcoming: {
    badge: "border-[#d4af37]/35 bg-[#d4af37]/15 text-[#f4d878]",
    button: "bg-[#d4af37] text-[#07152e] hover:bg-[#e5c158]",
    label: "Upcoming",
  },
  live: {
    badge: "border-emerald-300/35 bg-emerald-400/15 text-emerald-200",
    button: "bg-emerald-400 text-[#041c16] hover:bg-emerald-300",
    label: "Live",
  },
  completed: {
    badge: "border-slate-300/20 bg-slate-400/10 text-slate-300",
    button: "bg-slate-200 text-[#07152e] hover:bg-white",
    label: "Past",
  },
} as const;

export default function TournamentCard({ tournament, index, featuredMatch }: { tournament: Tournament; index: number; featuredMatch?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const design = statusDesign[tournament.status];
  const poster = getSafePoster(tournament.poster);
  const date = formatDateRange(tournament.startDate, tournament.endDate);
  const primary = getPrimaryAction(tournament);
  const detailsLabel = tournament.status === "upcoming" ? "View Details" : "View Tournament";
  const badge = tournament.status === "upcoming" ? tournament.registrationStatus || (tournament.registrationOpen ? "Registration Open" : design.label) : design.label;

  return (
    <motion.article
      className="h-full min-w-[calc(100%-1.5rem)] snap-center sm:min-w-[78%] md:min-w-0"
      initial={false}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.21), ease: "easeOut" }}
      viewport={{ once: true, margin: "-60px" }}
      whileInView={prefersReducedMotion ? undefined : { opacity: [0, 1], y: [22, 0] }}
    >
      <motion.div
        className="group flex h-full flex-col rounded-2xl border border-[#d4af37]/24 bg-[#0d1d3a] p-3 shadow-[0_24px_70px_rgba(0,0,0,.3)] transition duration-300 hover:border-[#d4af37]/70 hover:shadow-[0_30px_90px_rgba(0,0,0,.42),0_0_34px_rgba(212,175,55,.13)]"
        whileHover={prefersReducedMotion ? undefined : { y: -7 }}
        transition={{ duration: 0.22 }}
      >
        <div className="relative aspect-video overflow-hidden rounded-xl bg-[#07152e]">
          <Image alt={`${tournament.title} tournament poster`} className="object-cover transition duration-700 group-hover:scale-105" fill sizes="(max-width: 767px) 90vw, (max-width: 1279px) 50vw, 33vw" src={poster} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07152e]/85 via-transparent to-transparent" />
          <span className={`absolute top-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full border px-3 py-1 text-[0.65rem] font-black tracking-[0.12em] uppercase backdrop-blur-md ${design.badge}`}>
            {tournament.status === "live" && <span aria-hidden="true" className="mr-2 inline-block size-2 animate-pulse rounded-full bg-emerald-300 motion-reduce:animate-none" />}
            {badge}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-3 pt-5 md:p-5 md:pt-6">
          <p className="text-xs font-black tracking-[0.18em] text-[#d4af37] uppercase">{tournament.edition || "Viva Sports"}</p>
          <h3 className="mt-2 text-2xl leading-[1.05] font-black tracking-[-0.025em] text-white uppercase">{tournament.title}</h3>

          {featuredMatch && tournament.status === "live" && <div className="mt-4 rounded-xl border border-emerald-300/18 bg-emerald-400/8 px-4 py-3"><span className="block text-[.62rem] font-black tracking-[.14em] text-emerald-200 uppercase">Featured live match</span><strong className="mt-1 block truncate text-sm text-white">{featuredMatch}</strong></div>}

          {tournament.status === "completed" ? (
            <div className="mt-6 space-y-2">
              <InfoChip icon={CalendarDays} label={date || "Dates TBA"} />
              <Honour icon={Trophy} label="Winner" value={tournament.winner || "To be archived"} />
              <Honour icon={Medal} label="Runner-up" value={tournament.runnerUp || "To be archived"} />
              <Honour icon={Award} label="Player of tournament" value={tournament.playerOfTournament || "To be archived"} />
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-2">
              <InfoChip icon={MapPin} label={tournament.city || "Venue TBA"} />
              <InfoChip icon={CalendarDays} label={date || "Dates TBA"} />
              {tournament.prizePool && <InfoChip className="col-span-2" icon={Trophy} label={`Prize pool · ${tournament.prizePool}`} />}
            </div>
          )}

          <div className="mt-auto grid grid-cols-1 gap-2 pt-6 sm:grid-cols-2">
            <Link className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 text-center text-xs font-black uppercase transition ${design.button}`} href={primary.href} target={primary.external ? "_blank" : undefined} rel={primary.external ? "noreferrer" : undefined}>
              {(tournament.status === "live" || tournament.status === "completed") && <Play className="size-3.5 fill-current" />}{primary.label}
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/5 px-4 text-center text-xs font-black text-white uppercase transition hover:border-[#d4af37]/40 hover:text-[#e5c158]" href={tournament.buttonLink || "/seasons"}>{detailsLabel}</Link>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

function InfoChip({ icon: Icon, label, className = "" }: { icon: typeof MapPin; label: string; className?: string }) {
  return <span className={`flex min-h-11 items-center gap-2 rounded-xl border border-white/6 bg-white/4 px-3 py-2 text-xs font-bold text-slate-300 ${className}`}><Icon aria-hidden="true" className="size-4 shrink-0 text-[#d4af37]" /><span className="line-clamp-2">{label}</span></span>;
}

function Honour({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: string }) {
  return <span className="grid min-h-11 grid-cols-[1rem_6.5rem_minmax(0,1fr)] items-center gap-2 rounded-xl border border-white/6 bg-white/4 px-3 py-2 text-xs"><Icon aria-hidden="true" className="size-4 text-[#d4af37]" /><span className="font-bold text-slate-500">{label}</span><strong className="truncate text-right text-slate-200">{value}</strong></span>;
}

function getPrimaryAction(tournament: Tournament) {
  if (tournament.status === "live") return { label: "Watch Live", href: tournament.livestream || "/live", external: isExternal(tournament.livestream) };
  if (tournament.status === "completed") return { label: "Watch Highlights", href: tournament.youtubeHighlights || "/gallery", external: isExternal(tournament.youtubeHighlights) };
  return { label: "Register Team", href: "/register", external: false };
}

function isExternal(value?: string) { return Boolean(value && /^https?:\/\//i.test(value)); }

function getSafePoster(poster: string) {
  if (poster.startsWith("/")) return poster;
  try { const hostname = new URL(poster).hostname; if (hostname === "firebasestorage.googleapis.com" || hostname.endsWith(".googleusercontent.com")) return poster; } catch {}
  return "/highlights/match-night.png";
}

function formatDateRange(startDate: string, endDate: string) {
  const format = (value: string) => { if (!value) return ""; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date); };
  const start = format(startDate); const end = format(endDate); return start && end ? `${start} – ${end}` : start || end;
}
