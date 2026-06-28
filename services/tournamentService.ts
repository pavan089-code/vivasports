import { collection, onSnapshot, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";

import { db } from "@/Lib/firebase";

export type TournamentStatus = "upcoming" | "live" | "completed";

export type Tournament = {
  id: string;
  title: string;
  edition: string;
  status: TournamentStatus;
  poster: string;
  city: string;
  startDate: string;
  endDate: string;
  prizePool: string;
  teams: number | string;
  buttonText: string;
  buttonLink: string;
  subtitle?: string;
  trophyName?: string;
};

function toStringValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  if (value && typeof value === "object" && "toDate" in value) {
    const timestamp = value as { toDate: () => Date };
    return timestamp.toDate().toISOString();
  }

  return "";
}

function mapTournament(snapshot: QueryDocumentSnapshot<DocumentData>): Tournament | null {
  const data = snapshot.data();
  const status = String(data.status ?? "").toLowerCase();

  if (!data.title || !["upcoming", "live", "completed"].includes(status)) return null;

  return {
    id: snapshot.id,
    title: String(data.title),
    edition: toStringValue(data.edition),
    status: status as TournamentStatus,
    poster: toStringValue(data.poster),
    city: toStringValue(data.city),
    startDate: toStringValue(data.startDate),
    endDate: toStringValue(data.endDate),
    prizePool: toStringValue(data.prizePool),
    teams: typeof data.teams === "number" ? data.teams : toStringValue(data.teams),
    buttonText: toStringValue(data.buttonText),
    buttonLink: toStringValue(data.buttonLink),
    subtitle: toStringValue(data.subtitle) || undefined,
    trophyName: toStringValue(data.trophyName) || undefined,
  };
}

export function subscribeToTournaments(
  onData: (tournaments: Tournament[]) => void,
  onError?: (error: Error) => void,
) {
  return onSnapshot(
    collection(db, "tournaments"),
    (snapshot) => {
      const tournaments = snapshot.docs
        .map(mapTournament)
        .filter((tournament): tournament is Tournament => tournament !== null);
      onData(tournaments);
    },
    (error) => {
      onData([]);
      onError?.(error);
    },
  );
}
