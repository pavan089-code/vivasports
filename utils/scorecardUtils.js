import { calculateOvers } from "@/utils/matchUtils";
import {
  calculateInningsAnalytics,
  calculatePartnerships,
  formatDismissal,
  getBestPartnership,
} from "@/utils/cricketIntelligenceUtils";

function getStrikeRate(runs, balls) {
  return balls ? Number(((runs / balls) * 100).toFixed(2)) : 0;
}

function getEconomy(runs, balls) {
  return balls ? Number((runs / (balls / 6)).toFixed(2)) : 0;
}

function createInnings(inningsNumber, battingTeam, bowlingTeam) {
  return {
    inningsNumber,
    battingTeam,
    bowlingTeam,
    score: 0,
    wickets: 0,
    batting: new Map(),
    bowling: new Map(),
    extras: {
      wides: 0,
      noBalls: 0,
      byes: 0,
      legByes: 0,
    },
    fallOfWickets: [],
    events: [],
  };
}

function getInningsKey(ball) {
  const inningsNumber = ball.before?.innings || 1;
  const battingTeam = ball.before?.battingTeam || "Batting Team";

  return `${inningsNumber}-${battingTeam}`;
}

function ensureBatter(innings, playerName) {
  if (!innings.batting.has(playerName)) {
    innings.batting.set(playerName, {
      playerName,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
    });
  }

  return innings.batting.get(playerName);
}

function ensureBowler(innings, playerName) {
  if (!innings.bowling.has(playerName)) {
    innings.bowling.set(playerName, {
      playerName,
      balls: 0,
      overs: "0.0",
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
      overRuns: new Map(),
    });
  }

  return innings.bowling.get(playerName);
}

function updateExtras(innings, ball) {
  const label = String(ball.label || "");

  if (label.startsWith("WD")) {
    innings.extras.wides += ball.runs || 0;
    return;
  }

  if (label.startsWith("NB")) {
    innings.extras.noBalls += Math.max(
      (ball.runs || 0) - (ball.batterRuns || 0),
      0
    );
    return;
  }

  if (label.startsWith("LB")) {
    innings.extras.legByes += ball.runs || 0;
    return;
  }

  if (label.startsWith("B")) {
    innings.extras.byes += ball.runs || 0;
  }
}

function updateMaidenTracker(bowler, ball) {
  if (!ball.isLegalDelivery) return;

  const overNumber = Math.floor((ball.before?.totalBalls || 0) / 6);
  const current = bowler.overRuns.get(overNumber) || {
    legalBalls: 0,
    runs: 0,
  };

  bowler.overRuns.set(overNumber, {
    legalBalls: current.legalBalls + 1,
    runs: current.runs + (ball.bowlerRuns || 0),
  });
}

export function buildScorecard(match) {
  const events = match.commentary || match.balls || [];
  const inningsMap = new Map();

  events.forEach((ball) => {
    const inningsKey = getInningsKey(ball);
    const inningsNumber = ball.before?.innings || 1;
    const battingTeam = ball.before?.battingTeam || "Batting Team";
    const bowlingTeam = ball.before?.bowlingTeam || "Bowling Team";

    if (!inningsMap.has(inningsKey)) {
      inningsMap.set(
        inningsKey,
        createInnings(inningsNumber, battingTeam, bowlingTeam)
      );
    }

    const innings = inningsMap.get(inningsKey);

    innings.events.push(ball);
    innings.score += ball.runs || 0;
    updateExtras(innings, ball);

    if (ball.striker) {
      const batter = ensureBatter(innings, ball.striker);
      const batterRuns = ball.batterRuns || 0;

      batter.runs += batterRuns;
      batter.balls += ball.isLegalDelivery ? 1 : 0;
      batter.fours += batterRuns === 4 ? 1 : 0;
      batter.sixes += batterRuns === 6 ? 1 : 0;
      batter.strikeRate = getStrikeRate(batter.runs, batter.balls);
    }

    if (ball.bowler) {
      const bowler = ensureBowler(innings, ball.bowler);

      bowler.balls += ball.isLegalDelivery ? 1 : 0;
      bowler.overs = calculateOvers(bowler.balls);
      bowler.runsConceded += ball.bowlerRuns || 0;
      bowler.wickets += ball.type === "wicket" ? 1 : 0;
      bowler.economy = getEconomy(bowler.runsConceded, bowler.balls);
      updateMaidenTracker(bowler, ball);
    }

    if (ball.type === "wicket") {
      innings.wickets += 1;
      innings.fallOfWickets.push({
        score: innings.score,
        wicket: innings.wickets,
        batter: ball.striker,
        over: ball.over,
        dismissal: formatDismissal(ball),
      });
    }
  });

  const innings = [...inningsMap.values()]
    .sort((a, b) => a.inningsNumber - b.inningsNumber)
    .map((item) => {
      const bowling = [...item.bowling.values()].map((bowler) => {
        const maidens = [...bowler.overRuns.values()].filter(
          (over) => over.legalBalls === 6 && over.runs === 0
        ).length;

        return {
          ...bowler,
          maidens,
          overRuns: undefined,
        };
      });

      return {
        ...item,
        batting: [...item.batting.values()].sort((a, b) => b.runs - a.runs),
        bowling: bowling.sort((a, b) => b.wickets - a.wickets),
        partnerships: calculatePartnerships(item.events),
        bestPartnership: getBestPartnership(calculatePartnerships(item.events)),
        analytics: calculateInningsAnalytics(item.events, match.oversLimit || 20),
        events: undefined,
      };
    });

  const allBatters = innings.flatMap((item) =>
    item.batting.map((batter) => ({
      ...batter,
      teamName: item.battingTeam,
    }))
  );
  const allBowlers = innings.flatMap((item) =>
    item.bowling.map((bowler) => ({
      ...bowler,
      teamName: item.bowlingTeam,
    }))
  );

  const topBatter = [...allBatters].sort((a, b) => {
    if (b.runs !== a.runs) return b.runs - a.runs;
    return b.strikeRate - a.strikeRate;
  })[0];
  const topBowler = [...allBowlers].sort((a, b) => {
    if (b.wickets !== a.wickets) return b.wickets - a.wickets;
    return a.economy - b.economy;
  })[0];

  return {
    innings,
    topBatter,
    topBowler,
  };
}
