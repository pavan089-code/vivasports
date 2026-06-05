"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PublicPage, { PageHeader } from "@/components/ui/PublicPage";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getMatches } from "@/services/matchService";
import { getPlayerStats } from "@/services/playerStatsService";
import { getHallOfFame } from "@/utils/prestigeRankingsUtils";

export default function HallOfFamePage() {
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHallOfFame() {
      const [players, matches] = await Promise.all([
        getPlayerStats(),
        getMatches(),
      ]);
      setHall(getHallOfFame(players, matches));
      setLoading(false);
    }

    Promise.resolve().then(loadHallOfFame);
  }, []);

  if (loading) return <LoadingSkeleton title="HALL OF FAME" />;

  const cards = [
    {
      title: "All Time Most Runs",
      player: hall?.mostRuns,
      value: `${hall?.mostRuns?.runs || 0} runs`,
    },
    {
      title: "All Time Most Wickets",
      player: hall?.mostWickets,
      value: `${hall?.mostWickets?.wickets || 0} wickets`,
    },
    {
      title: "Most Player Of Match Awards",
      player: hall?.mostPlayerOfMatchAwards,
      value: `${hall?.mostPlayerOfMatchAwards?.awards || 0} awards`,
    },
    {
      title: "Highest Individual Score",
      player: hall?.highestIndividualScore,
      value: `${hall?.highestIndividualScore?.runs || 0} runs`,
      matchId: hall?.highestIndividualScore?.matchId,
    },
    {
      title: "Best Bowling Figures",
      player: hall?.bestBowlingFigures,
      value: hall?.bestBowlingFigures
        ? `${hall.bestBowlingFigures.wickets}/${hall.bestBowlingFigures.runsConceded}`
        : "-",
      matchId: hall?.bestBowlingFigures?.matchId,
    },
  ];

  return (
    <PublicPage>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <PageHeader
          eyebrow="Prestige And History"
          title="Hall Of Fame"
          subtitle="All-time leaders across batting, bowling and match awards."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="vs-card p-6">
              <p className="text-sm font-bold text-[var(--vs-gold)]">
                {card.title}
              </p>
              <h2 className="mt-4 text-3xl font-black">
                {card.player?.playerName || "No data"}
              </h2>
              <p className="mt-2 text-slate-400">{card.player?.teamName || "-"}</p>
              <p className="mt-5 text-2xl font-black text-[var(--vs-gold-soft)]">
                {card.value}
              </p>
              {card.matchId && (
                <Link href={`/scorecard/${card.matchId}`} className="vs-link mt-4 inline-flex">
                  View Scorecard
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>
    </PublicPage>
  );
}
