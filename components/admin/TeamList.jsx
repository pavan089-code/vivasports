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
    <div className="bg-[#101D35] rounded-3xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Existing Teams</h2>

      <div
        className="
    grid
  space-y-6
    gap-6
    items-start
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
              className="bg-[#0A1428] rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center text-2xl">
                    🏏
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {team.name}
                    </h3>
                    <p className="text-slate-400">Captain: {team.captain}</p>
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
