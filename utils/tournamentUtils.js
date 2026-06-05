import { calculateOvers } from "@/utils/matchUtils";

export function getMatchTimestamp(match) {
  const date = match.date || "";
  const time = match.time || "00:00";
  const timestamp = new Date(`${date}T${time}`).getTime();

  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
}

export function sortUpcomingMatches(matches) {
  return [...matches].sort((a, b) => getMatchTimestamp(a) - getMatchTimestamp(b));
}

export function sortRecentMatches(matches) {
  return [...matches].sort((a, b) => getMatchTimestamp(b) - getMatchTimestamp(a));
}

export function toDisplayOvers(totalBalls = 0) {
  return calculateOvers(totalBalls || 0);
}

export function toRunRateOvers(totalBalls = 0, oversLimit = 0) {
  const balls = totalBalls || 0;

  if (balls <= 0) {
    return oversLimit || 0;
  }

  return balls / 6;
}

export function calculateNRR({
  runsFor = 0,
  ballsFaced = 0,
  runsAgainst = 0,
  ballsBowled = 0,
}) {
  const oversFaced = toRunRateOvers(ballsFaced);
  const oversBowled = toRunRateOvers(ballsBowled);

  if (!oversFaced || !oversBowled) return 0;

  return Number(((runsFor / oversFaced) - (runsAgainst / oversBowled)).toFixed(3));
}

export function buildTeamStatsUpdate(team, delta) {
  const runsFor = (team.runsFor || 0) + (delta.runsFor || 0);
  const ballsFaced = (team.ballsFaced || 0) + (delta.ballsFaced || 0);
  const runsAgainst = (team.runsAgainst || 0) + (delta.runsAgainst || 0);
  const ballsBowled = (team.ballsBowled || 0) + (delta.ballsBowled || 0);

  return {
    played: (team.played || 0) + 1,
    won: (team.won || 0) + (delta.won || 0),
    lost: (team.lost || 0) + (delta.lost || 0),
    tied: (team.tied || 0) + (delta.tied || 0),
    points: (team.points || 0) + (delta.points || 0),
    runsFor,
    ballsFaced,
    oversFaced: toDisplayOvers(ballsFaced),
    runsAgainst,
    ballsBowled,
    oversBowled: toDisplayOvers(ballsBowled),
    nrr: calculateNRR({
      runsFor,
      ballsFaced,
      runsAgainst,
      ballsBowled,
    }),
  };
}

export function rankTeams(teams) {
  return [...teams].sort((a, b) => {
    if ((b.points || 0) !== (a.points || 0)) {
      return (b.points || 0) - (a.points || 0);
    }

    if ((b.nrr || 0) !== (a.nrr || 0)) {
      return (b.nrr || 0) - (a.nrr || 0);
    }

    if ((b.won || 0) !== (a.won || 0)) {
      return (b.won || 0) - (a.won || 0);
    }

    return (a.name || "").localeCompare(b.name || "");
  });
}
