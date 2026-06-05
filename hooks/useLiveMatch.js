"use client";

import { useEffect, useState } from "react";

import { subscribeToMatch } from "@/services/matchService";

export default function useLiveMatch(matchId) {
  const [state, setState] = useState({
    match: null,
    matchId,
  });

  useEffect(() => {
    if (!matchId) {
      return undefined;
    }

    const unsubscribe = subscribeToMatch(matchId, (data) => {
      setState({
        match: data,
        matchId,
      });
    });

    return () => unsubscribe();
  }, [matchId]);

  return state.matchId === matchId ? state.match : null;
}
