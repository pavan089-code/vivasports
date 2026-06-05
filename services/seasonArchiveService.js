import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/Lib/firebase";

export async function getSeasonArchives() {
  const snapshot = await getDocs(collection(db, "seasons"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
