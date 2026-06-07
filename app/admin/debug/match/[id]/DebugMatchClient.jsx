"use client";

import Link from "next/link";

import useMatch from "@/hooks/useMatch";
import { getInningsBallLimit, getOversPerInnings } from "@/utils/matchConfigUtils";
import { getMatchYouTubeUrl } from "@/utils/youtubeUtils";

function formatValue(value) {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value, null, 2);

  return String(value);
}

function playerName(player) {
  if (!player) return "-";
  if (typeof player === "string") return player;

  return player.name || player.playerName || JSON.stringify(player);
}

export default function DebugMatchClient({ matchId }) {
  const { match, loading, error } = useMatch(matchId);

  if (loading) {
    return (
      <main className="vs-page px-4 py-10">
        <div className="mx-auto max-w-5xl text-slate-300">Loading match debug...</div>
      </main>
    );
  }

  if (error || !match) {
    return (
      <main className="vs-page px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-300/20 bg-red-500/10 p-6">
          <h1 className="text-2xl font-black text-white">Match not found</h1>
          <p className="mt-2 text-slate-300">{error?.message || matchId}</p>
          <Link href="/admin" className="vs-link mt-4 inline-flex">
            Back to Admin
          </Link>
        </div>
      </main>
    );
  }

  const resolvedOvers = getOversPerInnings(match);
  const resolvedBalls = getInningsBallLimit(match);
  const runsNeeded = match.target ? Math.max(match.target - (match.score || 0), 0) : "-";
  const ballsRemaining =
    match.innings === 2 ? Math.max(resolvedBalls - (match.totalBalls || 0), 0) : "-";
  const rows = [
    ["Match ID", match.id || matchId],
    ["Status", match.status],
    ["Innings", match.innings],
    ["oversPerInnings", match.oversPerInnings],
    ["oversLimit", match.oversLimit],
    ["maxOvers", match.maxOvers],
    ["totalOvers", match.totalOvers],
    ["balls", match.balls ?? match.totalBalls],
    ["overs", match.overs],
    ["target", match.target],
    ["runsNeeded", runsNeeded],
    ["ballsRemaining", ballsRemaining],
    ["youtubeLink", match.youtubeLink],
    ["youtubeEmbedUrl", match.youtubeEmbedUrl || getMatchYouTubeUrl(match)],
    ["battingTeam", match.battingTeam],
    ["bowlingTeam", match.bowlingTeam],
    ["striker", playerName(match.striker)],
    ["nonStriker", playerName(match.nonStriker)],
    ["currentBowler", playerName(match.currentBowler)],
    ["Resolved Innings Limit", `${resolvedOvers} overs / ${resolvedBalls} balls`],
  ];

  return (
    <main className="vs-page px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="vs-eyebrow">Admin Debug</p>
            <h1 className="mt-2 text-4xl font-black text-white">Match State</h1>
          </div>
          <Link href="/admin" className="vs-link">
            Back to Admin
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid gap-2 border-b border-white/10 px-4 py-3 last:border-b-0 md:grid-cols-[220px_1fr]"
            >
              <div className="font-black text-[var(--vs-gold)]">{label}</div>
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-slate-100">
                {formatValue(value)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
