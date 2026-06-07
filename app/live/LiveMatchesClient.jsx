"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { subscribeToMatches } from "@/services/matchService";

export default function LiveMatchesClient() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMatches(
      (data) => {
        setMatches(
          data.filter((match) =>
            ["live", "paused", "innings_break"].includes(match.status)
          )
        );
        setLoading(false);
      },
      () => {
        setMatches([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingSkeleton title="LIVE MATCHES" />;

  return (
    <main className="vs-page">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <p className="vs-eyebrow">
          LIVE MATCH CENTRE
        </p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">
          Matches In Progress
        </h1>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {matches.map((match) => (
            <article
              key={match.id}
              className="vs-card p-5"
            >
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold uppercase text-red-300">
                {match.status}
              </span>
              <h2 className="mt-4 text-2xl font-black">
                {match.teamA} vs {match.teamB}
              </h2>
              <p className="mt-2 text-slate-400">{match.ground || "Ground TBA"}</p>
              <p className="mt-4 text-4xl font-black">
                {match.score ?? 0}/{match.wickets ?? 0}
                <span className="ml-3 text-xl text-slate-400">
                  ({match.overs || "0.0"})
                </span>
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/live/${match.id}`}
                  className="rounded-lg bg-[var(--vs-gold)] px-4 py-2 text-sm font-black uppercase text-[#050B18]"
                >
                  Live Match
                </Link>
                <Link
                  href={`/scorecard/${match.id}`}
                  className="rounded-lg border border-[var(--vs-gold)]/35 px-4 py-2 text-sm font-black uppercase text-[var(--vs-gold-soft)]"
                >
                  Scorecard
                </Link>
              </div>
            </article>
          ))}
        </div>

        {!matches.length && (
          <div className="vs-card mt-8 p-8 text-center">
            <h2 className="text-2xl font-black">No live matches</h2>
            <p className="mt-2 text-slate-400">
              Live matches will appear here as soon as play begins.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
