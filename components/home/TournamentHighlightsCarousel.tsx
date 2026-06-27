"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export type HighlightType =
  | "Announcement"
  | "Upcoming Tournament"
  | "Live Match"
  | "Winner"
  | "Gallery"
  | "Sponsor";

export type TournamentHighlight = {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image: string;
  type: HighlightType;
};

const AUTOPLAY_DELAY = 6000;

// Replace this local collection with a Firestore result when highlights become dynamic.
export const highlights: TournamentHighlight[] = [
  {
    id: "registration-2026",
    title: "Dr APJ Abdul Kalam Trophy",
    subtitle: "5th Edition • Hyderabad",
    description: "Only 20 teams. Registration closes soon.",
    buttonText: "Register now",
    buttonLink: "/register",
    secondaryButtonText: "Tournament details",
    secondaryButtonLink: "/seasons",
    image: "/highlights/match-night.png",
    type: "Upcoming Tournament",
  },
  {
    id: "live-matchday",
    title: "Matchday, Live From the First Ball",
    subtitle: "Scores • streaming • commentary",
    description: "Follow every boundary, wicket and momentum swing from the Viva Sports match centre.",
    buttonText: "Watch live",
    buttonLink: "/live",
    secondaryButtonText: "View fixtures",
    secondaryButtonLink: "/fixtures",
    image: "/highlights/match-night.png",
    type: "Live Match",
  },
  {
    id: "champions-2026",
    title: "United Nalgonda Are Champions of Viva T20 2026",
    subtitle: "Kapil Dev Trophy • Previous champions",
    description: "They lifted the trophy after an unforgettable final under the lights.",
    buttonText: "View highlights",
    buttonLink: "/champions",
    image: "/highlights/champions.png",
    type: "Winner",
  },
  {
    id: "season-announcement",
    title: "The Biggest Viva Season Is Coming",
    subtitle: "10–25 July 2026 • Hyderabad",
    description: "Forty-seven matches. Twenty teams. One new chapter in community cricket.",
    buttonText: "Explore fixtures",
    buttonLink: "/fixtures",
    image: "/highlights/champions.png",
    type: "Announcement",
  },
  {
    id: "partners",
    title: "The Partners Powering Viva Cricket",
    subtitle: "Official tournament partners",
    description: "Meet the organisations helping local cricket look, feel and perform at a professional level.",
    buttonText: "Meet our sponsors",
    buttonLink: "/sponsors",
    image: "/highlights/match-night.png",
    type: "Sponsor",
  },
  {
    id: "gallery",
    title: "Relive the Moments That Made History",
    subtitle: "From the Viva archives",
    description: "Trophy lifts, match-winning knocks and the finest frames from previous editions.",
    buttonText: "Open gallery",
    buttonLink: "/gallery",
    image: "/highlights/champions.png",
    type: "Gallery",
  },
];

const typeStyles: Record<HighlightType, string> = {
  Announcement: "border-sky-300/30 bg-sky-400/15 text-sky-100",
  "Upcoming Tournament": "border-amber-300/35 bg-amber-300/15 text-amber-100",
  "Live Match": "border-emerald-300/35 bg-emerald-400/15 text-emerald-100",
  Winner: "border-yellow-200/35 bg-yellow-300/15 text-yellow-100",
  Sponsor: "border-violet-300/35 bg-violet-400/15 text-violet-100",
  Gallery: "border-cyan-300/35 bg-cyan-400/15 text-cyan-100",
};

export default function TournamentHighlightsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % highlights.length);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + highlights.length) % highlights.length);
  }, []);

  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;

    const timer = window.setInterval(showNext, AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [isHovered, prefersReducedMotion, showNext]);

  const activeSlide = highlights[activeIndex];
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      aria-label="Tournament highlights"
      aria-roledescription="carousel"
      className="mx-auto mt-6 mb-0 h-[300px] w-[calc(100%-1.5rem)] max-w-[1400px] overflow-hidden rounded-3xl border border-[#d4af37]/30 bg-[#07152e] shadow-[0_28px_80px_rgba(0,0,0,0.48)] outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] md:h-[420px] md:w-[calc(100%-3rem)] lg:h-[520px]"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showPrevious();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          showNext();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
    >
      <div className="relative h-full w-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.article
            key={activeSlide.id}
            animate={{ opacity: 1, x: 0 }}
            aria-label={`${activeIndex + 1} of ${highlights.length}: ${activeSlide.title}`}
            className="absolute inset-0"
            exit={{ opacity: 0, x: -30 }}
            initial={{ opacity: 0, x: 30 }}
            transition={transition}
          >
            <Image
              alt=""
              className="object-cover"
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 1448px) calc(100vw - 24px), 1400px"
              src={activeSlide.image}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,15,35,.86)_0%,rgba(5,15,35,.62)_54%,rgba(5,15,35,.3)_100%)] md:bg-[linear-gradient(90deg,rgba(5,15,35,.88)_0%,rgba(5,15,35,.58)_58%,rgba(5,15,35,.3)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,15,35,.16),rgba(5,15,35,.2),rgba(5,15,35,.7))]" />

            <div className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center px-12 text-center md:inset-x-auto md:top-auto md:bottom-14 md:left-0 md:max-w-3xl md:translate-y-0 md:items-start md:px-16 md:text-left lg:bottom-16 lg:px-20">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] font-black tracking-[0.16em] uppercase backdrop-blur-md md:text-xs ${typeStyles[activeSlide.type]}`}>
                {activeSlide.type}
              </span>
              <p className="mt-3 text-[0.68rem] font-extrabold tracking-[0.18em] text-[#e5c158] uppercase md:mt-4 md:text-sm">
                {activeSlide.subtitle}
              </p>
              <h2 className="mt-2 max-w-3xl text-2xl leading-[1.02] font-black tracking-[-0.035em] text-white uppercase drop-shadow-lg md:mt-3 md:text-4xl lg:text-6xl">
                {activeSlide.title}
              </h2>
              {activeSlide.description && (
                <p className="mt-3 hidden max-w-2xl text-base leading-relaxed text-slate-200 sm:block md:mt-4 md:text-lg">
                  {activeSlide.description}
                </p>
              )}
              <div className="mt-5 flex w-full flex-col gap-2 sm:w-auto sm:flex-row md:mt-6">
                <Link
                  aria-label={`${activeSlide.buttonText}: ${activeSlide.title}`}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 text-sm font-black text-[#07152e] uppercase shadow-[0_10px_35px_rgba(212,175,55,.22)] transition hover:-translate-y-0.5 hover:bg-[#e5c158] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
                  href={activeSlide.buttonLink}
                >
                  {activeSlide.buttonText}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                {activeSlide.secondaryButtonText && activeSlide.secondaryButtonLink && (
                  <Link
                    aria-label={`${activeSlide.secondaryButtonText}: ${activeSlide.title}`}
                    className="hidden min-h-11 items-center justify-center rounded-full border border-white/20 bg-[#07152e]/55 px-6 py-3 text-sm font-black text-white uppercase backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#d4af37]/55 hover:bg-[#10254a]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex sm:w-auto"
                    href={activeSlide.secondaryButtonLink}
                  >
                    {activeSlide.secondaryButtonText}
                  </Link>
                )}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        <button
          aria-label="Show previous tournament highlight"
          className="absolute top-1/2 left-3 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[#d4af37]/25 bg-[#07152e]/70 text-[#e5c158] backdrop-blur-md transition hover:scale-105 hover:bg-[#10254a]/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37] md:left-6 md:size-12"
          onClick={showPrevious}
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </button>
        <button
          aria-label="Show next tournament highlight"
          className="absolute top-1/2 right-3 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[#d4af37]/25 bg-[#07152e]/70 text-[#e5c158] backdrop-blur-md transition hover:scale-105 hover:bg-[#10254a]/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37] md:right-6 md:size-12"
          onClick={showNext}
          type="button"
        >
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-6" role="group" aria-label="Choose a highlight">
          {highlights.map((slide, index) => (
            <button
              aria-label={`Show highlight ${index + 1}: ${slide.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className="group grid min-h-6 place-items-center px-0.5"
              key={slide.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <span
                aria-hidden="true"
                className={`h-[7px] rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${index === activeIndex ? "w-[30px] bg-[#d4af37]" : "w-[7px] bg-slate-400/65 group-hover:bg-slate-200"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
