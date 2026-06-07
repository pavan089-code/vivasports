import {
  getTopBatters,
  getTopBowlers,
} from "@/utils/leaderboardUtils";
import { sortUpcomingMatches } from "@/utils/tournamentUtils";

import { getInningsBallLimit } from "@/utils/matchConfigUtils";

export function getBallsRemaining(match) {
  const limit = getInningsBallLimit(match);
  return Math.max(limit - (match.totalBalls || 0), 0);
}

export function getRunRate(score, totalBalls) {
  return totalBalls ? ((score * 6) / totalBalls).toFixed(2) : "0.00";
}

export function getRequiredRate(match) {
  if (match.innings !== 2 || !match.target) return "-";

  const remaining = getBallsRemaining(match);
  const needed = Math.max((match.target || 0) - (match.score || 0), 0);

  return remaining ? ((needed * 6) / remaining).toFixed(2) : "-";
}

export function getNeedLine(match) {
  if (match.innings !== 2 || !match.target) return "";

  const needed = Math.max((match.target || 0) - (match.score || 0), 0);

  return `Need ${needed} from ${getBallsRemaining(match)}`;
}

export function getRequiredRuns(match) {
  if (match.innings !== 2 || !match.target) return "-";

  return Math.max((match.target || 0) - (match.score || 0), 0);
}

export function getRequiredBalls(match) {
  if (match.innings !== 2 || !match.target) return "-";

  return getBallsRemaining(match);
}

export function getLatestEvent(match) {
  if (match.status === "completed" && match.playerOfMatch) {
    return {
      key: `pom-${match.completedAt || match.playerOfMatch.playerName}`,
      type: "PLAYER OF THE MATCH",
      title: "PLAYER OF THE MATCH",
      subtitle: match.playerOfMatch.playerName,
      detail: match.playerOfMatch.teamName || "",
    };
  }

  const balls = match.commentary || match.balls || [];
  const last = balls[balls.length - 1];

  if (!last) return null;

  const previousRuns = last.before?.striker?.runs || 0;
  const newRuns = previousRuns + (last.batterRuns || 0);

  if (previousRuns < 100 && newRuns >= 100) {
    return {
      key: `hundred-${last.createdAt}`,
      type: "CENTURY",
      title: "CENTURY",
      subtitle: last.striker,
      detail: `${newRuns} runs`,
    };
  }

  if (previousRuns < 50 && newRuns >= 50) {
    return {
      key: `fifty-${last.createdAt}`,
      type: "HALF CENTURY",
      title: "HALF CENTURY",
      subtitle: last.striker,
      detail: `${newRuns} runs`,
    };
  }

  if (last.type === "wicket") {
    return {
      key: `wicket-${last.createdAt}`,
      type: "WICKET",
      title: "WICKET",
      subtitle: last.striker,
      detail: last.commentary || last.label || "",
    };
  }

  if ((last.batterRuns || 0) === 6) {
    return {
      key: `six-${last.createdAt}`,
      type: "SIX",
      title: "SIX",
      subtitle: last.striker,
      detail: last.bowler ? `Off ${last.bowler}` : "",
    };
  }

  if ((last.batterRuns || 0) === 4) {
    return {
      key: `four-${last.createdAt}`,
      type: "FOUR",
      title: "FOUR",
      subtitle: last.striker,
      detail: last.bowler ? `Off ${last.bowler}` : "",
    };
  }

  return null;
}

export function getGraphicText(match, type) {
  if (type === "playing_xi") {
    const teamAPlayers =
      match.teamAPlayers || match.battingTeamPlayers || match.playersA || [];
    const teamBPlayers =
      match.teamBPlayers || match.bowlingTeamPlayers || match.playersB || [];

    return {
      title: "PLAYING XI",
      lines: [
        `${match.teamA}: ${teamAPlayers.join(", ") || "Lineup TBA"}`,
        `${match.teamB}: ${teamBPlayers.join(", ") || "Lineup TBA"}`,
      ],
    };
  }

  if (type === "innings_break") {
    return {
      title: "INNINGS BREAK",
      lines: [
        `Target: ${match.target || "-"}`,
        `${match.teamA} vs ${match.teamB}`,
      ],
    };
  }

  if (type === "target") {
    return {
      title: "TARGET",
      lines: [
        `${match.battingTeam || "Chasing team"} need ${getRequiredRuns(match)} from ${getRequiredBalls(match)}`,
        `Target ${match.target || "-"}`,
      ],
    };
  }

  if (type === "result") {
    return {
      title: "MATCH RESULT",
      lines: [
        match.winner ? `Winner: ${match.winner}` : "Result",
        typeof match.result === "string" ? match.result : match.result?.result || "-",
      ],
    };
  }

  if (type === "player_of_match") {
    return {
      title: "PLAYER OF THE MATCH",
      lines: [
        match.playerOfMatch?.playerName || "-",
        match.playerOfMatch?.teamName || "",
      ].filter(Boolean),
    };
  }

  return {
    title: "TOSS WINNER",
    lines: [
      `${match.tossWinner || "-"} chose ${match.tossDecision || "-"}`,
    ],
  };
}

export function buildTickerItems({ matches, players, sponsors, sections = {} }) {
  const enabled = {
    upcoming: true,
    topBatters: true,
    topBowlers: true,
    sponsors: true,
    ...sections,
  };
  const upcoming = !enabled.upcoming
    ? []
    : sortUpcomingMatches(
    matches.filter((match) => match.status === "scheduled")
  )
    .slice(0, 3)
    .map((match) => `Upcoming: ${match.teamA} vs ${match.teamB} ${match.date || ""} ${match.time || ""}`);
  const batters = !enabled.topBatters
    ? []
    : getTopBatters(players)
    .slice(0, 3)
    .map((player) => `Top Batter: ${player.playerName} ${player.runs || 0} runs`);
  const bowlers = !enabled.topBowlers
    ? []
    : getTopBowlers(players)
    .slice(0, 3)
    .map((player) => `Top Bowler: ${player.playerName} ${player.wickets || 0} wickets`);
  const sponsorItems = !enabled.sponsors
    ? []
    : (sponsors || [])
    .slice(0, 3)
    .map((sponsor) => `${sponsor.category || "Sponsor"}: ${sponsor.name}`);

  return [...upcoming, ...batters, ...bowlers, ...sponsorItems].filter(Boolean);
}
