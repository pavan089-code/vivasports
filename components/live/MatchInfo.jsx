import Card from "../ui/Card";

export default function MatchInfo({
  match,
}) {
  return (
    <Card>

      <div className="space-y-6">

        <h3 className="text-2xl font-bold text-white">
          Match Info
        </h3>

        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <span className="text-slate-400">
              Striker
            </span>

            <span className="text-white font-bold">
              {match.striker}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">
              Non-Striker
            </span>

            <span className="text-white font-bold">
              {match.nonStriker}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">
              Bowler
            </span>

            <span className="text-white font-bold">
              {match.bowler}
            </span>
          </div>

        </div>

      </div>

    </Card>
  );
}