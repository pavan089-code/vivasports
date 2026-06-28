"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useMemo, useState } from "react";

import TournamentCard from "@/components/home/TournamentCard";
import TournamentTabs, { type TournamentTab } from "@/components/home/TournamentTabs";
import type { HomepageData } from "@/services/homepageService";
import type { Tournament, TournamentStatus } from "@/services/tournamentService";

export default function TournamentSection({ data }: { data: HomepageData | null }) {
  const [activeTab, setActiveTab] = useState<TournamentTab>("current");
  const prefersReducedMotion = useReducedMotion();
  const tournaments = useMemo(() => {
    const firestoreTournaments = (data?.tournaments ?? []).map(toTournament).filter((item): item is Tournament => Boolean(item));
    return firestoreTournaments.length ? firestoreTournaments : fallbackTournaments;
  }, [data]);
  const visibleTournaments = useMemo(
    () => tournaments.filter((tournament) => tabForStatus(tournament.status) === activeTab),
    [activeTab, tournaments],
  );

  return (
    <motion.section
      aria-labelledby="tournaments-title"
      className="bg-[#07152e] py-14 md:py-16 lg:py-20"
      initial={false}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={prefersReducedMotion ? undefined : { opacity: [0, 1], y: [18, 0] }}
    >
      <div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black tracking-[0.22em] text-[#d4af37] uppercase">Competitions</p>
          <h2 className="mt-3 text-4xl leading-none font-black tracking-[-0.035em] text-white uppercase md:text-6xl" id="tournaments-title">Our Tournaments</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">Explore every tournament organised by Viva Sports.</p>
        </div>

        <div className="mt-8 flex justify-center">
          <TournamentTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div aria-labelledby={`tournament-tab-${activeTab}`} className="mt-8" id="tournament-panel" role="tabpanel">
          {activeTab === "past" && <h3 className="mb-6 text-xl font-black text-white uppercase md:text-2xl">Previous Tournaments</h3>}
          <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-3"
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                key={activeTab}
                transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
              >
                {visibleTournaments.map((tournament, index) => {
                  const tournamentMatches = (data?.liveMatches ?? []).filter((match) => match.tournamentId === tournament.id);
                  const featuredMatch = tournamentMatches.find((match) => match.featured) ?? tournamentMatches[0];
                  return <TournamentCard featuredMatch={tournamentMatches.length > 1 && featuredMatch ? `${featuredMatch.teamA || "Team A"} vs ${featuredMatch.teamB || "Team B"}` : undefined} index={index} key={tournament.id} tournament={tournament} />;
                })}
              </motion.div>
          </AnimatePresence>

          {visibleTournaments.length === 0 && (
            <div className="rounded-3xl border border-white/8 bg-[#0d1d3a] px-6 py-12 text-center">
              <Trophy aria-hidden="true" className="mx-auto size-9 text-[#d4af37]" />
              <h3 className="mt-5 text-xl font-black text-white uppercase">No {activeTab} tournaments</h3>
              <p className="mt-2 text-sm text-slate-400">Tournament details will appear here as soon as they are published.</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function tabForStatus(status: TournamentStatus): TournamentTab {
  if (status === "live") return "current";
  if (status === "completed") return "past";
  return "upcoming";
}

function toTournament(item: HomepageData["tournaments"][number]): Tournament | null {
  const rawStatus = String(item.status || "").toLowerCase();
  const status = rawStatus === "current" || rawStatus === "active" ? "live" : rawStatus === "past" ? "completed" : rawStatus;
  if (!item.title || !["live", "upcoming", "completed"].includes(status)) return null;

  return {
    id: item.id,
    title: item.title,
    edition: String(item.edition || "Viva Sports"),
    status: status as TournamentStatus,
    poster: String(item.poster || "/highlights/match-night.png"),
    city: String(item.city || ""),
    startDate: String(item.startDate || ""),
    endDate: String(item.endDate || ""),
    prizePool: String(item.prizePool || ""),
    teams: item.teams || "",
    buttonText: String(item.buttonText || "View tournament"),
    buttonLink: String(item.buttonLink || "/seasons"),
    subtitle: item.subtitle,
    trophyName: item.trophyName,
    winner: item.winner,
    runnerUp: item.runnerUp,
    playerOfTournament: item.playerOfTournament,
    registrationOpen: Boolean(item.registrationOpen),
    registrationStatus: item.registrationStatus,
    youtubeHighlights: item.youtubeHighlights,
    livestream: item.livestream,
  };
}

const fallbackTournaments: Tournament[] = [
  {
    id: "united-cricket-fest-2026",
    title: "United Cricket Fest 2026",
    edition: "2026 Edition",
    status: "live",
    poster: "/highlights/match-night.png",
    city: "Quad Arena",
    startDate: "2026-07-10",
    endDate: "2026-07-25",
    prizePool: "₹3,33,333",
    teams: "",
    buttonText: "Watch Live",
    buttonLink: "/seasons",
    livestream: "/live",
  },
  {
    id: "viva-premier-league-2026",
    title: "Viva Premier League 2026",
    edition: "2026 Edition",
    status: "upcoming",
    poster: "/highlights/champions.png",
    city: "LB Nagar Cricket Ground",
    startDate: "2026-08-15",
    endDate: "2026-08-28",
    prizePool: "₹2,50,000",
    teams: "",
    buttonText: "Register Team",
    buttonLink: "/seasons",
    registrationOpen: true,
    registrationStatus: "Registration Open",
  },
  {
    id: "hyderabad-night-league-2026",
    title: "Hyderabad Night League",
    edition: "2026 Edition",
    status: "upcoming",
    poster: "/highlights/match-night.png",
    city: "Hyderabad",
    startDate: "2026-09-05",
    endDate: "2026-09-18",
    prizePool: "₹1,50,000",
    teams: "",
    buttonText: "Register Team",
    buttonLink: "/seasons",
    registrationOpen: false,
    registrationStatus: "Registration Opens Soon",
  },
  {
    id: "united-cricket-fest-2025",
    title: "United Cricket Fest 2025",
    edition: "2025 Edition",
    status: "completed",
    poster: "/highlights/champions.png",
    city: "Hyderabad",
    startDate: "2025-07-10",
    endDate: "2025-07-25",
    prizePool: "",
    teams: "",
    buttonText: "Watch Highlights",
    buttonLink: "/seasons",
    winner: "Moosarambagh Marcos",
    runnerUp: "United Nalgonda",
    playerOfTournament: "Santhosh",
    youtubeHighlights: "/gallery",
  },
  {
    id: "viva-t20-2024",
    title: "Viva T20 2024",
    edition: "2024 Edition",
    status: "completed",
    poster: "/highlights/match-night.png",
    city: "Hyderabad",
    startDate: "2024-08-12",
    endDate: "2024-08-25",
    prizePool: "",
    teams: "",
    buttonText: "Watch Highlights",
    buttonLink: "/seasons",
    winner: "Chikkadpally Cheetahs",
    runnerUp: "Bharath Nagar",
    playerOfTournament: "Akshay Kumar Katapally",
    youtubeHighlights: "/gallery",
  },
  {
    id: "viva-premier-cup-2023",
    title: "Viva Premier Cup 2023",
    edition: "2023 Edition",
    status: "completed",
    poster: "/highlights/champions.png",
    city: "Hyderabad",
    startDate: "2023-09-08",
    endDate: "2023-09-20",
    prizePool: "",
    teams: "",
    buttonText: "Watch Highlights",
    buttonLink: "/seasons",
    winner: "Sangareddy District Central Sangam",
    runnerUp: "Eagles XI",
    playerOfTournament: "Rahul Kumar",
    youtubeHighlights: "/gallery",
  },
];
