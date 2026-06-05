"use client";

import { useState } from "react";
import { updateTeam } from "@/services/teamService";

function normalizeRoster(players, captain) {
  return [captain, ...players]
    .map((player) => (player || "").trim())
    .filter(Boolean)
    .filter(
      (player, index, all) =>
        all.findIndex((item) => item.toLowerCase() === player.toLowerCase()) === index
    );
}

export default function TeamEditor({ team, onRefresh, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(team.name);
  const [captain, setCaptain] = useState(team.captain || "");
  const [logo, setLogo] = useState(team.logo || "");
  const [players, setPlayers] = useState(team.players || []);
  const [newPlayer, setNewPlayer] = useState("");

  function addPlayer() {
    const playerName = newPlayer.trim();
    if (!playerName) return;

    if (players.length >= 15) {
      alert("Maximum 15 players allowed");
      return;
    }

    if (players.some((player) => player.toLowerCase() === playerName.toLowerCase())) {
      alert("Player already exists");
      return;
    }

    setPlayers([...players, playerName]);
    setNewPlayer("");
  }

  function removePlayer(player) {
    if (player.toLowerCase() === captain.trim().toLowerCase()) {
      alert("Captain must remain in the squad. Change captain before removing this player.");
      return;
    }

    setPlayers(players.filter((item) => item !== player));
  }

  async function handleSave() {
    if (!name.trim()) {
      alert("Team name required");
      return;
    }

    const roster = normalizeRoster(players, captain);

    if (roster.length < 11) {
      const proceed = confirm(`This team only has ${roster.length} players. Save anyway?`);
      if (!proceed) return;
    }

    await updateTeam(team.id, {
      name,
      captain: captain.trim(),
      logo,
      players: roster,
    });

    setPlayers(roster);
    setEditing(false);
    onRefresh();
  }

  if (!editing) {
    return (
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 rounded-xl bg-yellow-500 text-white"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="px-4 py-2 rounded-xl bg-red-500 text-white"
        >
          Delete
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-[#101D35] p-5">
      <div>
        <label className="block text-slate-400 mb-2">Team Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Team Name"
          className="h-12 w-full rounded-lg bg-[#0A1428] px-3 text-white"
        />
      </div>

      <div>
        <label className="block text-slate-400 mb-2">Captain</label>
        <input
          value={captain}
          onChange={(event) => setCaptain(event.target.value)}
          placeholder="Captain"
          className="h-12 w-full rounded-lg bg-[#0A1428] px-3 text-white"
        />
        <p className="mt-2 text-sm text-slate-500">
          Captain is automatically kept in the squad.
        </p>
      </div>

      <input
        value={logo}
        onChange={(event) => setLogo(event.target.value)}
        placeholder="Logo URL"
        className="h-12 w-full rounded-lg bg-[#0A1428] px-3 text-white"
      />

      <div>
        <h4 className="text-white font-bold mb-3">Players ({normalizeRoster(players, captain).length})</h4>

        <div className="max-h-56 space-y-2 overflow-y-auto">
          {normalizeRoster(players, captain).map((player) => (
            <div
              key={player}
              className="flex items-center justify-between rounded-lg bg-[#0A1428] px-3 py-2"
            >
              <span className="text-white">
                {player}
                {player.toLowerCase() === captain.trim().toLowerCase() && (
                  <span className="ml-2 text-xs font-bold text-cyan-300">Captain</span>
                )}
              </span>

              <button onClick={() => removePlayer(player)} className="text-red-400">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <input
          value={newPlayer}
          onChange={(event) => setNewPlayer(event.target.value)}
          placeholder="Player Name"
          className="h-12 flex-1 rounded-xl border border-white/10 bg-[#0A1428] px-3 text-white"
        />

        <button onClick={addPlayer} className="rounded-lg bg-cyan-500 px-4 py-3 text-white">
          Add
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={handleSave} className="rounded-xl bg-green-500 px-5 py-3 font-bold text-white">
          Save Changes
        </button>

        <button onClick={() => setEditing(false)} className="rounded-xl bg-slate-600 px-5 py-3 text-white">
          Cancel
        </button>
      </div>
    </div>
  );
}
