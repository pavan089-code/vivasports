"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PublicPage, { PageHeader } from "@/components/ui/PublicPage";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getMatches } from "@/services/matchService";
import { getPlayerStats } from "@/services/playerStatsService";
import { getTournamentMvp } from "@/utils/prestigeRankingsUtils";

export default function MvpPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMvp() {
      const [playerData, matchData] = await Promise.all([
        getPlayerStats(),
        getMatches(),
      ]);
      setPlayers(getTournamentMvp(playerData, matchData));
      setLoading(false);
    }

    Promise.resolve().then(loadMvp);
  }, []);

  if (loading) return <LoadingSkeleton title="TOURNAMENT MVP" />;

  return (
    <PublicPage>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <PageHeader
          eyebrow="Advanced Rankings"
          title="Tournament MVP"
          subtitle="Composite ranking from batting, bowling, fielding and Player Of Match impact."
        />
        <RankingTable players={players} />
      </section>
    </PublicPage>
  );
}

function RankingTable({ players }) {
  return (
    <div className="vs-table-wrap">
      <table className="vs-table min-w-[900px]">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Team</th>
            <th>Batting</th>
            <th>Bowling</th>
            <th>Fielding</th>
            <th>POM</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id || `${player.teamName}-${player.playerName}`}>
              <td className="font-black text-[var(--vs-gold-soft)]">{index + 1}</td>
              <td className="font-bold">
                <Link href={`/player/${player.id}`} className="vs-link">
                  {player.playerName}
                </Link>
              </td>
              <td>{player.teamName}</td>
              <td>{player.batting}</td>
              <td>{player.bowling}</td>
              <td>{player.fielding}</td>
              <td>{player.playerOfMatch}</td>
              <td className="font-black text-[var(--vs-gold-soft)]">{player.mvpPoints}</td>
            </tr>
          ))}
          {!players.length && (
            <tr>
              <td colSpan="8" className="py-10 text-center text-slate-400">
                MVP rankings will appear after player statistics are available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
