"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getPlayerStats } from "@/services/playerStatsService";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const data = await getPlayerStats();
        const sorted = [...data].sort((a, b) => {
          if ((b.runs || 0) !== (a.runs || 0)) {
            return (b.runs || 0) - (a.runs || 0);
          }

          return (b.wickets || 0) - (a.wickets || 0);
        });

        setPlayers(sorted);
      } catch {
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    }

    Promise.resolve().then(loadPlayers);
  }, []);

  if (loading) return <LoadingSkeleton title="PLAYERS" />;

  return (
    <main className="vs-page">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="vs-eyebrow">
            PLAYER INDEX
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
            Player Statistics
          </h1>
          <p className="text-slate-400 mt-3">
            Basic player stat records generated from completed matches.
          </p>
        </div>

        <div className="vs-table-wrap">
          <table className="vs-table min-w-[640px]">
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Team</th>
                <th>Runs</th>
                <th>Wickets</th>
                <th>SR</th>
                <th>Economy</th>
                <th>Matches</th>
              </tr>
            </thead>

            <tbody>
              {players.map((player) => (
                <tr
                  key={player.id}
                  className="text-center"
                >
                  <td className="py-4 text-left font-semibold">
                    <Link href={`/player/${player.id}`} className="vs-link">
                      {player.playerName}
                    </Link>
                  </td>
                  <td className="py-4 text-left text-slate-300">
                    {player.teamName}
                  </td>
                  <td>{player.runs || 0}</td>
                  <td>{player.wickets || 0}</td>
                  <td>{(player.strikeRate || 0).toFixed(2)}</td>
                  <td>{(player.economy || 0).toFixed(2)}</td>
                  <td>{player.matches || 0}</td>
                </tr>
              ))}

              {players.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    No player statistics found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </main>
  );
}
