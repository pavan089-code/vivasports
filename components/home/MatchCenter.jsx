"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getMatches } from "@/services/matchService";

export default function MatchCenter() {
  const [matches, setMatches] =
    useState([]);

  useEffect(() => {
    async function loadMatches() {
      const data =
        await getMatches();

      setMatches(data);
    }

    loadMatches();
  }, []);

  const liveMatches =
    matches.filter(
      (m) => m.status === "live"
    );

  const upcomingMatches =
    matches.filter(
      (m) => m.status === "scheduled"
    );

  const completedMatches =
    matches.filter(
      (m) => m.status === "completed"
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

      <MatchSection
        title="🔥 LIVE MATCHES"
        matches={liveMatches}
      />

      <MatchSection
        title="📅 UPCOMING MATCHES"
        matches={upcomingMatches}
      />

      <MatchSection
        title="🏆 COMPLETED MATCHES"
        matches={completedMatches}
      />

    </div>
  );
}

function MatchSection({
  title,
  matches,
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">
        {title}
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

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
            <h3 className="text-white font-bold text-xl">
              {match.teamA} vs {match.teamB}
            </h3>

            <p className="text-slate-400 mt-2">
              {match.ground}
            </p>

            <p className="text-slate-400">
              {match.date} • {match.time}
            </p>

            <div className="flex gap-3 mt-5">

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

      </div>
    </div>
  );
}