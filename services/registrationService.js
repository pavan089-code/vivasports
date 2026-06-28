import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/Lib/firebase";

const REGISTRATIONS_COLLECTION = "tournamentRegistrations";

function normalizeError(error) {
  const code = error?.code || "unknown";
  return {
    code,
    message:
      code === "permission-denied"
        ? "Registration access is currently restricted."
        : error?.message || "Registration service is unavailable.",
  };
}

export async function createTournamentRegistration(data) {
  try {
    const docRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), {
      ...data,
      status: "Pending Verification",
      feeStatus: "Payment Pending",
      activity: ["Registration submitted"],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    throw normalizeError(error);
  }
}

export function subscribeToTournamentRegistrations(callback, onError) {
  return onSnapshot(
    collection(db, REGISTRATIONS_COLLECTION),
    (snapshot) => {
      callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    },
    (error) => {
      callback([]);
      if (onError) onError(normalizeError(error));
    }
  );
}

export async function updateTournamentRegistration(id, data) {
  try {
    await updateDoc(doc(db, REGISTRATIONS_COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getTournamentRegistration(id) {
  try {
    const snapshot = await getDoc(doc(db, REGISTRATIONS_COLLECTION, id));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  } catch {
    return null;
  }
}
