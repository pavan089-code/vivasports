"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PublicPage, { PageHeader } from "@/components/ui/PublicPage";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getMatches } from "@/services/matchService";
import { getMatchReports } from "@/utils/prestigeRankingsUtils";

export default function MatchReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      setReports(getMatchReports(await getMatches()));
      setLoading(false);
    }

    Promise.resolve().then(loadReports);
  }, []);

  if (loading) return <LoadingSkeleton title="AI MATCH REPORTS" />;

  return (
    <PublicPage>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <PageHeader
          eyebrow="Prestige And History"
          title="AI Match Reports"
          subtitle="Automated read-only narratives for completed Viva Sports matches."
        />

        <div className="grid gap-5">
          {reports.map((report) => (
            <article key={report.id} className="vs-card p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="vs-eyebrow">{report.date}</p>
                  <h2 className="mt-2 text-2xl font-black">{report.title}</h2>
                </div>
                <Link href={`/scorecard/${report.id}`} className="vs-link">
                  Scorecard
                </Link>
              </div>
              <p className="mt-5 text-slate-300">{report.summary}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <ReportStat
                  label="Top Batter"
                  value={
                    report.topBatter
                      ? `${report.topBatter.playerName} ${report.topBatter.runs}`
                      : "-"
                  }
                />
                <ReportStat
                  label="Top Bowler"
                  value={
                    report.topBowler
                      ? `${report.topBowler.playerName} ${report.topBowler.wickets}/${report.topBowler.runsConceded}`
                      : "-"
                  }
                />
                <ReportStat label="Turning Point" value={report.turningPoint} />
              </div>
            </article>
          ))}
          {!reports.length && (
            <div className="vs-card p-8 text-center text-slate-400">
              Match reports will appear after matches are completed.
            </div>
          )}
        </div>
      </section>
    </PublicPage>
  );
}

function ReportStat({ label, value }) {
  return (
    <div className="vs-card-muted p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 font-bold text-white">{value}</p>
    </div>
  );
}
