"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getMatches } from "@/services/matchService";

export default function FixturesList() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function loadMatches() {
      const data = await getMatches();

      const scheduledMatches = data.filter(
        (match) => match.status === "scheduled"
      );

      setMatches(scheduledMatches);
    }

    loadMatches();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-black text-white mb-8">
        Upcoming Fixtures
      </h1>

      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="
              bg-[#101D35]
              rounded-2xl
              p-5
              border border-white/10
            "
          >
            <h2 className="text-2xl font-bold text-white">
              {match.teamA} vs {match.teamB}
            </h2>

            <p className="text-slate-400 mt-2">
              📅 {match.date}
            </p>

            <p className="text-slate-400">
              🕒 {match.time}
            </p>

            <p className="text-slate-400">
              📍 {match.ground}
            </p>

            <div className="mt-4">
              <Link
                href={`/live/${match.id}`}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-cyan-500
                  text-white
                "
              >
                View Match
              </Link>
            </div>
          </div>
        ))}

        {matches.length === 0 && (
          <p className="text-slate-400">
            No upcoming fixtures.
          </p>
        )}
      </div>
    </div>
  );
}