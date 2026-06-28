import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import {
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/Lib/firebase";

export async function createTeam(data) {
  const docRef = await addDoc(
    collection(db, "teams"),
    {
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      points: 0,
      runsFor: 0,
      ballsFaced: 0,
      oversFaced: "0.0",
      runsAgainst: 0,
      ballsBowled: 0,
      oversBowled: "0.0",
      nrr: 0,

      createdAt: Date.now(),

      ...data,
    }
  );

  return docRef.id;
}

export async function getTeams() {
  try {
    const snapshot = await getDocs(collection(db, "teams"));
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

export async function updateTeam(
  teamId,
  data
) {
  await updateDoc(
    doc(db, "teams", teamId),
    data
  );
}

export async function updateTeamByName(
  teamName,
  data
) {
  let snapshot;
  try {
    snapshot = await getDocs(collection(db, "teams"));
  } catch {
    return;
  }

  const teamDoc =
    snapshot.docs.find(
      (doc) =>
        doc.data().name === teamName
    );

  if (!teamDoc) return;

  await updateDoc(
    doc(db, "teams", teamDoc.id),
    data
  );
}

export function subscribeToTeams(callback, onError) {
  return onSnapshot(
    collection(db, "teams"),
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
