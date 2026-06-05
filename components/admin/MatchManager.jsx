"use client";

import { useEffect, useState } from "react";
import Card from "../ui/Card";

import { createMatch } from "@/services/matchService";
import { getTeams } from "@/services/teamService";

export default function MatchManager() {
  const [teams, setTeams] = useState([]);

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  const [matchDate, setMatchDate] =
    useState("");

  const [matchTime, setMatchTime] =
    useState("");

  const [ground, setGround] =
    useState("");

  const [oversLimit, setOversLimit] =
    useState(20);

  const [youtubeLink, setYoutubeLink] =
    useState("");

  useEffect(() => {
    async function loadTeams() {
      const data = await getTeams();
      setTeams(data);
    }

    loadTeams();
  }, []);

  async function handleCreateMatch() {
    if (!teamA || !teamB) {
      alert("Select both teams");
      return;
    }

    if (teamA === teamB) {
      alert("Teams must be different");
      return;
    }

    const selectedTeamA = teams.find(
      (team) => team.name === teamA
    );

    const selectedTeamB = teams.find(
      (team) => team.name === teamB
    );

    if (
      (selectedTeamA?.players?.length || 0) < 11
    ) {
      alert(
        `${teamA} needs at least 11 players`
      );
      return;
    }

    if (
      (selectedTeamB?.players?.length || 0) < 11
    ) {
      alert(
        `${teamB} needs at least 11 players`
      );
      return;
    }

    const matchId = await createMatch({
      teamA,
      teamB,

      date: matchDate,
      time: matchTime,

      ground,
      youtubeLink,

      status: "scheduled",

      innings: 1,

      oversLimit: Number(
        oversLimit
      ),

      target: null,

      score: 0,
      wickets: 0,

      totalBalls: 0,
      overs: "0.0",

      currentOver: [],
      balls: [],

      outPlayers: [],

      winner: null,
      result: null,

      striker: null,
      nonStriker: null,
      currentBowler: null,

      tossWinner: null,
      tossDecision: null,

      battingTeam: null,
      bowlingTeam: null,

      teamAPlayers: selectedTeamA.players,
      teamBPlayers: selectedTeamB.players,
      battingTeamPlayers: [],
      bowlingTeamPlayers: [],
    });

    alert(
      `Match Created: ${matchId}`
    );

    setTeamA("");
    setTeamB("");

    setMatchDate("");
    setMatchTime("");

    setGround("");

    setOversLimit(20);

    setYoutubeLink("");
  }

  return (
    <Card>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">
          Create Match
        </h2>

        {/* TEAM A */}
        <select
          value={teamA}
          onChange={(e) =>
            setTeamA(e.target.value)
          }
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
          "
        >
          <option value="">
            Select Team A
          </option>

          {teams.map((team) => (
            <option
              key={team.id}
              value={team.name}
            >
              {team.name}
            </option>
          ))}
        </select>

        {/* TEAM B */}
        <select
          value={teamB}
          onChange={(e) =>
            setTeamB(e.target.value)
          }
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
          "
        >
          <option value="">
            Select Team B
          </option>

          {teams.map((team) => (
            <option
              key={team.id}
              value={team.name}
            >
              {team.name}
            </option>
          ))}
        </select>

        <p className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">
          Toss is conducted by the scorer after the match starts.
        </p>

        <input
          type="date"
          value={matchDate}
          onChange={(e) =>
            setMatchDate(
              e.target.value
            )
          }
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
          "
        />

        <input
          type="time"
          value={matchTime}
          onChange={(e) =>
            setMatchTime(
              e.target.value
            )
          }
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
          "
        />

        <input
          placeholder="Ground"
          value={ground}
          onChange={(e) =>
            setGround(
              e.target.value
            )
          }
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
          "
        />

        <input
          type="number"
          placeholder="Overs Per Innings"
          value={oversLimit}
          onChange={(e) =>
            setOversLimit(
              e.target.value
            )
          }
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
          "
        />

        <p className="-mt-4 text-sm text-slate-400">
          Enter overs per innings, not total match overs.
        </p>

        <input
          placeholder="YouTube Live Link"
          value={youtubeLink}
          onChange={(e) =>
            setYoutubeLink(
              e.target.value
            )
          }
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
          "
        />

        <button
          onClick={handleCreateMatch}
          className="
            h-14
            px-6
            rounded-xl
            bg-cyan-500
            hover:bg-cyan-600
            text-white
            font-bold
          "
        >
          Create Match
        </button>
      </div>
    </Card>
  );
}
