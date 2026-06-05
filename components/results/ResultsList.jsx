"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { subscribeToMatches } from "@/services/matchService";
import { sortRecentMatches } from "@/utils/tournamentUtils";

function getResultText(result) {
  if (!result) return "Result pending";
  if (typeof result === "string") return result;
  return result.result || "Result pending";
}

export default function ResultsList() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToMatches((data) => {
      const completedMatches = sortRecentMatches(
        data.filter((match) => match.status === "completed" || match.status === "abandoned")
      );

      setMatches(completedMatches);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8">
        <p className="vs-eyebrow">
          MATCH RESULTS
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
          Recent Results
        </h1>
        <p className="text-slate-400 mt-3">
          Completed matches, winners and final scorecards.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {matches.map((match) => (
          <article
            key={match.id}
            className="vs-card p-5 md:p-6"
          >
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  {match.teamA} vs {match.teamB}
                </h2>
                <p className="text-slate-400 mt-2">
                  {[match.date, match.time, match.ground].filter(Boolean).join(" | ")}
                </p>
              </div>

              <div className="vs-card-muted p-4">
                <p className="inline-flex rounded-full bg-[var(--vs-gold)]/10 px-4 py-2 font-bold text-[var(--vs-gold-soft)]">
                  {getResultText(match.result)}
                </p>

                <p className="mt-3 font-semibold text-[var(--vs-success)]">
                  Winner: {match.winner || "Tie"}
                </p>

                {match.playerOfMatch && (
                  <p className="mt-3 font-semibold text-[var(--vs-gold-soft)]">
                    Player of the Match: {match.playerOfMatch.playerName} (
                    {match.playerOfMatch.teamName})
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {match.resultType === "walkover" && <WarningBadge label="Walkover" />}
                  {match.resultType === "abandoned" && <WarningBadge label="Abandoned" />}
                  {match.revisedTargetApplied && <WarningBadge label="Revised Target" />}
                </div>

                <div className="mt-4 grid gap-2 text-slate-300 sm:grid-cols-2">
                  <p>
                    {match.teamA}: {match.firstInningsScore ?? "-"}/
                    {match.firstInningsWickets ?? "-"}
                  </p>
                  <p>
                    {match.teamB}: {match.secondInningsScore ?? "-"}/
                    {match.secondInningsWickets ?? "-"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/scorecard/${match.id}`}
                  className="w-fit rounded-lg bg-[var(--vs-gold)] px-5 py-3 text-sm font-black uppercase text-[#050B18]"
                >
                  View Scorecard
                </Link>

                <Link
                  href={`/live/${match.id}`}
                  className="w-fit rounded-lg border border-[var(--vs-gold)]/35 px-5 py-3 text-sm font-black uppercase text-[var(--vs-gold-soft)]"
                >
                  View Match
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="vs-card p-8 text-center">
          <p className="text-slate-400">No completed matches yet.</p>
        </div>
      )}
    </section>
  );
}

function WarningBadge({ label }) {
  return (
    <span className="rounded-full bg-[var(--vs-gold)]/15 px-3 py-1 text-xs font-bold text-[var(--vs-gold-soft)]">
      {label}
    </span>
  );
}
