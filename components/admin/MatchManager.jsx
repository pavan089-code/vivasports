"use client";

import { useEffect, useState } from "react";
import Card from "../ui/Card";

import { createMatch } from "@/services/matchService";
import { getTeams } from "@/services/teamService";

export default function MatchManager() {
  const [teams, setTeams] = useState([]);

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  const [tossWinner, setTossWinner] =
    useState("");

  const [tossDecision, setTossDecision] =
    useState("");

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

    if (!tossWinner) {
      alert("Select toss winner");
      return;
    }

    if (!tossDecision) {
      alert("Select Bat or Bowl");
      return;
    }

    let battingTeam;
    let bowlingTeam;

    if (tossDecision === "bat") {
      battingTeam = tossWinner;

      bowlingTeam =
        tossWinner === teamA
          ? teamB
          : teamA;
    } else {
      bowlingTeam = tossWinner;

      battingTeam =
        tossWinner === teamA
          ? teamB
          : teamA;
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

      tossWinner,
      tossDecision,

      battingTeam,
      bowlingTeam,

      battingTeamPlayers:
        battingTeam === teamA
          ? selectedTeamA.players
          : selectedTeamB.players,

      bowlingTeamPlayers:
        bowlingTeam === teamA
          ? selectedTeamA.players
          : selectedTeamB.players,
    });

    alert(
      `Match Created: ${matchId}`
    );

    setTeamA("");
    setTeamB("");

    setTossWinner("");
    setTossDecision("");

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

        {/* TOSS WINNER */}
        <select
          value={tossWinner}
          onChange={(e) =>
            setTossWinner(
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
        >
          <option value="">
            Select Toss Winner
          </option>

          {teamA && (
            <option value={teamA}>
              {teamA}
            </option>
          )}

          {teamB && (
            <option value={teamB}>
              {teamB}
            </option>
          )}
        </select>

        {/* BAT OR BOWL */}
        <select
          value={tossDecision}
          onChange={(e) =>
            setTossDecision(
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
        >
          <option value="">
            Select Decision
          </option>

          <option value="bat">
            Bat
          </option>

          <option value="bowl">
            Bowl
          </option>
        </select>

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
          placeholder="Overs"
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