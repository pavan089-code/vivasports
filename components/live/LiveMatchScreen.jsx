"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import EventAnimation from "@/components/broadcast/EventAnimation";
import useMatch from "@/hooks/useMatch";
import CurrentOver from "@/components/scorer/CurrentOver";
import BatterCard from "@/components/match/BatterCard";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ShareButton from "@/components/ui/ShareButton";
import { calculateOvers } from "@/utils/matchUtils";
import { calculatePartnerships } from "@/utils/cricketIntelligenceUtils";
import { getLatestEvent } from "@/utils/broadcastUtils";

function getResultText(result) {
  if (!result) return "";
  if (typeof result === "string") return result;
  return result.result || "";
}

function getRunRate(score, totalBalls) {
  if (!totalBalls) return "0.00";
  return ((score * 6) / totalBalls).toFixed(2);
}

function getBallsRemaining(match) {
  const limit = (match.oversLimit || 0) * 6;
  return Math.max(limit - (match.totalBalls || 0), 0);
}

function getNeedLine(match) {
  if (match.innings !== 2 || !match.target) return null;

  const needed = Math.max(match.target - (match.score || 0), 0);
  const ballsRemaining = getBallsRemaining(match);

  if (needed === 0) return `${match.battingTeam} have reached the target`;

  return `${match.battingTeam} need ${needed} runs from ${ballsRemaining} balls`;
}

export default function LiveMatchScreen({ matchId }) {
  const { match, loading } = useMatch(matchId);
  const [event, setEvent] = useState(null);
  const lastEventKey = useRef("");
  const commentaryRef = useRef(null);
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
        needLine: null,
        rrr: "0.00",
      };
    }

    const ballsRemaining = getBallsRemaining(match);
    const runsNeeded = match.target ? Math.max(match.target - (match.score || 0), 0) : 0;
    const currentInningsEvents = (match.commentary || match.balls || []).filter(
      (ball) => (ball.before?.innings || 1) === match.innings
    );

    return {
      ballsRemaining,
      crr: getRunRate(match.score || 0, match.totalBalls || 0),
      currentPartnership: calculatePartnerships(currentInningsEvents).slice(-1)[0],
      needLine: getNeedLine(match),
      rrr:
        match.innings === 2 && ballsRemaining > 0
          ? ((runsNeeded * 6) / ballsRemaining).toFixed(2)
          : "0.00",
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
    if (!commentaryRef.current) return;

    commentaryRef.current.scrollTo({
      top: commentaryRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [commentary.length]);

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
  const { ballsRemaining, crr, currentPartnership, needLine, rrr } = liveMetrics;

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
    <main className="vs-page relative p-4 sm:p-6 md:p-8">
      <EventAnimation event={event} />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="vs-eyebrow">LIVE MATCH</p>

            <h1 className="mt-2 break-words text-4xl font-black md:text-5xl">
              {match.teamA} vs {match.teamB}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ShareButton
              title={`${match.teamA} vs ${match.teamB}`}
              text="Viva Sports live match"
              path={`/live/${matchId}`}
            />
            <div className="w-fit rounded-xl bg-red-500 px-4 py-2 animate-pulse">
              LIVE
            </div>
          </div>
        </div>

        <div className="vs-card rounded-3xl p-6 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-slate-400">{match.battingTeam} batting</p>
              <div className="flex items-end gap-4 mt-2">
                <h2 className="text-6xl md:text-8xl font-black">
                  {String(match.score)}/{String(match.wickets)}
                </h2>

                <p className="text-2xl md:text-3xl text-slate-400 mb-2">
                  ({String(match.overs)})
                </p>
              </div>
            </div>

            {match.target && (
              <div className="text-left lg:text-right">
                <p className="text-slate-400">Target</p>
                <p className="text-4xl font-black text-[var(--vs-gold-soft)]">
                  {match.target}
                </p>
              </div>
            )}
          </div>

          {needLine && (
            <div className="mt-6 rounded-2xl border border-[var(--vs-gold)]/20 bg-[var(--vs-gold)]/10 p-4">
              <p className="text-xl font-bold text-[var(--vs-gold-soft)]">{needLine}</p>
            </div>
          )}

          {match.revisedTargetApplied && (
            <div className="mt-6 rounded-2xl border border-[var(--vs-gold)]/20 bg-[var(--vs-gold)]/10 p-4">
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--vs-gold-soft)]">
                Target Revised
              </p>
              <p className="mt-1 text-xl font-black text-[var(--vs-gold-soft)]">
                {match.revisedTarget} runs from {match.revisedOvers} overs
              </p>
              <p className="mt-1 text-slate-300">{match.revisionReason}</p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Stat label="CRR" value={crr} />
            <Stat label="RRR" value={match.innings === 2 ? rrr : "-"} />
            <Stat
              label="Balls Left"
              value={match.innings === 2 ? ballsRemaining : "-"}
            />
          </div>

          <div className="space-y-4 mt-8">
            <p className="text-slate-400 text-sm uppercase tracking-widest">
              Current Over
            </p>

            <CurrentOver balls={match.currentOver || []} />
          </div>

          {currentPartnership && (
            <div className="vs-card-muted mt-8 p-4">
              <p className="text-slate-400 text-sm">Current Partnership</p>
              <p className="mt-2 text-xl font-black">
                {currentPartnership.batterA} + {currentPartnership.batterB}:{" "}
                {currentPartnership.runs} ({currentPartnership.balls} balls)
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <BatterCard batter={match.striker} isStriker={true} />

          <BatterCard batter={match.nonStriker} isStriker={false} />

          <div className="vs-card p-6">
            <p className="text-slate-400">Current Bowler</p>
            <h3 className="text-2xl font-black mt-2">
              {match.currentBowler?.name || "Select Bowler"}
            </h3>
            <div className="flex gap-6 mt-6 text-slate-300">
              <p>O: {calculateOvers(match.currentBowler?.balls || 0)}</p>
              <p>R: {match.currentBowler?.runs || 0}</p>
              <p>W: {match.currentBowler?.wickets || 0}</p>
            </div>
          </div>
        </div>

        <div className="vs-card rounded-3xl p-6">
          <h2 className="text-2xl font-black mb-4">Ball-by-ball Commentary</h2>
          <div
            ref={commentaryRef}
            className="max-h-80 space-y-3 overflow-y-auto pr-2 scroll-smooth"
          >
            {commentary.map((ball, index) => (
              <p key={`${ball.createdAt}-${index}`} className="text-slate-300">
                {ball.commentary}
              </p>
            ))}
            {!commentary.length && (
              <p className="text-slate-500">No deliveries recorded yet.</p>
            )}
          </div>
        </div>

        <MatchNotes notes={match.matchNotes} />
      </div>
    </main>
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
            <span className="font-bold text-[var(--vs-gold-soft)]">{note.role || "official"}:</span>{" "}
            {note.text}
          </p>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="vs-card-muted p-4">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}
