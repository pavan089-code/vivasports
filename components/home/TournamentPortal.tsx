"use client";

import { ArrowRight, Camera, Eye, Mail, MapPin, MessageCircle, Phone, Send, Target, Trophy, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import type { Sponsor } from "@/Lib/sponsors";
import type { HomepageData, HomepageRecord, HomepageSponsor } from "@/services/homepageService";

export default function TournamentPortal({ data, fallbackSponsors, loading }: { data: HomepageData | null; fallbackSponsors: Sponsor[]; loading: boolean }) {
  const visibleSponsors = data?.sponsors.length ? data.sponsors : fallbackSponsors as HomepageSponsor[];
  return <div className="bg-[#07152e]"><Gallery gallery={data?.gallery ?? []} loading={loading} /><Sponsors sponsors={visibleSponsors} loading={loading && !visibleSponsors.length} /><Legacy legacy={data?.legacy ?? null} loading={loading} /><AboutViva data={data} /><Contact /></div>;
}

function Gallery({ gallery, loading }: { gallery: HomepageRecord[]; loading: boolean }) {
  const albums = useMemo(() => {
    if (!gallery.length) return fallbackAlbums;
    const seen = new Set<string>();
    return gallery.filter((item) => { const key = String(item.album || item.category || "Viva moments"); if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 6).map((item) => ({ id: item.id, title: String(item.album || item.title || item.category || "Viva moments"), category: String(item.category || "Gallery album"), image: String(item.image || "/highlights/match-night.png") }));
  }, [gallery]);
  return <HomeSection action="Explore gallery" eyebrow="Gallery albums" href="/gallery" title="Moments Beyond the Scoreboard">
    {loading ? <GallerySkeleton /> : albums.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{albums.map((album, index) => <Link className={`group relative min-h-80 overflow-hidden rounded-3xl border border-white/8 ${index === 0 ? "sm:col-span-2" : ""}`} href="/gallery" key={album.id}><Image alt={album.title} className="object-cover transition duration-700 group-hover:scale-105" fill sizes={index === 0 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, 25vw"} src={album.image} /><span className="absolute inset-0 bg-gradient-to-t from-[#050f23] via-[#050f23]/20 to-transparent" /><span className="absolute inset-x-0 bottom-0 z-10 p-6"><small className="font-black tracking-[.16em] text-[#d4af37] uppercase">{album.category}</small><strong className="mt-2 block text-xl font-black text-white uppercase">{album.title}</strong></span></Link>)}</div> : <EmptyState title="Gallery moments coming soon" text="Albums will appear here when the gallery collection is published." />}
  </HomeSection>;
}

function Sponsors({ sponsors, loading }: { sponsors: HomepageSponsor[]; loading: boolean }) {
  const platinum = sponsors.find((item) => getSponsorTier(item) === "platinum") ?? sponsors[0];
  const withoutPlatinum = sponsors.filter((item) => item.id !== platinum?.id);
  const gold = withoutPlatinum.filter((item) => getSponsorTier(item) === "gold").slice(0, 4);
  const goldIds = new Set(gold.map((item) => item.id));
  const silver = withoutPlatinum.filter((item) => !goldIds.has(item.id));
  return <HomeSection eyebrow="Our partners" title="The Partners Backing Viva Sports">
    {loading ? <SponsorSkeleton /> : sponsors.length ? <div className="space-y-10 md:space-y-12">
      {platinum && <section><h3 className="mb-6 text-center text-xs font-black tracking-[.18em] text-[#d4af37] uppercase">🏆 Platinum Partner</h3><div className="mx-auto max-w-xl"><SponsorCard sponsor={platinum} size="platinum" /></div></section>}
      {gold.length > 0 && <section><h3 className="mb-6 text-xs font-black tracking-[.18em] text-[#d4af37] uppercase">🥇 Gold Sponsors</h3><div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{gold.map((sponsor) => <SponsorCard key={sponsor.id} sponsor={sponsor} size="gold" />)}</div></section>}
      {silver.length > 0 && <section><h3 className="mb-6 text-xs font-black tracking-[.18em] text-[#d4af37] uppercase">🥈 Silver Sponsors</h3><div className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">{silver.map((sponsor) => <SponsorCard key={sponsor.id} sponsor={sponsor} size="silver" />)}</div></section>}
    </div> : <SponsorSkeleton staticPlaceholders />}
    <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#d4af37]/22 bg-[#0b1d3d] p-8 text-center md:mt-16 md:p-10"><h3 className="text-2xl font-black text-white uppercase">Want to Become a Sponsor?</h3><p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-400">Partner with Viva Sports and showcase your brand through professionally managed cricket tournaments.</p><Link className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#d4af37] px-7 font-black text-[#07152e] uppercase transition hover:-translate-y-0.5 hover:bg-[#e5c158]" href="/contact">Contact Us</Link></div>
  </HomeSection>;
}

function SponsorCard({ sponsor, size }: { sponsor: HomepageSponsor; size: "platinum" | "gold" | "silver" }) {
  const website = typeof sponsor.website === "string" ? sponsor.website : "";
  const cardClass = `group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border bg-[#101d35] transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/45 ${size === "platinum" ? "min-h-72 border-[#d4af37]/28 p-6 md:p-7" : size === "gold" ? "min-h-52 border-white/8 p-4 md:p-5" : "min-h-40 border-white/8 p-3"}`;
  const content = <><div className={`relative w-full shrink-0 overflow-hidden rounded-2xl bg-white/95 ${size === "platinum" ? "h-48" : size === "gold" ? "h-32" : "h-24"}`}>{(sponsor.logo || sponsor.image) && <Image alt={sponsor.name || "Viva Sports sponsor"} className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]" fill loading="lazy" sizes={size === "platinum" ? "560px" : size === "gold" ? "280px" : "180px"} src={sponsor.logo || sponsor.image || ""} />}</div><p className={`mt-auto break-words px-1 pt-4 text-center font-black leading-5 text-white ${size === "platinum" ? "text-base" : "text-xs"}`}>{sponsor.name || "Official partner"}</p></>;
  return website ? <a className={cardClass} href={website} rel="noreferrer" target="_blank">{content}</a> : <article className={cardClass}>{content}</article>;
}

function getSponsorTier(sponsor: HomepageSponsor) {
  const category = String(sponsor.category || "").toLowerCase();
  if (sponsor.group === "title" || category.includes("platinum") || category.includes("title")) return "platinum";
  if (sponsor.group === "tournament" || sponsor.group === "major" || category.includes("gold")) return "gold";
  return "silver";
}

function Legacy({ legacy, loading }: { legacy: HomepageData["legacy"] | null; loading: boolean }) {
  const champions = legacy?.champions ?? [];
  const history = legacy?.history ?? [];
  const hall = legacy?.hall;
  const latestChampion = [...champions].sort((a, b) => String(b.season || "").localeCompare(String(a.season || "")))[0];
  const records = [
    ["Most runs record", hall?.mostRuns?.playerName, hall?.mostRuns ? `${hall.mostRuns.runs} runs` : "Record pending"],
    ["Most wickets record", hall?.mostWickets?.playerName, hall?.mostWickets ? `${hall.mostWickets.wickets} wickets` : "Record pending"],
    ["Player of tournament", hall?.mostPlayerOfMatchAwards?.playerName, hall?.mostPlayerOfMatchAwards ? `${hall.mostPlayerOfMatchAwards.awards} match awards` : "Honour pending"],
    ["Hall of Fame", hall?.highestIndividualScore?.playerName, hall?.highestIndividualScore ? `${hall.highestIndividualScore.runs} highest score` : "Inductions pending"],
  ];
  return <HomeSection action="View legacy" eyebrow="Viva legacy" href="/history" title="Where Viva History Lives">
    {loading ? <LegacySkeleton /> : <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
      <article className="rounded-[2rem] border border-[#d4af37]/24 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,.18),transparent_36%),#101d35] p-7 md:p-9"><Trophy className="size-10 text-[#d4af37]" /><p className="mt-8 text-xs font-black tracking-[.16em] text-[#d4af37] uppercase">Tournament winner</p><h3 className="mt-3 text-3xl font-black text-white uppercase">{String(latestChampion?.champion || "Legacy data coming soon")}</h3><p className="mt-3 text-slate-400">{String(latestChampion?.tournamentName || latestChampion?.season || "Previous tournament winners and player-of-the-tournament honours will appear once the archive is published.")}</p><Link className="mt-7 inline-flex items-center gap-2 font-black text-[#e5c158] uppercase" href="/champions">Champions timeline <ArrowRight className="size-4" /></Link></article>
      <div className="grid gap-4 sm:grid-cols-2">{records.map(([label, name, value]) => <article className="rounded-3xl border border-white/8 bg-[#101d35] p-6" key={label}><p className="text-xs font-black tracking-[.13em] text-[#d4af37] uppercase">{label}</p><h3 className="mt-4 text-xl font-black text-white">{name || "--"}</h3><strong className="mt-2 block text-[#e5c158]">{value}</strong></article>)}</div>
    </div>}
    {history.length > 0 && <div className="mt-8"><h3 className="mb-4 text-xs font-black tracking-[.16em] text-[#d4af37] uppercase">Historic moments</h3><div className="flex gap-3 overflow-x-auto pb-2">{history.slice(0, 6).map((item) => <article className="min-w-56 rounded-2xl border border-white/8 bg-white/4 p-5" key={item.id}><strong className="text-2xl text-[#d4af37]">{String(item.year || "Season")}</strong><p className="mt-2 font-black text-white">{String(item.champion || item.tournamentName || "Viva Sports")}</p></article>)}</div></div>}
  </HomeSection>;
}

const fallbackAlbums = [
  { id: "opening-ceremony", title: "Opening Ceremony", category: "Gallery album", image: "/highlights/match-night.png" },
  { id: "league-matches", title: "League Matches", category: "Gallery album", image: "/highlights/champions.png" },
  { id: "semi-finals", title: "Semi Finals", category: "Gallery album", image: "/highlights/match-night.png" },
  { id: "final", title: "The Final", category: "Gallery album", image: "/highlights/champions.png" },
  { id: "champions", title: "Champions", category: "Gallery album", image: "/highlights/champions.png" },
  { id: "celebrations", title: "Winning Celebrations", category: "Gallery album", image: "/highlights/match-night.png" },
];

function AboutViva({ data }: { data: HomepageData | null }) {
  const prefersReducedMotion = useReducedMotion();
  const reveal = prefersReducedMotion ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } };
  const metrics = [
    ["Founded", "2021"],
    ["Tournaments", data?.metrics.tournaments ? String(data.metrics.tournaments) : "—"],
    ["Teams", data?.metrics.teams ? String(data.metrics.teams) : "—"],
    ["Players", data?.metrics.players ? String(data.metrics.players) : "—"],
  ];

  return <section aria-labelledby="about-viva-title" className="py-14 md:py-16 lg:py-20" id="about">
    <div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
      <motion.article {...reveal} className="min-w-0">
        <span className="inline-flex items-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-xs font-black tracking-[.2em] text-[#d4af37] uppercase">About Viva Sports</span>

        <div className="mt-6 grid gap-6 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
          <h2 className="max-w-3xl text-4xl leading-[.98] font-black tracking-[-.04em] text-white uppercase md:text-5xl xl:text-6xl" id="about-viva-title">
            <span className="block">Promoting</span><span className="block text-[#e5c158]">Sportsmanship</span><span className="block">Nurturing <span className="text-[#e5c158]">Talent</span></span><span className="block">Creating <span className="text-[#e5c158]">Champions</span></span>
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-white/8 bg-[#101d35] p-6 md:p-7"><Eye className="size-7 text-[#d4af37]" aria-hidden="true" /><p className="mt-5 text-xs font-black tracking-[.16em] text-[#d4af37] uppercase">Our Vision</p><p className="mt-3 leading-7 text-slate-300">To discover, develop and promote grassroots talent by creating opportunities that inspire the next generation of sporting champions.</p></article>
            <article className="rounded-3xl border border-white/8 bg-[#101d35] p-6 md:p-7"><Target className="size-7 text-[#d4af37]" aria-hidden="true" /><p className="mt-5 text-xs font-black tracking-[.16em] text-[#d4af37] uppercase">Our Mission</p><p className="mt-3 leading-7 text-slate-300">To foster a thriving sporting community through professionally managed and technology-enabled tournaments while identifying, nurturing and showcasing grassroots talent for opportunities at district, state, national and premier league levels.</p></article>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map(([label, value]) => <div className="rounded-2xl border border-white/8 bg-[#101d35] px-4 py-4" key={label}><span className="block text-xs font-black tracking-[.12em] text-slate-500 uppercase">{label}</span><strong className="mt-2 block text-2xl font-black text-[#e5c158]">{value}</strong></div>)}
        </div>

        <div className="mt-5 flex flex-wrap gap-3"><Link className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#d4af37] px-6 text-sm font-black text-[#07152e] uppercase shadow-[0_16px_36px_rgba(212,175,55,.18)] transition hover:-translate-y-0.5 hover:bg-[#e5c158]" href="/about">Know More <ArrowRight className="size-4" /></Link><Link className="inline-flex min-h-12 items-center rounded-full border border-white/14 bg-white/5 px-6 text-sm font-black text-white uppercase transition hover:-translate-y-0.5 hover:border-[#d4af37]/40 hover:text-[#e5c158]" href="/contact">Contact Us</Link></div>
      </motion.article>
    </div>
  </section>;
}

function GallerySkeleton() { return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div className="min-h-80 animate-pulse rounded-3xl border border-white/5 bg-white/5" key={index} />)}</div>; }
function SponsorSkeleton({ staticPlaceholders = false }: { staticPlaceholders?: boolean }) { const pulse = staticPlaceholders ? "" : "animate-pulse"; return <div className="space-y-10 md:space-y-12"><div className={`mx-auto h-72 max-w-xl rounded-3xl border border-white/8 bg-[#101d35] ${pulse}`} /><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div className={`h-52 rounded-3xl border border-white/8 bg-[#101d35] ${pulse}`} key={index} />)}</div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{Array.from({ length: 6 }, (_, index) => <div className={`h-40 rounded-3xl border border-white/8 bg-[#101d35] ${pulse}`} key={index} />)}</div></div>; }
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
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([title, text, href, Icon]) => <Link className="rounded-3xl border border-white/8 bg-[#101d35] p-6 transition hover:-translate-y-1 hover:border-[#d4af37]/30" href={href} key={title}><Icon className="size-6 text-[#d4af37]" /><h3 className="mt-5 text-lg font-black text-white uppercase">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></Link>)}</div>
    <div className="mt-6 grid gap-6 rounded-[2rem] border border-[#d4af37]/20 bg-[linear-gradient(135deg,#10254a,#08172f)] p-7 lg:grid-cols-[.8fr_1.2fr] md:p-10">
      <div><h3 className="text-2xl font-black text-white uppercase">Contact Viva Sports</h3><div className="mt-6 space-y-4 text-sm text-slate-300"><a className="flex items-center gap-3" href="mailto:hello@vivasports.in"><Mail className="size-5 shrink-0 text-[#d4af37]" /><span className="break-all">hello@vivasports.in</span></a><a className="flex items-center gap-3" href="tel:+919000000000"><Phone className="size-5 shrink-0 text-[#d4af37]" />+91 90000 00000</a><span className="flex items-center gap-3"><MapPin className="size-5 shrink-0 text-[#d4af37]" />Hyderabad, Telangana</span></div><div className="mt-7 flex flex-wrap gap-3"><a className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white" href="#">Instagram</a><a className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white" href="#">YouTube</a></div></div>
      <form action="mailto:hello@vivasports.in" className="grid gap-4 sm:grid-cols-2" method="post" encType="text/plain"><label className="grid gap-2 text-xs font-black text-slate-300 uppercase">Name<input className="rounded-2xl border border-white/10 bg-[#07152e]/70 px-4 py-3 text-base font-normal text-white outline-none focus:border-[#d4af37]/50" name="name" required /></label><label className="grid gap-2 text-xs font-black text-slate-300 uppercase">Email<input className="rounded-2xl border border-white/10 bg-[#07152e]/70 px-4 py-3 text-base font-normal text-white outline-none focus:border-[#d4af37]/50" name="email" type="email" required /></label><label className="grid gap-2 text-xs font-black text-slate-300 uppercase sm:col-span-2">Message<textarea className="min-h-32 rounded-2xl border border-white/10 bg-[#07152e]/70 px-4 py-3 text-base font-normal text-white outline-none focus:border-[#d4af37]/50" name="message" required /></label><button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d4af37] px-6 font-black text-[#07152e] uppercase sm:w-fit" type="submit">Send enquiry <Send className="size-4" /></button></form>
    </div>
  </HomeSection>;
}

function HomeSection({ action, children, eyebrow, href, id, title }: { action?: string; children: React.ReactNode; eyebrow: string; href?: string; id?: string; title: string }) {
  const headingId = `${id ?? eyebrow.toLowerCase().replaceAll(" ", "-")}-title`;
  return <section aria-labelledby={headingId} className="py-14 md:py-16 lg:py-20" id={id}><div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]"><div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black tracking-[.2em] text-[#d4af37] uppercase">{eyebrow}</p><h2 className="mt-3 max-w-4xl text-3xl leading-none font-black tracking-[-.03em] text-white uppercase md:text-5xl" id={headingId}>{title}</h2></div>{action && href && <Link className="inline-flex w-fit items-center gap-2 text-sm font-black text-[#e5c158] uppercase transition hover:text-white" href={href}>{action} <ArrowRight className="size-4" /></Link>}</div>{children}</div></section>;
}
