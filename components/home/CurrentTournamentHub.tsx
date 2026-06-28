"use client";

import { CalendarDays, ChevronRight, Clock3, Film, Play, Radio, Trophy } from "lucide-react";
import Link from "next/link";

import type { HomepageData, HomepageMatch, HomepageTournament } from "@/services/homepageService";

export default function CurrentTournamentHub({ data, loading }: { data: HomepageData | null; loading: boolean }) {
  const tournament = data?.tournament;
  const liveMatches = data?.liveMatches ?? [];
  const isActive = tournament?.status === "live" || liveMatches.length > 0;

  return (
    <section aria-labelledby="live-match-center-title" className="bg-[#081831] py-14 md:py-16 lg:py-20" id="live-match-center">
      <div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.22em] text-[#d4af37] uppercase">Happening now</p>
            <h2 className="mt-3 text-4xl leading-none font-black tracking-[-0.035em] text-white uppercase md:text-6xl" id="live-match-center-title">Live Match Center</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">Live streaming, matches, today&apos;s fixtures and recent results in one focused matchday view.</p>
          </div>
          <Link className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/8 px-5 text-sm font-black text-[#e5c158] uppercase transition hover:-translate-y-0.5 hover:bg-[#d4af37]/15" href="/seasons">View tournament <ChevronRight className="size-4" /></Link>
        </header>

        {loading ? <HubSkeleton /> : isActive ? <ActiveCenter data={data} /> : <InactiveCenter tournament={tournament} />}
      </div>
    </section>
  );
}

function ActiveCenter({ data }: { data: HomepageData | null }) {
  const liveMatches = data?.liveMatches ?? [];
  return <div className="grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
    <div className="space-y-5">
      <LiveStream match={liveMatches[0]} />
      <MatchList title="Live matches" icon={Radio} matches={liveMatches} empty="No match is live at this moment." />
    </div>
    <div className="space-y-5">
      <MatchList title="Today's fixtures" icon={CalendarDays} matches={data?.upcomingMatches ?? []} empty="Today's fixtures will appear here." />
      <MatchList title="Recent results" icon={Trophy} matches={data?.recentResults ?? []} empty="Results will appear after the first completed match." />
    </div>
  </div>;
}

function InactiveCenter({ tournament }: { tournament?: HomepageTournament }) {
  return <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
    <article className="rounded-[2rem] border border-[#d4af37]/22 bg-[radial-gradient(circle_at_85%_10%,rgba(212,175,55,.17),transparent_32%),linear-gradient(135deg,#10254a,#08172f)] p-7 md:p-10">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-slate-300 uppercase"><Clock3 className="size-4 text-[#d4af37]" /> Between tournaments</span>
      <h3 className="mt-6 text-3xl font-black text-white uppercase md:text-5xl">No Live Matches</h3>
      <p className="mt-4 max-w-2xl leading-7 text-slate-300">Live streaming and match updates will switch on automatically when play begins.</p>
      <div className="mt-8 rounded-3xl border border-white/8 bg-[#07152e]/55 p-6">
        <p className="text-xs font-black tracking-[.16em] text-[#d4af37] uppercase">Countdown to next tournament</p>
        <strong className="mt-3 block text-2xl font-black text-white uppercase">{countdownLabel(tournament?.startDate)}</strong>
        <p className="mt-2 text-sm text-slate-400">{tournament?.title || "The next edition will be announced soon"}</p>
      </div>
    </article>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
      <Link className="rounded-3xl border border-white/8 bg-[#101d35] p-7 transition hover:-translate-y-1 hover:border-[#d4af37]/30" href="/gallery"><Film className="size-7 text-[#d4af37]" /><h3 className="mt-5 text-xl font-black text-white uppercase">Watch highlights</h3><p className="mt-2 text-sm leading-6 text-slate-400">Relive standout moments from previous Viva tournaments.</p></Link>
      <Link className="rounded-3xl border border-white/8 bg-[#101d35] p-7 transition hover:-translate-y-1 hover:border-[#d4af37]/30" href={tournament?.buttonLink || "/seasons"}><CalendarDays className="size-7 text-[#d4af37]" /><h3 className="mt-5 text-xl font-black text-white uppercase">View tournament</h3><p className="mt-2 text-sm leading-6 text-slate-400">Explore the next tournament and published details.</p></Link>
    </div>
  </div>;
}

function LiveStream({ match }: { match?: HomepageMatch }) {
  return <article className="relative overflow-hidden rounded-[2rem] border border-rose-300/18 bg-[radial-gradient(circle_at_85%_20%,rgba(244,63,94,.14),transparent_30%),#101d35] p-7 md:p-9">
    <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-xs font-black tracking-[.16em] text-rose-200 uppercase"><i className="size-2 animate-pulse rounded-full bg-rose-400 motion-reduce:animate-none" /> Live stream</span><Radio className="size-5 text-rose-300" /></div>
    <h3 className="mt-7 text-2xl font-black text-white uppercase md:text-4xl">{match ? `${match.teamA || "Team A"} vs ${match.teamB || "Team B"}` : "Stream activates at match time"}</h3>
    <p className="mt-3 text-sm text-slate-400">{match?.ground || "Official Viva Sports broadcast"}</p>
    <Link className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#d4af37] px-6 text-sm font-black text-[#07152e] uppercase hover:bg-[#e5c158]" href={match ? `/live/${match.id}` : "/live"}><Play className="size-4 fill-current" /> Watch live</Link>
  </article>;
}

function MatchList({ title, icon: Icon, matches, empty }: { title: string; icon: typeof Trophy; matches: HomepageMatch[]; empty: string }) {
  return <article className="rounded-3xl border border-white/8 bg-[#101d35] p-6"><h3 className="flex items-center gap-2 text-sm font-black tracking-[.12em] text-white uppercase"><Icon className="size-4 text-[#d4af37]" />{title}</h3><div className="mt-5 space-y-3">{matches.length ? matches.slice(0, 3).map((match) => <Link href={`/live/${match.id}`} className="block rounded-2xl border border-white/6 bg-white/4 p-4 transition hover:border-[#d4af37]/25" key={match.id}><strong className="block text-sm text-white">{match.teamA || "Team A"} <span className="text-[#d4af37]">vs</span> {match.teamB || "Team B"}</strong><span className="mt-1 block text-xs leading-5 text-slate-400">{match.result || [match.date, match.time].filter(Boolean).join(" · ") || "Schedule TBA"}</span></Link>) : <p className="text-sm leading-6 text-slate-400">{empty}</p>}</div></article>;
}

function countdownLabel(value?: string) { if (!value) return "Date to be announced"; const date = new Date(value); if (Number.isNaN(date.getTime())) return value; const days = Math.ceil((date.getTime() - Date.now()) / 86_400_000); return days > 1 ? `${days} days to go` : days === 1 ? "Tomorrow" : days === 0 ? "Begins today" : "Coming soon"; }
function HubSkeleton() { return <div className="grid gap-5 xl:grid-cols-2"><div className="h-[520px] animate-pulse rounded-[2rem] bg-white/5" /><div className="h-[520px] animate-pulse rounded-[2rem] bg-white/5" /></div>; }
