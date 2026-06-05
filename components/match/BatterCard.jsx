export default function BatterCard({ batter, isStriker }) {
  // console.log("BATTER CARD", batter);
  if (!batter) return null;

  const runs = Number.isFinite(Number(batter?.runs)) ? Number(batter.runs) : 0;

  const balls = Number.isFinite(Number(batter?.balls))
    ? Number(batter.balls)
    : 0;

  const fours = Number.isFinite(Number(batter?.fours))
    ? Number(batter.fours)
    : 0;

  const sixes = Number.isFinite(Number(batter?.sixes))
    ? Number(batter.sixes)
    : 0;

  const strikeRate = balls > 0 ? ((runs / balls) * 100).toFixed(1) : "0.0";

  return (
    <div
      className="vs-card p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black text-white">
              {batter?.name || "Select Batter"}
            </h3>

            {isStriker && (
              <div
                className="
                  w-3
                  h-3
                  rounded-full
                  bg-[var(--vs-gold)]
                "
              />
            )}
          </div>

          <p className="text-slate-400 mt-1">Batting</p>
        </div>

        <div className="text-right">
          <h2 className="text-4xl font-black text-white">{runs}</h2>

          <p className="text-slate-400">({balls})</p>
        </div>
      </div>

      <div className="flex gap-6 mt-6 text-slate-300">
        <p>4s: {fours}</p>

        <p>6s: {sixes}</p>

        <p>SR: {strikeRate}</p>
      </div>
    </div>
  );
}
