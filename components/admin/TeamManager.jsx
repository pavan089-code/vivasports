"use client";

import { useState } from "react";
import Card from "../ui/Card";
import { createTeam } from "@/services/teamService";

function uniqueNames(names) {
  return names
    .map((name) => name.trim())
    .filter(Boolean)
    .filter(
      (name, index, all) =>
        all.findIndex((item) => item.toLowerCase() === name.toLowerCase()) === index
    );
}

export default function TeamManager() {
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  async function handleCreateTeam() {
    if (!teamName.trim()) {
      alert("Enter team name");
      return;
    }

    const captain = captainName.trim();
    const teamId = await createTeam({
      name: teamName,
      captain,
      logo: logoUrl,
      players: uniqueNames([captain]),
    });

    alert(`Team Created: ${teamId}`);

    setTeamName("");
    setCaptainName("");
    setLogoUrl("");
  }

  return (
    <Card>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">
          Add Team
        </h2>

        <input
          value={teamName}
          onChange={(e) =>
            setTeamName(e.target.value)
          }
          placeholder="Team Name"
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
            outline-none
          "
        />

        <input
          value={captainName}
          onChange={(e) =>
            setCaptainName(e.target.value)
          }
          placeholder="Captain Name"
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
            outline-none
          "
        />

        <input
          value={logoUrl}
          onChange={(e) =>
            setLogoUrl(e.target.value)
          }
          placeholder="Logo URL"
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
            outline-none
          "
        />

        <button
          onClick={handleCreateTeam}
          className="
            w-full
            sm:w-fit
            h-14
            px-6
            rounded-xl
            bg-[var(--vs-gold)]
            text-[#06152F]
            font-bold
          "
        >
          Create Team
        </button>
      </div>
    </Card>
  );
}

