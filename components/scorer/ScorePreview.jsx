import Card from "../ui/Card";

export default function ScorePreview({ match }) {

  return (
    <Card>

      <div className="space-y-6">

        {/* TOP */}
        <div className="flex items-center justify-between">

          {/* TEAM */}
          <div>

            <p className="text-cyan-400 text-sm tracking-widest font-semibold">
              LIVE SCORING
            </p>

            <h2 className="text-3xl font-black text-white mt-2">
              {match.battingTeam}
            </h2>

          </div>

          {/* SCORE */}
          <div className="text-right">

            <p
              className="
                text-6xl
                font-black
                text-white
                tracking-tight
              "
            >
              {match.score}/{match.wickets}
            </p>

            <p className="text-slate-400 mt-2">
              {match.overs} Overs
            </p>

          </div>

        </div>

        {/* STATUS */}
        <div
          className="
            px-4
            py-3
            rounded-2xl
            bg-cyan-500/10
            border border-cyan-500/20
          "
        >

          <p className="text-cyan-400 font-semibold">

            {match.status}

          </p>

        </div>

        {/* LAST EVENT */}
        {match.lastBallEvent && (

          <div
            className={`
              inline-flex
              px-5
              py-2
              rounded-full
              font-black
              text-lg
              animate-pulse
              ${
                match.lastBallEvent === "FOUR"
                  ? "bg-green-500/20 text-green-400"
                  : match.lastBallEvent === "SIX"
                  ? "bg-purple-500/20 text-purple-400"
                  : match.lastBallEvent === "WICKET"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-cyan-500/20 text-cyan-400"
              }
            `}
          >

            {match.lastBallEvent}

          </div>

        )}

        {/* PLAYERS */}
        <div className="grid grid-cols-2 gap-4">

          {/* STRIKER */}
          <div
            className="
              bg-[#101D35]
              rounded-2xl
              p-5
              border border-cyan-500/20
            "
          >

            <p className="text-slate-400 text-sm">
              Striker
            </p>

            <h3 className="text-white font-bold text-xl mt-2">
              {match.striker}
            </h3>

          </div>

          {/* BOWLER */}
          <div
            className="
              bg-[#101D35]
              rounded-2xl
              p-5
              border border-white/10
            "
          >

            <p className="text-slate-400 text-sm">
              Bowler
            </p>

            <h3 className="text-white font-bold text-xl mt-2">
              {match.bowler}
            </h3>

          </div>

        </div>

      </div>

    </Card>
  );
}