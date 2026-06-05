"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { getTeams } from "@/services/teamService";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function loadTeams() {
      const data = await getTeams();
      setTeams(data);
    }

    Promise.resolve().then(loadTeams);
  }, []);

  return (
    <main className="vs-page">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-black text-white mb-3">Teams</h1>
        <p className="text-slate-400 mb-10">Registered tournament squads</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team) => (
            <div
              key={team.id}
              className="vs-card p-6"
            >
              <h2 className="text-2xl font-bold text-white">{team.name}</h2>
              <p className="text-slate-400 mt-2">Captain: {team.captain || "-"}</p>
              <p className="mt-4 font-bold text-[var(--vs-gold-soft)]">
                Players: {team.players?.length || 0}
              </p>

              <div className="mt-5 space-y-2">
                {(team.players || []).slice(0, 11).map((player) => (
                  <p key={player} className="text-slate-300">
                    {player}
                  </p>
                ))}
              </div>

              <Link
                href={`/team/${team.id}`}
                className="mt-6 inline-flex rounded-lg bg-[var(--vs-gold)] px-4 py-2 text-sm font-black uppercase text-[#050B18]"
              >
                View Team
              </Link>
            </div>
          ))}
        </div>

        {!teams.length && <p className="text-slate-400">No teams found.</p>}
      </section>

      <Footer />
    </main>
  );
}
