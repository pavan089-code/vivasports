"use client";

import { CalendarDays, ChevronRight, MapPin, Radio, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { subscribeToMatches } from "@/services/matchService";
import { sortRecentMatches } from "@/utils/tournamentUtils";

type MatchStatus = "scheduled" | "live" | "paused" | "innings_break" | "completed" | "abandoned";

type HomeMatch = {
  id: string;
  status?: MatchStatus | string;
  teamA?: string;
  teamB?: string;
  date?: string;
  time?: string;
  ground?: string;
  oversLimit?: number | string;
  result?: string;
  pauseReason?: string;
};

const liveStatuses = new Set(["live", "paused", "innings_break"]);

export default function HomepageMatchCenter() {
  const [matches, setMatches] = useState<HomeMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMatches(
      (data: HomeMatch[]) => {
        setMatches(data);
        setIsLoading(false);
      },
      () => setIsLoading(false),
    );

    return () => unsubscribe();
  }, []);

  const liveMatches = useMemo(
    () => matches.filter((match) => liveStatuses.has(match.status ?? "")),
    [matches],
  );
  const latestResults = useMemo(
    () => sortRecentMatches(matches.filter((match) => match.status === "completed" || match.status === "abandoned")).slice(0, 4) as HomeMatch[],
    [matches],
  );

  return (
    <div className="bg-[#07152e]">
      <MatchSection
        accent="live"
        eyebrow="Live match center"
        emptyText="No matches are live right now. Check the upcoming fixtures below."
        href="/live"
        isLoading={isLoading}
        matches={liveMatches}
        title="Follow Every Ball, Live"
      />

      <MatchSection
        accent="result"
        eyebrow="Latest results"
        emptyText="Completed match results will appear here."
        href="/results"
        isLoading={isLoading}
        matches={latestResults}
        title="The Latest From The Field"
      />
    </div>
  );
}

function MatchSection({
  accent,
  eyebrow,
  emptyText,
  href,
  isLoading,
  matches,
  title,
}: {
  accent: "live" | "result";
  eyebrow: string;
  emptyText: string;
  href: string;
  isLoading: boolean;
  matches: HomeMatch[];
  title: string;
}) {
  return (
    <section className="py-16 md:py-24" aria-labelledby={`${accent}-matches-title`}>
      <div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#d4af37] uppercase">{eyebrow}</p>
            <h2 id={`${accent}-matches-title`} className="mt-3 text-3xl leading-none font-black tracking-[-0.03em] text-white uppercase md:text-5xl">
              {title}
            </h2>
          </div>
          <Link className="inline-flex w-fit items-center gap-2 text-sm font-black text-[#e5c158] uppercase transition hover:text-white" href={href}>
            View all <ChevronRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        {isLoading ? (
          <div aria-label={`Loading ${eyebrow}`} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="h-56 animate-pulse rounded-3xl border border-white/5 bg-white/5" key={index} />
            ))}
          </div>
        ) : matches.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {matches.map((match) => <MatchCard accent={accent} key={match.id} match={match} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/8 bg-[#101d35] px-6 py-10 text-center text-slate-400">
            {emptyText}
          </div>
        )}
      </div>
    </section>
  );
}

function MatchCard({ match, accent }: { match: HomeMatch; accent: "live" | "result" }) {
  const badgeStyles = {
    live: "bg-rose-400/15 text-rose-200 ring-rose-300/20",
    result: "bg-emerald-400/15 text-emerald-100 ring-emerald-300/20",
  }[accent];
  const BadgeIcon = accent === "live" ? Radio : Trophy;

  return (
    <article className="group flex min-h-64 flex-col rounded-3xl border border-white/8 bg-[#101d35] p-6 shadow-[0_20px_55px_rgba(0,0,0,.18)] transition hover:-translate-y-1 hover:border-[#d4af37]/30">
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.68rem] font-black tracking-wider uppercase ring-1 ${badgeStyles}`}>
          <BadgeIcon aria-hidden="true" className="size-3.5" />
          {match.status?.replace("_", " ") || accent}
        </span>
        <span className="text-xs font-bold text-slate-500">{match.oversLimit ? `${match.oversLimit} overs` : "T20"}</span>
      </div>

      <h3 className="mt-6 text-xl leading-tight font-black text-white uppercase">
        {match.teamA || "Team A"} <span className="text-[#d4af37]">vs</span> {match.teamB || "Team B"}
      </h3>

      <div className="mt-5 space-y-2 text-sm text-slate-400">
        <p className="flex items-center gap-2"><MapPin aria-hidden="true" className="size-4 text-[#d4af37]" />{match.ground || "Venue TBA"}</p>
        <p className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4 text-[#d4af37]" />{[match.date, match.time].filter(Boolean).join(" · ") || "Schedule TBA"}</p>
      </div>

      {(match.result || match.pauseReason) && (
        <p className="mt-4 text-sm font-bold text-emerald-200">{match.result || `Paused: ${match.pauseReason}`}</p>
      )}

      <Link className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-black text-[#e5c158] uppercase transition group-hover:text-white" href={`/live/${match.id}`}>
        Match center <ChevronRight aria-hidden="true" className="size-4" />
      </Link>
    </article>
  );
}
