"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PublicPage, { PageHeader } from "@/components/ui/PublicPage";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getMatches } from "@/services/matchService";
import { getPlayerStats } from "@/services/playerStatsService";
import { getFantasyPoints } from "@/utils/prestigeRankingsUtils";

export default function FantasyPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFantasy() {
      const [playerData, matchData] = await Promise.all([
        getPlayerStats(),
        getMatches(),
      ]);
      setPlayers(getFantasyPoints(playerData, matchData));
      setLoading(false);
    }

    Promise.resolve().then(loadFantasy);
  }, []);

  if (loading) return <LoadingSkeleton title="FANTASY POINTS" />;

  return (
    <PublicPage>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <PageHeader
          eyebrow="Advanced Rankings"
          title="Fantasy Points"
          subtitle="Read-only fantasy scoring from runs, wickets, catches, run outs and Player Of Match awards."
        />

        <div className="vs-table-wrap">
          <table className="vs-table min-w-[860px]">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Team</th>
                <th>Runs</th>
                <th>Wickets</th>
                <th>Catches</th>
                <th>Run Outs</th>
                <th>POM</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player.id || `${player.teamName}-${player.playerName}`}>
                  <td className="font-black text-[var(--vs-gold-soft)]">
                    {index + 1}
                  </td>
                  <td className="font-bold">
                    <Link href={`/player/${player.id}`} className="vs-link">
                      {player.playerName}
                    </Link>
                  </td>
                  <td>{player.teamName}</td>
                  <td>{player.fantasyBreakdown.runs}</td>
                  <td>{player.fantasyBreakdown.wickets}</td>
                  <td>{player.fantasyBreakdown.catches}</td>
                  <td>{player.fantasyBreakdown.runOuts}</td>
                  <td>{player.fantasyBreakdown.pom}</td>
                  <td className="font-black text-[var(--vs-gold-soft)]">
                    {player.fantasyPoints}
                  </td>
                </tr>
              ))}
              {!players.length && (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-slate-400">
                    Fantasy points will appear after player statistics are available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PublicPage>
  );
}
