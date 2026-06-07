"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import EventAnimation from "@/components/broadcast/EventAnimation";
import useMatch from "@/hooks/useMatch";
import { subscribeToBroadcastSettings } from "@/services/broadcastService";
import {
  getLatestEvent,
  getNeedLine,
  getRequiredRate,
  getRunRate,
} from "@/utils/broadcastUtils";

const ballStyles = {
  ".": "border-[#5A657A] bg-[#5A657A] text-white",
  "0": "border-[#5A657A] bg-[#5A657A] text-white",
  "1": "border-[#4A6FD6] bg-[#4A6FD6] text-white",
  "2": "border-[#4A6FD6] bg-[#4A6FD6] text-white",
  "3": "border-[#4A6FD6] bg-[#4A6FD6] text-white",
  "4": "border-[#3AAED8] bg-[#3AAED8] text-white",
  "6": "border-[#1F6F50] bg-[#1F6F50] text-white",
  W: "border-[#C0392B] bg-[#C0392B] text-white",
  WD: "border-[#F4B942] bg-[#F4B942] text-[#06152F]",
  NB: "border-[#F39C12] bg-[#F39C12] text-[#06152F]",
  LB: "border-purple-400 bg-purple-500 text-white",
  B: "border-purple-400 bg-purple-500 text-white",
};

const defaultSettings = {
  overlayVisible: true,
  graphicsVisible: true,
};

const demoMatch = {
  id: "demo",
  tournamentName: "Viva Sports T20 Cup",
  matchNumber: "12",
  ground: "Sarojini Ground",
  status: "live",
  teamA: "Thunder Strikers",
  teamB: "Royal Challengers",
  battingTeam: "Thunder Strikers",
  bowlingTeam: "Royal Challengers",
  score: 124,
  wickets: 4,
  overs: "14.2",
  totalBalls: 86,
  innings: 2,
  target: 157,
  oversLimit: 20,
  striker: { name: "Vijay Chandra", runs: 42, balls: 31 },
  nonStriker: { name: "Ajay Chavan", runs: 17, balls: 14 },
  currentBowler: { name: "Venu Chandran", wickets: 2, runs: 18, balls: 20 },
  currentOver: ["1", ".", "4", "W", "WD+4", "NB+1"],
  commentary: [
    { label: "1", isLegalDelivery: true, createdAt: 1 },
    { label: "0", isLegalDelivery: true, createdAt: 2 },
    { label: "4", isLegalDelivery: true, batterRuns: 4, striker: "Vijay Chandra", bowler: "Venu Chandran", createdAt: 3 },
    { label: "W", type: "wicket", isLegalDelivery: true, striker: "Vijay Chandra", bowler: "Venu Chandran", createdAt: 4 },
    { label: "WD+4", isLegalDelivery: false, createdAt: 5 },
    { label: "NB+1", isLegalDelivery: false, createdAt: 6 },
  ],
};

export default function BroadcastLiveOverlay({ matchId, demo = false }) {
  const { match: liveMatch, loading } = useOverlayMatch(matchId, demo);
  const [settings, setSettings] = useState(() => (demo ? defaultSettings : null));
  const [event, setEvent] = useState(null);
  const lastEventKey = useRef("");
  const match = demo ? demoMatch : liveMatch;

  useEffect(() => {
    document.documentElement.classList.add("broadcast-transparent-body");
    document.body.classList.add("broadcast-transparent-body");

    return () => {
      document.documentElement.classList.remove("broadcast-transparent-body");
      document.body.classList.remove("broadcast-transparent-body");
    };
  }, []);

  useEffect(() => {
    if (demo) return undefined;

    return subscribeToBroadcastSettings(setSettings);
  }, [demo]);

  useEffect(() => {
    if (!match || !settings?.graphicsVisible) return;

    const latest = settings?.manualGraphic
      ? {
          ...settings.manualGraphic,
          key: `manual-${settings.updatedAt || settings.manualGraphic.title}`,
        }
      : getLatestEvent(match);

    if (!latest) return;
    if (latest.key && latest.key === lastEventKey.current) return;

    lastEventKey.current = latest.key || `${latest.type}-${latest.title}-${latest.subtitle}`;

    const eventDuration = latest.type === "WICKET" ? 3000 : 2000;
    const showTimeout = setTimeout(() => setEvent(latest), 0);
    const hideTimeout = setTimeout(() => setEvent(null), eventDuration);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [match, settings?.graphicsVisible, settings?.manualGraphic, settings?.updatedAt]);

  if (loading || !match || !settings?.overlayVisible) return null;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-transparent font-sans text-white">
      {settings.graphicsVisible && event && (
        <EventAnimation event={event} variant="overlay" />
      )}

      <Scorebar match={match} />
    </main>
  );
}

function useOverlayMatch(matchId, demo) {
  return useMatch(demo ? null : matchId);
}

const Scorebar = memo(function Scorebar({ match }) {
  const model = useMemo(() => buildScorebarModel(match), [match]);

  return (
    <section className="absolute inset-x-0 bottom-0 px-2 pb-2 sm:px-4 sm:pb-3 lg:px-5 lg:pb-4">
      <div className="mx-auto w-full overflow-hidden rounded-xl border border-white/15 bg-[#06111F]/90 shadow-2xl shadow-black/55 backdrop-blur-xl will-change-transform">
        <div className="grid min-h-6 grid-cols-[minmax(118px,0.1fr)_1fr_auto] items-center gap-3 border-b border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#A8B3C7] sm:px-4">
          <BrandMark />
          <TournamentStrip meta={model.meta} />
          <StatusBadge status={model.status} />
        </div>

        <div className="grid min-h-[76px] grid-cols-[minmax(230px,0.7fr)_minmax(430px,1.35fr)_minmax(380px,0.62fr)] items-stretch divide-x divide-white/10 max-md:grid-cols-[minmax(185px,0.82fr)_minmax(280px,1fr)] max-md:divide-y max-md:divide-x-0 max-sm:grid-cols-1">
          <TeamScoreBlock team={model.team} score={model.score} wickets={model.wickets} overs={model.overs} />
          <PlayerArea striker={model.striker} nonStriker={model.nonStriker} bowler={model.bowler} metrics={model.metrics} />
          <BallTracker balls={model.lastSix} />
        </div>
      </div>
    </section>
  );
});

const BrandMark = memo(function BrandMark() {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-[#D4AF37]/55 bg-black">
        <Image
          src="/logo.jpeg"
          alt="Viva Sports"
          fill
          sizes="24px"
          className="object-cover"
          priority
        />
      </span>
      <span className="truncate text-white">Viva Sports</span>
    </div>
  );
});

const TournamentStrip = memo(function TournamentStrip({ meta }) {
  return (
    <div className="flex min-w-0 items-center gap-3 overflow-hidden">
      {meta.map((item) => (
        <span key={item} className="truncate first:text-[#D4AF37]">
          {item}
        </span>
      ))}
    </div>
  );
});

const StatusBadge = memo(function StatusBadge({ status }) {
  const label = formatStatus(status);
  const tone = getStatusTone(status);

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${tone}`}>
      {label}
    </span>
  );
});

const TeamScoreBlock = memo(function TeamScoreBlock({ team, score, wickets, overs }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 bg-[#D4AF37] px-4 py-2.5 text-[#06152F] sm:px-5">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-black uppercase leading-tight sm:text-2xl lg:text-3xl">
          {team}
        </h1>
        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#06152F]/75">
          Batting
        </p>
      </div>
      <div className="text-right">
        <p className="whitespace-nowrap text-3xl font-black leading-none sm:text-4xl">
          {score}/{wickets}
        </p>
        <p className="mt-1 whitespace-nowrap text-xs font-black uppercase tracking-wide text-[#06152F]/75 sm:text-sm">
          ({overs} Ov)
        </p>
      </div>
    </div>
  );
});

const PlayerArea = memo(function PlayerArea({ striker, nonStriker, bowler, metrics }) {
  return (
    <div className="grid grid-rows-[1fr_auto] px-4 py-2 sm:px-5">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(128px,0.7fr)] items-center gap-4 max-sm:grid-cols-1">
        <BatterLine player={striker} striker />
        <BatterLine player={nonStriker} />
        <BowlerLine bowler={bowler} />
      </div>
      <StatusStrip metrics={metrics} />
    </div>
  );
});

const BatterLine = memo(function BatterLine({ player, striker = false }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {striker ? "Batter" : "Batter"}
      </p>
      <p className="mt-1 truncate text-lg font-black uppercase leading-tight text-white sm:text-xl">
        {player.name}
        {striker && <span className="ml-1 text-[#D4AF37]">*</span>}
      </p>
      <p className="text-sm font-black text-[#D4AF37] sm:text-base">
        {player.runs} ({player.balls})
      </p>
    </div>
  );
});

const BowlerLine = memo(function BowlerLine({ bowler }) {
  return (
    <div className="min-w-0 text-right max-sm:text-left">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Bowler
      </p>
      <p className="mt-1 truncate text-lg font-black uppercase leading-tight text-white sm:text-xl">
        {bowler.name}
      </p>
      <p className="text-sm font-black text-[#D4AF37] sm:text-base">
        {bowler.wickets}-{bowler.runs}
        <span className="ml-2 text-slate-300">{bowler.overs} Ov</span>
      </p>
    </div>
  );
});

const StatusStrip = memo(function StatusStrip({ metrics }) {
  return (
    <div className="mt-2 flex items-center gap-4 border-t border-white/10 pt-2 text-xs font-black uppercase tracking-wide text-white sm:text-sm">
      <Metric label="CRR" value={metrics.crr} />
      {metrics.rrr && <Metric label="RRR" value={metrics.rrr} />}
      <p className="min-w-0 truncate text-[#F8FAFC]">{metrics.need || metrics.status}</p>
    </div>
  );
});

const BallTracker = memo(function BallTracker({ balls }) {
  return (
    <div className="flex flex-col justify-center gap-2 bg-black/18 px-6 py-2.5 sm:px-7">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
        Last Six
      </p>
      <div className="flex justify-start gap-2 overflow-hidden">
        {balls.map((ball, index) => (
          <span
            key={`${ball}-${index}`}
            className={`flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border text-[22px] font-black leading-none shadow-lg ${getBallStyle(ball)}`}
          >
            <span className={ball.length > 2 ? "scale-75 whitespace-nowrap" : "whitespace-nowrap"}>
              {ball}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
});

const Metric = memo(function Metric({ label, value }) {
  return (
    <p className="shrink-0 text-white">
      <span className="mr-2 text-[#D4AF37]">{label}</span>
      {value}
    </p>
  );
});

function buildScorebarModel(match) {
  const showRequiredRate = match.innings === 2 && Boolean(match.target);
  const meta = [
    match.tournamentName || match.tournament || match.seriesName,
    formatMatchNumber(match),
    match.ground || match.venue,
  ].filter(Boolean);

  return {
    meta,
    status: match.status,
    team: match.battingTeam || match.teamA || "Batting Team",
    score: match.score ?? 0,
    wickets: match.wickets ?? 0,
    overs: match.overs || "0.0",
    striker: formatBatter(match.striker),
    nonStriker: formatBatter(match.nonStriker),
    bowler: formatBowler(match.currentBowler),
    lastSix: getLastSixDeliveries(match),
    metrics: {
      crr: getRunRate(match.score || 0, match.totalBalls || 0),
      rrr: showRequiredRate ? getRequiredRate(match) : "",
      need: getNeedLine(match),
      status: getStatusLine(match),
    },
  };
}

function formatBatter(player) {
  return {
    name: formatPlayerName(player?.name),
    runs: player?.runs || 0,
    balls: player?.balls || 0,
  };
}

function formatBowler(bowler) {
  return {
    name: formatPlayerName(bowler?.name),
    wickets: bowler?.wickets || 0,
    runs: bowler?.runs || 0,
    overs: formatBowlerOvers(bowler?.balls),
  };
}

function formatMatchNumber(match) {
  const value = match.matchNumber || match.matchNo || match.matchIndex || match.matchId;
  if (!value) return "";
  const text = String(value).toUpperCase();

  return text.startsWith("MATCH") ? text : `Match ${text}`;
}

function formatStatus(status) {
  if (!status) return "Live";
  if (status === "innings_break") return "Innings Break";
  if (status === "abandoned") return "Abandoned";
  if (status === "completed") return "Completed";
  if (status === "paused") return "Rain Delay";

  return String(status).replaceAll("_", " ");
}

function getStatusTone(status) {
  if (status === "completed") return "border-slate-300/50 bg-slate-300/20 text-slate-100";
  if (status === "innings_break") return "border-yellow-300/60 bg-yellow-300/20 text-yellow-100";
  if (status === "paused") return "border-blue-300/60 bg-blue-300/20 text-blue-100";
  if (status === "abandoned") return "border-red-300/60 bg-red-400/25 text-red-100";

  return "border-emerald-300/60 bg-emerald-400/25 text-emerald-100";
}

function formatPlayerName(name) {
  if (!name) return "-";

  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts.slice(1).map((part) => `${part[0]}.`).join(" ")}`;
}

function formatBowlerOvers(balls = 0) {
  const legalBalls = Number(balls || 0);
  return `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
}

function getStatusLine(match) {
  if (match.status === "innings_break") return `Innings break. Target ${match.target || "-"}`;
  if (match.status === "paused") return `Match paused${match.pauseReason ? `: ${match.pauseReason}` : ""}`;
  if (match.status === "completed") return match.winner ? `Winner: ${match.winner}` : "Match completed";
  if (match.revisedTargetApplied) return `Revised target ${match.revisedTarget} from ${match.revisedOvers} overs`;

  return match.status ? String(match.status).replaceAll("_", " ") : "Live cricket coverage";
}

function getLastSixDeliveries(match) {
  const events = match.commentary || match.balls || [];
  const balls = events
    .map((ball) => normalizeBallLabel(ball))
    .filter(Boolean)
    .slice(-6);
  const fallback = (match.currentOver || []).map(normalizeBallLabel).filter(Boolean).slice(-6);
  const source = balls.length ? balls : fallback;
  const padded = [...source];

  while (padded.length < 6) {
    padded.unshift(".");
  }

  return padded;
}

function normalizeBallLabel(ball) {
  const raw = typeof ball === "string" ? ball : ball?.label || ball?.type || "";
  const label = String(raw).trim().toUpperCase();

  if (!label || label === "0") return ".";
  if (label.startsWith("WD+") || label === "WD" || label === "WIDE") return label.replace("WIDE", "WD");
  if (label.startsWith("NB+") || label === "NB" || label === "NO BALL" || label === "NO_BALL") return label.replace("NO BALL", "NB").replace("NO_BALL", "NB");
  if (label.startsWith("LB+") || label === "LB" || label === "LEG BYE" || label === "LEG_BYE") return label.replace("LEG BYE", "LB").replace("LEG_BYE", "LB");
  if (label.startsWith("B+") || label === "B" || label === "BYE") return label.replace("BYE", "B");
  if (label === "WICKET") return "W";
  if (["1", "2", "3", "4", "6", "W"].includes(label)) return label;

  return label.slice(0, 2);
}

function getBallStyle(ball) {
  if (ball.startsWith("WD")) return ballStyles.WD;
  if (ball.startsWith("NB")) return ballStyles.NB;
  if (ball.startsWith("LB")) return ballStyles.LB;
  if (ball.startsWith("B")) return ballStyles.B;

  return ballStyles[ball] || ballStyles["."];
}
