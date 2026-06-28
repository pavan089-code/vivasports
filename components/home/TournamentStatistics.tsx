"use client";

import { Award, BarChart3, Gauge, Medal, Shield, Swords } from "lucide-react";
import Link from "next/link";

import type { HomepageStatistics } from "@/services/homepageService";

export default function TournamentStatistics({ statistics, loading }: { statistics: HomepageStatistics; loading: boolean }) {
  const cards = [
    { label: "Top Run Scorer", name: statistics?.topRunScorer?.playerName, team: statistics?.topRunScorer?.teamName, value: statistics?.topRunScorer ? `${statistics.topRunScorer.runs || 0} runs` : "--", icon: Medal },
    { label: "Top Wicket Taker", name: statistics?.topWicketTaker?.playerName, team: statistics?.topWicketTaker?.teamName, value: statistics?.topWicketTaker ? `${statistics.topWicketTaker.wickets || 0} wickets` : "--", icon: Swords },
    { label: "Best All Rounder", name: statistics?.bestAllRounder?.playerName, team: statistics?.bestAllRounder?.teamName, value: statistics?.bestAllRounder ? `${statistics.bestAllRounder.runs || 0} runs · ${statistics.bestAllRounder.wickets || 0} wkts` : "--", icon: Award },
    { label: "Highest Team Score", name: statistics?.highestTeamScore?.name, team: statistics?.highestTeamScore ? "Tournament record" : undefined, value: statistics?.highestTeamScore?.value != null ? String(statistics.highestTeamScore.value) : "--", icon: Shield },
    { label: "Most Sixes", name: statistics?.mostSixes?.playerName, team: statistics?.mostSixes?.teamName, value: statistics?.mostSixes ? `${statistics.mostSixes.sixes || 0} sixes` : "--", icon: BarChart3 },
    { label: "Fastest Fifty", name: statistics?.fastestFifty?.playerName, team: statistics?.fastestFifty?.teamName, value: statistics?.fastestFifty?.balls ? `${statistics.fastestFifty.balls} balls` : "--", icon: Gauge },
  ];

  return <section aria-labelledby="statistics-title" className="bg-[#0a1933] py-16 md:py-24">
    <div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
      <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black tracking-[.2em] text-[#d4af37] uppercase">Tournament statistics</p><h2 className="mt-3 text-3xl leading-none font-black text-white uppercase md:text-5xl" id="statistics-title">The Leaders Of The Game</h2></div><Link className="inline-flex w-fit min-h-11 items-center rounded-full border border-[#d4af37]/25 px-5 text-sm font-black text-[#e5c158] uppercase transition hover:bg-[#d4af37]/10" href="/leaderboards">View full statistics</Link></div>
      {loading ? <StatisticsSkeleton /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(({ icon: Icon, ...card }) => <article className="group rounded-3xl border border-white/8 bg-[#101d35] p-6 transition hover:-translate-y-1 hover:border-[#d4af37]/30" key={card.label}><span className="grid size-12 place-items-center rounded-2xl bg-[#d4af37]/10 text-[#d4af37]"><Icon className="size-5" /></span><p className="mt-6 text-xs font-black tracking-[.14em] text-[#d4af37] uppercase">{card.label}</p><h3 className="mt-2 text-2xl font-black text-white">{card.name || "--"}</h3><p className="mt-1 text-sm text-slate-400">{card.team || "Data coming soon"}</p><strong className="mt-5 block text-xl text-[#e5c158]">{card.value}</strong></article>)}</div>}
    </div>
  </section>;
}

function StatisticsSkeleton() {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div className="h-56 animate-pulse rounded-3xl border border-white/5 bg-white/5" key={index} />)}</div>;
}
