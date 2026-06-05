"use client";

import { useEffect, useState } from "react";

import { subscribeToMatch } from "@/services/matchService";

export default function useMatch(matchId) {
  const [state, setState] = useState({
    error: null,
    loading: Boolean(matchId),
    match: null,
    matchId,
  });

  useEffect(() => {
    if (!matchId) {
      return undefined;
    }

    const unsubscribe = subscribeToMatch(
      matchId,
      (data) => {
        setState({
          error: null,
          loading: false,
          match: data,
          matchId,
        });
      },
      (subscriptionError) => {
        setState({
          error: subscriptionError,
          loading: false,
          match: null,
          matchId,
        });
      }
    );

    return () => unsubscribe();
  }, [matchId]);

  const isCurrentMatch = state.matchId === matchId;

  return {
    match: matchId && isCurrentMatch ? state.match : null,
    loading: matchId ? !isCurrentMatch || state.loading : false,
    error: isCurrentMatch ? state.error : null,
  };
}
