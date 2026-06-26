export default function AdminSidebar({
  activeTab,
  setActiveTab,
  mobile = false,
  onClose,
}) {
  const operationLinks = [
    ["Tournament Registrations", "/admin/tournament-registrations"],
    ["Points Manager", "/admin/points-table"],
    ["Historical Import", "/admin/historical-match"],
    ["Audit Mode", "/admin/audit"],
  ];
  const contentLinks = [
    ["About", "/admin/about"],
    ["Committee", "/admin/committee"],
    ["Champions", "/admin/champions"],
    ["Gallery", "/admin/gallery"],
    ["Sponsors", "/admin/sponsors"],
    ["History", "/admin/history"],
  ];
  const tabs = [
    "dashboard",
    "teams",
    "matches",
    "settings",
  ];

  return (
    <aside
      className={`
        min-w-0
        min-h-screen
        overflow-y-auto
        bg-[#0A1428]
        border-r border-[var(--border)]
        p-6
        ${
          mobile
            ? "admin-drawer-enter fixed inset-y-0 left-0 z-50 w-[min(18rem,calc(100vw-2rem))] lg:hidden"
            : "hidden lg:sticky lg:top-0 lg:block lg:w-64"
        }
      `}
    >
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            VIVA SPORTS
          </h2>

        <p className="text-[var(--vs-gold)] text-xs font-bold tracking-widest">
          ADMIN PANEL
        </p>
        </div>

        <button
          type="button"
          aria-label="Close admin menu"
          onClick={onClose}
          className={`h-11 w-11 items-center justify-center rounded-xl bg-[#101D35] text-xl font-black text-white ${
            mobile ? "flex" : "hidden"
          }`}
        >
          X
        </button>
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
                  ? "bg-[var(--vs-gold)] text-[#06152F] font-semibold"
                  : "bg-[#101D35] text-[var(--text-secondary)]"
              }
            `}
          >
            {tab}
          </button>
        ))}

        <div className="pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            Website Content
          </p>
          {contentLinks.map(([label, href]) => (
            <a key={`${label}-${href}`} href={href} onClick={onClose} className="mb-3 flex min-h-12 items-center justify-center rounded-xl bg-[#101D35] px-3 text-center text-sm font-semibold text-[var(--text-secondary)]">
              {label}
            </a>
          ))}
        </div>

        <div className="pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            Operations
          </p>
          {operationLinks.map(([label, href]) => (
            <a
              key={`${label}-${href}`}
              href={href}
              onClick={onClose}
              className="mb-3 flex min-h-12 items-center justify-center rounded-xl bg-[#101D35] px-3 text-center text-sm font-semibold text-[var(--text-secondary)]"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </aside>
  );
}

