"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getMatches } from "@/services/matchService";
import { getPlayerStats } from "@/services/playerStatsService";
import { getTournamentStats } from "@/utils/tournamentAnalyticsUtils";

export default function StatsPage() {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [matchData, playerData] = await Promise.all([
          getMatches(),
          getPlayerStats(),
        ]);

        setMatches(matchData);
        setPlayers(playerData);
      } catch {
        setMatches([]);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    }

    Promise.resolve().then(loadStats);
  }, []);

  const stats = useMemo(() => getTournamentStats(matches, players), [matches, players]);

  if (loading) return <LoadingSkeleton title="TOURNAMENT STATS" />;

  return (
    <main className="vs-page">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <p className="vs-eyebrow">
          TOURNAMENT STATS
        </p>
        <h1 className="mt-2 text-4xl md:text-5xl font-black">
          Statistics Dashboard
        </h1>
        <p className="mt-3 text-slate-400">
          Tournament-wide records from completed matches.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <RecordCard
            title="Highest Team Score"
            value={
              stats.highestTeamScore
                ? `${stats.highestTeamScore.battingTeam} ${stats.highestTeamScore.score}/${stats.highestTeamScore.wickets}`
                : "-"
            }
            matchId={stats.highestTeamScore?.matchId}
          />
          <RecordCard
            title="Lowest Team Score"
            value={
              stats.lowestTeamScore
                ? `${stats.lowestTeamScore.battingTeam} ${stats.lowestTeamScore.score}/${stats.lowestTeamScore.wickets}`
                : "-"
            }
            matchId={stats.lowestTeamScore?.matchId}
          />
          <RecordCard
            title="Highest Individual Score"
            value={
              stats.highestIndividualScore
                ? `${stats.highestIndividualScore.playerName} ${stats.highestIndividualScore.runs}`
                : "-"
            }
            matchId={stats.highestIndividualScore?.matchId}
          />
          <RecordCard
            title="Best Bowling Figures"
            value={
              stats.bestBowlingFigures
                ? `${stats.bestBowlingFigures.playerName} ${stats.bestBowlingFigures.wickets}/${stats.bestBowlingFigures.runsConceded}`
                : "-"
            }
            matchId={stats.bestBowlingFigures?.matchId}
          />
          <RecordCard
            title="Most Boundaries"
            value={
              stats.mostBoundaries
                ? `${stats.mostBoundaries.playerName} ${(stats.mostBoundaries.fours || 0) + (stats.mostBoundaries.sixes || 0)}`
                : "-"
            }
            playerId={stats.mostBoundaries?.id}
          />
          <RecordCard
            title="Most Sixes"
            value={
              stats.mostSixes
                ? `${stats.mostSixes.playerName} ${stats.mostSixes.sixes || 0}`
                : "-"
            }
            playerId={stats.mostSixes?.id}
          />
          <RecordCard
            title="Most Fours"
            value={
              stats.mostFours
                ? `${stats.mostFours.playerName} ${stats.mostFours.fours || 0}`
                : "-"
            }
            playerId={stats.mostFours?.id}
          />
          <RecordCard
            title="Most Catches"
            value={
              stats.mostCatches
                ? `${stats.mostCatches.playerName} ${stats.mostCatches.catches || 0}`
                : "-"
            }
            playerId={stats.mostCatches?.id}
          />
          <RecordCard
            title="Most Player Of Match Awards"
            value={
              stats.mostPlayerOfMatchAwards
                ? `${stats.mostPlayerOfMatchAwards.playerName} ${stats.mostPlayerOfMatchAwards.awards}`
                : "-"
            }
          />
          <RecordCard
            title="Tournament Runs"
            value={stats.tournamentRuns || 0}
          />
          <RecordCard
            title="Tournament Wickets"
            value={stats.tournamentWickets || 0}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}

function RecordCard({ title, value, matchId, playerId }) {
  return (
    <article className="vs-card p-6">
      <p className="text-sm font-semibold text-[var(--vs-gold)]">{title}</p>
      <h2 className="mt-4 text-3xl font-black">{value}</h2>
      {matchId && (
        <Link
          href={`/scorecard/${matchId}`}
          className="mt-5 inline-flex rounded-lg bg-[var(--vs-gold)] px-4 py-2 text-sm font-black uppercase text-[#050B18]"
        >
          View Match
        </Link>
      )}
      {playerId && (
        <Link
          href={`/player/${playerId}`}
          className="mt-5 inline-flex rounded-lg bg-[var(--vs-gold)] px-4 py-2 text-sm font-black uppercase text-[#050B18]"
        >
          View Player
        </Link>
      )}
    </article>
  );
}
