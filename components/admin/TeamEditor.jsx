"use client";

import { useState } from "react";
import { updateTeam } from "@/services/teamService";

export default function TeamEditor({ team, onRefresh, onDelete }) {
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(team.name);

  const [captain, setCaptain] = useState(team.captain);

  const [logo, setLogo] = useState(team.logo || "");

  const [players, setPlayers] = useState(team.players || []);

  const [newPlayer, setNewPlayer] = useState("");

  function addPlayer() {
    if (!newPlayer.trim()) return;

    if (players.length >= 15) {
      alert("Maximum 15 players allowed");
      return;
    }
    if (players.some((p) => p.toLowerCase() === newPlayer.toLowerCase())) {
      alert("Player already exists");
      return;
    }
    setPlayers([...players, newPlayer.trim()]);

    setNewPlayer("");
  }

  function removePlayer(player) {
    setPlayers(players.filter((p) => p !== player));
  }

  async function handleSave() {
    if (!name.trim()) {
      alert("Team name required");
      return;
    }

    if (players.length < 11) {
      const proceed = confirm(
        `This team only has ${players.length} players. Save anyway?`,
      );

      if (!proceed) return;
    }

    await updateTeam(team.id, {
      name,
      captain,
      logo,
      players,
    });

    setEditing(false);

    onRefresh();
  }
  <div className="flex justify-between items-center">
  <h3 className="text-white font-bold">
    Edit Team
  </h3>

  <button
    onClick={() =>
      setEditing(false)
    }
    className="
      text-slate-400
      hover:text-white
    "
  >
    ✕
  </button>
</div>
 if (!editing) {
  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={() =>
          setEditing(true)
        }
        className="
          px-4
          py-2
          rounded-xl
          bg-yellow-500
          text-white
        "
      >
        Edit
      </button>

      <button
        onClick={onDelete}
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
  );
}

  return (
    <div
      className="
      mt-6
      p-5
      rounded-2xl
      bg-[#101D35]
      border
      border-white/10
      space-y-4
    "
    >
      <div>
        <label className="block text-slate-400 mb-2">Team Name</label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team Name"
          className="
          w-full
          h-12
          px-3
          rounded-lg
          bg-[#101D35]
          text-white
        "
        />
      </div>

      <div>
        <label className="block text-slate-400 mb-2">Captain</label>

        <input
          value={captain}
          onChange={(e) => setCaptain(e.target.value)}
          placeholder="Captain"
          className="
          w-full
          h-12
          px-3
          rounded-lg
          bg-[#101D35]
          text-white
        "
        />
      </div>

      <input
        value={logo}
        onChange={(e) => setLogo(e.target.value)}
        placeholder="Logo URL"
        className="
          w-full
          h-12
          px-3
          rounded-lg
          bg-[#101D35]
          text-white
        "
      />

      <div>
        <h4 className="text-white font-bold mb-3">
          Players ({players.length})
        </h4>

        <div
          className="
    space-y-2
    max-h-56
    overflow-y-auto
  "
        >
          {players.map((player) => (
            <div
              key={player}
              className="
                flex
                justify-between
                items-center
                bg-[#101D35]
                rounded-lg
                px-3
                py-2
              "
            >
              <span className="text-white">{player}</span>

              <button
                onClick={() => removePlayer(player)}
                className="
                  text-red-400
                "
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <input
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="Player Name"
          className="
  flex-1
  h-12
  px-3
  rounded-xl
  bg-[#0A1428]
  border
  border-white/10
  text-white
"
        />

        <button
          onClick={addPlayer}
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

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          className="
      px-5
      py-3
      rounded-xl
      bg-green-500
      text-white
      font-bold
    "
        >
          Save Changes
        </button>

        <button
          onClick={() => setEditing(false)}
          className="
      px-5
      py-3
      rounded-xl
      bg-slate-600
      text-white
    "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
