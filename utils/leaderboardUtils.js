export function getTopBatters(players) {
  return [...players].sort((a, b) => {
    if ((b.runs || 0) !== (a.runs || 0)) {
      return (b.runs || 0) - (a.runs || 0);
    }

    return (b.strikeRate || 0) - (a.strikeRate || 0);
  });
}

export function getTopBowlers(players) {
  return [...players].sort((a, b) => {
    if ((b.wickets || 0) !== (a.wickets || 0)) {
      return (b.wickets || 0) - (a.wickets || 0);
    }

    return (a.economy || 0) - (b.economy || 0);
  });
}

export function getAllRounderScore(player) {
  return (player.runs || 0) + ((player.wickets || 0) * 20);
}

export function getTopAllRounders(players) {
  return [...players].sort(
    (a, b) => getAllRounderScore(b) - getAllRounderScore(a)
  );
}
