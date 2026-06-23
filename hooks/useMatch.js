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

    console.info("[perf] useMatch subscribe", { matchId });
    const unsubscribe = subscribeToMatch(
      matchId,
      (data) => {
        console.time(`[perf] useMatch setState:${matchId}`);
        setState({
          error: null,
          loading: false,
          match: data,
          matchId,
        });
        console.timeEnd(`[perf] useMatch setState:${matchId}`);
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

    return () => {
      console.info("[perf] useMatch unsubscribe", { matchId });
      unsubscribe();
    };
  }, [matchId]);

  const isCurrentMatch = state.matchId === matchId;

  return {
    match: matchId && isCurrentMatch ? state.match : null,
    loading: matchId ? !isCurrentMatch || state.loading : false,
    error: isCurrentMatch ? state.error : null,
  };
}
