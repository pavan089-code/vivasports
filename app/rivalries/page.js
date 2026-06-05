"use client";

import { useEffect, useState } from "react";

import PublicPage, { PageHeader } from "@/components/ui/PublicPage";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getMatches } from "@/services/matchService";
import { getTeamRivalries } from "@/utils/prestigeRankingsUtils";

export default function RivalriesPage() {
  const [rivalries, setRivalries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRivalries() {
      setRivalries(getTeamRivalries(await getMatches()));
      setLoading(false);
    }

    Promise.resolve().then(loadRivalries);
  }, []);

  if (loading) return <LoadingSkeleton title="TEAM RIVALRIES" />;

  return (
    <PublicPage>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <PageHeader
          eyebrow="Prestige And History"
          title="Team Rivalries"
          subtitle="Head-to-head records generated from completed match scorecards."
        />

        <div className="grid gap-5">
          {rivalries.map((rivalry) => (
            <article key={rivalry.key} className="vs-card p-6">
              <h2 className="text-2xl font-black">
                {rivalry.teams[0]} vs {rivalry.teams[1]}
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Metric label="Matches Played" value={rivalry.matchesPlayed} />
                <Metric
                  label={`${rivalry.teams[0]} Wins`}
                  value={rivalry.wins[rivalry.teams[0]] || 0}
                />
                <Metric
                  label={`${rivalry.teams[1]} Wins`}
                  value={rivalry.wins[rivalry.teams[1]] || 0}
                />
                <Metric
                  label="Highest Score"
                  value={`${rivalry.highestScore.teamName} ${rivalry.highestScore.score}`}
                />
                <Metric
                  label="Largest Victory"
                  value={`${rivalry.largestVictory.winner} ${rivalry.largestVictory.margin}`}
                />
              </div>
            </article>
          ))}
          {!rivalries.length && (
            <div className="vs-card p-8 text-center text-slate-400">
              Rivalries will appear after completed matches.
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
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}
