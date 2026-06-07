"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/Lib/firebase";
import TeamEditor from "@/components/admin/TeamEditor";

export default function TeamList() {
  const [teams, setTeams] = useState([]);

  async function loadTeams() {
    // FIX: Added quotes around "teams"
    const snapshot = await getDocs(collection(db, "teams"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTeams(data);
  }

  async function handleDelete(teamId) {
    const confirmed = confirm("Delete this team?");
    if (!confirmed) return;
    // FIX: Added quotes around "teams"
    await deleteDoc(doc(db, "teams", teamId));
    loadTeams();
  }

  useEffect(() => {
    Promise.resolve().then(loadTeams);
  }, []);

  return (
    <div className="w-full min-w-0 rounded-2xl bg-[#101D35] p-4 sm:p-6 lg:rounded-3xl">
      <h2 className="text-2xl font-bold text-white mb-6">Existing Teams</h2>

      <div
        className="
    grid
    gap-6
    items-start
    min-w-0
  "
      >
        {teams.map((team) => {
          const playerCount = team.players?.length || 0;
          const badgeColor =
            playerCount >= 11
              ? "bg-green-500/20 text-green-400"
              : playerCount >= 8
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400";

          return (
            <div
              key={team.id}
              className="min-w-0 rounded-2xl border border-white/5 bg-[#0A1428] p-4 transition-all hover:border-[var(--vs-gold)]/30 sm:p-6 lg:rounded-3xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex min-w-0 gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--vs-gold)]/20 text-xl sm:h-14 sm:w-14 sm:text-2xl">
                    🏏
                  </div>
                  <div className="min-w-0">
                    <h3 className="break-words text-xl font-bold leading-snug text-white">
                      {team.name}
                    </h3>
                    <p className="mt-1 break-words text-base text-slate-400">Captain: {team.captain || "TBA"}</p>
                  </div>
                </div>
              </div>

              <div
                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mt-4 ${badgeColor}`}
              >
                Players: {playerCount}/11
              </div>

              <TeamEditor
                team={team}
                onRefresh={loadTeams}
                onDelete={() => handleDelete(team.id)}
              />
            </div>
          );
        })}

        {teams.length === 0 && <p className="text-slate-400">No teams yet</p>}
      </div>
    </div>
  );
}

