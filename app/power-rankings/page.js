"use client";

import { useEffect, useState } from "react";

import PublicPage, { PageHeader } from "@/components/ui/PublicPage";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getMatches } from "@/services/matchService";
import { getTeams } from "@/services/teamService";
import { getTeamPowerRankings } from "@/utils/prestigeRankingsUtils";

export default function PowerRankingsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      const [teamData, matchData] = await Promise.all([
        getTeams(),
        getMatches(),
      ]);
      setTeams(getTeamPowerRankings(teamData, matchData));
      setLoading(false);
    }

    Promise.resolve().then(loadRankings);
  }, []);

  if (loading) return <LoadingSkeleton title="TEAM POWER RANKINGS" />;

  return (
    <PublicPage>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <PageHeader
          eyebrow="Advanced Rankings"
          title="Team Power Rankings"
          subtitle="Form table based on wins, net run rate and recent completed-match form."
        />

        <div className="grid gap-4">
          {teams.map((team, index) => (
            <article key={team.id || team.name} className="vs-card p-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="vs-eyebrow">Rank {index + 1}</p>
                  <h2 className="mt-2 text-2xl font-black">{team.name}</h2>
                </div>
                <p className="text-4xl font-black text-[var(--vs-gold-soft)]">
                  {team.powerScore}
                </p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Metric label="Wins" value={team.won || 0} />
                <Metric label="NRR" value={(team.nrr || 0).toFixed(3)} />
                <Metric label="Recent Form" value={team.recentForm} />
              </div>
            </article>
          ))}
          {!teams.length && (
            <div className="vs-card p-8 text-center text-slate-400">
              Power rankings will appear after teams are added.
            </div>
          )}
        </div>
      </section>
    </PublicPage>
  );
}

function Metric({ label, value }) {
  return (
    <div className="vs-card-muted p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
