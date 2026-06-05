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
import { updatePointsTable } from "@/Lib/pointsTable";
import { updatePlayerStats } from "@/services/playerStatsService";
import { getSettings } from "@/services/SettingServices";
import { calculatePlayerOfMatch } from "@/utils/playerOfMatchUtils";

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

  await updateDoc(
    matchRef,
    data
  );

  if (data.status === "completed") {
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
  }
}

export function subscribeToMatch(
  matchId,
  callback,
  onError
) {
  return onSnapshot(
    doc(db, "matches", matchId),
    (snapshot) => {
      callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
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
      if (onError) {
        onError(error);
      }
    }
  );
}

export async function getMatches() {
  const snapshot = await getDocs(
    collection(db, "matches")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function deleteMatch(
  matchId
) {
  await deleteDoc(
    doc(db, "matches", matchId)
  );
}
