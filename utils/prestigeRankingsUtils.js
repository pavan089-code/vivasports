import { buildScorecard } from "@/utils/scorecardUtils";

const completedStatuses = ["completed", "abandoned"];
const milestoneRules = [
  { key: "runs500", label: "500 Runs", field: "runs", target: 500 },
  { key: "runs1000", label: "1000 Runs", field: "runs", target: 1000 },
  { key: "wickets25", label: "25 Wickets", field: "wickets", target: 25 },
  { key: "wickets50", label: "50 Wickets", field: "wickets", target: 50 },
  { key: "wickets100", label: "100 Wickets", field: "wickets", target: 100 },
];

function getCompletedMatches(matches) {
  return matches.filter((match) => completedStatuses.includes(match.status));
}

function getResultText(match) {
  const result = match?.result;
  if (!result) return "";
  if (typeof result === "string") return result;
  return result.result || "";
}

function getPlayerKey(player) {
  return `${player.teamName || ""}::${player.playerName || ""}`;
}

function getPlayerOfMatchCounts(matches) {
  const counts = new Map();

  getCompletedMatches(matches).forEach((match) => {
    const award = match.playerOfMatch;
    if (!award?.playerName || !award?.teamName) return;

    const key = `${award.teamName}::${award.playerName}`;
    const current = counts.get(key) || {
      playerName: award.playerName,
      teamName: award.teamName,
      awards: 0,
    };

    counts.set(key, {
      ...current,
      awards: current.awards + 1,
    });
  });

  return counts;
}

function getAllInnings(matches) {
  return getCompletedMatches(matches).flatMap((match) =>
    buildScorecard(match).innings.map((innings) => ({
      ...innings,
      matchId: match.id,
      matchTitle: `${match.teamA} vs ${match.teamB}`,
      date: match.date,
      result: getResultText(match),
    }))
  );
}

function parseVictoryMargin(match) {
  const text = getResultText(match);
  const runs = text.match(/(\d+)\s+runs?/i);
  const wickets = text.match(/(\d+)\s+wickets?/i);

  if (runs) {
    return {
      type: "runs",
      value: Number(runs[1]),
      label: `${runs[1]} runs`,
    };
  }

  if (wickets) {
    return {
      type: "wickets",
      value: Number(wickets[1]),
      label: `${wickets[1]} wickets`,
    };
  }

  return {
    type: "none",
    value: 0,
    label: text || "-",
  };
}

function calculateBattingScore(player) {
  return (player.runs || 0) + (player.fours || 0) + (player.sixes || 0) * 2;
}

function calculateBowlingScore(player) {
  return (player.wickets || 0) * 25 + Math.max(0, 8 - (player.economy || 0)) * 5;
}

function calculateFieldingScore(player) {
  return (player.catches || 0) * 8 + (player.runOuts || 0) * 12 + (player.stumpings || 0) * 12;
}

export function getHallOfFame(players, matches) {
  const innings = getAllInnings(matches);
  const batting = innings.flatMap((item) =>
    item.batting.map((player) => ({
      ...player,
      teamName: item.battingTeam,
      matchId: item.matchId,
      matchTitle: item.matchTitle,
    }))
  );
  const bowling = innings.flatMap((item) =>
    item.bowling.map((player) => ({
      ...player,
      teamName: item.bowlingTeam,
      matchId: item.matchId,
      matchTitle: item.matchTitle,
    }))
  );
  const pomCounts = [...getPlayerOfMatchCounts(matches).values()];

  return {
    mostRuns: [...players].sort((a, b) => (b.runs || 0) - (a.runs || 0))[0],
    mostWickets: [...players].sort((a, b) => (b.wickets || 0) - (a.wickets || 0))[0],
    mostPlayerOfMatchAwards: pomCounts.sort((a, b) => b.awards - a.awards)[0],
    highestIndividualScore: batting.sort((a, b) => b.runs - a.runs)[0],
    bestBowlingFigures: bowling.sort((a, b) => {
      if (b.wickets !== a.wickets) return b.wickets - a.wickets;
      return a.runsConceded - b.runsConceded;
    })[0],
  };
}

export function getTeamRivalries(matches) {
  const rivalryMap = new Map();

  getCompletedMatches(matches).forEach((match) => {
    if (!match.teamA || !match.teamB) return;

    const teams = [match.teamA, match.teamB].sort();
    const key = teams.join("::");
    const current = rivalryMap.get(key) || {
      key,
      teams,
      matchesPlayed: 0,
      wins: {
        [teams[0]]: 0,
        [teams[1]]: 0,
      },
      highestScore: {
        teamName: "-",
        score: 0,
      },
      largestVictory: {
        winner: "-",
        marginValue: 0,
        margin: "-",
      },
    };
    const scorecard = buildScorecard(match);

    scorecard.innings.forEach((innings) => {
      if (innings.score > current.highestScore.score) {
        current.highestScore = {
          teamName: innings.battingTeam,
          score: innings.score,
        };
      }
    });

    if (match.winner && current.wins[match.winner] !== undefined) {
      current.wins[match.winner] += 1;
    }

    const margin = parseVictoryMargin(match);
    if (margin.value > current.largestVictory.marginValue) {
      current.largestVictory = {
        winner: match.winner || "-",
        marginValue: margin.value,
        margin: margin.label,
      };
    }

    rivalryMap.set(key, {
      ...current,
      matchesPlayed: current.matchesPlayed + 1,
    });
  });

  return [...rivalryMap.values()].sort((a, b) => b.matchesPlayed - a.matchesPlayed);
}

export function getPlayerMilestones(players) {
  return milestoneRules.map((rule) => ({
    ...rule,
    players: [...players]
      .filter((player) => (player[rule.field] || 0) >= rule.target)
      .sort((a, b) => (b[rule.field] || 0) - (a[rule.field] || 0)),
  }));
}

export function getMatchReports(matches) {
  return getCompletedMatches(matches)
    .map((match) => {
      const scorecard = buildScorecard(match);
      const topBatter = scorecard.topBatter;
      const topBowler = scorecard.topBowler;
      const result = getResultText(match);
      const turningPoint =
        match.playerOfMatch?.playerName
          ? `${match.playerOfMatch.playerName}'s Player Of Match performance shifted the contest.`
          : topBowler?.wickets
            ? `${topBowler.playerName}'s ${topBowler.wickets}-wicket spell created the decisive pressure.`
            : topBatter
              ? `${topBatter.playerName}'s ${topBatter.runs} anchored the result.`
              : "The decisive phase will appear once scorecard detail is available.";

      return {
        id: match.id,
        title: `${match.teamA} vs ${match.teamB}`,
        date: match.date || "Date TBA",
        summary: result
          ? `${match.winner || "The match"} finished ${result} in the Viva Sports tournament.`
          : `${match.teamA} vs ${match.teamB} is completed.`,
        topBatter,
        topBowler,
        turningPoint,
      };
    })
    .reverse();
}

export function getTournamentMvp(players, matches) {
  const pomCounts = getPlayerOfMatchCounts(matches);

  return [...players]
    .map((player) => {
      const pomAwards = pomCounts.get(getPlayerKey(player))?.awards || 0;
      const batting = calculateBattingScore(player);
      const bowling = calculateBowlingScore(player);
      const fielding = calculateFieldingScore(player);
      const playerOfMatch = pomAwards * 35;

      return {
        ...player,
        pomAwards,
        batting,
        bowling,
        fielding,
        playerOfMatch,
        mvpPoints: Number((batting + bowling + fielding + playerOfMatch).toFixed(2)),
      };
    })
    .sort((a, b) => b.mvpPoints - a.mvpPoints);
}

export function getFantasyPoints(players, matches) {
  const pomCounts = getPlayerOfMatchCounts(matches);

  return [...players]
    .map((player) => {
      const pomAwards = pomCounts.get(getPlayerKey(player))?.awards || 0;
      const runs = player.runs || 0;
      const wickets = (player.wickets || 0) * 25;
      const catches = (player.catches || 0) * 8;
      const runOuts = (player.runOuts || 0) * 12;
      const pom = pomAwards * 25;

      return {
        ...player,
        pomAwards,
        fantasyPoints: runs + wickets + catches + runOuts + pom,
        fantasyBreakdown: {
          runs,
          wickets,
          catches,
          runOuts,
          pom,
        },
      };
    })
    .sort((a, b) => b.fantasyPoints - a.fantasyPoints);
}

export function getTeamPowerRankings(teams, matches) {
  const recentCompleted = getCompletedMatches(matches).slice(-5);

  return [...teams]
    .map((team) => {
      const recentForm = recentCompleted.reduce((score, match) => {
        if (match.teamA !== team.name && match.teamB !== team.name) return score;
        if (match.winner === team.name) return score + 1;
        if (!match.winner) return score + 0.5;
        return score;
      }, 0);
      const winsScore = (team.won || 0) * 10;
      const nrrScore = Math.max((team.nrr || 0) * 8, -8);
      const formScore = recentForm * 6;

      return {
        ...team,
        recentForm,
        powerScore: Number((winsScore + nrrScore + formScore).toFixed(2)),
      };
    })
    .sort((a, b) => b.powerScore - a.powerScore);
}

export function getAwardsHistory(seasons, matches, players) {
  const currentMvp = getTournamentMvp(players, matches)[0];
  const currentPom = [...getPlayerOfMatchCounts(matches).values()].sort(
    (a, b) => b.awards - a.awards
  )[0];
  const historical = seasons.flatMap((season) =>
    (season.awards || []).map((award) => ({
      seasonName: season.seasonName || season.name || "Season",
      seasonYear: season.seasonYear || season.year || "-",
      award: award.award || award.title || "Award",
      playerName: award.playerName || "-",
      teamName: award.teamName || "-",
    }))
  );

  return [
    ...historical,
    currentPom && {
      seasonName: "Current Tournament",
      seasonYear: "Live",
      award: "Player Of Match Leader",
      playerName: currentPom.playerName,
      teamName: currentPom.teamName,
    },
    currentMvp && {
      seasonName: "Current Tournament",
      seasonYear: "Live",
      award: "Tournament MVP",
      playerName: currentMvp.playerName,
      teamName: currentMvp.teamName,
    },
  ].filter(Boolean);
}
