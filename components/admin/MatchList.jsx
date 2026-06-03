"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getMatches,
  deleteMatch,
  updateMatch,
} from "@/services/matchService";

export default function MatchList() {
  const [matches, setMatches] =
    useState([]);

  async function loadMatches() {
    const data =
      await getMatches();

    setMatches(data);
  }

  async function handleDelete(
    matchId
  ) {
    const confirmed =
      confirm(
        "Delete this match?"
      );

    if (!confirmed) return;

    await deleteMatch(matchId);

    loadMatches();
  }

  async function startMatch(
    matchId
  ) {
    await updateMatch(matchId, {
      status: "live",
    });

    loadMatches();
  }

  async function completeMatch(
    matchId
  ) {
    const confirmed =
      confirm(
        "Mark match as completed?"
      );

    if (!confirmed) return;

    await updateMatch(matchId, {
      status: "completed",
    });

    loadMatches();
  }

  useEffect(() => {
    loadMatches();
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
            className="
              bg-[#101D35]
              rounded-2xl
              p-5
              border border-white/10
            "
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {match.teamA} vs{" "}
                  {match.teamB}
                </h3>

                <p className="text-slate-400 mt-2">
                  {match.date} •{" "}
                  {match.time}
                </p>

                <p className="text-slate-400">
                  {match.ground}
                </p>
              </div>

              <div>
                {match.status ===
                  "scheduled" && (
                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-yellow-500/20
                      text-yellow-400
                      text-sm
                    "
                  >
                    Scheduled
                  </span>
                )}

                {match.status ===
                  "live" && (
                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-green-500/20
                      text-green-400
                      text-sm
                    "
                  >
                    Live
                  </span>
                )}

                {match.status ===
                  "completed" && (
                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-cyan-500/20
                      text-cyan-400
                      text-sm
                    "
                  >
                    Completed
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              {match.status ===
                "scheduled" && (
                <button
                  onClick={() =>
                    startMatch(
                      match.id
                    )
                  }
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-green-500
                    text-white
                    font-medium
                  "
                >
                  Start Match
                </button>
              )}

              {match.status ===
                "live" && (
                <button
                  onClick={() =>
                    completeMatch(
                      match.id
                    )
                  }
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-yellow-500
                    text-white
                    font-medium
                  "
                >
                  Complete Match
                </button>
              )}

              <Link
                href={`/scorer/${match.id}`}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-cyan-500
                  text-white
                "
              >
                Scorer
              </Link>

              <Link
                href={`/live/${match.id}`}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-500
                  text-white
                "
              >
                Live
              </Link>

              <button
                onClick={() =>
                  handleDelete(
                    match.id
                  )
                }
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-red-500
                  text-white
                "
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {matches.length === 0 && (
          <p className="text-slate-400">
            No matches created yet.
          </p>
        )}
      </div>
    </div>
  );
}