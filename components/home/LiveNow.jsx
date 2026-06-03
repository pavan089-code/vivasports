"use client";

import Container from "../Layout/Container";
import Card from "../ui/Card";
import LiveBadge from "../ui/LiveBadge";

import  useMatch  from "@/hooks/useMatch";

export default function LiveNow() {

  const match = useMatch();


  if (!match) return null;

  return (
    <section className="py-12">

      <Container>

        <div className="flex items-center justify-between mb-6">

          <LiveBadge />

          <p className="text-slate-400 text-sm">
            LIVE MATCH
          </p>

        </div>

        <Card className="grid lg:grid-cols-2 gap-6 items-center">

          {/* Score */}
          <div>

            <div className="flex items-center justify-between">

              {/* Batting Team */}
              <div>

                <h2 className="text-2xl font-bold text-white">
                  {match.battingTeam}
                </h2>

                <p className="text-5xl font-black text-white mt-2">
                  {match.score}/{match.wickets}
                </p>

                <p className="text-slate-400 mt-2">
                  {match.overs}.{match.balls} Overs
                </p>

              </div>

              {/* VS */}
              <div className="text-4xl font-black text-cyan-400">
                VS
              </div>

              {/* Bowling Team */}
              <div className="text-right">

                <h2 className="text-2xl font-bold text-white">
                  {match.bowlingTeam}
                </h2>

                <p className="text-slate-400 mt-2">
                  Target: {match.target || "-"}
                </p>

              </div>

            </div>

            {/* Match Status */}
            <div className="mt-6">

              <p className="text-cyan-400 font-semibold text-lg">
                {match.status}
              </p>

            </div>

            {/* Current Over */}
            <div className="flex gap-2 mt-6 flex-wrap">

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
                    text-white font-bold
                  "
                >
                  {ball}
                </div>

              ))}

            </div>

          </div>

          {/* Stream */}
          <div className="aspect-video bg-black rounded-2xl overflow-hidden">

            <iframe
              className="w-full h-full"
              src={match.youtubeUrl}
              allowFullScreen
            />

          </div>

        </Card>

      </Container>

    </section>
  );
}