export function calculateOvers(totalBalls) {

  const overs = Math.floor(totalBalls / 6);

  const balls = totalBalls % 6;

  return `${overs}.${balls}`;
}