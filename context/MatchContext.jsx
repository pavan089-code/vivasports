"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

const MatchContext = createContext();

export function MatchProvider({ children }) {

  const [match, setMatch] = useState({
    battingTeam: "Royal Kings",
    bowlingTeam: "Warriors XI",

    score: 156,
    wickets: 4,

    overs: 17,
    balls: 2,

    striker: "Rahul",
    nonStriker: "Arjun",

    bowler: "Karan",

    currentOver: ["1", "4"],

    status: "LIVE",
  });

  return (
    <MatchContext.Provider
      value={{
        match,
        setMatch,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  return useContext(MatchContext);
}