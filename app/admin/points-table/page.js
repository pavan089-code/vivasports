"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getTeams } from "@/services/teamService";
import {
  rebuildStandingsFromMatches,
  saveManualTeamStanding,
} from "@/services/tournamentOperationsService";

const fields = [
  "played",
  "won",
  "lost",
  "tied",
  "points",
  "nrr",
  "runsFor",
  "oversFaced",
  "runsAgainst",
  "oversBowled",
];

export default function AdminPointsTablePage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");

  async function loadTeams() {
    setTeams(await getTeams());
    setLoading(false);
  }

  useEffect(() => {
    Promise.resolve().then(loadTeams);
  }, []);

  function updateLocalTeam(teamId, field, value) {
    setTeams((current) =>
      current.map((team) =>
        team.id === teamId
          ? {
              ...team,
              [field]: value,
            }
          : team
      )
    );
  }

  async function saveTeam(team) {
    setSaving(team.id);
    await saveManualTeamStanding(team.id, team);
    await loadTeams();
    setSaving("");
  }

  async function recalculate() {
    const confirmed = confirm(
      "Recalculate standings from completed, historical, abandoned, and walkover matches?"
    );

    if (!confirmed) return;

    setSaving("recalculate");
    await rebuildStandingsFromMatches();
    await loadTeams();
    setSaving("");
  }

  if (loading) return <LoadingSkeleton title="POINTS TABLE MANAGER" />;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050B18] px-4 py-8 text-white">
      <section className="mx-auto max-w-7xl space-y-6">
        <Link href="/admin" className="text-sm font-bold text-[var(--vs-gold)]">
          Back to Admin
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[var(--vs-gold)]">
              ADMIN OPERATIONS
            </p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Points Table Manager</h1>
            <p className="mt-2 text-slate-400">
              Manual overrides save directly to team documents.
            </p>
          </div>

          <button
            onClick={recalculate}
            className="min-h-11 w-full rounded-xl bg-yellow-300 px-5 py-3 font-black text-black sm:w-fit"
          >
            Recalculate Tournament
          </button>
        </div>

        {!teams.length && (
          <EmptyState
            title="No teams available"
            message="Create teams before editing standings."
            actionHref="/admin"
            actionLabel="Open Admin"
          />
        )}

        <div className="grid gap-5">
          {teams.map((team) => (
            <article
              key={team.id}
              className="rounded-2xl border border-white/10 bg-[#101D35] p-5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="break-words text-2xl font-black">{team.name}</h2>
                {team.manualOverride && (
                  <span className="w-fit rounded-full bg-yellow-500/15 px-3 py-1 text-sm font-bold text-yellow-300">
                    Manual Override
                  </span>
                )}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {fields.map((field) => (
                  <label key={field} className="block">
                    <span className="text-xs font-semibold uppercase text-slate-400">
                      {field}
                    </span>
                    <input
                      value={team[field] ?? ""}
                      onChange={(event) =>
                        updateLocalTeam(team.id, field, event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0A1428] px-3 py-3 text-white"
                    />
                  </label>
                ))}
              </div>

              <button
                onClick={() => saveTeam(team)}
                className="mt-5 min-h-11 w-full rounded-xl bg-[var(--vs-gold)] px-5 py-3 font-black text-black sm:w-fit"
              >
                {saving === team.id ? "Saving..." : "Save Standing"}
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

