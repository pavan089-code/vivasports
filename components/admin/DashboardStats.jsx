"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    teams: 0,
    matches: 0,
    live: 0,
    completed: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const teamsSnapshot =
        await getDocs(
          collection(db, "teams")
        );

      const matchesSnapshot =
        await getDocs(
          collection(db, "matches")
        );

      const matches =
        matchesSnapshot.docs.map((doc) =>
          doc.data()
        );

      setStats({
        teams: teamsSnapshot.size,

        matches: matchesSnapshot.size,

        live: matches.filter(
          (m) =>
            m.status === "live" ||
            m.status === "innings_break"
        ).length,

        completed: matches.filter(
          (m) =>
            m.status === "completed"
        ).length,
      });
    }

    loadStats();
  }, []);

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
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
    <div className="bg-[#101D35] rounded-3xl p-6">
      <p className="text-slate-400">
        {title}
      </p>

      <h2 className="text-5xl font-black text-white mt-3">
        {value}
      </h2>
    </div>
  );
}