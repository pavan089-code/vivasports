import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/Lib/firebase";

export async function getAboutSettings() {
  try {
    const snapshot = await getDoc(doc(db, "settings", "about"));
    return snapshot.exists() ? snapshot.data() : null;
  } catch {
    return null;
  }
}

export async function saveAboutSettings(data) {
  await setDoc(doc(db, "settings", "about"), { ...data, updatedAt: Date.now() }, { merge: true });
}

export function subscribeToOrganizationCollection(collectionName, callback, onError) {
  return onSnapshot(collection(db, collectionName), (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  }, (error) => {
    callback([]);
    if (onError) onError(error);
  });
}

export async function createOrganizationItem(collectionName, data) {
  return addDoc(collection(db, collectionName), { ...data, createdAt: Date.now(), updatedAt: Date.now() });
}

export async function updateOrganizationItem(collectionName, id, data) {
  return updateDoc(doc(db, collectionName, id), { ...data, updatedAt: Date.now() });
}

export async function deleteOrganizationItem(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id));
}
