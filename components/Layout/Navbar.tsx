"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Container from "./Container";

const primaryLinks = [
  ["Home", "/"],
  ["Tournaments", "/seasons"],
  ["Live Center", "/live"],
  ["Gallery", "/gallery"],
  ["Sponsors", "/sponsors"],
  ["Hall Of Fame", "/hall-of-fame"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
];

const secondaryLinks = [
  ["Live Center", "/live"],
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
  const pathname = usePathname();
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
      <Container className="max-w-[1536px] px-3 sm:px-4 lg:px-5 xl:px-6">
        <div
          className={`flex flex-nowrap items-center justify-between gap-3 transition-all duration-300 ${
            scrolled ? "min-h-16" : "min-h-20"
          }`}
        >
          <Link
            href="/"
            onClick={closeMenus}
            className="flex min-w-0 shrink-0 items-center gap-2"
          >
            <span
              className={`relative overflow-hidden rounded-full border border-[#F4C95D]/40 bg-black transition-all duration-300 ${
                scrolled ? "h-11 w-11" : "h-14 w-14"
              }`}
            >
              <Image
                src="/logo.jpeg"
                alt="Viva Sports"
                fill
                sizes="56px"
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

          <nav className="hidden flex-nowrap items-center gap-0.5 whitespace-nowrap text-[13px] font-semibold text-[#AAB8D5] min-[1200px]:flex min-[1400px]:gap-1">
            {primaryLinks.map(([label, href]) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
              <Link
                key={`${label}-${href}`}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative shrink-0 rounded-full px-1.5 py-2 transition duration-200 hover:-translate-y-0.5 hover:text-[#F4C84B] min-[1400px]:px-2 ${
                  active ? "bg-white/6 text-[#F4C84B]" : ""
                }`}
              >
                {label}
              </Link>
              );
            })}

            <div className="relative">
              <button
                onClick={() => setMoreOpen((value) => !value)}
                className="inline-flex min-h-0 shrink-0 items-center gap-1 rounded-full px-1.5 py-2 transition hover:-translate-y-0.5 hover:text-[#F4C84B] min-[1400px]:px-2"
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

          <div className="hidden shrink-0 items-center min-[1200px]:flex">
            <Link
              href="/register"
              className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full bg-[#F4C84B] px-3.5 text-xs font-black uppercase text-[#07152E] shadow-lg shadow-[#F4C84B]/20 transition hover:-translate-y-0.5 hover:bg-[#FFD96A] min-[1400px]:px-4"
            >
              Register Team
            </Link>
          </div>

          <button
            onClick={() => setOpen((value) => !value)}
            className="rounded-2xl border border-[#F4C95D]/25 p-2 text-white min-[1200px]:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-[#F4C95D]/15 bg-[#09153A] min-[1200px]:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 px-4 py-5 text-white">
            {primaryLinks.map(([label, href]) => (
              <Link
                key={`${label}-${href}`}
                href={href}
                onClick={closeMenus}
                aria-current={(href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "page" : undefined}
                className={`rounded-2xl border px-4 py-3 font-semibold transition ${
                  (href === "/" ? pathname === "/" : pathname.startsWith(href))
                    ? "border-[#F4C95D]/35 bg-[#F4C95D]/10 text-[#F4C84B]"
                    : "border-white/10 bg-[#12224D]"
                }`}
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
