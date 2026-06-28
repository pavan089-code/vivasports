"use client";

import { CalendarDays, ChevronRight, MapPin, Radio, Trophy, Users } from "lucide-react";
import Link from "next/link";

import type { HomepageData, HomepageMatch, HomepageTeam, HomepageTournament } from "@/services/homepageService";

export default function CurrentTournamentHub({ data, loading }: { data: HomepageData | null; loading: boolean }) {
  const tournament = data?.tournament;
  const liveMatch = data?.liveMatches[0];
  const upcomingMatches = data?.upcomingMatches ?? [];
  const recentResults = data?.recentResults ?? [];
  const standings = data?.standings ?? [];

  return (
    <section aria-labelledby="tournament-hub-title" className="bg-[#07152e] py-16 md:py-24">
      <div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
        <header className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.22em] text-[#d4af37] uppercase">Tournament command center</p>
            <h2 className="mt-3 text-4xl leading-none font-black tracking-[-0.035em] text-white uppercase md:text-6xl" id="tournament-hub-title">
              {tournament?.status === "live" ? "Current Tournament" : tournament ? "Upcoming Tournament" : "No Active Tournament"}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">One place for the live contest, next fixtures, latest results and the race through the table.</p>
          </div>
          <Link className="inline-flex w-fit min-h-11 items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/8 px-5 text-sm font-black text-[#e5c158] uppercase transition hover:-translate-y-0.5 hover:bg-[#d4af37]/15" href="/seasons">
            View tournament <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </header>

        {loading ? <HubSkeleton /> : (
          <div className="grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
            <div className="space-y-5">
              <TournamentIdentity tournament={tournament} />
              <div className="grid gap-5 md:grid-cols-2">
                <MatchList title="Upcoming matches" icon={CalendarDays} matches={upcomingMatches} empty="The next fixtures will be published here." />
                <MatchList title="Recent results" icon={Trophy} matches={recentResults} empty="Results will appear after the first completed match." />
              </div>
            </div>
            <div className="space-y-5">
              <LiveMatchCard match={liveMatch} />
              <Standings teams={standings} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TournamentIdentity({ tournament }: { tournament?: HomepageTournament }) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-[#d4af37]/25 bg-[radial-gradient(circle_at_85%_10%,rgba(212,175,55,.18),transparent_32%),linear-gradient(135deg,#10254a,#08172f)] p-7 shadow-[0_28px_80px_rgba(0,0,0,.3)] md:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-3 py-1.5 text-[.68rem] font-black tracking-[.14em] uppercase ${tournament?.status === "live" ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-200" : "border-[#d4af37]/35 bg-[#d4af37]/12 text-[#f4d878]"}`}>
          {tournament?.status === "live" ? "Live now" : tournament ? "Coming next" : "Awaiting announcement"}
        </span>
        <span className="text-xs font-black tracking-[.16em] text-[#d4af37] uppercase">{tournament?.edition || "Viva Sports"}</span>
      </div>
      <h3 className="mt-5 max-w-3xl text-3xl leading-none font-black text-white uppercase md:text-5xl">{tournament?.title || "No Active Tournament"}</h3>
      <p className="mt-4 max-w-2xl leading-7 text-slate-300">{tournament?.subtitle || tournament?.trophyName || "Official tournament information will appear here as soon as the next edition is published."}</p>
      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <Info icon={MapPin} value={tournament?.city || "Venue TBA"} />
        <Info icon={CalendarDays} value={formatDate(tournament?.startDate)} />
        <Info icon={Users} value={tournament?.teams ? `${tournament.teams} teams` : "Teams TBA"} />
      </div>
    </article>
  );
}

function LiveMatchCard({ match }: { match?: HomepageMatch }) {
  return (
    <article className="rounded-[2rem] border border-rose-300/18 bg-[#101d35] p-7 shadow-[0_22px_65px_rgba(0,0,0,.24)]">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-black tracking-[.16em] text-rose-200 uppercase"><i className="size-2 animate-pulse rounded-full bg-rose-400 motion-reduce:animate-none" /> Live match</span>
        <Radio className="size-5 text-rose-300" aria-hidden="true" />
      </div>
      {match ? <>
        <h3 className="mt-6 text-2xl font-black text-white uppercase md:text-3xl">{match.teamA} <span className="text-[#d4af37]">vs</span> {match.teamB}</h3>
        <p className="mt-4 text-sm text-slate-400">{match.ground || "Venue TBA"} · {[match.date, match.time].filter(Boolean).join(" · ") || "In progress"}</p>
        <Link className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d4af37] px-5 text-sm font-black text-[#07152e] uppercase transition hover:bg-[#e5c158]" href={`/live/${match.id}`}>Open live center <ChevronRight className="size-4" /></Link>
      </> : <>
        <h3 className="mt-6 text-2xl font-black text-white uppercase">No match is live right now</h3>
        <p className="mt-3 leading-7 text-slate-400">Live scoring and streaming links will activate here when play begins.</p>
        <Link className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#e5c158] uppercase" href="/fixtures">View fixtures <ChevronRight className="size-4" /></Link>
      </>}
    </article>
  );
}

function MatchList({ title, icon: Icon, matches, empty }: { title: string; icon: typeof Trophy; matches: HomepageMatch[]; empty: string }) {
  return <article className="rounded-3xl border border-white/8 bg-[#101d35] p-6">
    <h3 className="flex items-center gap-2 text-sm font-black tracking-[.12em] text-white uppercase"><Icon className="size-4 text-[#d4af37]" />{title}</h3>
    <div className="mt-5 space-y-3">{matches.length ? matches.map((match) => <Link href={`/live/${match.id}`} className="block rounded-2xl border border-white/6 bg-white/4 p-4 transition hover:border-[#d4af37]/25" key={match.id}><strong className="block text-sm text-white">{match.teamA || "Team A"} <span className="text-[#d4af37]">vs</span> {match.teamB || "Team B"}</strong><span className="mt-1 block text-xs leading-5 text-slate-400">{match.result || [match.date, match.time].filter(Boolean).join(" · ") || "Schedule TBA"}</span></Link>) : <p className="text-sm leading-6 text-slate-400">{empty}</p>}</div>
  </article>;
}

function Standings({ teams }: { teams: HomepageTeam[] }) {
  return <article className="rounded-[2rem] border border-white/8 bg-[#101d35] p-6 md:p-7">
    <div className="flex items-center justify-between"><h3 className="text-sm font-black tracking-[.12em] text-white uppercase">Points table preview</h3><Link className="text-xs font-black text-[#e5c158] uppercase" href="/pointstable">Full table</Link></div>
    <div className="mt-5 space-y-2">{teams.length ? teams.map((team, index) => <div className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1 rounded-2xl bg-white/4 px-3 py-3 sm:grid-cols-[2rem_minmax(0,1fr)_auto]" key={team.id || team.name}><b className="text-[#d4af37]">{index + 1}</b><strong className="truncate text-sm text-white">{team.name}</strong><span className="col-start-2 text-xs font-bold text-slate-400 sm:col-start-3 sm:row-start-1">{team.points || 0} pts · {Number(team.nrr || 0).toFixed(2)}</span></div>) : <p className="text-sm text-slate-400">Standings will appear when teams begin league play.</p>}</div>
  </article>;
}

function Info({ icon: Icon, value }: { icon: typeof MapPin; value: string }) { return <span className="flex min-h-12 items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 text-sm font-bold text-slate-200"><Icon className="size-4 shrink-0 text-[#d4af37]" />{value}</span>; }
function formatDate(value?: string) { if (!value) return "Dates TBA"; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date); }
function HubSkeleton() { return <div className="grid gap-5 xl:grid-cols-2"><div className="h-[520px] animate-pulse rounded-[2rem] bg-white/5" /><div className="h-[520px] animate-pulse rounded-[2rem] bg-white/5" /></div>; }
