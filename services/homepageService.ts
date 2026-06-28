import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import type { Sponsor } from "@/Lib/sponsors";
import { db } from "@/Lib/firebase";
import { getHallOfFame } from "@/utils/prestigeRankingsUtils";
import { sortRecentMatches } from "@/utils/tournamentUtils";

export type HomepageRecord = { id: string; [key: string]: unknown };
export type HomepageTournament = HomepageRecord & {
  title?: string; edition?: string; status?: string; city?: string; startDate?: string;
  endDate?: string; poster?: string; prizePool?: string; teams?: number | string;
  subtitle?: string; trophyName?: string; buttonText?: string; buttonLink?: string;
  winner?: string; runnerUp?: string; playerOfTournament?: string;
  registrationOpen?: boolean; registrationStatus?: string;
  youtubeHighlights?: string; livestream?: string;
};
export type HomepageMatch = HomepageRecord & {
  status?: string; teamA?: string; teamB?: string; tournamentId?: string;
  date?: string; time?: string; ground?: string; result?: string;
  featured?: boolean;
};
export type HomepagePlayer = HomepageRecord & {
  playerName?: string; teamName?: string; runs?: number; wickets?: number; sixes?: number;
};
export type HomepageStatistics = {
  topRunScorer?: HomepagePlayer;
  topWicketTaker?: HomepagePlayer;
  bestAllRounder?: HomepagePlayer;
  highestTeamScore?: { name?: string; value?: number };
  mostSixes?: HomepagePlayer;
  fastestFifty?: { playerName?: string; teamName?: string; balls?: number };
} | null;
export type HomepageSponsor = Partial<Sponsor> & HomepageRecord & { logo?: string; image?: string };
export type HomepageLegacy = {
  champions: HomepageRecord[];
  history: HomepageRecord[];
  hall: ReturnType<typeof getHallOfFame> | null;
};
export type HomepageData = {
  tournament?: HomepageTournament;
  tournaments: HomepageTournament[];
  matches: HomepageMatch[];
  liveMatches: HomepageMatch[];
  upcomingMatches: HomepageMatch[];
  recentResults: HomepageMatch[];
  gallery: HomepageRecord[];
  sponsors: HomepageSponsor[];
  legacy: HomepageLegacy;
  announcements: HomepageRecord[];
  about: HomepageRecord | null;
  metrics: { tournaments: number; teams: number; players: number };
};

const emptyHomepageData: HomepageData = {
  tournaments: [], matches: [], liveMatches: [], upcomingMatches: [], recentResults: [],
  gallery: [], sponsors: [],
  legacy: { champions: [], history: [], hall: null }, announcements: [], about: null,
  metrics: { tournaments: 0, teams: 0, players: 0 },
};

async function safeCollection(name: string): Promise<HomepageRecord[]> {
  try {
    const snapshot = await getDocs(collection(db, name));
    if (snapshot.empty) return [];
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch {
    // Optional homepage collections are allowed to be absent or unreadable.
    return [];
  }
}

async function safeDocument(collectionName: string, documentName: string): Promise<HomepageRecord | null> {
  try {
    const snapshot = await getDoc(doc(db, collectionName, documentName));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch {
    return null;
  }
}

export async function getHomepageData(fallbackSponsors: Sponsor[] = []): Promise<HomepageData> {
  try {
    const [matches, players, teams, tournaments, gallery, remoteSponsors, champions, history, announcements, about] = await Promise.all([
      safeCollection("matches"),
      safeCollection("playerStats"), // Leaderboards are derived from this existing statistics collection.
      safeCollection("teams"), // The points table is stored on team documents in the current data model.
      safeCollection("tournaments"),
      safeCollection("gallery"),
      safeCollection("sponsors"),
      safeCollection("champions"), // TODO: This automatically populates Viva Legacy when the optional collection is created.
      safeCollection("history"),
      safeCollection("announcements"),
      safeDocument("settings", "about"),
    ]);

    const typedMatches = matches as HomepageMatch[];
    const typedPlayers = players as HomepagePlayer[];
    const typedTournaments = tournaments as HomepageTournament[];
    const enrichedTournaments = typedTournaments.map((item) => enrichTournamentHonours(item, champions));
    const tournament = enrichedTournaments.find((item) => item.status === "live") ?? enrichedTournaments.find((item) => item.status === "upcoming");
    const linkedMatches = tournament ? typedMatches.filter((match) => match.tournamentId === tournament.id) : [];
    const tournamentMatches = linkedMatches.length ? linkedMatches : typedMatches;
    const liveMatches = tournamentMatches.filter((match) => ["live", "paused", "innings_break"].includes(match.status ?? ""));
    const upcomingMatches = tournamentMatches.filter((match) => match.status === "scheduled").slice(0, 3);
    const recentResults = sortRecentMatches(tournamentMatches.filter((match) => ["completed", "abandoned"].includes(match.status ?? ""))).slice(0, 3) as HomepageMatch[];

    return {
      tournament,
      tournaments: enrichedTournaments,
      matches: typedMatches,
      liveMatches,
      upcomingMatches,
      recentResults,
      gallery,
      sponsors: remoteSponsors.length ? remoteSponsors as HomepageSponsor[] : fallbackSponsors.map((item) => ({ ...item })),
      legacy: {
        champions,
        history,
        hall: typedPlayers.length || typedMatches.length ? getHallOfFame(typedPlayers, typedMatches) : null,
      },
      announcements,
      about,
      metrics: { tournaments: typedTournaments.length, teams: teams.length, players: typedPlayers.length },
    };
  } catch {
    return { ...emptyHomepageData, sponsors: fallbackSponsors.map((item) => ({ ...item })) };
  }
}

function enrichTournamentHonours(tournament: HomepageTournament, champions: HomepageRecord[]): HomepageTournament {
  if (tournament.winner || tournament.runnerUp || tournament.playerOfTournament) return tournament;
  const title = String(tournament.title || "").toLowerCase();
  const edition = String(tournament.edition || "").toLowerCase();
  const archived = champions.find((item) =>
    item.tournamentId === tournament.id ||
    String(item.tournamentName || "").toLowerCase() === title ||
    (edition && String(item.season || item.edition || "").toLowerCase() === edition),
  );
  if (!archived) return tournament;
  return {
    ...tournament,
    winner: String(archived.champion || archived.winner || ""),
    runnerUp: String(archived.runnerUp || archived.runner_up || ""),
    playerOfTournament: String(archived.playerOfTournament || archived.player_of_tournament || ""),
  };
}
