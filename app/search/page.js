"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { getMatches } from "@/services/matchService";
import { getPlayerStats } from "@/services/playerStatsService";
import { getTeams } from "@/services/teamService";

function includesText(value, query) {
  return String(value || "").toLowerCase().includes(query);
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSearchData() {
      const [playerData, teamData, matchData] = await Promise.all([
        getPlayerStats(),
        getTeams(),
        getMatches(),
      ]);

      setPlayers(playerData);
      setTeams(teamData);
      setMatches(matchData);
      setLoading(false);
    }

    Promise.resolve().then(loadSearchData);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalizedQuery) {
      return {
        players: players.slice(0, 8),
        teams: teams.slice(0, 8),
        matches: matches.slice(0, 8),
      };
    }

    return {
      players: players.filter(
        (player) =>
          includesText(player.playerName, normalizedQuery) ||
          includesText(player.teamName, normalizedQuery)
      ),
      teams: teams.filter(
        (team) =>
          includesText(team.name, normalizedQuery) ||
          includesText(team.captain, normalizedQuery)
      ),
      matches: matches.filter(
        (match) =>
          includesText(match.teamA, normalizedQuery) ||
          includesText(match.teamB, normalizedQuery) ||
          includesText(match.ground, normalizedQuery) ||
          includesText(match.status, normalizedQuery) ||
          includesText(match.result, normalizedQuery)
      ),
    };
  }, [matches, normalizedQuery, players, teams]);

  if (loading) return <LoadingSkeleton title="SEARCH" />;

  const totalResults =
    results.players.length + results.teams.length + results.matches.length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050B18] text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-sm font-semibold tracking-widest text-cyan-400">
          GLOBAL SEARCH
        </p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">
          Find Players, Teams, Matches
        </h1>
        <p className="mt-3 text-slate-400">
          Search tournament data in one place with instant grouped results.
        </p>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
          placeholder="Search by player, team, ground, status..."
          className="mt-8 w-full rounded-2xl border border-cyan-400/30 bg-[#0A1428] px-5 py-4 text-lg text-white outline-none focus:border-cyan-300"
        />

        <div className="mt-8 space-y-6">
          {totalResults === 0 && (
            <EmptyState
              title="No results found"
              message="Try another player name, team name, ground, or match status."
            />
          )}

          <ResultGroup title="Players" count={results.players.length}>
            {results.players.map((player) => (
              <ResultLink
                key={player.id}
                href={`/player/${player.id}`}
                title={player.playerName}
                meta={`${player.teamName || "-"} | ${player.runs || 0} runs | ${
                  player.wickets || 0
                } wickets`}
              />
            ))}
          </ResultGroup>

          <ResultGroup title="Teams" count={results.teams.length}>
            {results.teams.map((team) => (
              <ResultLink
                key={team.id}
                href={`/team/${team.id}`}
                title={team.name}
                meta={`${team.points || 0} points | ${team.played || 0} played`}
              />
            ))}
          </ResultGroup>

          <ResultGroup title="Matches" count={results.matches.length}>
            {results.matches.map((match) => (
              <ResultLink
                key={match.id}
                href={
                  match.status === "completed"
                    ? `/scorecard/${match.id}`
                    : `/live/${match.id}`
                }
                title={`${match.teamA} vs ${match.teamB}`}
                meta={[match.status, match.date, match.ground]
                  .filter(Boolean)
                  .join(" | ")}
              />
            ))}
          </ResultGroup>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ResultGroup({ title, count, children }) {
  if (!count) return null;

  return (
    <section className="rounded-2xl border border-white/10 bg-[#101D35] p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black">{title}</h2>
        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-200">
          {count}
        </span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}

function ResultLink({ href, title, meta }) {
  return (
    <Link
      href={href}
      className="block rounded-xl bg-[#0A1428] p-4 transition hover:bg-[#14213B]"
    >
      <p className="font-black text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{meta || "-"}</p>
    </Link>
  );
}
