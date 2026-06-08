"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

import EventAnimation from "@/components/broadcast/EventAnimation";
import useMatch from "@/hooks/useMatch";
import CurrentOver from "@/components/scorer/CurrentOver";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ShareButton from "@/components/ui/ShareButton";
import LiveStream from "@/components/live/LiveStream";
import SponsorBanner from "@/components/sponsors/SponsorBanner";
import { calculatePartnerships } from "@/utils/cricketIntelligenceUtils";
import {
  getBallsRemaining,
  getLatestEvent,
  getNeedLine,
  getRequiredRate,
  getRunRate,
} from "@/utils/broadcastUtils";
import { getMatchYouTubeUrl } from "@/utils/youtubeUtils";

const LiveLowerContent = dynamic(() => import("@/components/live/LiveLowerContent"), {
  loading: () => (
    <div className="vs-card rounded-2xl p-5 text-sm font-semibold text-[var(--text-secondary)]">
      Loading match details...
    </div>
  ),
});

function getResultText(result) {
  if (!result) return "";
  if (typeof result === "string") return result;
  return result.result || "";
}

export default function LiveMatchScreen({ matchId, sponsors = [] }) {
  const { match, loading } = useMatch(matchId);
  const [event, setEvent] = useState(null);
  const [showStickyScore, setShowStickyScore] = useState(false);
  const lastEventKey = useRef("");
  const scoreHeroRef = useRef(null);
  const commentary = useMemo(
    () =>
      [...(match?.commentary || match?.balls || [])]
        .filter((ball) => ball.commentary)
        .slice(-40),
    [match?.balls, match?.commentary]
  );

  const liveMetrics = useMemo(() => {
    if (!match) {
      return {
        ballsRemaining: 0,
        crr: "0.00",
        currentPartnership: null,
        lastWicket: null,
        needLine: null,
        runsNeeded: 0,
        rrr: "0.00",
      };
    }

    const ballsRemaining = getBallsRemaining(match);
    const runsNeeded = match.target ? Math.max(match.target - (match.score || 0), 0) : 0;
    const currentInningsEvents = (match.commentary || match.balls || []).filter(
      (ball) => (ball.before?.innings || 1) === match.innings
    );
    const lastWicket = [...currentInningsEvents]
      .reverse()
      .find((ball) => ball.type === "wicket");

    return {
      ballsRemaining,
      crr: getRunRate(match.score || 0, match.totalBalls || 0),
      currentPartnership: calculatePartnerships(currentInningsEvents).slice(-1)[0],
      lastWicket,
      needLine: getNeedLine(match),
      runsNeeded,
      rrr: match.innings === 2 ? getRequiredRate(match) : "0.00",
    };
  }, [match]);

  useEffect(() => {
    if (!match) return;

    if (["innings_break", "paused", "completed"].includes(match.status)) {
      const clearTimeoutId = setTimeout(() => setEvent(null), 0);
      return () => clearTimeout(clearTimeoutId);
    }

    const latest = getLatestEvent(match);
    if (!latest) return;
    if (latest.key && latest.key === lastEventKey.current) return;

    lastEventKey.current = latest.key || `${latest.type}-${latest.title}-${latest.subtitle}`;

    const showTimeout = setTimeout(() => {
      setEvent(latest);
    }, 0);
    const hideTimeout = setTimeout(() => {
      setEvent(null);
    }, 4200);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [match]);

  useEffect(() => {
    function handleScroll() {
      if (!scoreHeroRef.current) return;

      const bottom = scoreHeroRef.current.getBoundingClientRect().bottom;
      setShowStickyScore(bottom < 0);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return <LoadingSkeleton title="LIVE MATCH" />;
  }

  if (!match) {
    return (
      <main className="vs-page px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Match not found"
            message="This live match is unavailable or the match link is no longer valid."
            actionHref="/matches"
            actionLabel="Back to Matches"
          />
        </div>
      </main>
    );
  }

  const resultText = getResultText(match.result);
  const {
    ballsRemaining,
    crr,
    currentPartnership,
    lastWicket,
    needLine,
    runsNeeded,
    rrr,
  } = liveMetrics;
  const streamAvailable = Boolean(getMatchYouTubeUrl(match));
  const scrollToScore = () => {
    scoreHeroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const scrollToStream = () => {
    document
      .getElementById("live-stream-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (match.status === "innings_break") {
    return (
      <main className="vs-page relative flex items-center justify-center p-8">
        <EventAnimation event={event} />
        <div className="text-center">
          <h1 className="text-6xl font-black">INNINGS BREAK</h1>

          <p className="mt-8 text-3xl">Target: {match.target}</p>

          <p className="text-slate-400 mt-4">
            {match.battingTeam} need {match.target} runs to win
          </p>
        </div>
      </main>
    );
  }

  if (match.status === "paused") {
    return (
      <main className="vs-page relative flex items-center justify-center p-8">
        <EventAnimation event={event} />
        <div className="max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-widest text-orange-300">
            MATCH PAUSED
          </p>
          <h1 className="mt-3 text-5xl font-black">
            {match.pauseReason || "Delay"}
          </h1>
          <p className="mt-5 text-2xl">
            {match.teamA} vs {match.teamB}
          </p>
          <p className="mt-4 text-slate-400">
            Score remains {match.score}/{match.wickets} ({match.overs})
          </p>
          <MatchNotes notes={match.matchNotes} />
        </div>
      </main>
    );
  }

  if (match.status === "completed") {
    return (
      <main className="vs-page relative flex items-center justify-center p-8">
        <EventAnimation event={event} />
        <div className="text-center">
          <h1 className="text-6xl font-black">MATCH COMPLETED</h1>

          <p className="mt-6 text-3xl">{resultText}</p>

          <p className="mt-4 text-slate-400">
            Winner: {match.winner || "No winner"}
          </p>

          <p className="mt-4 text-slate-400">
            Final Score: {match.score}/{match.wickets}
          </p>

          {match.playerOfMatch && (
            <p className="mt-6 text-2xl font-bold text-[var(--vs-gold-soft)]">
              Player of the Match: {match.playerOfMatch.playerName}
            </p>
          )}

          <div className="mt-8 flex justify-center">
            <ShareButton
              title={`${match.teamA} vs ${match.teamB}`}
              text={resultText || "Viva Sports match"}
              path={`/live/${matchId}`}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="vs-page relative p-3 pb-20 sm:p-4 md:p-6">
      <EventAnimation event={event} />
      <StickyMobileScorebar
        show={showStickyScore}
        battingTeam={match.battingTeam}
        score={`${match.score}/${match.wickets}`}
        overs={match.overs}
        needLine={needLine}
        onClick={scrollToScore}
      />
      <div className="mx-auto max-w-7xl space-y-4 md:space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="vs-eyebrow">LIVE MATCH</p>

            <h1 className="mt-1 break-words text-2xl font-black md:text-4xl">
              {match.teamA} vs {match.teamB}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ShareButton
              title={`${match.teamA} vs ${match.teamB}`}
              text="Viva Sports live match"
              path={`/live/${matchId}`}
            />
            {streamAvailable && (
              <button
                type="button"
                onClick={scrollToStream}
                className="w-fit rounded-xl border border-[var(--vs-gold)]/35 px-4 py-2 font-black text-[var(--vs-gold-soft)]"
              >
                Watch Stream
              </button>
            )}
            <div className="w-fit rounded-xl bg-[var(--emerald)] px-4 py-2 font-black text-white shadow-lg shadow-black/20 animate-pulse">
              LIVE
            </div>
          </div>
        </div>

        <section ref={scoreHeroRef} className="vs-card rounded-2xl p-4 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--vs-gold)]">
                  {match.battingTeam || "Batting Team"} batting
                </p>
                <div className="mt-2">
                  <h2 className="text-6xl font-black leading-none text-white sm:text-7xl md:text-8xl xl:text-9xl">
                    {String(match.score)}/{String(match.wickets)}
                  </h2>
                  <p className="mt-1 text-xl font-black text-[var(--text-secondary)] md:text-3xl">
                    ({String(match.overs)} Ov)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center lg:min-w-72">
                <StatCompact label="CRR" value={crr} />
                <StatCompact label="RRR" value={match.innings === 2 ? rrr : "-"} />
                <StatCompact label="Target" value={match.target || "-"} />
              </div>
          </div>

          <SituationStrip
            innings={match.innings}
            crr={crr}
            rrr={rrr}
            target={match.target}
            runsNeeded={runsNeeded}
            ballsRemaining={ballsRemaining}
            partnership={currentPartnership}
            lastWicket={lastWicket}
          />

          {needLine && (
            <div className="mt-3 rounded-xl border border-[var(--vs-gold)]/20 bg-[var(--vs-gold)]/10 p-3">
              <p className="text-lg font-black text-[var(--vs-gold-soft)]">{needLine}</p>
            </div>
          )}

          {match.revisedTargetApplied && (
            <div className="mt-3 rounded-xl border border-[var(--vs-gold)]/20 bg-[var(--vs-gold)]/10 p-3">
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--vs-gold-soft)]">
                Target Revised
              </p>
              <p className="mt-1 text-lg font-black text-[var(--vs-gold-soft)]">
                {match.revisedTarget} runs from {match.revisedOvers} overs
              </p>
              <p className="mt-1 text-slate-300">{match.revisionReason}</p>
            </div>
          )}

          <div className="mt-3 space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--text-secondary)]">
              Current Over
            </p>
            <CurrentOver balls={match.currentOver || []} />
          </div>
        </section>

        <SponsorBanner sponsors={sponsors} />

        {streamAvailable ? (
          <LiveStream match={match} />
        ) : (
          <MatchCenterPanel
            target={match.target}
            runsNeeded={runsNeeded}
            ballsRemaining={ballsRemaining}
            lastWicket={lastWicket}
            partnership={currentPartnership}
          />
        )}

        <LiveLowerContent match={match} commentary={commentary} />
      </div>
    </main>
  );
}

function StatCompact({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
      <p className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function SituationStrip({
  innings,
  crr,
  rrr,
  target,
  runsNeeded,
  ballsRemaining,
  partnership,
  lastWicket,
}) {
  const firstInningsItems = [
    ["CRR", crr],
    ["Partnership", formatPartnership(partnership)],
    ["Last Wicket", formatLastWicket(lastWicket)],
  ];
  const chaseItems = [
    ["Target", target || "-"],
    ["Need", target ? runsNeeded : "-"],
    ["Balls", target ? ballsRemaining : "-"],
    ["RRR", target ? rrr : "-"],
  ];
  const items = innings === 2 ? chaseItems : firstInningsItems;

  return (
    <div className="mt-3 grid gap-2 rounded-xl border border-[var(--border)] bg-[var(--navy-light)]/80 p-3 sm:mt-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wider text-[var(--vs-gold)]">
            {label}
          </p>
          <p className="mt-1 truncate text-sm font-black text-white sm:text-base">{value}</p>
        </div>
      ))}
    </div>
  );
}

function MatchCenterPanel({
  target,
  runsNeeded,
  ballsRemaining,
  lastWicket,
  partnership,
}) {
  return (
    <section className="vs-card flex min-h-full flex-col justify-center rounded-2xl p-5">
      <div className="aspect-video rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex h-full flex-col justify-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--vs-gold)]">
            Live stream not available
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">Match Center</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoTile label="Target" value={target || "-"} />
            <InfoTile label="Need Runs" value={target ? runsNeeded : "-"} />
            <InfoTile label="Balls Remaining" value={target ? ballsRemaining : "-"} />
            <InfoTile label="Last Wicket" value={formatLastWicket(lastWicket)} />
          </div>
          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
            <p className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
              Current Partnership
            </p>
            <p className="mt-1 text-lg font-black text-white">
              {formatPartnership(partnership)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
      <p className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1 truncate text-xl font-black text-white">{value}</p>
    </div>
  );
}

function MatchNotes({ notes = [] }) {
  if (!notes.length) return null;

  return (
    <div className="vs-card mt-6 rounded-3xl p-6 text-left">
      <h2 className="text-2xl font-black">Match Notes</h2>
      <div className="mt-4 space-y-3">
        {notes.slice(-5).reverse().map((note) => (
          <p key={note.createdAt} className="text-slate-300">
            <span className="font-bold text-[var(--vs-gold-soft)]">
              {note.role || "official"}:
            </span>{" "}
            {note.text}
          </p>
        ))}
      </div>
    </div>
  );
}

function StickyMobileScorebar({ show, battingTeam, score, overs, needLine, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-[var(--vs-gold)]/25 bg-[#06152F]/95 px-4 py-3 text-left shadow-2xl shadow-black/40 backdrop-blur md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
      } transition`}
      aria-hidden={!show}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--vs-gold)]">
            Live
          </p>
          <p className="truncate text-sm font-black text-white">
            {battingTeam || "Batting Team"}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-black text-white">
            {score} <span className="text-sm text-[var(--text-secondary)]">({overs})</span>
          </p>
          {needLine && (
            <p className="max-w-40 truncate text-xs font-bold text-[var(--vs-gold-soft)]">
              {needLine}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function formatPartnership(partnership) {
  if (!partnership) return "-";

  return `${partnership.runs} (${partnership.balls})`;
}

function formatLastWicket(ball) {
  if (!ball) return "-";

  const batter = ball.striker || ball.before?.striker?.name || "Wicket";
  const score = ball.before
    ? `${ball.before.score || 0}/${(ball.before.wickets || 0) + 1}`
    : "";

  return [batter, score].filter(Boolean).join(" ");
}
