export function getMatchResult(
  match,
  score,
  wickets
) {
  // CHASE SUCCESSFUL

  if (score >= match.target) {
    return {
      winner: match.battingTeam,

      result: `Won by ${
        10 - wickets
      } wickets`,
    };
  }

  const oversComplete =
    match.totalBalls >=
    match.oversLimit * 6;

  const allOut =
    wickets >= 10;

  if (
    oversComplete ||
    allOut
  ) {
    return {
      winner: match.bowlingTeam,

      result: `Won by ${
        match.target -
        score -
        1
      } runs`,
    };
  }

  return null;
}