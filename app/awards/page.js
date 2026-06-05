"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getMatches } from "@/services/matchService";
import { getPlayerStats } from "@/services/playerStatsService";
import { getAwards } from "@/utils/tournamentAnalyticsUtils";

export default function AwardsPage() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAwards() {
      const [playerData, matchData] = await Promise.all([
        getPlayerStats(),
        getMatches(),
      ]);

      setPlayers(playerData);
      setMatches(matchData);
      setLoading(false);
    }

    Promise.resolve().then(loadAwards);
  }, []);

  const awards = getAwards(players, matches);

  if (loading) return <LoadingSkeleton title="AWARDS" />;

  return (
    <main className="vs-page">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <p className="vs-eyebrow">
          AWARDS CENTER
        </p>
        <h1 className="mt-2 text-4xl md:text-5xl font-black">
          Tournament Awards
        </h1>
        <p className="mt-3 text-slate-400">
          Awards generated from completed-match statistics.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AwardCard
            title="Most Runs"
            player={awards.mostRuns}
            value={awards.mostRuns ? `${awards.mostRuns.runs || 0} runs` : "-"}
          />
          <AwardCard
            title="Most Wickets"
            player={awards.mostWickets}
            value={
              awards.mostWickets ? `${awards.mostWickets.wickets || 0} wickets` : "-"
            }
          />
          <AwardCard
            title="Best Batter"
            player={awards.bestBatter}
            value={
              awards.bestBatter
                ? `SR ${(awards.bestBatter.strikeRate || 0).toFixed(2)}`
                : "-"
            }
          />
          <AwardCard
            title="Best Bowler"
            player={awards.bestBowler}
            value={
              awards.bestBowler
                ? `${awards.bestBowler.wickets || 0} wkts, Econ ${(
                    awards.bestBowler.economy || 0
                  ).toFixed(2)}`
                : "-"
            }
          />
          <AwardCard
            title="Best All Rounder"
            player={awards.bestAllRounder}
            value={
              awards.bestAllRounder
                ? `${(awards.bestAllRounder.runs || 0) + (awards.bestAllRounder.wickets || 0) * 20} pts`
                : "-"
            }
          />
          <AwardCard
            title="Most Player Of Match Awards"
            player={awards.mostPlayerOfMatchAwards}
            value={
              awards.mostPlayerOfMatchAwards
                ? `${awards.mostPlayerOfMatchAwards.awards} awards`
                : "-"
            }
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}

function AwardCard({ title, player, value }) {
  return (
    <article className="vs-card p-6">
      <p className="text-sm font-semibold text-[var(--vs-gold)]">{title}</p>
      <h2 className="mt-4 text-3xl font-black">
        {player?.playerName || "No data"}
      </h2>
      <p className="mt-2 text-slate-400">{player?.teamName || "-"}</p>
      <p className="mt-5 text-2xl font-black text-[var(--vs-gold-soft)]">{value}</p>
      {player?.id && (
        <Link
          href={`/player/${player.id}`}
          className="mt-5 inline-flex rounded-lg bg-[var(--vs-gold)] px-4 py-2 text-sm font-black uppercase text-[#050B18]"
        >
          View Player
        </Link>
      )}
    </article>
  );
}
