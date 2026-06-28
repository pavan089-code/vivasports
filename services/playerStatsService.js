import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db } from "@/Lib/firebase";
import { calculateOvers } from "@/utils/matchUtils";

function getPlayerStatId(teamName, playerName) {
  return `${teamName}__${playerName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getMatchKey(match) {
  return String(
    match.id ||
      [match.createdAt, match.teamA, match.teamB, match.date, match.time]
        .filter(Boolean)
        .join("-")
  );
}

function createEmptyPlayerStat(teamName, playerName) {
  return {
    teamName,
    playerName,
    matches: 0,
    innings: 0,
    runs: 0,
    ballsFaced: 0,
    fours: 0,
    sixes: 0,
    highestScore: 0,
    strikeRate: 0,
    overs: "0.0",
    ballsBowled: 0,
    runsConceded: 0,
    wickets: 0,
    economy: 0,
    catches: 0,
    runOuts: 0,
    stumpings: 0,
    completedMatches: [],
    updatedAt: Date.now(),
  };
}

function getPlayersByTeam(match) {
  const playersByTeam = new Map();

  if (match.battingTeam) {
    playersByTeam.set(match.battingTeam, match.battingTeamPlayers || []);
  }

  if (match.bowlingTeam) {
    playersByTeam.set(match.bowlingTeam, match.bowlingTeamPlayers || []);
  }

  return playersByTeam;
}

function ensureMatchStat(statMap, teamName, playerName) {
  const key = `${teamName}::${playerName}`;

  if (!statMap.has(key)) {
    statMap.set(key, {
      teamName,
      playerName,
      played: true,
      innings: false,
      matchRuns: 0,
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

  return statMap.get(key);
}

function buildMatchPlayerStats(match) {
  const statMap = new Map();
  const playersByTeam = getPlayersByTeam(match);

  playersByTeam.forEach((players, teamName) => {
    players.forEach((playerName) => {
      ensureMatchStat(statMap, teamName, playerName);
    });
  });

  const events = match.commentary || match.balls || [];

  events.forEach((ball) => {
    const battingTeam = ball.before?.battingTeam;
    const bowlingTeam = ball.before?.bowlingTeam;
    const strikerName = ball.striker;
    const bowlerName = ball.bowler;

    if (battingTeam && strikerName) {
      const batter = ensureMatchStat(statMap, battingTeam, strikerName);
      const batterRuns = ball.batterRuns || 0;

      batter.innings = true;
      batter.matchRuns += batterRuns;
      batter.runs += batterRuns;
      batter.ballsFaced += ball.isLegalDelivery ? 1 : 0;
      batter.fours += batterRuns === 4 ? 1 : 0;
      batter.sixes += batterRuns === 6 ? 1 : 0;
    }

    if (bowlingTeam && bowlerName) {
      const bowler = ensureMatchStat(statMap, bowlingTeam, bowlerName);

      bowler.ballsBowled += ball.isLegalDelivery ? 1 : 0;
      bowler.runsConceded += ball.bowlerRuns || 0;
      bowler.wickets += ball.type === "wicket" ? 1 : 0;
    }

    if (bowlingTeam && ball.fielder) {
      const fielder = ensureMatchStat(statMap, bowlingTeam, ball.fielder);

      if (ball.dismissalType === "caught") {
        fielder.catches += 1;
      }

      if (ball.dismissalType === "run_out") {
        fielder.runOuts += 1;
      }

      if (ball.dismissalType === "stumped") {
        fielder.stumpings += 1;
      }
    }
  });

  return [...statMap.values()];
}

function mergePlayerStats(existing, matchStat, matchKey) {
  const matches = (existing.matches || 0) + 1;
  const innings = (existing.innings || 0) + (matchStat.innings ? 1 : 0);
  const runs = (existing.runs || 0) + matchStat.runs;
  const ballsFaced = (existing.ballsFaced || 0) + matchStat.ballsFaced;
  const ballsBowled = (existing.ballsBowled || 0) + matchStat.ballsBowled;
  const runsConceded = (existing.runsConceded || 0) + matchStat.runsConceded;

  return {
    teamName: matchStat.teamName,
    playerName: matchStat.playerName,
    matches,
    innings,
    runs,
    ballsFaced,
    fours: (existing.fours || 0) + matchStat.fours,
    sixes: (existing.sixes || 0) + matchStat.sixes,
    highestScore: Math.max(existing.highestScore || 0, matchStat.matchRuns),
    strikeRate: ballsFaced ? Number(((runs / ballsFaced) * 100).toFixed(2)) : 0,
    overs: calculateOvers(ballsBowled),
    ballsBowled,
    runsConceded,
    wickets: (existing.wickets || 0) + matchStat.wickets,
    economy: ballsBowled
      ? Number((runsConceded / (ballsBowled / 6)).toFixed(2))
      : 0,
    catches: (existing.catches || 0) + matchStat.catches,
    runOuts: (existing.runOuts || 0) + matchStat.runOuts,
    stumpings: (existing.stumpings || 0) + matchStat.stumpings,
    completedMatches: [...(existing.completedMatches || []), matchKey],
    updatedAt: Date.now(),
  };
}

export async function updatePlayerStats(match) {
  if (match.status !== "completed") return;

  const matchKey = getMatchKey(match);
  if (!matchKey) return;

  const matchStats = buildMatchPlayerStats(match);

  await Promise.all(
    matchStats.map(async (matchStat) => {
      const statId = getPlayerStatId(matchStat.teamName, matchStat.playerName);
      const statRef = doc(db, "playerStats", statId);
      const snapshot = await getDoc(statRef);
      const existing = snapshot.exists()
        ? snapshot.data()
        : createEmptyPlayerStat(matchStat.teamName, matchStat.playerName);

      if ((existing.completedMatches || []).includes(matchKey)) {
        return;
      }

      await setDoc(
        statRef,
        mergePlayerStats(existing, matchStat, matchKey)
      );
    })
  );
}

export async function getPlayerStats() {
  try {
    const snapshot = await getDocs(collection(db, "playerStats"));
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

export async function getPlayerStat(playerId) {
  try {
    const snapshot = await getDoc(doc(db, "playerStats", playerId));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch {
    return null;
  }
}

export async function getTeamPlayersStats(teamName) {
  const stats = await getPlayerStats();

  return stats.filter((player) => player.teamName === teamName);
}
