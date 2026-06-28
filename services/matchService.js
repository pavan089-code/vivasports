import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
} from "firebase/firestore";

import {
  getDocs,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/Lib/firebase";

export async function createMatch(data) {
  const docRef = await addDoc(
    collection(db, "matches"),
    {
      status: "scheduled",
      createdAt: Date.now(),
      ...data,
    }
  );

  return docRef.id;
}

export async function updateMatch(
  matchId,
  data
) {
  const matchRef = doc(db, "matches", matchId);
  const timerLabel = `[perf] updateMatch:${matchId}:${Date.now()}`;
  const payloadKeys = Object.keys(data || {});

  try {
    console.info("[perf] updateMatch payload", {
      matchId,
      keys: payloadKeys,
      jsonBytes: JSON.stringify(data || {}).length,
    });
  } catch {
    console.info("[perf] updateMatch payload", {
      matchId,
      keys: payloadKeys,
      jsonBytes: "unavailable",
    });
  }

  console.time(timerLabel);

  await updateDoc(
    matchRef,
    data
  );

  console.timeEnd(timerLabel);

  if (data.status === "completed") {
    const completionTimerLabel = `[perf] completion side effects:${matchId}:${Date.now()}`;
    console.time(completionTimerLabel);
    const { updatePointsTable } = await import("@/Lib/pointsTable");
    const { updatePlayerStats } = await import("@/services/playerStatsService");
    const { getSettings } = await import("@/services/SettingServices");
    const { calculatePlayerOfMatch } = await import("@/utils/playerOfMatchUtils");
    const settings = await getSettings();
    const automaticStandings = settings?.automaticStandings !== false;
    const snapshot = await getDoc(matchRef);
    const completedMatch = {
      id: matchId,
      ...snapshot.data(),
    };

    if (automaticStandings) {
      await updatePointsTable(
        completedMatch,
        {
          winner: completedMatch.winner,
          result: completedMatch.result,
        }
      );
    }

    await updatePlayerStats(completedMatch);

    if (!completedMatch.playerOfMatch) {
      const playerOfMatch = calculatePlayerOfMatch(completedMatch);

      if (playerOfMatch) {
        await updateDoc(matchRef, {
          playerOfMatch,
        });
      }
    }

    console.timeEnd(completionTimerLabel);
  }
}

export function subscribeToMatch(
  matchId,
  callback,
  onError
) {
  const listenerLabel = `[perf] subscribeToMatch:${matchId}:${Date.now()}`;
  console.info("[perf] subscribeToMatch start", { matchId });

  return onSnapshot(
    doc(db, "matches", matchId),
    (snapshot) => {
      console.time(listenerLabel);
      const data = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;

      if (data) {
        try {
          console.info("[perf] match snapshot", {
            matchId,
            jsonBytes: JSON.stringify(data).length,
            balls: data.balls?.length || 0,
            commentary: data.commentary?.length || 0,
          });
        } catch {
          console.info("[perf] match snapshot", {
            matchId,
            jsonBytes: "unavailable",
          });
        }
      }

      callback(data);
      console.timeEnd(listenerLabel);
    },
    (error) => {
      callback(null);
      if (onError) onError(error);
    }
  );
}

export function subscribeToMatches(callback, onError) {
  return onSnapshot(
    collection(db, "matches"),
    (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    },
    (error) => {
      callback([]);
      if (onError) onError(error);
    }
  );
}

export async function getMatches() {
  try {
    const snapshot = await getDocs(collection(db, "matches"));
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

export async function deleteMatch(
  matchId
) {
  await deleteDoc(
    doc(db, "matches", matchId)
  );
}
