"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

import Container from "./Container";

const primaryLinks = [
  ["Home", "/"],
  ["Live", "/live"],
  ["Fixtures", "/fixtures"],
  ["Results", "/results"],
  ["Sponsors", "/sponsors"],
];

const secondaryLinks = [
  ["Points Table", "/pointstable"],
  ["Teams", "/teams"],
  ["Players", "/players"],
  ["Leaderboards", "/leaderboards"],
  ["Awards", "/awards"],
  ["Analytics", "/analytics"],
  ["Statistics", "/stats"],
  ["Seasons", "/seasons"],
  ["Hall Of Fame", "/hall-of-fame"],
  ["Rivalries", "/rivalries"],
  ["Milestones", "/milestones"],
  ["Match Reports", "/match-reports"],
  ["MVP", "/mvp"],
  ["Fantasy", "/fantasy"],
  ["Power Rankings", "/power-rankings"],
  ["Awards History", "/awards-history"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  function closeMenus() {
    setOpen(false);
    setMoreOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#D8B45A]/20 bg-[#020611]/95 backdrop-blur-xl">
      <Container>
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link
            href="/"
            onClick={closeMenus}
            className="flex min-w-0 shrink-0 items-center gap-3"
          >
            <span className="relative h-12 w-12 overflow-hidden rounded-full border border-[#D8B45A]/40 bg-black">
              <Image
                src="/logo.jpeg"
                alt="Viva Sports"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </span>
            <span className="min-w-0">
              <span className="block text-xl font-black tracking-wide text-white sm:text-2xl">
                Viva Sports
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-300 lg:flex">
            {primaryLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="transition hover:text-[#F1D58A]"
              >
                {label}
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setMoreOpen((value) => !value)}
                className="inline-flex items-center gap-1 transition hover:text-[#F1D58A]"
              >
                More
                <ChevronDown className="h-4 w-4" />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-9 z-50 grid max-h-[70vh] w-64 gap-3 overflow-y-auto rounded-xl border border-[#D8B45A]/20 bg-[#07101F] p-4 shadow-2xl shadow-black/50">
                  {secondaryLinks.map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMenus}
                      className="transition hover:text-[#F1D58A]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <button
            onClick={() => setOpen((value) => !value)}
            className="rounded-xl border border-[#D8B45A]/25 p-2 text-white lg:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-[#D8B45A]/15 bg-[#020611] lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 px-4 py-5 text-white">
            {primaryLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenus}
                className="rounded-xl border border-white/10 bg-[#07101F] px-4 py-3 font-semibold"
              >
                {label}
              </Link>
            ))}

            <button
              onClick={() => setMoreOpen((value) => !value)}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-[#07101F] px-4 py-3 text-left font-semibold"
              aria-expanded={moreOpen}
            >
              More
              <ChevronDown
                className={`h-4 w-4 transition ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>

            {moreOpen && (
              <div className="grid gap-2 rounded-xl border border-[#D8B45A]/15 bg-[#07101F]/70 p-2">
                {secondaryLinks.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenus}
                    className="rounded-lg px-3 py-3 text-sm font-semibold text-[var(--text-secondary)]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
