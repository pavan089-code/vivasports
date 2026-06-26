"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import Container from "./Container";

const primaryLinks = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Tournaments", "/seasons"],
  ["Gallery", "/gallery"],
  ["Sponsors", "/sponsors"],
  ["Hall Of Fame", "/hall-of-fame"],
  ["Contact", "/contact"],
];

const secondaryLinks = [
  ["Live Matches", "/live"],
  ["Fixtures", "/fixtures"],
  ["Results", "/results"],
  ["Points Table", "/pointstable"],
  ["Teams", "/teams"],
  ["Players", "/players"],
  ["Player Rankings", "/leaderboards"],
  ["Scorer Login", "/matches"],
  ["Admin Login", "/admin"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const syncScrolled = () => setScrolled(window.scrollY > 24);

    syncScrolled();
    window.addEventListener("scroll", syncScrolled, { passive: true });

    return () => window.removeEventListener("scroll", syncScrolled);
  }, []);

  function closeMenus() {
    setOpen(false);
    setMoreOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 bg-[#07152E]/82 shadow-2xl shadow-black/20 backdrop-blur-2xl transition-all duration-300 ${
        scrolled ? "border-[#F4C95D]/20" : ""
      }`}
    >
      <Container>
        <div
          className={`flex items-center justify-between gap-4 transition-all duration-300 ${
            scrolled ? "min-h-16" : "min-h-20"
          }`}
        >
          <Link
            href="/"
            onClick={closeMenus}
            className="flex min-w-0 shrink-0 items-center gap-3"
          >
            <span
              className={`relative overflow-hidden rounded-full border border-[#F4C95D]/40 bg-black transition-all duration-300 ${
                scrolled ? "h-10 w-10" : "h-12 w-12"
              }`}
            >
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
              <span className="hidden text-[9px] font-black uppercase tracking-[.22em] text-[#F4C95D] sm:block">
                Live Cricket Platform
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-base font-semibold text-[#AAB8D5] lg:flex">
            {primaryLinks.map(([label, href]) => (
              <Link
                key={`${label}-${href}`}
                href={href}
                className="transition hover:text-[#F4C84B]"
              >
                {label}
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setMoreOpen((value) => !value)}
                className="inline-flex min-h-0 items-center gap-1 transition hover:text-[#F4C84B]"
              >
                More
                <ChevronDown className="h-4 w-4" />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-9 z-50 grid max-h-[70vh] w-72 gap-3 overflow-y-auto rounded-[24px] border border-white/10 bg-[#122246]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
                  {secondaryLinks.map(([label, href]) => (
                    <Link
                      key={`${label}-${href}`}
                      href={href}
                      onClick={closeMenus}
                      className="transition hover:text-[#F4C84B]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/register"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F4C84B] px-5 text-sm font-black uppercase text-[#07152E] shadow-lg shadow-[#F4C84B]/20 transition hover:bg-[#FFD96A]"
            >
              Register Team
            </Link>
          </div>

          <button
            onClick={() => setOpen((value) => !value)}
            className="rounded-2xl border border-[#F4C95D]/25 p-2 text-white lg:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-[#F4C95D]/15 bg-[#09153A] lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 px-4 py-5 text-white">
            {primaryLinks.map(([label, href]) => (
              <Link
                key={`${label}-${href}`}
                href={href}
                onClick={closeMenus}
                className="rounded-2xl border border-white/10 bg-[#12224D] px-4 py-3 font-semibold"
              >
                {label}
              </Link>
            ))}

            <Link
              href="/register"
              onClick={closeMenus}
              className="rounded-2xl bg-[#F4C84B] px-4 py-3 text-center font-black uppercase text-[#07152E]"
            >
              Register Team
            </Link>

            <button
              onClick={() => setMoreOpen((value) => !value)}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#12224D] px-4 py-3 text-left font-semibold"
              aria-expanded={moreOpen}
            >
              More
              <ChevronDown
                className={`h-4 w-4 transition ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>

            {moreOpen && (
              <div className="grid gap-2 rounded-2xl border border-[#F4C95D]/15 bg-[#12224D]/70 p-2">
                {secondaryLinks.map(([label, href]) => (
                  <Link
                    key={`${label}-${href}`}
                    href={href}
                    onClick={closeMenus}
                    className="rounded-xl px-3 py-3 text-sm font-semibold text-[var(--text-secondary)]"
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
