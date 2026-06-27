"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import TournamentCard from "@/components/home/TournamentCard";
import TournamentTabs, { type TournamentTab } from "@/components/home/TournamentTabs";
import { subscribeToTournaments, type Tournament } from "@/services/tournamentService";

export default function TournamentSection() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTab, setActiveTab] = useState<TournamentTab>("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const unsubscribe = subscribeToTournaments(
      (items) => {
        setTournaments(items);
        setHasError(false);
        setIsLoading(false);
      },
      () => {
        setHasError(true);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const hasLiveTournaments = tournaments.some((tournament) => tournament.status === "live");
  const visibleTournaments = useMemo(
    () => tournaments.filter((tournament) => tournament.status === activeTab),
    [activeTab, tournaments],
  );

  return (
    <motion.section
      aria-labelledby="tournaments-title"
      className="bg-[#07152e] py-16 md:py-24"
      initial={false}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={prefersReducedMotion ? undefined : { opacity: [0, 1], y: [18, 0] }}
    >
      <div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black tracking-[0.22em] text-[#d4af37] uppercase">Competitions</p>
          <h2 className="mt-3 text-4xl leading-none font-black tracking-[-0.035em] text-white uppercase md:text-6xl" id="tournaments-title">Our Tournaments</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
            Discover every Viva Sports tournament—from upcoming editions to live competitions and past champions.
          </p>
        </div>

        <div className="mt-9 flex justify-center md:mt-11">
          <TournamentTabs activeTab={activeTab} hasLiveTournaments={hasLiveTournaments} onChange={setActiveTab} />
        </div>

        <div aria-labelledby={`tournament-tab-${activeTab}`} className="mt-9 md:mt-12" id="tournament-panel" role="tabpanel">
          {isLoading ? (
            <TournamentSkeleton />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-3"
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                key={activeTab}
                transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
              >
                {visibleTournaments.map((tournament, index) => (
                  <TournamentCard index={index} key={tournament.id} tournament={tournament} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoading && visibleTournaments.length === 0 && (
            <div className="rounded-3xl border border-white/8 bg-[#0d1d3a] px-6 py-12 text-center">
              <Trophy aria-hidden="true" className="mx-auto size-9 text-[#d4af37]" />
              <h3 className="mt-5 text-xl font-black text-white uppercase">
                {hasError ? "Tournament data is temporarily unavailable" : `No ${activeTab === "live" && !hasLiveTournaments ? "current" : activeTab} tournaments`}
              </h3>
              <p className="mt-2 text-sm text-slate-400">Tournament details will appear here as soon as they are published.</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function TournamentSkeleton() {
  return (
    <div aria-label="Loading tournaments" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div className="overflow-hidden rounded-2xl border border-white/6 bg-[#0d1d3a] p-3" key={index}>
          <div className="aspect-video animate-pulse rounded-xl bg-white/6" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-white/8" />
            <div className="h-7 w-4/5 animate-pulse rounded bg-white/8" />
            <div className="h-24 animate-pulse rounded-xl bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
