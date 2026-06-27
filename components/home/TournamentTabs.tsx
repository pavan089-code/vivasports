"use client";

import { motion } from "framer-motion";

export type TournamentTab = "upcoming" | "live" | "completed";

export default function TournamentTabs({
  activeTab,
  hasLiveTournaments,
  onChange,
}: {
  activeTab: TournamentTab;
  hasLiveTournaments: boolean;
  onChange: (tab: TournamentTab) => void;
}) {
  const tabs: Array<{ id: TournamentTab; label: string }> = [
    { id: "upcoming", label: "Upcoming" },
    { id: "live", label: hasLiveTournaments ? "Live" : "Current" },
    { id: "completed", label: "Previous" },
  ];

  return (
    <div aria-label="Filter tournaments" className="inline-flex rounded-full border border-white/10 bg-[#0a1833] p-1.5" role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            aria-controls="tournament-panel"
            aria-selected={isActive}
            className={`relative min-h-11 rounded-full px-5 text-sm font-black uppercase transition-colors md:px-7 ${isActive ? "text-[#07152e]" : "text-slate-400 hover:text-white"}`}
            id={`tournament-tab-${tab.id}`}
            key={tab.id}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const currentIndex = tabs.findIndex((item) => item.id === tab.id);
              const offset = event.key === "ArrowRight" ? 1 : -1;
              const nextTab = tabs[(currentIndex + offset + tabs.length) % tabs.length];
              onChange(nextTab.id);
              document.getElementById(`tournament-tab-${nextTab.id}`)?.focus();
            }}
            role="tab"
            type="button"
          >
            {isActive && (
              <motion.span
                className="absolute inset-0 rounded-full bg-[#d4af37] shadow-[0_8px_28px_rgba(212,175,55,.25)]"
                layoutId="active-tournament-tab"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
