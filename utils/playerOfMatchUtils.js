function ensurePlayer(players, teamName, playerName) {
  const key = `${teamName}::${playerName}`;

  if (!players.has(key)) {
    players.set(key, {
      teamName,
      playerName,
      runs: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      ballsBowled: 0,
      runsConceded: 0,
      wickets: 0,
      catches: 0,
      runOuts: 0,
      stumpings: 0,
    });
  }

  return players.get(key);
}

function calculateScore(player) {
  const strikeRate =
    player.ballsFaced > 0 ? (player.runs / player.ballsFaced) * 100 : 0;
  const economy =
    player.ballsBowled > 0 ? player.runsConceded / (player.ballsBowled / 6) : 0;
  const battingScore = player.runs + (player.ballsFaced > 0 ? strikeRate / 10 : 0);
  const bowlingScore =
    (player.wickets * 25) + (player.ballsBowled > 0 ? Math.max(0, 12 - economy) : 0);
  const fieldingScore =
    (player.catches * 10) +
    (player.runOuts * 15) +
    (player.stumpings * 15);

  return {
    score: Number((battingScore + bowlingScore + fieldingScore).toFixed(2)),
    strikeRate: Number(strikeRate.toFixed(2)),
    economy: player.ballsBowled > 0 ? Number(economy.toFixed(2)) : 0,
  };
}

export function calculatePlayerOfMatch(match) {
  const events = match.commentary || match.balls || [];
  const players = new Map();

  events.forEach((ball) => {
    const battingTeam = ball.before?.battingTeam;
    const bowlingTeam = ball.before?.bowlingTeam;

    if (battingTeam && ball.striker) {
      const batter = ensurePlayer(players, battingTeam, ball.striker);
      const batterRuns = ball.batterRuns || 0;

      batter.runs += batterRuns;
      batter.ballsFaced += ball.isLegalDelivery ? 1 : 0;
      batter.fours += batterRuns === 4 ? 1 : 0;
      batter.sixes += batterRuns === 6 ? 1 : 0;
    }

    if (bowlingTeam && ball.bowler) {
      const bowler = ensurePlayer(players, bowlingTeam, ball.bowler);

      bowler.ballsBowled += ball.isLegalDelivery ? 1 : 0;
      bowler.runsConceded += ball.bowlerRuns || 0;
      bowler.wickets += ball.type === "wicket" ? 1 : 0;
    }

    if (bowlingTeam && ball.fielder) {
      const fielder = ensurePlayer(players, bowlingTeam, ball.fielder);

      if (ball.dismissalType === "caught") fielder.catches += 1;
      if (ball.dismissalType === "run_out") fielder.runOuts += 1;
      if (ball.dismissalType === "stumped") fielder.stumpings += 1;
    }
  });

  const ranked = [...players.values()]
    .map((player) => ({
      ...player,
      ...calculateScore(player),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.runs !== a.runs) return b.runs - a.runs;
      return b.wickets - a.wickets;
    });

  const winner = ranked[0];

  if (!winner) return null;

  return {
    playerName: winner.playerName,
    teamName: winner.teamName,
    score: winner.score,
    runs: winner.runs,
    strikeRate: winner.strikeRate,
    wickets: winner.wickets,
    economy: winner.economy,
    catches: winner.catches,
    runOuts: winner.runOuts,
    stumpings: winner.stumpings,
  };
}
