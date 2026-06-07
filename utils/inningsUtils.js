import { getInningsBallLimit } from "@/utils/matchConfigUtils";

export function isInningsComplete(match) {
  const oversFinished =
    match.totalBalls >=
    getInningsBallLimit(match);

  const allOut =
    match.wickets >= 10;

  return (
    oversFinished ||
    allOut
  );
}
