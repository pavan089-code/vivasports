"use client";

import { useMemo } from "react";
import Link from "next/link";

import useMatch from "@/hooks/useMatch";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ShareButton from "@/components/ui/ShareButton";
import { buildScorecard } from "@/utils/scorecardUtils";

function getResultText(result) {
  if (!result) return "Result pending";
  if (typeof result === "string") return result;
  return result.result || "Result pending";
}

export default function ScorecardScreen({ matchId }) {
  const { match, loading } = useMatch(matchId);
  const scorecard = useMemo(() => (match ? buildScorecard(match) : null), [match]);

  if (loading) {
    return <LoadingSkeleton title="SCORECARD" />;
  }

  if (!match) {
    return (
      <main className="vs-page px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Match not found"
            message="This scorecard is unavailable or the match link is no longer valid."
            actionHref="/results"
            actionLabel="Back to Results"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="vs-page px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <Link href="/results" className="vs-link text-sm">
            Back to Results
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
            <p className="vs-eyebrow">
              FULL MATCH SCORECARD
            </p>
            <h1 className="mt-2 break-words text-4xl font-black md:text-5xl">
              {match.teamA} vs {match.teamB}
            </h1>
            <p className="text-slate-400 mt-3">
              {[match.date, match.time, match.ground].filter(Boolean).join(" | ")}
            </p>
            </div>
            <ShareButton
              title={`${match.teamA} vs ${match.teamB} Scorecard`}
              text="Viva Sports full match scorecard"
              path={`/scorecard/${matchId}`}
            />
          </div>
        </header>

        <SummaryCard
          match={match}
          topBatter={scorecard.topBatter}
          topBowler={scorecard.topBowler}
        />

        {scorecard.innings.map((innings) => (
          <InningsCard key={`${innings.inningsNumber}-${innings.battingTeam}`} innings={innings} />
        ))}

        {!scorecard.innings.length && (
          <div className="vs-card p-8 text-center">
            <p className="text-slate-400">
              No ball-by-ball data is available for this match.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryCard({ match, topBatter, topBowler }) {
  return (
    <section className="vs-card p-5 md:p-6">
      <h2 className="text-2xl font-black">Match Summary</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <SummaryItem label="Winner" value={match.winner || "Tie"} />
        <SummaryItem label="Result" value={getResultText(match.result)} />
        <SummaryItem
          label="Player Of Match"
          value={match.playerOfMatch?.playerName || "-"}
        />
        <SummaryItem
          label="Top Batter"
          value={topBatter ? `${topBatter.playerName} (${topBatter.runs})` : "-"}
        />
        <SummaryItem
          label="Top Bowler"
          value={
            topBowler
              ? `${topBowler.playerName} (${topBowler.wickets}/${topBowler.runsConceded})`
              : "-"
          }
        />
      </div>
    </section>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="vs-card-muted p-4">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white font-bold mt-2">{value}</p>
    </div>
  );
}

function InningsCard({ innings }) {
  return (
    <section className="vs-card space-y-6 p-5 md:p-6">
      <div>
        <p className="text-sm font-semibold text-[var(--vs-gold)]">
          Innings {innings.inningsNumber}
        </p>
        <h2 className="text-3xl font-black mt-1">
          {innings.battingTeam} {innings.score}/{innings.wickets}
        </h2>
      </div>

      <ScoreTable
        title="Batting"
        headers={["Batter", "Runs", "Balls", "4s", "6s", "SR"]}
        rows={innings.batting.map((batter) => [
          batter.playerName,
          batter.runs,
          batter.balls,
          batter.fours,
          batter.sixes,
          batter.strikeRate.toFixed(2),
        ])}
      />

      <ScoreTable
        title="Bowling"
        headers={["Bowler", "Overs", "M", "Runs", "Wkts", "Econ"]}
        rows={innings.bowling.map((bowler) => [
          bowler.playerName,
          bowler.overs,
          bowler.maidens,
          bowler.runsConceded,
          bowler.wickets,
          bowler.economy.toFixed(2),
        ])}
      />

      <ExtrasBreakdown extras={innings.extras} />

      <BestPartnership partnership={innings.bestPartnership} />

      <InningsAnalytics analytics={innings.analytics} />

      <FallOfWickets wickets={innings.fallOfWickets} />
    </section>
  );
}

function ScoreTable({ title, headers, rows }) {
  return (
    <div>
      <h3 className="text-xl font-black mb-3">{title}</h3>

      <div className="vs-table-wrap">
        <table className="vs-table min-w-[560px] text-sm sm:text-base">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                    className={index === 0 ? "text-left" : "text-center"}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={`${title}-${row[0]}`}>
                {row.map((cell, index) => (
                  <td
                    key={`${row[0]}-${index}`}
                    className={`text-white ${
                      index === 0 ? "text-left font-semibold" : "text-center"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}

            {!rows.length && (
              <tr>
                <td colSpan={headers.length} className="py-8 text-center text-slate-400">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExtrasBreakdown({ extras }) {
  return (
    <div>
      <h3 className="text-xl font-black mb-3">Extras</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryItem label="Wides" value={extras.wides} />
        <SummaryItem label="No Balls" value={extras.noBalls} />
        <SummaryItem label="Byes" value={extras.byes} />
        <SummaryItem label="Leg Byes" value={extras.legByes} />
      </div>
    </div>
  );
}

function FallOfWickets({ wickets }) {
  return (
    <div>
      <h3 className="text-xl font-black mb-3">Fall Of Wickets</h3>
      <div className="vs-card-muted p-4">
        {wickets.length ? (
          <div className="flex flex-wrap gap-3">
            {wickets.map((wicket) => (
              <span
                key={`${wicket.wicket}-${wicket.batter}-${wicket.over}`}
                className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
              >
                {wicket.score}/{wicket.wicket} - {wicket.batter} ({wicket.over})
                {wicket.dismissal ? ` ${wicket.dismissal}` : ""}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">No wickets fell.</p>
        )}
      </div>
    </div>
  );
}

function BestPartnership({ partnership }) {
  return (
    <div>
      <h3 className="text-xl font-black mb-3">Best Partnership</h3>
      <div className="vs-card-muted p-4">
        {partnership ? (
          <p className="text-white font-bold">
            {partnership.batterA} + {partnership.batterB}: {partnership.runs} runs (
            {partnership.balls} balls)
          </p>
        ) : (
          <p className="text-slate-400">No partnership data available.</p>
        )}
      </div>
    </div>
  );
}

function InningsAnalytics({ analytics }) {
  const rows = [
    ["Powerplay", analytics?.powerplay],
    ["Middle Overs", analytics?.middle],
    ["Death Overs", analytics?.death],
  ];

  return (
    <div>
      <h3 className="text-xl font-black mb-3">Innings Analytics</h3>
      <div className="grid gap-3 md:grid-cols-3">
        {rows.map(([label, phase]) => (
          <div key={label} className="vs-card-muted p-4">
            <p className="text-slate-400 text-sm">{label}</p>
            <p className="mt-2 text-2xl font-black">
              {phase?.runs || 0}/{phase?.wickets || 0}
            </p>
            <p className="mt-1 text-[var(--vs-gold-soft)]">RR {phase?.runRate || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
