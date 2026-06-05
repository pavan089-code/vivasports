export function getPlayerRecentMatches(player, matches) {
  return matches
    .filter((match) => match.status === "completed")
    .map((match) => {
      const events = match.commentary || match.balls || [];
      const playerEvents = events.filter(
        (ball) =>
          ball.before?.battingTeam === player.teamName &&
          ball.striker === player.playerName
      );

      if (!playerEvents.length) return null;

      const runs = playerEvents.reduce(
        (total, ball) => total + (ball.batterRuns || 0),
        0
      );
      const balls = playerEvents.filter((ball) => ball.isLegalDelivery).length;
      const opponent =
        match.teamA === player.teamName
          ? match.teamB
          : match.teamA;

      return {
        matchId: match.id,
        opponent,
        date: match.date,
        runs,
        balls,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 5);
}

export function getPlayerOfMatchHistory(player, matches) {
  return matches
    .filter(
      (match) =>
        match.status === "completed" &&
        match.playerOfMatch?.playerName === player.playerName &&
        match.playerOfMatch?.teamName === player.teamName
    )
    .map((match) => ({
      matchId: match.id,
      opponent:
        match.teamA === player.teamName
          ? match.teamB
          : match.teamA,
      date: match.date,
      result: match.result,
    }));
}
