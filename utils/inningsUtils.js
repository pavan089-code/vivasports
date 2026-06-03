export function isInningsComplete(match) {
  console.log(
    "INSIDE isInningsComplete",
    match.totalBalls,
    match.oversLimit
  );

  const oversFinished =
    match.totalBalls >=
    match.oversLimit * 6;

  const allOut =
    match.wickets >= 10;

  console.log(
    "oversFinished",
    oversFinished
  );

  return (
    oversFinished ||
    allOut
  );
}