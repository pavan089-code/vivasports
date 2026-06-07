export function getOversPerInnings(match = {}) {
  const candidates = [
    match.oversLimit,
    match.oversPerInnings,
    match.inningsOvers,
    match.matchOvers,
    match.maxOvers,
    match.totalOvers,
  ];

  const value = candidates
    .map((entry) => Number(entry))
    .find((entry) => Number.isFinite(entry) && entry > 0);

  return value || 20;
}

export function getInningsBallLimit(match = {}) {
  return getOversPerInnings(match) * 6;
}
