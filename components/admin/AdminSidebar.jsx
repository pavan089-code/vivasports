export default function AdminSidebar({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    "dashboard",
    "teams",
    "matches",
    "settings",
  ];

  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-[#0A1428]
        border-r border-white/10
        p-6
      "
    >
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white">
          VIVA
        </h2>

        <p className="text-cyan-400 text-xs tracking-widest">
          ADMIN PANEL
        </p>
      </div>

      <nav className="space-y-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab)
            }
            className={`
              w-full
              h-12
              rounded-xl
              capitalize
              transition-all

              ${
                activeTab === tab
                  ? "bg-cyan-500 text-white font-semibold"
                  : "bg-[#101D35] text-slate-300"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </nav>
    </aside>
  );
}