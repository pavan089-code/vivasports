"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ShareButton from "@/components/ui/ShareButton";
import { getMatches } from "@/services/matchService";
import { getPlayerStat } from "@/services/playerStatsService";
import {
  getPlayerOfMatchHistory,
  getPlayerRecentMatches,
} from "@/utils/playerProfileUtils";
import { getAchievements } from "@/utils/cricketIntelligenceUtils";

function getResultText(result) {
  if (!result) return "";
  if (typeof result === "string") return result;
  return result.result || "";
}

export default function PlayerProfilePage({
  params,
}) {
  const [player, setPlayer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const { playerId } = await params;
        const [playerData, matchData] = await Promise.all([
          getPlayerStat(playerId),
          getMatches(),
        ]);

        if (!active) return;

        setPlayer(playerData);
        setMatches(matchData);
      } catch {
        if (!active) return;

        setPlayer(null);
        setMatches([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    Promise.resolve().then(loadProfile);

    return () => {
      active = false;
    };
  }, [params]);

  const recentMatches = useMemo(
    () => (player ? getPlayerRecentMatches(player, matches) : []),
    [matches, player]
  );
  const awardHistory = useMemo(
    () => (player ? getPlayerOfMatchHistory(player, matches) : []),
    [matches, player]
  );

  if (loading) {
    return <LoadingSkeleton title="PLAYER PROFILE" />;
  }

  if (!player) {
    return (
      <main className="vs-page">
        <Navbar />
        <section className="max-w-5xl mx-auto px-4 py-16">
          <EmptyState
            title="Player not found"
            message="This player profile is missing or the player statistics have not been generated yet."
            actionHref="/leaderboards"
            actionLabel="Back to Leaderboards"
          />
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="vs-page">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <Link href="/leaderboards" className="vs-link text-sm">
          Back to Leaderboards
        </Link>

        <ProfileHeader player={player} awardsCount={awardHistory.length} />

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentMatches matches={recentMatches} />
          <AwardHistory awards={awardHistory} />
        </div>

        <CareerStats player={player} />
      </section>

      <Footer />
    </main>
  );
}

function ProfileHeader({ player, awardsCount }) {
  const achievements = getAchievements(player, awardsCount);

  return (
    <header className="vs-card p-6 md:p-8">
      <p className="vs-eyebrow">
        PLAYER PROFILE
      </p>
      <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="break-words text-4xl font-black md:text-6xl">
            {player.playerName}
          </h1>
          <p className="mt-2 text-lg text-slate-400">{player.teamName}</p>
        </div>
        <ShareButton
          title={`${player.playerName} | Viva Sports`}
          text={`${player.playerName} player profile`}
          path={`/player/${player.id}`}
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        <Stat label="Matches" value={player.matches || 0} />
        <Stat label="Runs" value={player.runs || 0} />
        <Stat label="Wickets" value={player.wickets || 0} />
        <Stat label="Highest" value={player.highestScore || 0} />
        <Stat label="SR" value={(player.strikeRate || 0).toFixed(2)} />
        <Stat label="Economy" value={(player.economy || 0).toFixed(2)} />
        <Stat label="Overs" value={player.overs || "0.0"} />
      </div>

      {achievements.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {achievements.map((achievement) => (
            <span
              key={achievement}
              className="rounded-full bg-[var(--vs-gold)]/15 px-3 py-1 text-sm font-bold text-[var(--vs-gold-soft)]"
            >
              {achievement}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

function Stat({ label, value }) {
  return (
    <div className="vs-card-muted p-4">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-black mt-2">{value}</p>
    </div>
  );
}

function RecentMatches({ matches }) {
  return (
    <section className="vs-card p-5 md:p-6">
      <h2 className="text-2xl font-black">Recent Matches</h2>

      <div className="mt-5 space-y-3">
        {matches.map((match) => (
          <Link
            key={match.matchId}
            href={`/scorecard/${match.matchId}`}
            className="vs-card-muted block p-4 transition hover:border-[var(--vs-gold)]/35"
          >
            <p className="font-bold text-white">
              {match.runs} ({match.balls}) vs {match.opponent}
            </p>
            <p className="text-sm text-slate-400 mt-1">{match.date || "Date TBA"}</p>
          </Link>
        ))}

        {!matches.length && (
          <p className="text-slate-400">No recent batting performances yet.</p>
        )}
      </div>
    </section>
  );
}

function AwardHistory({ awards }) {
  return (
    <section className="vs-card p-5 md:p-6">
      <h2 className="text-2xl font-black">Player Of Match History</h2>

      <div className="vs-card-muted mt-5 p-4">
        <p className="text-slate-400 text-sm">Awards</p>
        <p className="mt-2 text-5xl font-black text-[var(--vs-gold-soft)]">{awards.length}</p>
      </div>

      <div className="mt-5 space-y-3">
        {awards.map((award) => (
          <Link
            key={award.matchId}
            href={`/scorecard/${award.matchId}`}
            className="vs-card-muted block p-4 transition hover:border-[var(--vs-gold)]/35"
          >
            <p className="font-bold text-white">vs {award.opponent}</p>
            <p className="text-sm text-slate-400 mt-1">
              {[award.date, getResultText(award.result)].filter(Boolean).join(" | ")}
            </p>
          </Link>
        ))}

        {!awards.length && (
          <p className="text-slate-400">No Player Of Match awards yet.</p>
        )}
      </div>
    </section>
  );
}

function CareerStats({ player }) {
  return (
    <section className="vs-card p-5 md:p-6">
      <h2 className="text-2xl font-black">Career Stats</h2>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-xl font-black mb-3">Batting</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Runs" value={player.runs || 0} />
            <Stat label="Balls" value={player.ballsFaced || 0} />
            <Stat label="4s" value={player.fours || 0} />
            <Stat label="6s" value={player.sixes || 0} />
            <Stat label="Highest" value={player.highestScore || 0} />
            <Stat label="SR" value={(player.strikeRate || 0).toFixed(2)} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black mb-3">Bowling</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Overs" value={player.overs || "0.0"} />
            <Stat label="Wickets" value={player.wickets || 0} />
            <Stat label="Economy" value={(player.economy || 0).toFixed(2)} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black mb-3">Fielding</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Catches" value={player.catches || 0} />
            <Stat label="Run Outs" value={player.runOuts || 0} />
            <Stat label="Stumpings" value={player.stumpings || 0} />
          </div>
        </div>
      </div>
    </section>
  );
}
