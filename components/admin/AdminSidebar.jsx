export default function AdminSidebar({
  activeTab,
  setActiveTab,
}) {
  const operationLinks = [
    ["Points Manager", "/admin/points-table"],
    ["Historical Import", "/admin/historical-match"],
    ["Audit Mode", "/admin/audit"],
  ];
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
          VIVA SPORTS
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

        <div className="pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
            Operations
          </p>
          {operationLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="mb-3 flex h-12 items-center justify-center rounded-xl bg-[#101D35] text-sm font-semibold text-slate-300"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </aside>
  );
}
