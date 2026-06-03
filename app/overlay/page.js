"use client";

import useMatch from "../../hooks/useMatch";

export default function OverlayPage() {

  const match = useMatch();

  if (!match) return null;

  return (
    <main className="w-screen h-screen bg-transparent flex items-end p-8">

      <div
        className="
          w-full
          max-w-5xl
          rounded-3xl
          bg-black/70
          backdrop-blur-xl
          border border-white/10
          px-8
          py-6
        "
      >

        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div>

            <p className="text-cyan-400 font-semibold text-sm tracking-widest">
              LIVE
            </p>

            <h1 className="text-4xl font-black text-white mt-2">
              {match.battingTeam}
            </h1>

            <p className="text-slate-300 mt-2 text-lg">
              {match.status}
            </p>

          </div>

          {/* CENTER SCORE */}
          <div className="text-center">

            <h2 className="text-7xl font-black text-white">
              {match.score}/{match.wickets}
            </h2>

            <p className="text-slate-400 mt-2 text-xl">
              {match.overs}.{match.balls} Overs
            </p>

          </div>

          {/* RIGHT */}
          <div className="text-right">

            <p className="text-slate-400 text-sm">
              Current Over
            </p>

            <div className="flex gap-2 mt-3 justify-end">

              {match.currentOver?.map((ball, index) => (

                <div
                  key={index}
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-[#101D35]
                    border border-white/10
                    flex items-center justify-center
                    text-white
                    font-bold
                  "
                >
                  {ball}
                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}