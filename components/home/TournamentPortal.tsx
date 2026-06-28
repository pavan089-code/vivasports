"use client";

import { ArrowRight, Camera, Mail, MapPin, MessageCircle, Phone, Send, Trophy, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import type { HomepageData, HomepageRecord, HomepageSponsor } from "@/services/homepageService";

type About = { story?: string; mission?: string; vision?: string; futurePlans?: string; image?: string; video?: string };

export default function TournamentPortal({ data, loading }: { data: HomepageData | null; loading: boolean }) {
  return <div className="bg-[#07152e]"><Gallery gallery={data?.gallery ?? []} loading={loading} /><Sponsors sponsors={data?.sponsors ?? []} loading={loading} /><Legacy legacy={data?.legacy ?? null} loading={loading} /><AboutViva about={(data?.about as About | null) ?? null} data={data} /><Contact /></div>;
}

function Gallery({ gallery, loading }: { gallery: HomepageRecord[]; loading: boolean }) {
  const albums = useMemo(() => {
    if (!gallery.length) return [];
    const seen = new Set<string>();
    return gallery.filter((item) => { const key = String(item.album || item.category || "Viva moments"); if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 6).map((item) => ({ id: item.id, title: String(item.album || item.title || item.category || "Viva moments"), category: String(item.category || "Gallery album"), image: String(item.image || "/highlights/match-night.png") }));
  }, [gallery]);
  return <HomeSection action="Explore gallery" eyebrow="Gallery albums" href="/gallery" title="Every Chapter, Organised By Moment">
    {loading ? <GallerySkeleton /> : albums.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{albums.map((album, index) => <Link className={`group relative min-h-80 overflow-hidden rounded-3xl border border-white/8 ${index === 0 ? "sm:col-span-2" : ""}`} href="/gallery" key={album.id}><Image alt={album.title} className="object-cover transition duration-700 group-hover:scale-105" fill sizes={index === 0 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, 25vw"} src={album.image} /><span className="absolute inset-0 bg-gradient-to-t from-[#050f23] via-[#050f23]/20 to-transparent" /><span className="absolute inset-x-0 bottom-0 z-10 p-6"><small className="font-black tracking-[.16em] text-[#d4af37] uppercase">{album.category}</small><strong className="mt-2 block text-xl font-black text-white uppercase">{album.title}</strong></span></Link>)}</div> : <EmptyState title="Gallery moments coming soon" text="Albums will appear here when the gallery collection is published." />}
  </HomeSection>;
}

function Sponsors({ sponsors, loading }: { sponsors: HomepageSponsor[]; loading: boolean }) {
  const groups = [
    ["Platinum Sponsors", sponsors.filter((item) => getSponsorTier(item) === "platinum")],
    ["Gold Sponsors", sponsors.filter((item) => getSponsorTier(item) === "gold")],
    ["Silver Sponsors", sponsors.filter((item) => getSponsorTier(item) === "silver")],
    ["Associate Partners", sponsors.filter((item) => getSponsorTier(item) === "associate")],
  ] as const;
  return <HomeSection eyebrow="Our partners" title="The Partners Backing Viva Sports">
    {loading ? <SponsorSkeleton /> : sponsors.length ? <div className="space-y-12 md:space-y-14">{groups.map(([title, items]) => items.length ? <section key={title}><h3 className="mb-5 text-xs font-black tracking-[.18em] text-[#d4af37] uppercase md:mb-6">{title}</h3><div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{items.map((sponsor) => <article className="flex min-h-52 w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-white/8 bg-[#101d35] p-4 md:p-5" key={sponsor.id}><div className="relative h-32 w-full shrink-0 overflow-hidden rounded-2xl bg-white/95">{(sponsor.logo || sponsor.image) && <Image alt={sponsor.name || "Viva Sports sponsor"} className="object-contain p-4" fill loading="lazy" sizes="(max-width: 639px) calc(100vw - 56px), (max-width: 1023px) 45vw, 280px" src={sponsor.logo || sponsor.image || ""} />}</div><p className="mt-auto break-words px-1 pt-4 text-center text-xs font-black leading-5 text-white">{sponsor.name || "Official partner"}</p></article>)}</div></section> : null)}</div> : <SponsorSkeleton staticPlaceholders />}
    <div className="mt-14 flex flex-col items-stretch justify-between gap-6 rounded-3xl border border-[#d4af37]/22 bg-[#0b1d3d] p-7 sm:flex-row sm:items-center md:mt-16 md:p-8"><div className="min-w-0"><h3 className="text-2xl font-black text-white uppercase">Want to become a sponsor?</h3><p className="mt-2 text-slate-400">Put your brand beside a growing professional sports community.</p></div><Link className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-full bg-[#d4af37] px-5 font-black text-[#07152e] uppercase transition hover:bg-[#e5c158] sm:w-auto" href="/contact">Contact us</Link></div>
  </HomeSection>;
}

function getSponsorTier(sponsor: HomepageSponsor) {
  const category = String(sponsor.category || "").toLowerCase();
  if (sponsor.group === "title" || category.includes("platinum") || category.includes("title")) return "platinum";
  if (sponsor.group === "tournament" || sponsor.group === "major" || category.includes("gold")) return "gold";
  if (sponsor.group === "prize" || sponsor.group === "runnerUp" || category.includes("silver")) return "silver";
  return "associate";
}

function Legacy({ legacy, loading }: { legacy: HomepageData["legacy"] | null; loading: boolean }) {
  const champions = legacy?.champions ?? [];
  const history = legacy?.history ?? [];
  const hall = legacy?.hall;
  const latestChampion = [...champions].sort((a, b) => String(b.season || "").localeCompare(String(a.season || "")))[0];
  const records = [
    ["Most runs record", hall?.mostRuns?.playerName, hall?.mostRuns ? `${hall.mostRuns.runs} runs` : "Record pending"],
    ["Most wickets record", hall?.mostWickets?.playerName, hall?.mostWickets ? `${hall.mostWickets.wickets} wickets` : "Record pending"],
    ["Highest individual score", hall?.highestIndividualScore?.playerName, hall?.highestIndividualScore ? `${hall.highestIndividualScore.runs} runs` : "Record pending"],
    ["Hall of Fame", hall?.mostPlayerOfMatchAwards?.playerName, hall?.mostPlayerOfMatchAwards ? `${hall.mostPlayerOfMatchAwards.awards} match awards` : "Inductions pending"],
  ];
  return <HomeSection action="Explore hall of fame" eyebrow="Viva legacy" href="/hall-of-fame" title="Where Viva History Lives">
    {loading ? <LegacySkeleton /> : <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
      <article className="rounded-[2rem] border border-[#d4af37]/24 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,.18),transparent_36%),#101d35] p-7 md:p-9"><Trophy className="size-10 text-[#d4af37]" /><p className="mt-8 text-xs font-black tracking-[.16em] text-[#d4af37] uppercase">Latest champion</p><h3 className="mt-3 text-3xl font-black text-white uppercase">{String(latestChampion?.champion || "Legacy data coming soon")}</h3><p className="mt-3 text-slate-400">{String(latestChampion?.tournamentName || latestChampion?.season || "Previous tournament winners and player-of-the-tournament honours will appear once the archive is published.")}</p><Link className="mt-7 inline-flex items-center gap-2 font-black text-[#e5c158] uppercase" href="/champions">Champions timeline <ArrowRight className="size-4" /></Link></article>
      <div className="grid gap-4 sm:grid-cols-2">{records.map(([label, name, value]) => <article className="rounded-3xl border border-white/8 bg-[#101d35] p-6" key={label}><p className="text-xs font-black tracking-[.13em] text-[#d4af37] uppercase">{label}</p><h3 className="mt-4 text-xl font-black text-white">{name || "--"}</h3><strong className="mt-2 block text-[#e5c158]">{value}</strong></article>)}</div>
    </div>}
    {history.length > 0 && <div className="mt-6 flex gap-3 overflow-x-auto pb-2">{history.slice(0, 6).map((item) => <article className="min-w-56 rounded-2xl border border-white/8 bg-white/4 p-5" key={item.id}><strong className="text-2xl text-[#d4af37]">{String(item.year || "Season")}</strong><p className="mt-2 font-black text-white">{String(item.champion || item.tournamentName || "Viva Sports")}</p></article>)}</div>}
  </HomeSection>;
}

function AboutViva({ about, data }: { about: About | null; data: HomepageData | null }) {
  const prefersReducedMotion = useReducedMotion();
  const image = about?.image || "/highlights/match-night.png";
  const reveal = prefersReducedMotion ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } };
  const metrics = [
    ["Founded", "2021"],
    ["Tournaments", data?.metrics.tournaments ? String(data.metrics.tournaments) : "—"],
    ["Teams", data?.metrics.teams ? String(data.metrics.teams) : "—"],
    ["Players", data?.metrics.players ? String(data.metrics.players) : "—"],
  ];

  return <section aria-labelledby="about-viva-title" className="py-16 md:py-24" id="about">
    <div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
      <div className="grid items-stretch gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-10 xl:gap-12">
        <motion.article {...reveal} className="min-w-0">
          <span className="inline-flex items-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-xs font-black tracking-[.2em] text-[#d4af37] uppercase">About Viva Sports</span>
          <h2 className="mt-6 max-w-3xl text-4xl leading-[.98] font-black tracking-[-.04em] text-white uppercase md:text-5xl xl:text-6xl" id="about-viva-title">
            Promoting <span className="text-[#e5c158]">Sportsmanship</span><span className="block">Nurturing <span className="text-[#e5c158]">Talent</span></span><span className="block">Creating <span className="text-[#e5c158]">Champions</span></span>
          </h2>

          <div className="mt-8 max-w-3xl space-y-4 text-[.98rem] leading-8 text-slate-300 md:text-base">
            <p>Founded in <strong className="font-extrabold text-[#e5c158]">2021</strong>, <strong className="font-extrabold text-white">Viva Sports Association</strong> is a Hyderabad-based sports organization committed to developing grassroots cricket through professionally managed tournaments, transparent operations, and modern technology.</p>
            <p>Our mission is to create opportunities for talented players while building a thriving cricket community across <strong className="font-extrabold text-[#e5c158]">Telangana</strong>, <strong className="font-extrabold text-[#e5c158]">Andhra Pradesh</strong>, and beyond.</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map(([label, value]) => <div className="rounded-2xl border border-white/8 bg-[#101d35] px-4 py-4" key={label}><span className="block text-xs font-black tracking-[.12em] text-slate-500 uppercase">{label}</span><strong className="mt-2 block text-2xl font-black text-[#e5c158]">{value}</strong></div>)}
          </div>

          <div className="mt-8 flex flex-wrap gap-3"><Link className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#d4af37] px-6 text-sm font-black text-[#07152e] uppercase shadow-[0_16px_36px_rgba(212,175,55,.18)] transition hover:-translate-y-0.5 hover:bg-[#e5c158]" href="/about">Learn more <ArrowRight className="size-4" /></Link><Link className="inline-flex min-h-12 items-center rounded-full border border-white/14 bg-white/5 px-6 text-sm font-black text-white uppercase transition hover:-translate-y-0.5 hover:border-[#d4af37]/40 hover:text-[#e5c158]" href="/contact">Contact us</Link></div>
        </motion.article>

        <motion.div {...reveal} transition={prefersReducedMotion ? undefined : { duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-[#d4af37]/20 bg-[#101d35] shadow-[0_28px_80px_rgba(0,0,0,.28)] md:min-h-[500px] lg:min-h-full">
          <Image alt="Viva Sports tournament under the lights" className="object-cover" fill loading="lazy" sizes="(max-width: 1023px) calc(100vw - 48px), 45vw" src={image} />
          <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(5,15,35,.88)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8"><p className="text-xs font-black tracking-[.18em] text-[#d4af37] uppercase">Grassroots to greatness</p><p className="mt-2 max-w-md text-lg font-black leading-6 text-white uppercase">Professional opportunities. Lasting sporting impact.</p></div>
        </motion.div>
      </div>
    </div>
  </section>;
}

function GallerySkeleton() { return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div className="min-h-80 animate-pulse rounded-3xl border border-white/5 bg-white/5" key={index} />)}</div>; }
function SponsorSkeleton({ staticPlaceholders = false }: { staticPlaceholders?: boolean }) { return <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div className={`flex min-h-52 min-w-0 flex-col overflow-hidden rounded-3xl border border-white/8 bg-[#101d35] p-4 md:p-5 ${staticPlaceholders ? "" : "animate-pulse"}`} key={index}><div className="grid h-32 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/8 px-4 text-center text-xs font-black tracking-wider text-slate-500 uppercase">{staticPlaceholders ? "Sponsor coming soon" : ""}</div></div>)}</div>; }
function LegacySkeleton() { return <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]"><div className="h-72 animate-pulse rounded-[2rem] bg-white/5" /><div className="grid grid-cols-2 gap-4">{Array.from({ length: 4 }, (_, index) => <div className="animate-pulse rounded-3xl bg-white/5" key={index} />)}</div></div>; }
function EmptyState({ title, text }: { title: string; text: string }) { return <div className="rounded-[2rem] border border-dashed border-white/12 bg-white/3 px-6 py-14 text-center"><h3 className="text-xl font-black text-white uppercase">{title}</h3><p className="mx-auto mt-3 max-w-xl text-slate-400">{text}</p></div>; }

function Contact() {
  const cards = [
    ["Team Registration", "Enter the next Viva tournament.", "/register", Users],
    ["Sponsors", "Build a partnership with Viva Sports.", "mailto:hello@vivasports.in?subject=Sponsorship enquiry", Trophy],
    ["Media", "Coverage, photography and broadcast.", "mailto:hello@vivasports.in?subject=Media enquiry", Camera],
    ["General Enquiries", "Everything else—our team can help.", "mailto:hello@vivasports.in", MessageCircle],
  ] as const;
  return <HomeSection eyebrow="Contact" id="contact" title="Start The Right Conversation">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([title, text, href, Icon]) => <Link className="rounded-3xl border border-white/8 bg-[#101d35] p-6 transition hover:-translate-y-1 hover:border-[#d4af37]/30" href={href} key={title}><Icon className="size-6 text-[#d4af37]" /><h3 className="mt-5 text-lg font-black text-white uppercase">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></Link>)}</div>
    <div className="mt-6 grid gap-6 rounded-[2rem] border border-[#d4af37]/20 bg-[linear-gradient(135deg,#10254a,#08172f)] p-7 lg:grid-cols-[.8fr_1.2fr] md:p-10">
      <div><h3 className="text-2xl font-black text-white uppercase">Contact Viva Sports</h3><div className="mt-6 space-y-4 text-sm text-slate-300"><a className="flex items-center gap-3" href="mailto:hello@vivasports.in"><Mail className="size-5 shrink-0 text-[#d4af37]" /><span className="break-all">hello@vivasports.in</span></a><a className="flex items-center gap-3" href="tel:+919000000000"><Phone className="size-5 shrink-0 text-[#d4af37]" />+91 90000 00000</a><span className="flex items-center gap-3"><MapPin className="size-5 shrink-0 text-[#d4af37]" />Hyderabad, Telangana</span></div><div className="mt-7 flex flex-wrap gap-3"><a className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white" href="#">Instagram</a><a className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white" href="#">YouTube</a></div></div>
      <form action="mailto:hello@vivasports.in" className="grid gap-4 sm:grid-cols-2" method="post" encType="text/plain"><label className="grid gap-2 text-xs font-black text-slate-300 uppercase">Name<input className="rounded-2xl border border-white/10 bg-[#07152e]/70 px-4 py-3 text-base font-normal text-white outline-none focus:border-[#d4af37]/50" name="name" required /></label><label className="grid gap-2 text-xs font-black text-slate-300 uppercase">Email<input className="rounded-2xl border border-white/10 bg-[#07152e]/70 px-4 py-3 text-base font-normal text-white outline-none focus:border-[#d4af37]/50" name="email" type="email" required /></label><label className="grid gap-2 text-xs font-black text-slate-300 uppercase sm:col-span-2">Message<textarea className="min-h-32 rounded-2xl border border-white/10 bg-[#07152e]/70 px-4 py-3 text-base font-normal text-white outline-none focus:border-[#d4af37]/50" name="message" required /></label><button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d4af37] px-6 font-black text-[#07152e] uppercase sm:w-fit" type="submit">Send enquiry <Send className="size-4" /></button></form>
    </div>
  </HomeSection>;
}

function HomeSection({ action, children, eyebrow, href, id, title }: { action?: string; children: React.ReactNode; eyebrow: string; href?: string; id?: string; title: string }) {
  const headingId = `${id ?? eyebrow.toLowerCase().replaceAll(" ", "-")}-title`;
  return <section aria-labelledby={headingId} className="py-16 md:py-24" id={id}><div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]"><div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:mb-10"><div><p className="text-xs font-black tracking-[.2em] text-[#d4af37] uppercase">{eyebrow}</p><h2 className="mt-3 max-w-4xl text-3xl leading-none font-black tracking-[-.03em] text-white uppercase md:text-5xl" id={headingId}>{title}</h2></div>{action && href && <Link className="inline-flex w-fit items-center gap-2 text-sm font-black text-[#e5c158] uppercase transition hover:text-white" href={href}>{action} <ArrowRight className="size-4" /></Link>}</div>{children}</div></section>;
}
