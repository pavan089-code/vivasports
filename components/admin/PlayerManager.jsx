"use client";

import { useState } from "react";
import { updateTeam } from "@/services/teamService";

export default function PlayerManager({
  team,
  onRefresh,
}) {
  const [playerName, setPlayerName] =
    useState("");

  async function handleAddPlayer() {
    if (!playerName.trim()) return;

    const updatedPlayers = [
      ...(team.players || []),
      playerName,
    ];

    await updateTeam(team.id, {
      players: updatedPlayers,
    });

    setPlayerName("");

    onRefresh();
  }

  async function handleRemovePlayer(
    player
  ) {
    const updatedPlayers =
      (team.players || []).filter(
        (p) => p !== player
      );

    await updateTeam(team.id, {
      players: updatedPlayers,
    });

    onRefresh();
  }

  return (
    <div className="mt-4">
      <h4 className="text-white font-bold mb-3">
        Players
      </h4>

      <div className="space-y-2">
        {(team.players || []).map(
          (player) => (
            <div
              key={player}
              className="
                flex
                flex-col
                gap-2
                bg-[#101D35]
                rounded-lg
                px-3
                py-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <span className="break-words text-white">
                {player}
              </span>

              <button
                onClick={() =>
                  handleRemovePlayer(
                    player
                  )
                }
                className="
                  min-h-11
                  rounded-lg
                  bg-red-500/10
                  px-3
                  text-sm
                  text-red-300
                  sm:bg-transparent
                "
              >
                Remove
              </button>
            </div>
          )
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={playerName}
          onChange={(e) =>
            setPlayerName(
              e.target.value
            )
          }
          placeholder="Player Name"
          className="
            w-full
            flex-1
            h-12
            px-3
            rounded-lg
            bg-[#101D35]
            border
            border-white/10
            text-white
          "
        />

        <button
          onClick={handleAddPlayer}
          className="
            min-h-11
            w-full
            px-4
            rounded-lg
            bg-[var(--vs-gold)]
            text-[#06152F]
            font-bold
            sm:w-auto
          "
        >
          Add
        </button>
      </div>
    </div>
  );
}
