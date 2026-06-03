"use client";

import { useEffect, useState } from "react";

import { subscribeToMatch } from "@/services/matchService";

export default function useMatch(matchId) {
  const [match, setMatch] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;

    const unsubscribe = subscribeToMatch(
      matchId,
      (data) => {
        setMatch(data);

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [matchId]);

  return {
    match,
    loading,
  };
}