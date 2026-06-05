import Card from "../ui/Card";

export default function BigScoreBoard({ match }) {
  return (
    <Card className="p-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Batting Team</p>

            <h2 className="text-4xl font-black text-white mt-2">
              {match.battingTeam}
            </h2>
          </div>

          <div className="text-right">
            <h1 className="text-7xl md:text-8xl font-black text-white">
              {match.score}/{match.wickets}
            </h1>

            <p className="mt-3 text-xl text-[var(--vs-gold-soft)]">{match.overs} Overs</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
