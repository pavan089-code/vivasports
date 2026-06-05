"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Image from "next/image";

import EventAnimation from "@/components/broadcast/EventAnimation";
import useMatch from "@/hooks/useMatch";
import { getPlayerStats } from "@/services/playerStatsService";
import { getSponsorsByCategory, subscribeToBroadcastSettings } from "@/services/broadcastService";
import { subscribeToMatches } from "@/services/matchService";
import {
  buildTickerItems,
  getGraphicText,
  getLatestEvent,
  getRequiredBalls,
  getRequiredRate,
  getRequiredRuns,
  getRunRate,
} from "@/utils/broadcastUtils";

const themeClasses = {
  classic: {
    panel: "border-white/20 bg-[#06101F]/88",
    accent: "text-white",
    bar: "bg-white text-[#050B18]",
    label: "text-slate-300",
  },
  modern: {
    panel: "border-[#D8B45A]/25 bg-[#07101F]/90",
    accent: "text-[#F1D58A]",
    bar: "bg-[#07101F] text-white",
    label: "text-slate-300",
  },
  premium_gold: {
    panel: "border-[#D8B45A]/45 bg-[#020611]/92",
    accent: "text-[#F1D58A]",
    bar: "bg-[#D8B45A] text-[#050B18]",
    label: "text-slate-300",
  },
};

export default function BroadcastLiveOverlay({ matchId }) {
  const { match, loading } = useMatch(matchId);
  const [settings, setSettings] = useState(null);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [sponsorIndex, setSponsorIndex] = useState(0);
  const [event, setEvent] = useState(null);
  const lastEventKey = useRef("");

  useEffect(() => {
    document.documentElement.classList.add("broadcast-transparent-body");
    document.body.classList.add("broadcast-transparent-body");

    return () => {
      document.documentElement.classList.remove("broadcast-transparent-body");
      document.body.classList.remove("broadcast-transparent-body");
    };
  }, []);

  useEffect(() => {
    const unsubscribeSettings = subscribeToBroadcastSettings(setSettings);
    const unsubscribeMatches = subscribeToMatches(setMatches);

    getPlayerStats().then(setPlayers).catch(() => setPlayers([]));

    return () => {
      unsubscribeSettings();
      unsubscribeMatches();
    };
  }, []);

  const sponsors = useMemo(
    () => getSponsorsByCategory(settings, settings?.activeSponsorCategory || "all"),
    [settings]
  );

  useEffect(() => {
    if (!settings?.sponsorRotation || sponsors.length <= 1) return;

    const interval = setInterval(() => {
      setSponsorIndex((index) => (index + 1) % sponsors.length);
    }, Math.max(settings.sponsorInterval || 8, 2) * 1000);

    return () => clearInterval(interval);
  }, [settings?.sponsorInterval, settings?.sponsorRotation, sponsors.length]);

  useEffect(() => {
    if (!match || !settings?.graphicsVisible) {
      return;
    }

    const latest = settings?.manualGraphic
      ? {
          ...settings.manualGraphic,
          key: `manual-${settings.updatedAt || settings.manualGraphic.title}`,
        }
      : getLatestEvent(match);

    if (!latest) return;
    if (latest.key && latest.key === lastEventKey.current) return;

    lastEventKey.current = latest.key || `${latest.type}-${latest.title}-${latest.subtitle}`;

    const showTimeout = setTimeout(() => setEvent(latest), 0);
    const hideTimeout = setTimeout(() => setEvent(null), 4600);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [match, settings?.graphicsVisible, settings?.manualGraphic, settings?.updatedAt]);

  const tickerItems = useMemo(
    () =>
      buildTickerItems({
        matches,
        players,
        sponsors,
        sections: settings?.tickerSections,
      }),
    [matches, players, sponsors, settings?.tickerSections]
  );

  if (loading || !match || !settings?.overlayVisible) return null;

  const theme = themeClasses[settings.overlayTheme] || themeClasses.premium_gold;
  const currentSponsor = sponsors[sponsorIndex % Math.max(sponsors.length, 1)] || null;
  const graphicType = settings.liveGraphic?.type || settings.matchGraphic?.type;
  const graphicVisible =
    settings.graphicsVisible &&
    (settings.liveGraphic?.visible || settings.matchGraphic?.visible);
  const graphic = graphicVisible ? getGraphicText(match, graphicType) : null;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-transparent font-sans text-white">
      <Scorebug match={match} theme={theme} />

      <OperationsBug match={match} theme={theme} />

      {settings.graphicsVisible && event && <EventAnimation event={event} />}

      {settings.graphicsVisible && settings.lowerThird?.visible && (
        <LowerThird lowerThird={settings.lowerThird} theme={theme} />
      )}

      {graphic && <MatchGraphic graphic={graphic} theme={theme} />}

      {currentSponsor && <SponsorBug sponsor={currentSponsor} theme={theme} />}

      {settings.tickerVisible && <Ticker items={tickerItems} theme={theme} />}
    </main>
  );
}

function Scorebug({ match, theme }) {
  return (
    <section
      className={`absolute left-8 top-8 min-w-[980px] overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md ${theme.panel}`}
    >
      <div className="grid grid-cols-[320px_1fr]">
        <div className="border-r border-white/10 px-6 py-5">
          <p className={`text-xs font-black uppercase tracking-[0.28em] ${theme.accent}`}>
            {match.battingTeam || "Batting Team"}
          </p>
          <div className="mt-2 flex items-end gap-3">
            <p className="text-6xl font-black leading-none">
              {match.score ?? 0}/{match.wickets ?? 0}
            </p>
            <p className="pb-2 text-2xl font-black text-slate-300">
              {match.overs || "0.0"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr] gap-4 px-6 py-5">
          <PlayerLine
            label="Batters"
            primary={match.striker?.name || "-"}
            secondary={match.nonStriker?.name || "-"}
            theme={theme}
          />
          <PlayerLine
            label="Bowler"
            primary={match.currentBowler?.name || "-"}
            secondary={`${match.currentBowler?.wickets || 0}/${match.currentBowler?.runs || 0}`}
            theme={theme}
          />
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="CRR" value={getRunRate(match.score || 0, match.totalBalls || 0)} />
            <MiniStat label="RRR" value={getRequiredRate(match)} />
            <MiniStat label="Req Runs" value={getRequiredRuns(match)} />
            <MiniStat label="Req Balls" value={getRequiredBalls(match)} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayerLine({ label, primary, secondary, theme }) {
  return (
    <div>
      <p className={`text-xs font-bold uppercase tracking-[0.18em] ${theme.label}`}>
        {label}
      </p>
      <p className="mt-2 truncate text-2xl font-black">{primary}</p>
      <p className={`mt-1 truncate text-lg font-bold ${theme.accent}`}>{secondary}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function OperationsBug({ match, theme }) {
  const latestNote = (match.matchNotes || []).slice(-1)[0];

  if (!latestNote && !match.revisedTargetApplied && !["paused", "innings_break", "completed"].includes(match.status)) {
    return null;
  }

  return (
    <section
      className={`absolute left-8 top-48 max-w-3xl rounded-xl border px-6 py-4 shadow-2xl backdrop-blur-md ${theme.panel}`}
    >
      {match.status === "paused" && (
        <p className={`text-2xl font-black ${theme.accent}`}>
          MATCH PAUSED: {match.pauseReason || "Delay"}
        </p>
      )}

      {match.status === "innings_break" && (
        <p className={`text-2xl font-black ${theme.accent}`}>
          INNINGS BREAK: Target {match.target || "-"}
        </p>
      )}

      {match.status === "completed" && (
        <p className={`text-2xl font-black ${theme.accent}`}>
          MATCH RESULT: {match.winner || "Result pending"}
        </p>
      )}

      {match.revisedTargetApplied && (
        <p className="mt-2 text-xl font-black text-white">
          Target Revised: {match.revisedTarget} from {match.revisedOvers} overs
        </p>
      )}

      {latestNote && (
        <p className="mt-2 text-lg font-bold text-white">{latestNote.text}</p>
      )}
    </section>
  );
}

function SponsorBug({ sponsor, theme }) {
  return (
    <a
      href={sponsor.link || undefined}
      className={`absolute right-8 top-8 flex min-w-72 items-center gap-4 rounded-xl border px-5 py-3 shadow-2xl backdrop-blur-md ${theme.panel}`}
    >
      {sponsor.logo ? (
        <Image
          src={sponsor.logo}
          alt={sponsor.name}
          width={64}
          height={48}
          unoptimized
          className="h-12 w-16 rounded-md object-contain"
        />
      ) : (
        <div className="flex h-12 w-16 items-center justify-center rounded-md border border-[#D8B45A]/35 bg-black/25 text-xs font-black text-[#F1D58A]">
          VS
        </div>
      )}
      <div>
        <p className={`text-xs font-bold uppercase tracking-[0.18em] ${theme.accent}`}>
          {sponsor.category || "Sponsor"}
        </p>
        <p className="text-xl font-black">{sponsor.name}</p>
      </div>
    </a>
  );
}

function LowerThird({ lowerThird, theme }) {
  return (
    <section
      className={`absolute bottom-28 left-8 min-w-[520px] rounded-xl border px-8 py-5 shadow-2xl backdrop-blur-md ${theme.panel}`}
    >
      <p className={`text-xs font-black uppercase tracking-[0.28em] ${theme.accent}`}>
        Viva Sports
      </p>
      <p className="mt-2 text-4xl font-black">{lowerThird.playerName || "PLAYER"}</p>
      <p className={`mt-2 text-xl font-bold ${theme.accent}`}>{lowerThird.line1}</p>
      <p className="text-lg text-slate-300">{lowerThird.line2}</p>
    </section>
  );
}

function MatchGraphic({ graphic, theme }) {
  return (
    <section
      className={`absolute right-8 top-36 max-w-3xl rounded-2xl border p-8 text-right shadow-2xl backdrop-blur-md ${theme.panel}`}
    >
      <p className={`text-sm font-black uppercase tracking-[0.28em] ${theme.accent}`}>
        Match Graphic
      </p>
      <p className="mt-2 text-5xl font-black text-white">{graphic.title}</p>
      <div className="mt-6 space-y-3">
        {graphic.lines.map((line) => (
          <p key={line} className="text-2xl font-bold leading-snug text-slate-100">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}

function Ticker({ items, theme }) {
  if (!items.length) return null;

  return (
    <section className={`absolute bottom-0 left-0 right-0 overflow-hidden ${theme.bar}`}>
      <div className="broadcast-ticker flex w-max gap-12 px-8 py-3 text-xl font-black">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`} className="whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
      <style jsx>{`
        .broadcast-ticker {
          animation: broadcastTicker 42s linear infinite;
        }

        @keyframes broadcastTicker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
