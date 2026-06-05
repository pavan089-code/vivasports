import {
  getTeams,
  updateTeamByName,
} from "@/services/teamService";
import { getSettings } from "@/services/SettingServices";
import { buildTeamStatsUpdate } from "@/utils/tournamentUtils";

function getMatchKey(match) {
  return [
    match.createdAt,
    match.teamA,
    match.teamB,
    match.date,
    match.time,
  ]
    .filter(Boolean)
    .join("-");
}

function getCompletedMatchStats(match) {
  const firstBattingTeam = match.bowlingTeam;
  const secondBattingTeam = match.battingTeam;
  const oversLimitBalls = (match.oversLimit || 0) * 6;

  const firstInningsRuns = match.firstInningsScore ?? 0;
  const secondInningsRuns = match.secondInningsScore ?? match.score ?? 0;
  const secondInningsWickets = match.secondInningsWickets ?? match.wickets ?? 0;

  const firstInningsBalls = oversLimitBalls;
  const secondInningsBalls =
    secondInningsWickets >= 10
      ? oversLimitBalls
      : match.totalBalls || oversLimitBalls;

  return {
    firstBattingTeam,
    secondBattingTeam,
    firstInningsRuns,
    secondInningsRuns,
    firstInningsBalls,
    secondInningsBalls,
  };
}

function getResultDelta(teamName, winner, isTie) {
  if (isTie) {
    return {
      won: 0,
      lost: 0,
      tied: 1,
      points: 1,
    };
  }

  const won = winner === teamName;

  return {
    won: won ? 1 : 0,
    lost: won ? 0 : 1,
    tied: 0,
    points: won ? 2 : 0,
  };
}

export async function updatePointsTable(
  match,
  resultData
) {
  const settings = await getSettings();

  if (settings?.automaticStandings === false) {
    return;
  }

  const {
    firstBattingTeam,
    secondBattingTeam,
    firstInningsRuns,
    secondInningsRuns,
    firstInningsBalls,
    secondInningsBalls,
  } = getCompletedMatchStats(match);

  if (
    !firstBattingTeam ||
    !secondBattingTeam ||
    match.secondInningsScore == null
  )
    return;

  const matchKey = getMatchKey(match);
  const winner = resultData?.winner || null;
  const isTie =
    !winner ||
    String(resultData?.result || "")
      .toLowerCase()
      .includes("tie");

  const teams = await getTeams();

  const firstTeam = teams.find(
    (team) => team.name === firstBattingTeam
  );
  const secondTeam = teams.find(
    (team) => team.name === secondBattingTeam
  );

  if (!firstTeam || !secondTeam) return;

  if (
    matchKey &&
    (
      (firstTeam.completedMatches || []).includes(matchKey) ||
      (secondTeam.completedMatches || []).includes(matchKey)
    )
  ) {
    return;
  }

  const firstTeamUpdate = buildTeamStatsUpdate(firstTeam, {
    ...getResultDelta(firstBattingTeam, winner, isTie),
    runsFor: firstInningsRuns,
    ballsFaced: firstInningsBalls,
    runsAgainst: secondInningsRuns,
    ballsBowled: secondInningsBalls,
  });

  const secondTeamUpdate = buildTeamStatsUpdate(secondTeam, {
    ...getResultDelta(secondBattingTeam, winner, isTie),
    runsFor: secondInningsRuns,
    ballsFaced: secondInningsBalls,
    runsAgainst: firstInningsRuns,
    ballsBowled: firstInningsBalls,
  });

  const firstCompletedMatches = [
    ...(firstTeam.completedMatches || []),
    matchKey,
  ].filter(Boolean);
  const secondCompletedMatches = [
    ...(secondTeam.completedMatches || []),
    matchKey,
  ].filter(Boolean);

  await updateTeamByName(
    firstBattingTeam,
    {
      ...firstTeamUpdate,
      completedMatches: firstCompletedMatches,
    }
  );

  await updateTeamByName(
    secondBattingTeam,
    {
      ...secondTeamUpdate,
      completedMatches: secondCompletedMatches,
    }
  );
}
