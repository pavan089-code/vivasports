import { createMatch, getMatches, updateMatch } from "@/services/matchService";
import { getSettings } from "@/services/SettingServices";
import { getTeams, updateTeam } from "@/services/teamService";
import { calculateNRR } from "@/utils/tournamentUtils";

const defaultOperationsSettings = {
  automaticStandings: true,
  allowManualOverride: true,
  abandonedMatchPoints: 1,
  enableRevisedTargets: true,
  enableWalkovers: true,
};

export function getOperationsSettings(settings = {}) {
  return {
    ...defaultOperationsSettings,
    ...(settings || {}),
  };
}

export function parseOversToBalls(overs) {
  const [overPart, ballPart = "0"] = String(overs || "0")
    .split(".");
  const fullOvers = Number(overPart) || 0;
  const balls = Math.min(Number(ballPart) || 0, 5);

  return (fullOvers * 6) + balls;
}

function ballsToOvers(totalBalls = 0) {
  const balls = Number(totalBalls) || 0;

  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

function emptyStanding(team) {
  return {
    id: team.id,
    name: team.name,
    played: 0,
    won: 0,
    lost: 0,
    tied: 0,
    points: 0,
    runsFor: 0,
    ballsFaced: 0,
    oversFaced: "0.0",
    runsAgainst: 0,
    ballsBowled: 0,
    oversBowled: "0.0",
    nrr: 0,
    completedMatches: [],
    manualOverride: false,
  };
}

function addTeamResult(team, delta) {
  team.played += 1;
  team.won += delta.won || 0;
  team.lost += delta.lost || 0;
  team.tied += delta.tied || 0;
  team.points += delta.points || 0;
  team.runsFor += delta.runsFor || 0;
  team.ballsFaced += delta.ballsFaced || 0;
  team.runsAgainst += delta.runsAgainst || 0;
  team.ballsBowled += delta.ballsBowled || 0;
  team.oversFaced = ballsToOvers(team.ballsFaced);
  team.oversBowled = ballsToOvers(team.ballsBowled);
  team.nrr = calculateNRR(team);
}

function resultDelta(teamName, match) {
  if (match.resultType === "abandoned" || match.status === "abandoned") {
    return {
      tied: 0,
      won: 0,
      lost: 0,
      points: match.abandonedPoints ?? 1,
    };
  }

  if (!match.winner || String(match.result || "").toLowerCase().includes("tie")) {
    return {
      tied: 1,
      won: 0,
      lost: 0,
      points: 1,
    };
  }

  return {
    tied: 0,
    won: match.winner === teamName ? 1 : 0,
    lost: match.winner === teamName ? 0 : 1,
    points: match.winner === teamName ? 2 : 0,
  };
}

function applyMatchToStandingMap(match, standings) {
  const teamA = standings.get(match.teamA);
  const teamB = standings.get(match.teamB);

  if (!teamA || !teamB) return;

  const key = match.id || match.createdAt || `${match.teamA}-${match.teamB}-${match.date}`;
  const teamAScore = Number(match.teamAScore ?? match.firstInningsScore ?? 0);
  const teamBScore = Number(match.teamBScore ?? match.secondInningsScore ?? match.score ?? 0);
  const teamABalls = Number(match.teamABalls ?? match.firstInningsBalls ?? parseOversToBalls(match.teamAOvers || match.oversLimit || 0));
  const teamBBalls = Number(match.teamBBalls ?? match.secondInningsBalls ?? match.totalBalls ?? parseOversToBalls(match.teamBOvers || match.oversLimit || 0));

  addTeamResult(teamA, {
    ...resultDelta(match.teamA, match),
    runsFor: match.resultType === "walkover" || match.resultType === "abandoned" ? 0 : teamAScore,
    ballsFaced: match.resultType === "walkover" || match.resultType === "abandoned" ? 0 : teamABalls,
    runsAgainst: match.resultType === "walkover" || match.resultType === "abandoned" ? 0 : teamBScore,
    ballsBowled: match.resultType === "walkover" || match.resultType === "abandoned" ? 0 : teamBBalls,
  });

  addTeamResult(teamB, {
    ...resultDelta(match.teamB, match),
    runsFor: match.resultType === "walkover" || match.resultType === "abandoned" ? 0 : teamBScore,
    ballsFaced: match.resultType === "walkover" || match.resultType === "abandoned" ? 0 : teamBBalls,
    runsAgainst: match.resultType === "walkover" || match.resultType === "abandoned" ? 0 : teamAScore,
    ballsBowled: match.resultType === "walkover" || match.resultType === "abandoned" ? 0 : teamABalls,
  });

  teamA.completedMatches.push(key);
  teamB.completedMatches.push(key);
}

export async function rebuildStandingsFromMatches() {
  const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
  const standings = new Map(teams.map((team) => [team.name, emptyStanding(team)]));

  matches
    .filter((match) => match.status === "completed" || match.status === "abandoned")
    .forEach((match) => applyMatchToStandingMap(match, standings));

  await Promise.all(
    [...standings.values()].map((standing) =>
      updateTeam(standing.id, {
        ...standing,
        recalculatedAt: Date.now(),
      })
    )
  );

  return [...standings.values()];
}

export async function auditStandings() {
  const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
  const standings = new Map(teams.map((team) => [team.name, emptyStanding(team)]));

  matches
    .filter((match) => match.status === "completed" || match.status === "abandoned")
    .forEach((match) => applyMatchToStandingMap(match, standings));

  return teams.map((team) => {
    const calculated = standings.get(team.name) || emptyStanding(team);

    return {
      team,
      calculated,
      mismatches: ["played", "won", "lost", "tied", "points", "nrr"].filter(
        (field) => Number(team[field] || 0) !== Number(calculated[field] || 0)
      ),
    };
  });
}

export async function importHistoricalMatch(data) {
  const teamAScore = Number(data.teamAScore || 0);
  const teamBScore = Number(data.teamBScore || 0);
  const teamABalls = parseOversToBalls(data.teamAOvers || data.oversLimit || 20);
  const teamBBalls = parseOversToBalls(data.teamBOvers || data.oversLimit || 20);

  const matchData = {
    teamA: data.teamA,
    teamB: data.teamB,
    status: "completed",
    resultType: "historical",
    importedHistorical: true,
    date: data.date || "",
    time: data.time || "",
    ground: data.ground || "",
    winner: data.winner || null,
    result: data.result || "Historical result",
    firstInningsScore: teamAScore,
    firstInningsWickets: Number(data.teamAWickets || 0),
    secondInningsScore: teamBScore,
    secondInningsWickets: Number(data.teamBWickets || 0),
    teamAScore,
    teamBScore,
    teamABalls,
    teamBBalls,
    battingTeam: data.teamB,
    bowlingTeam: data.teamA,
    score: teamBScore,
    wickets: Number(data.teamBWickets || 0),
    totalBalls: teamBBalls,
    balls: [],
    commentary: [],
    matchNotes: [
      {
        text: "Historical match imported by admin.",
        role: "admin",
        createdAt: Date.now(),
      },
    ],
    completedAt: Date.now(),
  };

  const matchId = await createMatch(matchData);
  await rebuildStandingsFromMatches();

  return matchId;
}

export async function pauseMatch(match, reason, note, role = "admin") {
  await updateMatch(match.id, {
    status: "paused",
    pauseReason: reason,
    pausedAt: Date.now(),
    matchNotes: [
      ...(match.matchNotes || []),
      {
        text: note || `Match paused: ${reason}`,
        role,
        type: "pause",
        createdAt: Date.now(),
      },
    ],
  });
}

export async function resumeMatch(match, note, role = "admin") {
  await updateMatch(match.id, {
    status: "live",
    pauseReason: null,
    resumedAt: Date.now(),
    matchNotes: [
      ...(match.matchNotes || []),
      {
        text: note || "Play resumed.",
        role,
        type: "resume",
        createdAt: Date.now(),
      },
    ],
  });
}

export async function appendMatchNote(match, text, role = "admin") {
  await updateMatch(match.id, {
    matchNotes: [
      ...(match.matchNotes || []),
      {
        text,
        role,
        type: "note",
        createdAt: Date.now(),
      },
    ],
  });
}

export async function applyRevisedTarget(matchId, data) {
  await updateMatch(matchId, {
    revisedOvers: Number(data.revisedOvers || 0),
    revisedTarget: Number(data.revisedTarget || 0),
    revisionReason: data.revisionReason || "",
    target: Number(data.revisedTarget || 0),
    revisedTargetApplied: true,
    revisedAt: Date.now(),
  });
}

export async function markAbandoned(match, reason = "No Result") {
  const settings = getOperationsSettings(await getSettings());

  await updateMatch(match.id, {
    status: "abandoned",
    resultType: "abandoned",
    result: "No Result",
    winner: null,
    abandonedReason: reason,
    abandonedPoints: Number(settings.abandonedMatchPoints ?? 1),
    completedAt: Date.now(),
  });

  await rebuildStandingsFromMatches();
}

export async function createWalkover(match, winner) {
  const loser = winner === match.teamA ? match.teamB : match.teamA;

  await updateMatch(match.id, {
    status: "completed",
    resultType: "walkover",
    winner,
    result: `${winner} won by walkover`,
    walkoverWinner: winner,
    walkoverLoser: loser,
    completedAt: Date.now(),
  });

  await rebuildStandingsFromMatches();
}

export async function saveManualTeamStanding(teamId, data) {
  const ballsFaced = parseOversToBalls(data.oversFaced);
  const ballsBowled = parseOversToBalls(data.oversBowled);

  await updateTeam(teamId, {
    played: Number(data.played || 0),
    won: Number(data.won || 0),
    lost: Number(data.lost || 0),
    tied: Number(data.tied || 0),
    points: Number(data.points || 0),
    nrr: Number(data.nrr || 0),
    runsFor: Number(data.runsFor || 0),
    ballsFaced,
    oversFaced: data.oversFaced || ballsToOvers(ballsFaced),
    runsAgainst: Number(data.runsAgainst || 0),
    ballsBowled,
    oversBowled: data.oversBowled || ballsToOvers(ballsBowled),
    manualOverride: true,
    manualOverrideAt: Date.now(),
  });
}
