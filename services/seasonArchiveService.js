import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/Lib/firebase";

export async function getSeasonArchives() {
  try {
    const snapshot = await getDocs(collection(db, "seasons"));
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}
