export default function AdminHeader() {
  return (
    <div className="flex items-center justify-between">

      <div>
        <h1 className="text-4xl font-black text-white">
          Tournament Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Manage matches, teams and settings
        </p>
      </div>

      <div className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 font-semibold">
        LIVE TOURNAMENT
      </div>

    </div>
  );
}