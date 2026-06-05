import { buildScorecard } from "@/utils/scorecardUtils";
import {
  getFastestMilestone,
} from "@/utils/cricketIntelligenceUtils";

function getCompletedMatches(matches) {
  return matches.filter((match) => match.status === "completed");
}

function getResultText(result) {
  if (!result) return "";
  if (typeof result === "string") return result;
  return result.result || "";
}

export function getTeamRecentMatches(team, matches) {
  return getCompletedMatches(matches)
    .filter((match) => match.teamA === team.name || match.teamB === team.name)
    .slice(-5)
    .reverse()
    .map((match) => ({
      id: match.id,
      opponent: match.teamA === team.name ? match.teamB : match.teamA,
      date: match.date,
      result: getResultText(match.result),
      winner: match.winner,
    }));
}

export function getTeamLeaders(team, players) {
  const teamPlayers = players.filter((player) => player.teamName === team.name);
  const topBatter = [...teamPlayers].sort((a, b) => {
    if ((b.runs || 0) !== (a.runs || 0)) return (b.runs || 0) - (a.runs || 0);
    return (b.strikeRate || 0) - (a.strikeRate || 0);
  })[0];
  const topBowler = [...teamPlayers].sort((a, b) => {
    if ((b.wickets || 0) !== (a.wickets || 0)) {
      return (b.wickets || 0) - (a.wickets || 0);
    }

    return (a.economy || 0) - (b.economy || 0);
  })[0];

  return {
    topBatter,
    topBowler,
  };
}

export function getAwards(players, matches) {
  const playerOfMatchCounts = new Map();

  getCompletedMatches(matches).forEach((match) => {
    const award = match.playerOfMatch;
    if (!award?.playerName || !award?.teamName) return;

    const key = `${award.teamName}::${award.playerName}`;
    const current = playerOfMatchCounts.get(key) || {
      teamName: award.teamName,
      playerName: award.playerName,
      awards: 0,
    };

    playerOfMatchCounts.set(key, {
      ...current,
      awards: current.awards + 1,
    });
  });

  const mostPlayerOfMatchAwards = [...playerOfMatchCounts.values()].sort(
    (a, b) => b.awards - a.awards
  )[0];

  return {
    mostRuns: [...players].sort((a, b) => (b.runs || 0) - (a.runs || 0))[0],
    mostWickets: [...players].sort(
      (a, b) => (b.wickets || 0) - (a.wickets || 0)
    )[0],
    bestBatter: [...players].sort((a, b) => {
      if ((b.strikeRate || 0) !== (a.strikeRate || 0)) {
        return (b.strikeRate || 0) - (a.strikeRate || 0);
      }

      return (b.runs || 0) - (a.runs || 0);
    })[0],
    bestBowler: [...players].sort((a, b) => {
      if ((b.wickets || 0) !== (a.wickets || 0)) {
        return (b.wickets || 0) - (a.wickets || 0);
      }

      return (a.economy || 0) - (b.economy || 0);
    })[0],
    bestAllRounder: [...players].sort(
      (a, b) =>
        ((b.runs || 0) + (b.wickets || 0) * 20) -
        ((a.runs || 0) + (a.wickets || 0) * 20)
    )[0],
    mostPlayerOfMatchAwards,
  };
}

export function getTournamentStats(matches, players) {
  const completed = getCompletedMatches(matches);
  const innings = completed.flatMap((match) =>
    buildScorecard(match).innings.map((item) => ({
      ...item,
      matchId: match.id,
      matchTitle: `${match.teamA} vs ${match.teamB}`,
    }))
  );

  const allBatting = innings.flatMap((item) =>
    item.batting.map((batter) => ({
      ...batter,
      teamName: item.battingTeam,
      matchId: item.matchId,
    }))
  );
  const allBowling = innings.flatMap((item) =>
    item.bowling.map((bowler) => ({
      ...bowler,
      teamName: item.bowlingTeam,
      matchId: item.matchId,
    }))
  );

  const highestTeamScore = [...innings].sort((a, b) => b.score - a.score)[0];
  const lowestTeamScore = [...innings]
    .filter((item) => item.score > 0)
    .sort((a, b) => a.score - b.score)[0];
  const highestIndividualScore = [...allBatting].sort(
    (a, b) => b.runs - a.runs
  )[0];
  const bestBowlingFigures = [...allBowling].sort((a, b) => {
    if (b.wickets !== a.wickets) return b.wickets - a.wickets;
    return a.runsConceded - b.runsConceded;
  })[0];
  const mostBoundaries = [...players].sort(
    (a, b) =>
      ((b.fours || 0) + (b.sixes || 0)) -
      ((a.fours || 0) + (a.sixes || 0))
  )[0];
  const mostSixes = [...players].sort((a, b) => (b.sixes || 0) - (a.sixes || 0))[0];
  const mostFours = [...players].sort((a, b) => (b.fours || 0) - (a.fours || 0))[0];
  const mostCatches = [...players].sort(
    (a, b) => (b.catches || 0) - (a.catches || 0)
  )[0];
  const playerOfMatchCounts = new Map();

  completed.forEach((match) => {
    const award = match.playerOfMatch;
    if (!award?.playerName || !award?.teamName) return;

    const key = `${award.teamName}::${award.playerName}`;
    const current = playerOfMatchCounts.get(key) || {
      playerName: award.playerName,
      teamName: award.teamName,
      awards: 0,
    };
    playerOfMatchCounts.set(key, { ...current, awards: current.awards + 1 });
  });
  const mostPlayerOfMatchAwards = [...playerOfMatchCounts.values()].sort(
    (a, b) => b.awards - a.awards
  )[0];

  return {
    highestTeamScore,
    lowestTeamScore,
    highestIndividualScore,
    bestBowlingFigures,
    mostBoundaries,
    mostSixes,
    mostFours,
    mostCatches,
    mostPlayerOfMatchAwards,
    tournamentRuns: innings.reduce((total, item) => total + item.score, 0),
    tournamentWickets: innings.reduce((total, item) => total + item.wickets, 0),
  };
}

export function getMatchAnalytics(matches) {
  const completed = getCompletedMatches(matches);
  const scorecards = completed.map((match) => ({
    match,
    scorecard: buildScorecard(match),
  }));
  const innings = scorecards.flatMap(({ match, scorecard }) =>
    scorecard.innings.map((item) => ({
      ...item,
      matchId: match.id,
      match,
    }))
  );
  const partnerships = innings.flatMap((inningsItem) =>
    (inningsItem.partnerships || []).map((partnership) => ({
      ...partnership,
      matchId: inningsItem.matchId,
      teamName: inningsItem.battingTeam,
    }))
  );
  const highestChases = completed
    .filter((match) => match.winner === match.battingTeam && match.target)
    .sort((a, b) => (b.target || 0) - (a.target || 0));
  const lowestDefendedTotals = completed
    .filter((match) => match.winner === match.bowlingTeam && match.firstInningsScore)
    .sort((a, b) => (a.firstInningsScore || 0) - (b.firstInningsScore || 0));
  const allBowling = innings.flatMap((item) =>
    item.bowling.map((bowler) => ({
      ...bowler,
      teamName: item.bowlingTeam,
      matchId: item.matchId,
    }))
  );

  return {
    highestPartnerships: [...partnerships].sort((a, b) => b.runs - a.runs).slice(0, 10),
    bestBowlingFigures: [...allBowling].sort((a, b) => {
      if (b.wickets !== a.wickets) return b.wickets - a.wickets;
      return a.runsConceded - b.runsConceded;
    }).slice(0, 10),
    fastestFifties: getFastestMilestone(scorecards, 50),
    fastestHundreds: getFastestMilestone(scorecards, 100),
    highestChases: highestChases.slice(0, 10),
    lowestDefendedTotals: lowestDefendedTotals.slice(0, 10),
  };
}
