"use client";

import Container from "../Layout/Container";
import Button from "../ui/Button";

import Link from "next/link";

export default function Hero() {

  return (
    <section className="relative overflow-hidden py-16">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 blur-3xl" />

      <Container>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="relative z-10">

            {/* LIVE TAG */}
            <div
              className="
                inline-flex
                items-center
                gap-3
                px-4
                py-2
                rounded-full
                bg-red-500/10
                border border-red-500/20
                mb-6
              "
            >

              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />

              <p className="text-red-400 font-semibold tracking-widest text-sm">
                LIVE TOURNAMENT
              </p>

            </div>

            {/* TITLE */}
            <h1 className="text-5xl md:text-7xl font-black leading-none text-white">

              RIVALRY.
              <br />

              PASSION.
              <br />

              GLORY.

            </h1>

            {/* SUBTEXT */}
            <p className="mt-6 text-slate-300 text-lg max-w-xl leading-relaxed">

              Experience realtime cricket scoring,
              live match broadcasts, tournament standings
              and unforgettable moments — all powered by
              VIVA Cricket.

            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4 mt-8">

              <Link href="/live">

                <Button>
                  WATCH LIVE
                </Button>

              </Link>

              <Link href="/matches">

                <Button variant="secondary">
                  VIEW MATCHES
                </Button>

              </Link>

            </div>

            {/* QUICK STATS */}
            <div className="flex gap-10 mt-10">

              <div>
                <p className="text-4xl font-black text-white">
                  8
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  Teams
                </p>
              </div>

              <div>
                <p className="text-4xl font-black text-white">
                  24
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  Matches
                </p>
              </div>

              <div>
                <p className="text-4xl font-black text-white">
                  LIVE
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  Broadcast
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative">

            {/* Glow */}
            <div className="aspect-square rounded-full bg-cyan-500/20 blur-3xl absolute inset-0" />

            {/* Secondary Glow */}
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />

            {/* Player Image */}
            <img
              src="/batsman.png"
              alt="Cricket Player"
              className="
                relative
                z-10
                w-full
                drop-shadow-[0_0_60px_rgba(34,211,238,0.25)]
              "
            />

          </div>

        </div>

      </Container>

    </section>
  );
}