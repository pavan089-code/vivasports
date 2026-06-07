"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { subscribeToMatches } from "@/services/matchService";
import { sortUpcomingMatches } from "@/utils/tournamentUtils";

export default function FixturesList() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToMatches((data) => {
      const scheduledMatches = sortUpcomingMatches(
        data.filter((match) => match.status === "scheduled")
      );

      setMatches(scheduledMatches);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-6 md:mb-8">
        <p className="vs-eyebrow">
          TOURNAMENT FIXTURES
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
          Upcoming Matches
        </h1>
        <p className="text-slate-400 mt-3">
          Scheduled matches sorted by date and start time.
        </p>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => (
          <Link
            key={match.id}
            href={`/live/${match.id}`}
            className="vs-card p-5 md:p-6"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--vs-gold)]">
                  {match.matchStage || "Fixture"}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-black text-white">
                    {match.teamA}
                  </h2>
                  <span className="font-bold text-slate-300">vs</span>
                  <h2 className="text-2xl font-black text-white">
                    {match.teamB}
                  </h2>
                </div>

                <div className="mt-4 grid gap-2 text-slate-400 sm:grid-cols-3">
                  <p>{match.date || "Date TBA"}</p>
                  <p>{match.time || "Time TBA"}</p>
                  <p>{match.ground || "Ground TBA"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[var(--vs-gold)]/15 px-3 py-1 text-sm font-bold text-[var(--vs-gold-soft)] capitalize">
                  {match.status}
                </span>
                <span className="rounded-lg bg-[var(--vs-gold)] px-4 py-2 text-sm font-black uppercase text-[#050B18]">
                  Match Page
                </span>
              </div>
            </div>
          </Link>
        ))}

        {matches.length === 0 && (
          <div className="vs-card p-8 text-center">
            <p className="text-slate-400">No scheduled fixtures yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
