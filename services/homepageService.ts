import { collection, doc, getDoc, getDocs, type DocumentData } from "firebase/firestore";

import type { Sponsor } from "@/Lib/sponsors";
import { db } from "@/Lib/firebase";
import { getTopAllRounders, getTopBatters, getTopBowlers } from "@/utils/leaderboardUtils";
import { getHallOfFame } from "@/utils/prestigeRankingsUtils";
import { buildScorecard } from "@/utils/scorecardUtils";
import { rankTeams, sortRecentMatches } from "@/utils/tournamentUtils";

export type HomepageRecord = { id: string; [key: string]: unknown };
export type HomepageTournament = HomepageRecord & {
  title?: string; edition?: string; status?: string; city?: string; startDate?: string;
  teams?: number | string; subtitle?: string; trophyName?: string;
};
export type HomepageMatch = HomepageRecord & {
  status?: string; teamA?: string; teamB?: string; tournamentId?: string;
  date?: string; time?: string; ground?: string; result?: string;
};
export type HomepageTeam = HomepageRecord & {
  name?: string; played?: number; won?: number; points?: number; nrr?: number;
};
export type HomepagePlayer = HomepageRecord & {
  playerName?: string; teamName?: string; runs?: number; wickets?: number; sixes?: number;
};
export type HomepageSponsor = Partial<Sponsor> & HomepageRecord & { logo?: string; image?: string };
export type HomepageStatistics = {
  topRunScorer?: HomepagePlayer;
  topWicketTaker?: HomepagePlayer;
  bestAllRounder?: HomepagePlayer;
  highestTeamScore?: { name?: string; value?: number };
  mostSixes?: HomepagePlayer;
  fastestFifty?: { playerName?: string; teamName?: string; balls?: number };
} | null;
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
  standings: HomepageTeam[];
  statistics: HomepageStatistics;
  gallery: HomepageRecord[];
  sponsors: HomepageSponsor[];
  legacy: HomepageLegacy;
  announcements: HomepageRecord[];
  about: HomepageRecord | null;
  metrics: { tournaments: number; teams: number; players: number };
};

const emptyHomepageData: HomepageData = {
  tournaments: [], matches: [], liveMatches: [], upcomingMatches: [], recentResults: [],
  standings: [], statistics: null, gallery: [], sponsors: [],
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
    const typedTeams = teams as HomepageTeam[];
    const typedTournaments = tournaments as HomepageTournament[];
    const tournament = typedTournaments.find((item) => item.status === "live") ?? typedTournaments.find((item) => item.status === "upcoming");
    const linkedMatches = tournament ? typedMatches.filter((match) => match.tournamentId === tournament.id) : [];
    const tournamentMatches = linkedMatches.length ? linkedMatches : typedMatches;
    const liveMatches = tournamentMatches.filter((match) => ["live", "paused", "innings_break"].includes(match.status ?? ""));
    const upcomingMatches = tournamentMatches.filter((match) => match.status === "scheduled").slice(0, 3);
    const recentResults = sortRecentMatches(tournamentMatches.filter((match) => ["completed", "abandoned"].includes(match.status ?? ""))).slice(0, 3) as HomepageMatch[];

    return {
      tournament,
      tournaments: typedTournaments,
      matches: typedMatches,
      liveMatches,
      upcomingMatches,
      recentResults,
      standings: rankTeams(typedTeams).slice(0, 5) as HomepageTeam[],
      statistics: buildStatistics(typedPlayers, typedMatches),
      gallery,
      sponsors: remoteSponsors.length ? remoteSponsors as HomepageSponsor[] : fallbackSponsors.map((item) => ({ ...item })),
      legacy: {
        champions,
        history,
        hall: typedPlayers.length || typedMatches.length ? getHallOfFame(typedPlayers, typedMatches) : null,
      },
      announcements,
      about,
      metrics: { tournaments: typedTournaments.length, teams: typedTeams.length, players: typedPlayers.length },
    };
  } catch {
    return { ...emptyHomepageData, sponsors: fallbackSponsors.map((item) => ({ ...item })) };
  }
}

function buildStatistics(players: HomepagePlayer[], matches: HomepageMatch[]): HomepageStatistics {
  if (!players.length && !matches.length) return null;
  try {
    const innings = matches
      .filter((match) => match.status === "completed")
      .flatMap((match) => buildScorecard(match as DocumentData).innings);
    const highest = [...innings].sort((a, b) => b.score - a.score)[0];
    const fastest = innings
      .flatMap((item) => item.batting.map((player: { playerName?: string; runs: number; balls: number }) => ({ ...player, teamName: item.battingTeam })))
      .filter((player) => player.runs >= 50)
      .sort((a, b) => a.balls - b.balls)[0];
    return {
      topRunScorer: getTopBatters(players)[0],
      topWicketTaker: getTopBowlers(players)[0],
      bestAllRounder: getTopAllRounders(players)[0],
      highestTeamScore: highest ? { name: highest.battingTeam, value: highest.score } : undefined,
      mostSixes: [...players].sort((a, b) => (b.sixes || 0) - (a.sixes || 0))[0],
      fastestFifty: fastest,
    };
  } catch {
    return null;
  }
}
