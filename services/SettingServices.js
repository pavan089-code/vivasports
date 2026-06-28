import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/Lib/firebase";

export async function getSettings() {
  try {
    const snapshot = await getDoc(doc(db, "settings", "tournament"));
    if (!snapshot.exists()) return null;
    return snapshot.data();
  } catch {
    return null;
  }
}

export async function saveSettings(
  data
) {
  await setDoc(
    doc(
      db,
      "settings",
      "tournament"
    ),
    data,
    {
      merge: true,
    }
  );
}
