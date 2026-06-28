"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type HeroCategory = "Current Tournament" | "Registrations Open" | "Upcoming Tournament" | "Champions" | "Sponsors" | "Gallery";

export type TournamentHighlight = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  category: HeroCategory | string;
  status?: string;
  buttonPrimary: string;
  buttonSecondary?: string;
  linkPrimary: string;
  linkSecondary?: string;
  priority: number;
};

const AUTOPLAY_DELAY = 7000;
const SWIPE_THRESHOLD = 48;

// Firestore can replace this array directly; the component consumes the same shape through its slides prop.
export const highlights: TournamentHighlight[] = [
  {
    id: "united-cricket-fest-2026",
    title: "United Cricket Fest 2026",
    subtitle: "10 July – 25 July · ₹3,33,333 Prize Pool",
    description: "The biggest community cricket season begins under the lights.",
    image: "/highlights/match-night.png",
    category: "Current Tournament",
    status: "Live Now",
    buttonPrimary: "Watch Live",
    buttonSecondary: "View Tournament",
    linkPrimary: "/live",
    linkSecondary: "/seasons",
    priority: 1,
  },
  {
    id: "viva-premier-league-registration",
    title: "Registrations Are Open",
    subtitle: "Viva Premier League 2026 · Hyderabad",
    description: "Build your squad and enter the next chapter of Viva cricket.",
    image: "/highlights/champions.png",
    category: "Registrations Open",
    status: "Team Entries",
    buttonPrimary: "Register Team",
    buttonSecondary: "View Tournament",
    linkPrimary: "/register",
    linkSecondary: "/seasons",
    priority: 2,
  },
  {
    id: "hyderabad-night-league",
    title: "Coming Soon",
    subtitle: "Hyderabad Night League · 5–18 September 2026",
    description: "A new tournament experience is preparing to take centre stage.",
    image: "/highlights/match-night.png",
    category: "Upcoming Tournament",
    status: "Next Season",
    buttonPrimary: "Learn More",
    linkPrimary: "/seasons",
    priority: 3,
  },
  {
    id: "champions-2025",
    title: "Congratulations Champions !",
    subtitle: "Moosarambagh Marcos · Champions 2025",
    description: "Celebrate the team and the moments that defined an unforgettable final.",
    image: "/highlights/champions.png",
    category: "Champions",
    status: "Title Winners",
    buttonPrimary: "Watch Highlights",
    linkPrimary: "/gallery",
    priority: 4,
  },
  {
    id: "viva-sports-partners",
    title: "Powered By Our Sponsors",
    subtitle: "Official Viva Sports Partners",
    description: "Strong partnerships help community cricket perform on a bigger stage.",
    image: "/highlights/match-night.png",
    category: "Sponsors",
    status: "Official Partners",
    buttonPrimary: "Become A Sponsor",
    linkPrimary: "/contact",
    priority: 5,
  },
  {
    id: "season-gallery",
    title: "Moments That Made History",
    subtitle: "Season Highlights · From the Viva archives",
    description: "Relive trophy lifts, match-winning performances and unforgettable celebrations.",
    image: "/highlights/champions.png",
    category: "Gallery",
    status: "Viva Archives",
    buttonPrimary: "Explore Gallery",
    linkPrimary: "/gallery",
    priority: 6,
  },
];

const categoryStyles: Partial<Record<HeroCategory, string>> = {
  "Current Tournament": "border-emerald-300/35 bg-emerald-400/15 text-emerald-100",
  "Registrations Open": "border-sky-300/30 bg-sky-400/15 text-sky-100",
  "Upcoming Tournament": "border-amber-300/35 bg-amber-300/15 text-amber-100",
  Champions: "border-yellow-200/35 bg-yellow-300/15 text-yellow-100",
  Sponsors: "border-violet-300/35 bg-violet-400/15 text-violet-100",
  Gallery: "border-cyan-300/35 bg-cyan-400/15 text-cyan-100",
};

export default function TournamentHighlightsCarousel({ slides = highlights }: { slides?: TournamentHighlight[] }) {
  const orderedSlides = useMemo(() => [...(slides.length ? slides : highlights)].sort((a, b) => a.priority - b.priority), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isPaused = isHovered || isFocused;

  const showNext = useCallback(() => setActiveIndex((current) => (current + 1) % orderedSlides.length), [orderedSlides.length]);
  const showPrevious = useCallback(() => setActiveIndex((current) => (current - 1 + orderedSlides.length) % orderedSlides.length), [orderedSlides.length]);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const timer = window.setTimeout(showNext, AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, prefersReducedMotion, showNext]);

  const safeActiveIndex = activeIndex % orderedSlides.length;
  const activeSlide = orderedSlides[safeActiveIndex];
  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const };
  const isFirstSlide = activeSlide.id === orderedSlides[0]?.id;

  function finishSwipe(endX: number) {
    if (touchStartX.current === null) return;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    if (distance < 0) showNext(); else showPrevious();
  }

  return (
    <section
      aria-label="Viva Sports highlights"
      aria-roledescription="carousel"
      className="mx-auto mt-6 mb-0 h-[400px] w-[calc(100%-1.5rem)] max-w-[1400px] touch-pan-y overflow-hidden rounded-3xl border border-[#d4af37]/30 bg-[#07152e] shadow-[0_28px_80px_rgba(0,0,0,0.48)] outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] md:h-[500px] md:w-[calc(100%-3rem)] lg:h-[600px]"
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsFocused(false); }}
      onFocus={() => setIsFocused(true)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); showPrevious(); }
        if (event.key === "ArrowRight") { event.preventDefault(); showNext(); }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchCancel={() => { touchStartX.current = null; }}
      onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}
      onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
      tabIndex={0}
    >
      <style>{`@keyframes viva-hero-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
      <div className="relative h-full w-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.article key={activeSlide.id} animate={{ opacity: 1, x: 0 }} aria-label={`${safeActiveIndex + 1} of ${orderedSlides.length}: ${activeSlide.title}`} className="absolute inset-0" exit={{ opacity: 0, x: -24 }} initial={{ opacity: 0, x: 24 }} transition={transition}>
            <motion.div className="absolute inset-0" initial={{ scale: 1 }} animate={{ scale: prefersReducedMotion ? 1 : 1.055 }} transition={{ duration: prefersReducedMotion ? 0 : 9, ease: "linear" }}>
              <Image
                alt=""
                className="object-cover"
                fill
                sizes="(max-width: 767px) calc(100vw - 24px), (max-width: 1448px) calc(100vw - 48px), 1400px"
                src={activeSlide.image}
                {...(isFirstSlide ? { preload: true } : { loading: "lazy" as const })}
              />
            </motion.div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,15,35,.93)_0%,rgba(5,15,35,.76)_45%,rgba(5,15,35,.2)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,15,35,.12),rgba(5,15,35,.12),rgba(5,15,35,.72))]" />

            <div className="absolute inset-y-0 left-0 z-10 flex w-full max-w-3xl flex-col justify-center px-14 text-left md:px-16 lg:px-20">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-[0.55rem] font-black tracking-[0.08em] uppercase backdrop-blur-md md:px-3 md:text-xs md:tracking-[0.14em] ${categoryStyles[activeSlide.category as HeroCategory] ?? "border-[#d4af37]/35 bg-[#d4af37]/15 text-[#f4d878]"}`}>{activeSlide.category}</span>
                {activeSlide.status && <span className="inline-flex rounded-full border border-white/18 bg-[#07152e]/65 px-2.5 py-1 text-[0.55rem] font-black tracking-[0.08em] text-white uppercase backdrop-blur-md md:px-3 md:text-xs md:tracking-[0.14em]">{activeSlide.status}</span>}
              </div>
              <p className="mt-3 line-clamp-2 max-w-2xl text-[0.68rem] leading-5 font-extrabold tracking-[0.14em] text-[#e5c158] uppercase md:mt-4 md:text-sm">{activeSlide.subtitle}</p>
              <h2 className="mt-2 max-w-3xl overflow-visible pb-[.08em] text-[1.65rem] leading-[1.02] font-black tracking-[-0.035em] text-balance break-normal hyphens-none text-white uppercase drop-shadow-lg sm:text-3xl md:mt-3 md:text-5xl lg:text-7xl">{activeSlide.title}</h2>
              <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-slate-200 md:mt-4 md:text-lg md:leading-8">{activeSlide.description}</p>
              <div className="mt-4 flex w-full max-w-sm flex-col gap-2 sm:max-w-none sm:flex-row md:mt-6">
                <Link aria-label={`${activeSlide.buttonPrimary}: ${activeSlide.title}`} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 text-sm font-black text-[#07152e] uppercase shadow-[0_10px_35px_rgba(212,175,55,.22)] transition hover:-translate-y-0.5 hover:bg-[#e5c158] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto" href={activeSlide.linkPrimary}>{activeSlide.buttonPrimary}<ArrowRight aria-hidden="true" className="size-4" /></Link>
                {activeSlide.buttonSecondary && activeSlide.linkSecondary && <Link aria-label={`${activeSlide.buttonSecondary}: ${activeSlide.title}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/20 bg-[#07152e]/55 px-6 py-3 text-sm font-black text-white uppercase backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#d4af37]/55 hover:bg-[#10254a]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto" href={activeSlide.linkSecondary}>{activeSlide.buttonSecondary}</Link>}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        <button aria-label="Show previous highlight" className="absolute top-1/2 left-3 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[#d4af37]/25 bg-[#07152e]/70 text-[#e5c158] backdrop-blur-md transition hover:scale-105 hover:bg-[#10254a]/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37] md:left-6 md:size-12" onClick={showPrevious} type="button"><ArrowLeft aria-hidden="true" className="size-5" /></button>
        <button aria-label="Show next highlight" className="absolute top-1/2 right-3 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[#d4af37]/25 bg-[#07152e]/70 text-[#e5c158] backdrop-blur-md transition hover:scale-105 hover:bg-[#10254a]/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37] md:right-6 md:size-12" onClick={showNext} type="button"><ArrowRight aria-hidden="true" className="size-5" /></button>

        <div className="absolute bottom-2 left-1/2 z-20 flex max-w-[calc(100%-7rem)] -translate-x-1/2 items-center gap-2 md:bottom-6" role="group" aria-label="Choose a highlight">
          {orderedSlides.map((slide, index) => {
            const active = index === safeActiveIndex;
            return <button aria-label={`Show highlight ${index + 1}: ${slide.title}`} aria-current={active ? "true" : undefined} className="group grid min-h-6 w-9 place-items-center md:w-14" key={slide.id} onClick={() => setActiveIndex(index)} type="button"><span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/20"><span aria-hidden="true" className={`absolute inset-0 origin-left rounded-full ${active ? "bg-[#d4af37]" : "scale-x-0 bg-slate-300 transition group-hover:scale-x-100"}`} key={active ? activeSlide.id : slide.id} style={active ? { animation: prefersReducedMotion ? "none" : `viva-hero-progress ${AUTOPLAY_DELAY}ms linear forwards`, animationPlayState: isPaused ? "paused" : "running", transform: prefersReducedMotion ? "scaleX(1)" : undefined } : undefined} /></span></button>;
          })}
        </div>
      </div>
    </section>
  );
}
