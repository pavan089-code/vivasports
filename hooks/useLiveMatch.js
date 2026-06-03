"use client";

import { useEffect, useState } from "react";

import {
  ref,
  onValue
} from "firebase/database";

import { db } from "@/lib/firebase";

export default function useMatch(matchId) {

  const [match, setMatch] = useState(null);

  useEffect(() => {

    if (!matchId) return;

    const matchRef = ref(
      db,
      `matches/${matchId}`
    );

    const unsubscribe = onValue(
      matchRef,
      (snapshot) => {

        if (snapshot.exists()) {

          setMatch({
            id: matchId,
            ...snapshot.val()
          });

        }

      }
    );

    return () => unsubscribe();

  }, [matchId]);

  return match;
}