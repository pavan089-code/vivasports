"use client";

import { useEffect, useState } from "react";

import PublicPage, { PageHeader } from "@/components/ui/PublicPage";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getSeasonArchives } from "@/services/seasonArchiveService";

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeasons() {
      const data = await getSeasonArchives();
      setSeasons(
        [...data].sort(
          (a, b) => (b.seasonYear || b.year || 0) - (a.seasonYear || a.year || 0)
        )
      );
      setLoading(false);
    }

    Promise.resolve().then(loadSeasons);
  }, []);

  if (loading) return <LoadingSkeleton title="SEASON ARCHIVES" />;

  return (
    <PublicPage>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <PageHeader
          eyebrow="Prestige And History"
          title="Season Archives"
          subtitle="Historic Viva Sports seasons, champions and finalists."
        />

        <div className="vs-table-wrap">
          <table className="vs-table min-w-[680px]">
            <thead>
              <tr>
                <th>Season Name</th>
                <th>Season Year</th>
                <th>Champion</th>
                <th>Runner Up</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((season) => (
                <tr key={season.id || `${season.seasonName}-${season.seasonYear}`}>
                  <td className="font-bold">{season.seasonName || season.name || "-"}</td>
                  <td>{season.seasonYear || season.year || "-"}</td>
                  <td className="text-[var(--vs-gold-soft)]">
                    {season.champion || "-"}
                  </td>
                  <td>{season.runnerUp || season.runner_up || "-"}</td>
                </tr>
              ))}
              {!seasons.length && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-slate-400">
                    No archived seasons have been published yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PublicPage>
  );
}
