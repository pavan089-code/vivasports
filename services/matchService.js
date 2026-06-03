import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
} from "firebase/firestore";

import {
  getDocs,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

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
  await updateDoc(
    doc(db, "matches", matchId),
    data
  );
}

export function subscribeToMatch(
  matchId,
  callback
) {
  return onSnapshot(
    doc(db, "matches", matchId),
    (snapshot) => {
      callback(snapshot.data());
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