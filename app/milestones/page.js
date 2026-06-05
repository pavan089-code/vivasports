"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PublicPage, { PageHeader } from "@/components/ui/PublicPage";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getPlayerStats } from "@/services/playerStatsService";
import { getPlayerMilestones } from "@/utils/prestigeRankingsUtils";

export default function MilestonesPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMilestones() {
      setGroups(getPlayerMilestones(await getPlayerStats()));
      setLoading(false);
    }

    Promise.resolve().then(loadMilestones);
  }, []);

  if (loading) return <LoadingSkeleton title="PLAYER MILESTONES" />;

  return (
    <PublicPage>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <PageHeader
          eyebrow="Prestige And History"
          title="Player Milestones"
          subtitle="Career landmark clubs for runs and wickets."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {groups.map((group) => (
            <article key={group.key} className="vs-card p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black">{group.label}</h2>
                <span className="rounded-full bg-[var(--vs-gold)]/15 px-3 py-1 text-sm font-bold text-[var(--vs-gold-soft)]">
                  {group.players.length}
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {group.players.slice(0, 10).map((player) => (
                  <Link
                    key={`${group.key}-${player.id}`}
                    href={`/player/${player.id}`}
                    className="vs-card-muted flex items-center justify-between p-4 transition hover:border-[var(--vs-gold)]/35"
                  >
                    <span>
                      <span className="block font-bold">{player.playerName}</span>
                      <span className="text-sm text-slate-400">{player.teamName}</span>
                    </span>
                    <span className="font-black text-[var(--vs-gold-soft)]">
                      {player[group.field] || 0}
                    </span>
                  </Link>
                ))}
                {!group.players.length && (
                  <p className="text-slate-400">No players have reached this mark yet.</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicPage>
  );
}
