"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import Container from "../Layout/Container";
import SectionTitle from "../ui/SectionTitle";

import { subscribeToTeams } from "@/services/teamService";
import { rankTeams } from "@/utils/tournamentUtils";

const FullPointsTable = dynamic(() => import("@/components/home/FullPointsTable"), {
  loading: () => (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center text-[var(--text-secondary)]">
      Loading full table...
    </div>
  ),
});

export default function PointsTablePreview() {
  const [teams, setTeams] = useState([]);
  const [showFullMobileTable, setShowFullMobileTable] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToTeams((data) => {
      setTeams(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const syncDesktopState = () => setIsDesktop(mediaQuery.matches);

    syncDesktopState();
    mediaQuery.addEventListener("change", syncDesktopState);

    return () => mediaQuery.removeEventListener("change", syncDesktopState);
  }, []);

  const rankedTeams = useMemo(() => rankTeams(teams), [teams]);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionTitle
          title="Points Table"
          subtitle="Tournament standings ranked by points and net run rate"
        />

        <div className="grid gap-3 md:hidden">
          {rankedTeams.map((team, index) => (
            <article
              key={team.id || team.name}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="flex items-start gap-3">
                <p className="shrink-0 text-xl font-black text-[var(--vs-gold)]">
                  #{index + 1}
                </p>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xl font-black uppercase text-white">
                    {team.name}
                  </h3>

                  <p className="mt-3 text-base font-black text-white">
                    P {team.played || 0} <span className="text-slate-500">|</span>{" "}
                    W {team.won || 0} <span className="text-slate-500">|</span>{" "}
                    PTS {team.points || 0}
                  </p>

                  <p
                    className={`mt-2 text-sm font-black ${
                      (team.nrr || 0) >= 0
                        ? "text-[var(--vs-success)]"
                        : "text-[var(--vs-danger)]"
                    }`}
                  >
                    NRR {formatSignedNrr(team.nrr)}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {rankedTeams.length === 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center text-[var(--text-secondary)]">
              No teams found
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowFullMobileTable((value) => !value)}
            className="mt-2 inline-flex min-h-12 w-fit items-center rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-black uppercase text-[#06152F]"
          >
            {showFullMobileTable ? "Hide Full Table" : "View Full Table"}
          </button>

          {showFullMobileTable && (
            <div className="mt-2">
              <FullPointsTable teams={rankedTeams} />
            </div>
          )}
        </div>

        {isDesktop && (
          <div className="hidden md:block">
          <FullPointsTable teams={rankedTeams} />
          </div>
        )}
      </Container>
    </section>
  );
}

function formatSignedNrr(value = 0) {
  const numericValue = Number(value) || 0;
  const formattedValue = numericValue.toFixed(2);

  return numericValue > 0 ? `+${formattedValue}` : formattedValue;
}
