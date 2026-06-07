export default function AdminHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h1 className="max-w-full break-words text-2xl font-black leading-tight text-white sm:text-4xl">
          Tournament Dashboard
        </h1>

        <p className="mt-2 text-base text-slate-400">
          Manage matches, teams and settings
        </p>
      </div>

      <div className="w-fit rounded-xl bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400">
        LIVE TOURNAMENT
      </div>

    </div>
  );
}
