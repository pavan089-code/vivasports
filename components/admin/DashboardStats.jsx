"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/Lib/firebase";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    teams: 0,
    matches: 0,
    live: 0,
    completed: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [teamsSnapshot, matchesSnapshot] = await Promise.all([
          getDocs(collection(db, "teams")),
          getDocs(collection(db, "matches")),
        ]);
        const matches = matchesSnapshot.docs.map((doc) => doc.data());
        setStats({
          teams: teamsSnapshot.size,
          matches: matchesSnapshot.size,
          live: matches.filter((match) => match.status === "live" || match.status === "innings_break").length,
          completed: matches.filter((match) => match.status === "completed").length,
        });
      } catch {
        setStats({ teams: 0, matches: 0, live: 0, completed: 0 });
      }
    }

    loadStats();
  }, []);

  return (
    <div className="grid w-full max-w-full gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Teams"
        value={stats.teams}
      />

      <StatCard
        title="Matches"
        value={stats.matches}
      />

      <StatCard
        title="Live Matches"
        value={stats.live}
      />

      <StatCard
        title="Completed"
        value={stats.completed}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
}) {
  return (
    <div className="w-full min-w-0 max-w-full rounded-2xl bg-[#101D35] p-4 sm:p-6 lg:rounded-3xl">
      <p className="break-words text-base text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 break-words text-4xl font-black text-white sm:text-5xl">
        {value}
      </h2>
    </div>
  );
}
