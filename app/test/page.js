"use client";

import { createMatch } from "@/services/matchService";

export default function TestPage() {
  async function handleCreateMatch() {
    const matchId = await createMatch({
      teamA: "Viva Sports Warriors",
      teamB: "Royal Strikers",
      
      status: "live",
      
      innings: 1,
      
      oversLimit: 2,
      
      target: null,
      
      score: 0,
      wickets: 0,
      
      totalBalls: 0,
      overs: "0.0",
      
      currentOver: [],
      balls: [],
      
      outPlayers: [],
      
      matchEnded: false,
      
      winner: null,
      
      result: null,
      
      battingTeam: "Viva Sports Warriors",
      bowlingTeam: "Royal Strikers",
      
      battingTeamPlayers: [
        "Virat",
        "Rohit",
        "Sky",
        "Hardik",
        "Dhoni",
        "Jadeja",
        "Axar",
        "Bumrah",
        "Shami",
        "Siraj",
        "Kuldeep",
      ],
      
      bowlingTeamPlayers: [
        "Buttler",
        "Salt",
        "Livingstone",
        "Brook",
        "Moeen",
        "Curran",
        "Woakes",
        "Wood",
        "Archer",
        "Rashid",
        "Rehan",
      ],

      striker: {
        name: "Virat",
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
      },
      
      nonStriker: {
        name: "Rohit",
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
      },
      
      currentBowler: {
        name: "Archer",
        runs: 0,
        wickets: 0,
        balls: 0,
      },
    });
    
    alert("Match Created Successfully");
    alert(`Match Created: ${matchId}`);
  }
  
  return (
    <div className="min-h-screen bg-[#050B18] text-white p-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-black mb-8">
          Viva Sports Test Match Creator
        </h1>

        <button
          onClick={handleCreateMatch}
          className="
            bg-cyan-500
            hover:bg-cyan-600
            text-white
            px-8
            py-4
            rounded-xl
            font-bold
          "
        >
          Create Test Match
        </button>
      </div>
    </div>
  );
}
