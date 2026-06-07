import { getInningsBallLimit } from "@/utils/matchConfigUtils";

export function getMatchResult(
  match,
  score,
  wickets,
  totalBalls = match.totalBalls
) {
  // CHASE SUCCESSFUL

  if (match.target && score >= match.target) {
    return {
      winner: match.battingTeam,

      result: `Won by ${
        10 - wickets
      } wickets`,
    };
  }

  const oversComplete =
    totalBalls >=
    getInningsBallLimit(match);

  const allOut =
    wickets >= 10;

  if (
    oversComplete ||
    allOut
  ) {
    const margin =
      match.target -
      score -
      1;

    if (margin === 0) {
      return {
        winner: null,

        result: "Match tied",
      };
    }

    return {
      winner: match.bowlingTeam,

      result: `Won by ${
        margin
      } runs`,
    };
  }

  return null;
}
