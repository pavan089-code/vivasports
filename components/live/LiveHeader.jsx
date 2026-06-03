import LiveBadge from "../ui/LiveBadge";

export default function LiveHeader() {
  return (
    <div className="flex items-center justify-between">

      <div>
        <h1 className="text-4xl font-black text-white">
          LIVE MATCH
        </h1>

        <p className="text-slate-400 mt-2">
          VIVA Cricket Tournament
        </p>
      </div>

      <LiveBadge />

    </div>
  );
}