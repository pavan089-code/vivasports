export function formatDismissal(ball) {
  const type = ball.dismissalType || "bowled";
  const bowler = ball.bowler || "";
  const fielder = ball.fielder || "";

  if (type === "caught") return `c ${fielder || "-"} b ${bowler}`;
  if (type === "lbw") return `lbw ${bowler}`;
  if (type === "run_out") return `run out ${fielder || "-"}`;
  if (type === "stumped") return `st ${fielder || "-"} b ${bowler}`;
  if (type === "hit_wicket") return `hit wicket b ${bowler}`;

  return `b ${bowler}`;
}

export function getAchievements(player, awardsCount = 0) {
  const achievements = [];

  if ((player.highestScore || 0) >= 50) achievements.push("50+");
  if ((player.highestScore || 0) >= 100) achievements.push("100+");
  if ((player.wickets || 0) >= 3) achievements.push("3 Wicket Haul");
  if ((player.wickets || 0) >= 5) achievements.push("5 Wicket Haul");
  if (awardsCount > 0) achievements.push("Player Of Match");

  return achievements;
}

export function calculatePartnerships(events) {
  const partnerships = [];
  let current = null;

  events.forEach((ball) => {
    const striker = ball.before?.striker?.name || ball.striker;
    const nonStriker = ball.before?.nonStriker?.name;

    if (!striker || !nonStriker) return;

    const batters = [striker, nonStriker].sort();
    const key = batters.join("|");

    if (!current || current.key !== key) {
      if (current) partnerships.push(current);
      current = {
        key,
        batterA: batters[0],
        batterB: batters[1],
        runs: 0,
        balls: 0,
      };
    }

    current.runs += ball.runs || 0;
    current.balls += ball.isLegalDelivery ? 1 : 0;

    if (ball.type === "wicket") {
      partnerships.push(current);
      current = null;
    }
  });

  if (current) partnerships.push(current);

  return partnerships;
}

export function getBestPartnership(partnerships) {
  return [...partnerships].sort((a, b) => {
    if (b.runs !== a.runs) return b.runs - a.runs;
    return b.balls - a.balls;
  })[0];
}

function createPhase() {
  return {
    runs: 0,
    wickets: 0,
    balls: 0,
    runRate: 0,
  };
}

function getPhaseName(ball, oversLimit = 20) {
  const over = Math.floor((ball.before?.totalBalls || 0) / 6);

  if (over < 6) return "powerplay";
  if (over >= Math.max(oversLimit - 4, 6)) return "death";
  return "middle";
}

export function calculateInningsAnalytics(events, oversLimit) {
  const phases = {
    powerplay: createPhase(),
    middle: createPhase(),
    death: createPhase(),
  };

  events.forEach((ball) => {
    const phase = phases[getPhaseName(ball, oversLimit)];

    phase.runs += ball.runs || 0;
    phase.wickets += ball.type === "wicket" ? 1 : 0;
    phase.balls += ball.isLegalDelivery ? 1 : 0;
  });

  Object.values(phases).forEach((phase) => {
    phase.runRate = phase.balls
      ? Number(((phase.runs * 6) / phase.balls).toFixed(2))
      : 0;
  });

  return phases;
}

export function getFastestMilestone(scorecards, targetRuns) {
  const candidates = [];

  scorecards.forEach(({ match, scorecard }) => {
    scorecard.innings.forEach((innings) => {
      innings.batting.forEach((batter) => {
        if (batter.runs >= targetRuns) {
          candidates.push({
            matchId: match.id,
            playerName: batter.playerName,
            teamName: innings.battingTeam,
            runs: batter.runs,
            balls: batter.balls,
          });
        }
      });
    });
  });

  return candidates.sort((a, b) => a.balls - b.balls)[0];
}
