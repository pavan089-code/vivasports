"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getMatches } from "@/services/matchService";
import { getMatchAnalytics } from "@/utils/tournamentAnalyticsUtils";

export default function AnalyticsPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setMatches(await getMatches());
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    Promise.resolve().then(loadAnalytics);
  }, []);

  const analytics = useMemo(() => getMatchAnalytics(matches), [matches]);

  if (loading) return <LoadingSkeleton title="ANALYTICS" />;

  return (
    <main className="vs-page">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <div>
          <p className="vs-eyebrow">
            MATCH ANALYTICS
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl font-black">
            Advanced Cricket Intelligence
          </h1>
          <p className="mt-3 text-slate-400">
            Derived from completed match scorecards and ball-by-ball data.
          </p>
        </div>

        <ListPanel
          title="Highest Partnerships"
          rows={analytics.highestPartnerships}
          render={(item) => `${item.batterA} + ${item.batterB} - ${item.runs} (${item.balls} balls)`}
        />

        <ListPanel
          title="Best Bowling Figures"
          rows={analytics.bestBowlingFigures}
          render={(item) => `${item.playerName} - ${item.wickets}/${item.runsConceded}`}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <FeatureCard
            title="Fastest Fifty"
            item={analytics.fastestFifties}
            render={(item) => `${item.playerName} - ${item.runs} in ${item.balls} balls`}
          />
          <FeatureCard
            title="Fastest Hundred"
            item={analytics.fastestHundreds}
            render={(item) => `${item.playerName} - ${item.runs} in ${item.balls} balls`}
          />
        </div>

        <ListPanel
          title="Highest Chases"
          rows={analytics.highestChases}
          render={(match) => `${match.battingTeam} chased ${match.target} vs ${match.bowlingTeam}`}
        />

        <ListPanel
          title="Lowest Defended Totals"
          rows={analytics.lowestDefendedTotals}
          render={(match) => `${match.bowlingTeam} defended ${match.firstInningsScore} vs ${match.battingTeam}`}
        />
      </section>

      <Footer />
    </main>
  );
}

function ListPanel({ title, rows, render }) {
  return (
    <section className="vs-card p-5 md:p-6">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5 grid gap-3">
        {rows.map((row, index) => (
          <Link
            key={`${title}-${index}`}
            href={`/scorecard/${row.matchId || row.id}`}
            className="vs-card-muted block p-4 transition hover:border-[var(--vs-gold)]/35"
          >
            <p className="font-bold">{index + 1}. {render(row)}</p>
          </Link>
        ))}
        {!rows.length && <p className="text-slate-400">No data yet.</p>}
      </div>
    </section>
  );
}

function FeatureCard({ title, item, render }) {
  return (
    <section className="vs-card p-5 md:p-6">
      <h2 className="text-2xl font-black">{title}</h2>
      {item ? (
        <Link
          href={`/scorecard/${item.matchId}`}
          className="vs-card-muted mt-5 block p-4 transition hover:border-[var(--vs-gold)]/35"
        >
          <p className="font-bold">{render(item)}</p>
        </Link>
      ) : (
        <p className="mt-5 text-slate-400">No data yet.</p>
      )}
    </section>
  );
}
