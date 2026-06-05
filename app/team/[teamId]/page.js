"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ShareButton from "@/components/ui/ShareButton";
import { getMatches } from "@/services/matchService";
import { getPlayerStats } from "@/services/playerStatsService";
import { getTeams } from "@/services/teamService";
import {
  getTeamLeaders,
  getTeamRecentMatches,
} from "@/utils/tournamentAnalyticsUtils";
import { getAchievements } from "@/utils/cricketIntelligenceUtils";

export default function TeamProfilePage({ params }) {
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadTeam() {
      try {
        const { teamId } = await params;
        const [teams, playerStats, matchData] = await Promise.all([
          getTeams(),
          getPlayerStats(),
          getMatches(),
        ]);

        if (!active) return;

        setTeam(teams.find((item) => item.id === teamId) || null);
        setPlayers(playerStats);
        setMatches(matchData);
      } catch {
        if (!active) return;

        setTeam(null);
        setPlayers([]);
        setMatches([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    Promise.resolve().then(loadTeam);

    return () => {
      active = false;
    };
  }, [params]);

  const teamPlayers = useMemo(
    () => (team ? players.filter((player) => player.teamName === team.name) : []),
    [players, team]
  );
  const recentMatches = useMemo(
    () => (team ? getTeamRecentMatches(team, matches) : []),
    [matches, team]
  );
  const teamLeaders = useMemo(
    () => (team ? getTeamLeaders(team, players) : { topBatter: null, topBowler: null }),
    [players, team]
  );
  const awardCounts = useMemo(() => {
    if (!team) return {};

    return matches.reduce((counts, match) => {
      const award = match.playerOfMatch;
      if (award?.teamName !== team.name) return counts;

      counts[award.playerName] = (counts[award.playerName] || 0) + 1;
      return counts;
    }, {});
  }, [matches, team]);

  if (loading) {
    return <LoadingSkeleton title="TEAM PROFILE" />;
  }

  if (!team) {
    return (
      <main className="vs-page">
        <Navbar />
        <section className="max-w-7xl mx-auto px-4 py-12">
          <EmptyState
            title="Team not found"
            message="This team may have been deleted, or the link may be out of date."
            actionHref="/teams"
            actionLabel="Back to Teams"
          />
        </section>
        <Footer />
      </main>
    );
  }

  const { topBatter, topBowler } = teamLeaders;

  return (
    <main className="vs-page">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <Link href="/teams" className="vs-link text-sm">
          Back to Teams
        </Link>

        <header className="vs-card p-6 md:p-8">
          <p className="vs-eyebrow">
            TEAM PROFILE
          </p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="break-words text-4xl font-black md:text-6xl">
                {team.name}
              </h1>
              <p className="mt-2 text-slate-400">
                Captain: {team.captain || "-"}
              </p>
            </div>
            <ShareButton
              title={`${team.name} | Viva Sports`}
              text={`${team.name} team profile`}
              path={`/team/${team.id}`}
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
            <Stat label="Played" value={team.played || 0} />
            <Stat label="Won" value={team.won || 0} />
            <Stat label="Lost" value={team.lost || 0} />
            <Stat label="Points" value={team.points || 0} />
            <Stat label="Runs For" value={team.runsFor || 0} />
            <Stat label="Runs Against" value={team.runsAgainst || 0} />
            <Stat label="NRR" value={(team.nrr || 0).toFixed(3)} />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Squad">
            <div className="grid gap-2 sm:grid-cols-2">
              {(team.players || []).map((playerName) => {
                const playerStat = teamPlayers.find(
                  (player) => player.playerName === playerName
                );
                const achievements = playerStat
                  ? getAchievements(playerStat, awardCounts[playerName] || 0)
                  : [];

                return (
                  <div key={playerName} className="vs-card-muted p-3">
                    <p>{playerName}</p>
                    {achievements.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {achievements.map((achievement) => (
                          <span
                            key={achievement}
                            className="rounded-full bg-[var(--vs-gold)]/15 px-2 py-1 text-xs font-bold text-[var(--vs-gold-soft)]"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Team Leaders">
            <div className="grid gap-3 sm:grid-cols-2">
              <LeaderCard
                label="Top Batter"
                player={topBatter}
                value={topBatter ? `${topBatter.runs || 0} runs` : "-"}
              />
              <LeaderCard
                label="Top Bowler"
                player={topBowler}
                value={topBowler ? `${topBowler.wickets || 0} wickets` : "-"}
              />
            </div>
          </Panel>
        </div>

        <Panel title="Recent Matches">
          <div className="grid gap-3">
            {recentMatches.map((match) => (
              <Link
                key={match.id}
                href={`/scorecard/${match.id}`}
                className="vs-card-muted p-4 transition hover:border-[var(--vs-gold)]/35"
              >
                <p className="font-bold">vs {match.opponent}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {[match.date, match.result].filter(Boolean).join(" | ")}
                </p>
              </Link>
            ))}
            {!recentMatches.length && (
              <p className="text-slate-400">No completed matches yet.</p>
            )}
          </div>
        </Panel>

        <Panel title="Player Statistics">
          <div className="vs-table-wrap">
            <table className="vs-table min-w-[640px]">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Matches</th>
                  <th>Runs</th>
                  <th>Wickets</th>
                  <th>SR</th>
                  <th>Economy</th>
                </tr>
              </thead>
              <tbody>
                {teamPlayers.map((player) => (
                  <tr key={player.id} className="text-center">
                    <td className="py-4 text-left font-semibold">
                      <Link href={`/player/${player.id}`} className="vs-link">
                        {player.playerName}
                      </Link>
                    </td>
                    <td>{player.matches || 0}</td>
                    <td>{player.runs || 0}</td>
                    <td>{player.wickets || 0}</td>
                    <td>{(player.strikeRate || 0).toFixed(2)}</td>
                    <td>{(player.economy || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="vs-card-muted p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="vs-card p-5 md:p-6">
      <h2 className="mb-5 text-2xl font-black">{title}</h2>
      {children}
    </section>
  );
}

function LeaderCard({ label, player, value }) {
  return (
    <div className="vs-card-muted p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 font-bold">{player?.playerName || "-"}</p>
      <p className="mt-1 text-[var(--vs-gold-soft)]">{value}</p>
    </div>
  );
}
