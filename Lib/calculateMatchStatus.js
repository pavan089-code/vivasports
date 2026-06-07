import { getOversPerInnings } from "@/utils/matchConfigUtils";

export function calculateMatchStatus({
  target,
  score,
  overs,
  balls,
  totalOvers,
  oversLimit,
  oversPerInnings,
  inningsOvers,
  matchOvers,
  maxOvers,
  battingTeam,
}) {

  if (!target) {
    return "First innings in progress";
  }

  const totalBalls = getOversPerInnings({
    oversLimit,
    oversPerInnings,
    inningsOvers,
    matchOvers,
    maxOvers,
    totalOvers,
  }) * 6;

  const safeOvers =
    Number(overs || 0);

  const safeBalls =
    Number(balls || 0);

  const ballsBowled =
    safeOvers * 6 +
    safeBalls;

  const ballsRemaining =
    totalBalls - ballsBowled;

  const runsRemaining =
    target - score;

  if (runsRemaining <= 0) {
    return `${battingTeam} won the match`;
  }

  return `${battingTeam} need ${runsRemaining} runs in ${ballsRemaining} balls`;
}
