"use client";

import { Play, Radio, Trophy } from "lucide-react";
import Link from "next/link";

import Button from "@/components/ui/Button";
import HomepageSectionHeader from "@/components/ui/HomepageSectionHeader";
import type { HomepageData, HomepageMatch } from "@/services/homepageService";

export default function CurrentTournamentHub({ data, loading }: { data: HomepageData | null; loading: boolean }) {
  return (
    <section aria-labelledby="live-match-center-title" className="bg-[#081831] py-12 md:py-16" id="live-match-center">
      <div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
        <HomepageSectionHeader
          action="View Tournament"
          description="Watch live matches with livestreams and real-time score updates from one central match hub."
          eyebrow="Happening now"
          headingId="live-match-center-title"
          href="/seasons"
          title="Live Match Center"
        />

        {loading ? <HubSkeleton /> : <MatchCenter data={data} />}
      </div>
    </section>
  );
}

function MatchCenter({ data }: { data: HomepageData | null }) {
  const liveMatches = data?.liveMatches ?? [];
  return <div className="grid gap-5 lg:grid-cols-2">
    <LiveStream match={liveMatches[0]} />
    <MatchList title="Scoreboard" icon={Trophy} matches={liveMatches} empty="Real-time scores will appear here when play begins." />
  </div>;
}

function LiveStream({ match }: { match?: HomepageMatch }) {
  return <article className="relative overflow-hidden rounded-[2rem] border border-rose-300/18 bg-[radial-gradient(circle_at_85%_20%,rgba(244,63,94,.14),transparent_30%),#101d35] p-7 md:p-9">
    <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-xs font-black tracking-[.16em] text-rose-200 uppercase"><i className="size-2 animate-pulse rounded-full bg-rose-400 motion-reduce:animate-none" /> Live stream</span><Radio className="size-5 text-rose-300" /></div>
    <h3 className="mt-7 text-2xl font-black text-white uppercase md:text-4xl">{match ? `${match.teamA || "Team A"} vs ${match.teamB || "Team B"}` : "Stream activates at match time"}</h3>
    <p className="mt-3 text-sm text-slate-400">{match?.ground || "Official Viva Sports broadcast"}</p>
    <Button className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full" href={match ? `/live/${match.id}` : "/live"}><Play className="size-4 fill-current" /> Watch live</Button>
  </article>;
}

function MatchList({ title, icon: Icon, matches, empty }: { title: string; icon: typeof Trophy; matches: HomepageMatch[]; empty: string }) {
  return <article className="rounded-3xl border border-white/8 bg-[#101d35] p-6"><h3 className="flex items-center gap-2 text-sm font-black tracking-[.12em] text-white uppercase"><Icon className="size-4 text-[#d4af37]" />{title}</h3><div className="mt-5 space-y-3">{matches.length ? matches.slice(0, 3).map((match) => <Link href={`/live/${match.id}`} className="block rounded-2xl border border-white/6 bg-white/4 p-4 transition hover:border-[#d4af37]/25" key={match.id}><strong className="block text-sm text-white">{match.teamA || "Team A"} <span className="text-[#d4af37]">vs</span> {match.teamB || "Team B"}</strong><span className="mt-1 block text-xs leading-5 text-slate-400">{match.result || [match.date, match.time].filter(Boolean).join(" · ") || "Schedule TBA"}</span></Link>) : <p className="text-sm leading-6 text-slate-400">{empty}</p>}</div></article>;
}

function HubSkeleton() { return <div className="grid gap-5 lg:grid-cols-2"><div className="h-72 animate-pulse rounded-[2rem] bg-white/5" /><div className="h-72 animate-pulse rounded-[2rem] bg-white/5" /></div>; }
