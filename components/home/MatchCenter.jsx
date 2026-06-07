"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { subscribeToMatches } from "@/services/matchService";
import {
  sortRecentMatches,
  sortUpcomingMatches,
} from "@/utils/tournamentUtils";

export default function MatchCenter() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToMatches((data) => {
      setMatches(data);
    });

    return () => unsubscribe();
  }, []);

  const liveMatches = matches.filter(
    (match) =>
      match.status === "live" ||
      match.status === "paused" ||
      match.status === "innings_break"
  );
  const upcomingMatches = sortUpcomingMatches(
    matches.filter((match) => match.status === "scheduled")
  ).slice(0, 4);
  const completedMatches = sortRecentMatches(
    matches.filter((match) => match.status === "completed" || match.status === "abandoned")
  ).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <MatchSection
        title="Live Matches"
        subtitle="Matches currently in progress"
        matches={liveMatches}
        emptyText="No live matches right now."
        accent="red"
      />

      <MatchSection
        title="Upcoming Matches"
        subtitle="Next scheduled fixtures"
        matches={upcomingMatches}
        emptyText="No upcoming fixtures scheduled."
        accent="yellow"
      />

      <MatchSection
        title="Recent Results"
        subtitle="Latest completed matches"
        matches={completedMatches}
        emptyText="No completed matches yet."
        accent="gold"
      />
    </section>
  );
}

function MatchSection({
  title,
  subtitle,
  matches,
  emptyText,
  accent,
}) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">{title}</h2>
          <p className="text-slate-400 mt-1">{subtitle}</p>
        </div>

        <Link
          href={title === "Recent Results" ? "/results" : "/fixtures"}
          className="w-fit rounded-xl bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--vs-gold-soft)]"
        >
          View All
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} accent={accent} />
        ))}
      </div>

      {matches.length === 0 && (
        <div className="rounded-2xl bg-[#101D35] p-6 text-center">
          <p className="text-slate-400">{emptyText}</p>
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, accent }) {
  const badgeClass = {
    red: "bg-red-500/15 text-red-300",
    yellow: "bg-yellow-500/15 text-yellow-300",
    gold: "bg-[var(--vs-gold)]/15 text-[var(--vs-gold-soft)]",
  }[accent];

  return (
    <article className="rounded-2xl border border-white/10 bg-[#101D35] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${badgeClass}`}>
          {match.status}
        </span>
        <span className="text-xs text-slate-500">{match.oversLimit || "-"} overs</span>
      </div>

      <h3 className="mt-5 text-xl font-black text-white">
        {match.teamA} vs {match.teamB}
      </h3>

      <div className="mt-4 space-y-1 text-sm text-slate-400">
        <p>{match.ground || "Ground TBA"}</p>
        <p>{[match.date, match.time].filter(Boolean).join(" | ") || "Schedule TBA"}</p>
      </div>

      {match.status === "completed" && (
        <p className="mt-4 text-sm font-semibold text-green-300">
          {match.result || "Completed"}
        </p>
      )}

      {match.status === "paused" && (
        <p className="mt-4 text-sm font-semibold text-orange-300">
          Paused: {match.pauseReason || "Delay"}
        </p>
      )}

      {match.revisedTargetApplied && (
        <p className="mt-3 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-300">
          Revised target: {match.revisedTarget} from {match.revisedOvers} overs
        </p>
      )}

      <Link
        href={`/live/${match.id}`}
        className="mt-5 inline-flex rounded-xl bg-[var(--vs-gold)] px-4 py-2 text-sm font-semibold text-[#06152F] hover:bg-[#E5C158]"
      >
        View Match
      </Link>
    </article>
  );
}
