"use client";

import useMatch from "@/hooks/useMatch";
import CurrentOver from "@/components/scorer/CurrentOver";
import BatterCard from "@/components/match/BatterCard";

export default function LiveMatchScreen({ matchId }) {
  const { match, loading } = useMatch(matchId);
  if (match) {
    console.log("LIVE STATUS:", match.status);
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Match...
      </div>
    );
  }
  if (!match) {
    return <div>Match Not Found</div>;
  }

  if (match.status === "innings_break") {
    return (
      <main className="min-h-screen bg-[#050B18] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-black">INNINGS BREAK</h1>

          <p className="mt-8 text-3xl">Target: {match.target}</p>

          <p className="text-slate-400 mt-4">
            {match.battingTeam} need {match.target} runs to win
          </p>
        </div>
      </main>
    );
  }
if (match.status === "completed") {
  return (
    <main className="min-h-screen bg-[#050B18] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-black">
          MATCH COMPLETED
        </h1>

        <p className="mt-6 text-3xl">
          {match.result?.result}
        </p>

        <p className="mt-4 text-slate-400">
          Winner: {match.result?.winner}
        </p>

        <p className="mt-4 text-slate-400">
          Final Score: {match.score}/{match.wickets}
        </p>
      </div>
    </main>
  );
}
  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* <pre>{JSON.stringify(match, null, 2)}</pre> */}
      <div className="max-w-5xl mx-auto space-y-8">
        {/* console.log("match data", match) */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-cyan-400 text-sm">LIVE MATCH</p>

            <h1 className="text-5xl font-black mt-2">
              {match.teamA} vs {match.teamB}
            </h1>
          </div>

          <div className="px-4 py-2 rounded-xl bg-red-500 animate-pulse">
            LIVE
          </div>
        </div>
        <div className="bg-[#101D35] rounded-3xl p-10">
          <div className="flex items-end gap-4">
            <h2 className="text-8xl font-black">
              {String(match.score)}/{String(match.wickets)}
            </h2>

            <p className="text-3xl text-slate-400 mb-3">
              ({String(match.overs)})
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-slate-400 text-sm uppercase tracking-widest">
              Current Over
            </p>

            <CurrentOver balls={match.currentOver || []} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <BatterCard batter={match.striker} isStriker={true} />

            <BatterCard batter={match.nonStriker} isStriker={false} />
          </div>
        </div>
      </div>
    </main>
  );
}
