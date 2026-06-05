"use client";

import { useEffect, useState } from "react";

import PublicPage, { PageHeader } from "@/components/ui/PublicPage";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getMatches } from "@/services/matchService";
import { getPlayerStats } from "@/services/playerStatsService";
import { getSeasonArchives } from "@/services/seasonArchiveService";
import { getAwardsHistory } from "@/utils/prestigeRankingsUtils";

export default function AwardsHistoryPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      const [seasons, matches, players] = await Promise.all([
        getSeasonArchives(),
        getMatches(),
        getPlayerStats(),
      ]);
      setRows(getAwardsHistory(seasons, matches, players));
      setLoading(false);
    }

    Promise.resolve().then(loadHistory);
  }, []);

  if (loading) return <LoadingSkeleton title="AWARDS HISTORY" />;

  return (
    <PublicPage>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <PageHeader
          eyebrow="Advanced Rankings"
          title="Awards History"
          subtitle="Player Of Match and Tournament MVP history across archived and current seasons."
        />

        <div className="vs-table-wrap">
          <table className="vs-table min-w-[760px]">
            <thead>
              <tr>
                <th>Season</th>
                <th>Year</th>
                <th>Award</th>
                <th>Player</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.seasonName}-${row.award}-${row.playerName}-${index}`}>
                  <td className="font-bold">{row.seasonName}</td>
                  <td>{row.seasonYear}</td>
                  <td className="text-[var(--vs-gold-soft)]">{row.award}</td>
                  <td>{row.playerName}</td>
                  <td>{row.teamName}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-400">
                    Awards history will appear after seasons or awards are available.
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
