"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getMatches } from "@/services/matchService";

export default function ResultsList() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function loadMatches() {
      const data = await getMatches();

      const completedMatches = data.filter(
        (match) => match.status === "completed",
      );

      setMatches(completedMatches);
    }

    loadMatches();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-5xl font-black text-white mb-10">Match Results</h1>

      <div className="space-y-6">
        {matches.map((match) => (
          <div
            key={match.id}
            className="
              bg-[#101D35]
              rounded-3xl
              p-6
              border border-white/10
            "
          >
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {match.teamA} vs {match.teamB}
                </h2>

                {(match.date || match.ground) && (
                  <p className="text-slate-400 mt-2">
                    {[match.date, match.ground].filter(Boolean).join(" • ")}
                  </p>
                )}
              </div>

              <div
                className="
                  bg-[#0A1428]
                  rounded-2xl
                  p-4
                "
              >
                <div
                  className="
    inline-flex
    px-4
    py-2
    rounded-full
    bg-cyan-500/10
    text-cyan-400
    font-bold
  "
                >
                  {typeof match.result === "object"
                    ? match.result.result
                    : match.result}
                </div>

                {match.winner && (
                  <p className="text-green-400 mt-2 font-medium">
                    Winner: {match.winner}
                  </p>
                )}

                <div className="mt-3 space-y-1">
                  <p className="text-slate-300">
                    {match.teamA} {match.firstInningsScore ?? "-"}/
                    {match.firstInningsWickets ?? "-"}
                  </p>

                  <p className="text-slate-300">
                    {match.teamB} {match.secondInningsScore ?? "-"}/
                    {match.secondInningsWickets ?? "-"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/live/${match.id}`}
                  className="
                    px-5
                    py-3
                    rounded-xl
                    bg-green-500
                    hover:bg-green-600
                    text-white
                    font-semibold
                  "
                >
                  View Scorecard
                </Link>

                {/* <Link
                  href={`/scorer/${match.id}`}
                  className="
                    px-5
                    py-3
                    rounded-xl
                    bg-cyan-500
                    hover:bg-cyan-600
                    text-white
                    font-semibold
                  "
                >
                  Match Details
                </Link> */}
              </div>
            </div>
          </div>
        ))}

        {matches.length === 0 && (
          <div
            className="
              bg-[#101D35]
              rounded-3xl
              p-8
              text-center
            "
          >
            <p className="text-slate-400 text-lg">No completed matches yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
