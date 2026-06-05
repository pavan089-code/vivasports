export function isInningsComplete(match) {
  const oversFinished =
    match.totalBalls >=
    match.oversLimit * 6;

  const allOut =
    match.wickets >= 10;

  return (
    oversFinished ||
    allOut
  );
}
