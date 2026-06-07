"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  deleteMatch,
  subscribeToMatches,
  updateMatch,
} from "@/services/matchService";
import {
  appendMatchNote,
  applyRevisedTarget,
  createWalkover,
  markAbandoned,
  pauseMatch,
  resumeMatch,
} from "@/services/tournamentOperationsService";
import {
  sortRecentMatches,
  sortUpcomingMatches,
} from "@/utils/tournamentUtils";

export default function MatchList() {
  const [matches, setMatches] = useState([]);
  const [reasonModal, setReasonModal] = useState(null);

  async function handleDelete(matchId) {
    const confirmed = confirm("Delete this match?");

    if (!confirmed) return;

    await deleteMatch(matchId);
  }

  async function startMatch(matchId) {
    await updateMatch(matchId, {
      status: "live",
    });
  }

  async function completeMatch(match) {
    const confirmed = confirm(
      "Mark match as completed? Scored matches should normally complete from the scorer panel so standings can update."
    );

    if (!confirmed) return;

    await updateMatch(match.id, {
      status: "completed",
    });
  }

  async function handleResume(match) {
    const note = prompt("Resume note", "Play resumes.");
    await resumeMatch(match, note, "admin");
  }

  async function handleNote(match) {
    const note = prompt("Publish match note");
    if (!note) return;

    await appendMatchNote(match, note, "admin");
  }

  async function handleRevisedTarget(match) {
    const revisedOvers = prompt("Revised overs", match.revisedOvers || match.oversLimit || "");
    if (!revisedOvers) return;

    const revisedTarget = prompt("Revised target", match.revisedTarget || match.target || "");
    if (!revisedTarget) return;

    const revisionReason = prompt("Revision reason", "Rain Delay");
    await applyRevisedTarget(match.id, {
      revisedOvers,
      revisedTarget,
      revisionReason,
    });
  }

  async function handleWalkover(match) {
    const winner = prompt(`Walkover winner: ${match.teamA} or ${match.teamB}`);
    if (![match.teamA, match.teamB].includes(winner)) {
      alert("Winner must exactly match Team A or Team B.");
      return;
    }

    await createWalkover(match, winner);
  }

  useEffect(() => {
    const unsubscribe = subscribeToMatches((data) => {
      const scheduled = sortUpcomingMatches(
        data.filter((match) => match.status !== "completed" && match.status !== "abandoned")
      );
      const completed = sortRecentMatches(
        data.filter((match) => match.status === "completed" || match.status === "abandoned")
      );

      setMatches([...scheduled, ...completed]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Created Matches
      </h2>

      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="min-w-0 rounded-2xl border border-white/10 bg-[#101D35] p-4 sm:p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <h3 className="break-words text-xl font-bold leading-snug text-white">
                  {match.teamA} vs {match.teamB}
                </h3>

                <p className="mt-2 break-words text-base text-slate-400">
                  {[match.date, match.time].filter(Boolean).join(" | ") || "Schedule TBA"}
                </p>

                <p className="break-words text-base text-slate-400">
                  {match.ground || "Ground TBA"}
                </p>
              </div>

              <StatusBadge status={match.status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {match.manualOverride && <WarningBadge label="Manual Override" />}
              {match.revisedTargetApplied && <WarningBadge label="Revised Target" />}
              {match.resultType === "abandoned" && <WarningBadge label="Abandoned" />}
              {match.resultType === "walkover" && <WarningBadge label="Walkover" />}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              {match.status === "scheduled" && (
                <button
                  onClick={() => startMatch(match.id)}
                  className="min-h-11 rounded-xl bg-green-500 px-4 py-2 font-medium text-white"
                >
                  Start Match
                </button>
              )}

              {match.status === "live" && (
                <button
                  onClick={() => completeMatch(match)}
                  className="min-h-11 rounded-xl bg-yellow-500 px-4 py-2 font-medium text-white"
                >
                  Complete Match
                </button>
              )}

              {match.status === "live" && (
                <button
                  onClick={() => setReasonModal({ type: "pause", match })}
                  className="min-h-11 rounded-xl bg-orange-500 px-4 py-2 font-medium text-white"
                >
                  Pause
                </button>
              )}

              {match.status === "paused" && (
                <button
                  onClick={() => handleResume(match)}
                  className="min-h-11 rounded-xl bg-green-500 px-4 py-2 font-medium text-white"
                >
                  Resume
                </button>
              )}

              {(match.status === "live" || match.status === "paused") && (
                <>
                  <button
                    onClick={() => handleRevisedTarget(match)}
                    className="min-h-11 rounded-xl bg-purple-500 px-4 py-2 font-medium text-white"
                  >
                    Revised Target
                  </button>
                  <button
                    onClick={() => setReasonModal({ type: "abandon", match })}
                    className="min-h-11 rounded-xl bg-slate-600 px-4 py-2 font-medium text-white"
                  >
                    Mark Abandoned
                  </button>
                </>
              )}

              {match.status === "scheduled" && (
                <button
                  onClick={() => handleWalkover(match)}
                  className="min-h-11 rounded-xl bg-fuchsia-500 px-4 py-2 font-medium text-white"
                >
                  Walkover
                </button>
              )}

              <button
                onClick={() => handleNote(match)}
                className="min-h-11 rounded-xl bg-[#1B2A49] px-4 py-2 text-white"
              >
                Add Note
              </button>

              <Link
                href={`/scorer/${match.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center justify-center rounded-xl bg-[var(--vs-gold)] px-4 py-2 font-bold text-[#06152F]"
              >
                Scorer
              </Link>

              <Link
                href={`/live/${match.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center justify-center rounded-xl bg-blue-500 px-4 py-2 text-white"
              >
                Live
              </Link>

              <button
                onClick={() => handleDelete(match.id)}
                className="min-h-11 rounded-xl bg-red-500 px-4 py-2 text-white"
              >
                Delete Match
              </button>
            </div>
          </div>
        ))}

        {matches.length === 0 && (
          <p className="text-slate-400">No matches created yet.</p>
        )}
      </div>

      <ReasonModal
        config={reasonModal}
        onClose={() => setReasonModal(null)}
        onSubmit={async ({ reason, note }) => {
          if (!reasonModal) return;

          if (reasonModal.type === "pause") {
            await pauseMatch(reasonModal.match, reason, note, "admin");
          }

          if (reasonModal.type === "abandon") {
            await markAbandoned(reasonModal.match, reason);
          }

          setReasonModal(null);
        }}
      />
    </div>
  );
}

function ReasonModal({ config, onClose, onSubmit }) {
  const [reason, setReason] = useState("Rain");
  const [customReason, setCustomReason] = useState("");
  const [note, setNote] = useState("");

  if (!config) return null;

  const options =
    config.type === "abandon"
      ? ["Rain", "Bad Light", "Ground Issue", "Team Unavailable", "Technical Issue", "Other"]
      : ["Rain", "Bad Light", "Ground Issue", "Medical Emergency", "Technical Issue", "Other"];
  const finalReason = reason === "Other" ? customReason.trim() : reason;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-[#101D35] p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-white">
            {config.type === "abandon" ? "Abandoned Match Reason" : "Pause Reason"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            Close
          </button>
        </div>

        <select
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="mt-5 h-12 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 text-white"
        >
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {reason === "Other" && (
          <input
            value={customReason}
            onChange={(event) => setCustomReason(event.target.value)}
            placeholder="Custom reason"
            className="mt-4 h-12 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 text-white"
          />
        )}

        {config.type === "pause" && (
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Public note"
            className="mt-4 h-12 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 text-white"
          />
        )}

        <button
          disabled={!finalReason}
          onClick={() => onSubmit({ reason: finalReason, note })}
          className="mt-6 h-12 w-full rounded-xl bg-[var(--vs-gold)] font-black text-[#06152F] disabled:opacity-50"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const classes = {
    scheduled: "bg-yellow-500/20 text-yellow-300",
    live: "bg-green-500/20 text-green-300",
    paused: "bg-orange-500/20 text-orange-300",
    innings_break: "bg-purple-500/20 text-purple-300",
    completed: "bg-[var(--vs-gold)]/20 text-[var(--vs-gold)]",
    abandoned: "bg-slate-500/20 text-slate-300",
  };

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-sm font-bold capitalize ${
        classes[status] || "bg-slate-500/20 text-slate-300"
      }`}
    >
      {status || "unknown"}
    </span>
  );
}

function WarningBadge({ label }) {
  return (
    <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-bold text-yellow-300">
      {label}
    </span>
  );
}

