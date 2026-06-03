import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function getSettings() {
  const snapshot = await getDoc(
    doc(
      db,
      "settings",
      "tournament"
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
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
    data
  );
}