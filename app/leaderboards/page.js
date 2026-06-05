"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getPlayerStats } from "@/services/playerStatsService";
import {
  getAllRounderScore,
  getTopAllRounders,
  getTopBatters,
  getTopBowlers,
} from "@/utils/leaderboardUtils";

export default function LeaderboardsPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const data = await getPlayerStats();
        setPlayers(data);
      } catch {
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    }

    Promise.resolve().then(loadPlayers);
  }, []);

  const topBatters = useMemo(() => getTopBatters(players), [players]);
  const topBowlers = useMemo(() => getTopBowlers(players), [players]);
  const topAllRounders = useMemo(() => getTopAllRounders(players), [players]);

  if (loading) return <LoadingSkeleton title="LEADERBOARDS" />;

  return (
    <main className="vs-page">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        <div>
          <p className="vs-eyebrow">
            TOURNAMENT LEADERBOARDS
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
            Player Rankings
          </h1>
          <p className="text-slate-400 mt-3">
            Rankings from completed-match player statistics.
          </p>
        </div>

        <LeaderboardTable
          title="Top Batters"
          players={topBatters}
          columns={[
            { label: "Runs", render: (player) => player.runs || 0 },
            {
              label: "SR",
              render: (player) => (player.strikeRate || 0).toFixed(2),
            },
            { label: "4s", render: (player) => player.fours || 0 },
            { label: "6s", render: (player) => player.sixes || 0 },
          ]}
        />

        <LeaderboardTable
          title="Top Bowlers"
          players={topBowlers}
          columns={[
            { label: "Wkts", render: (player) => player.wickets || 0 },
            {
              label: "Econ",
              render: (player) => (player.economy || 0).toFixed(2),
            },
            { label: "Overs", render: (player) => player.overs || "0.0" },
          ]}
        />

        <LeaderboardTable
          title="Top All Rounders"
          players={topAllRounders}
          columns={[
            {
              label: "Score",
              render: (player) => getAllRounderScore(player),
            },
            { label: "Runs", render: (player) => player.runs || 0 },
            { label: "Wkts", render: (player) => player.wickets || 0 },
          ]}
        />
      </section>

      <Footer />
    </main>
  );
}

function LeaderboardTable({ title, players, columns }) {
  const topPlayers = players.slice(0, 10);

  return (
    <section className="vs-card p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-black text-white">{title}</h2>

      <div className="vs-table-wrap mt-5">
        <table className="vs-table min-w-[620px] text-sm sm:text-base">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Name</th>
              <th>Team</th>
              {columns.map((column) => (
                <th key={column.label}>{column.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {topPlayers.map((player, index) => (
              <tr
                key={`${title}-${player.id || player.playerName}`}
                className="text-center"
              >
                <td className="py-4 text-left font-bold text-[var(--vs-gold-soft)]">
                  {index + 1}
                </td>
                <td className="py-4 text-left font-semibold">
                  <Link
                    href={`/player/${player.id}`}
                    className="text-white hover:text-[var(--vs-gold-soft)]"
                  >
                    {player.playerName}
                  </Link>
                </td>
                <td className="py-4 text-left text-slate-300">
                  {player.teamName}
                </td>
                {columns.map((column) => (
                  <td key={column.label}>{column.render(player)}</td>
                ))}
              </tr>
            ))}

            {topPlayers.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 3}
                  className="py-10 text-center text-slate-400"
                >
                  No player statistics found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
