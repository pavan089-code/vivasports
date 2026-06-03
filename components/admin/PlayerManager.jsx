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
                items-center
                justify-between
                bg-[#101D35]
                rounded-lg
                px-3
                py-2
              "
            >
              <span className="text-white">
                {player}
              </span>

              <button
                onClick={() =>
                  handleRemovePlayer(
                    player
                  )
                }
                className="
                  text-red-400
                  text-sm
                "
              >
                Remove
              </button>
            </div>
          )
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={playerName}
          onChange={(e) =>
            setPlayerName(
              e.target.value
            )
          }
          placeholder="Player Name"
          className="
            flex-1
            h-10
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
            px-4
            rounded-lg
            bg-cyan-500
            text-white
          "
        >
          Add
        </button>
      </div>
    </div>
  );
}