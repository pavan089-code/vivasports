"use client";

import { Award, Compass, Eye, HeartHandshake, Lightbulb, Medal, Rocket, Scale, ShieldCheck, Sparkles, Target, Trophy, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getHomepageData, type HomepageData } from "@/services/homepageService";

const values = [
  ["Sportsmanship", "Respecting opponents, officials and the spirit of the game.", HeartHandshake],
  ["Integrity", "Acting fairly and responsibly in every sporting decision.", ShieldCheck],
  ["Community", "Using sport to build stronger, lasting local relationships.", Users],
  ["Opportunity", "Creating credible pathways for talented grassroots athletes.", Lightbulb],
  ["Excellence", "Holding every tournament to a professional standard.", Award],
  ["Transparency", "Managing competitions with clarity, trust and accountability.", Scale],
] as const;

const futureGoals = [
  ["Grassroots development", "Discover and nurture promising athletes at the community level.", Target],
  ["Technology-driven tournaments", "Use modern tools to make competitions more transparent and engaging.", Rocket],
  ["Multiple sports", "Expand the Viva platform carefully into more sporting disciplines.", Trophy],
  ["A larger sporting community", "Connect more players, teams, supporters and responsible partners.", Users],
  ["Young athlete opportunities", "Build stronger pathways toward district, state, national and premier league levels.", Medal],
] as const;

export default function AboutPageContent() {
  const [data, setData] = useState<HomepageData | null>(null);

  useEffect(() => {
    let active = true;
    getHomepageData().then((result) => { if (active) setData(result); });
    return () => { active = false; };
  }, []);

  const achievements = [
    ["Founded", "2021"],
    ["Tournaments Organized", data?.metrics.tournaments ? String(data.metrics.tournaments) : "—"],
    ["Teams Participated", data?.metrics.teams ? String(data.metrics.teams) : "—"],
    ["Players Engaged", data?.metrics.players ? String(data.metrics.players) : "—"],
    ["Champions Crowned", data?.legacy.champions.length ? String(data.legacy.champions.length) : "—"],
  ];

  return <>
    <section className="relative flex min-h-[560px] items-end overflow-hidden border-b border-white/8 py-16 md:min-h-[650px] md:py-24">
      <Image alt="Viva Sports championship celebration" className="object-cover" fill priority sizes="100vw" src="/highlights/champions.png" />
      <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,15,35,.96),rgba(5,15,35,.72)_52%,rgba(5,15,35,.3)),linear-gradient(0deg,#07152e,transparent_58%)]" />
      <div className="relative z-10 mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
        <Reveal>
          <p className="text-xs font-black tracking-[.22em] text-[#d4af37] uppercase">About Viva Sports</p>
          <h1 className="mt-5 max-w-5xl text-5xl leading-[.92] font-black tracking-[-.05em] text-white uppercase md:text-7xl lg:text-8xl">Building champions from the <span className="text-[#e5c158]">grassroots</span> up.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">A professional community sports organization creating opportunity, celebrating talent and raising the standard of grassroots cricket since 2021.</p>
        </Reveal>
      </div>
    </section>

    <AboutSection eyebrow="Our story" title="A Passion For Sport Became A Platform For Opportunity">
      <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
        <Reveal className="rounded-[2rem] border border-[#d4af37]/18 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,.15),transparent_40%),#101d35] p-7 md:p-9"><Sparkles className="size-9 text-[#d4af37]" /><p className="mt-8 text-2xl font-black leading-9 text-white">Founded by people who believe local talent deserves a professional stage.</p></Reveal>
        <Reveal className="space-y-5 text-base leading-8 text-slate-300">
          <p>Founded in 2021 by two passionate Hyderabad-based sports enthusiasts, <strong className="text-white">Mr. Raju Chevva</strong> and <strong className="text-white">Mr. Balarazu Katepalli</strong> (Founders &amp; Directors), Viva Sports Association was established with a vision to provide grassroots cricketers a professional platform to showcase their talent and pursue greater opportunities.</p>
          <p>What began as a passion-driven initiative has grown into a respected community sports organization dedicated to promoting cricket, sportsmanship, and competitive excellence. Through professionally organized tournaments, modern technology, and transparent management, Viva Sports brings together players, teams, and supporters to celebrate the true spirit of the game.</p>
          <p>Beyond competition, we strive to inspire young athletes, build lasting relationships, and strengthen sporting culture across Telangana, Andhra Pradesh, and beyond. Today, Viva Sports continues its mission of connecting grassroots talent with greater opportunities while creating memorable sporting experiences for the community.</p>
        </Reveal>
      </div>
    </AboutSection>

    <AboutSection eyebrow="Journey since 2021" title="Growing With Every Season" alternate>
      <div className="grid gap-4 md:grid-cols-3">
        {[ ["2021", "Viva Sports Association founded in Hyderabad."], ["The platform", "Professional tournaments, transparent operations and modern match technology."], ["Today", "A growing community connecting grassroots talent with greater opportunities."] ].map(([year, text]) => <Reveal className="rounded-3xl border border-white/8 bg-[#101d35] p-7" key={year}><strong className="text-3xl font-black text-[#d4af37]">{year}</strong><p className="mt-5 leading-7 text-slate-300">{text}</p></Reveal>)}
      </div>
    </AboutSection>

    <AboutSection eyebrow="Purpose" title="The Direction Behind Every Tournament">
      <div className="grid gap-5 lg:grid-cols-2">
        <StatementCard icon={Rocket} label="Our Mission">To foster a thriving sporting community through professionally managed and technology-enabled tournaments while identifying, nurturing, and showcasing grassroots talent for opportunities at district, state, national, and premier league levels.</StatementCard>
        <StatementCard icon={Eye} label="Our Vision">To discover, develop, and promote grassroots talent by creating opportunities that inspire the next generation of sporting champions.</StatementCard>
      </div>
    </AboutSection>

    <AboutSection eyebrow="Core values" title="The Standards We Play By" alternate>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{values.map(([title, text, Icon]) => <Reveal className="rounded-3xl border border-white/8 bg-[#101d35] p-6" key={title}><span className="grid size-12 place-items-center rounded-2xl bg-[#d4af37]/10 text-[#d4af37]"><Icon className="size-6" /></span><h3 className="mt-6 text-xl font-black text-white uppercase">{title}</h3><p className="mt-3 leading-7 text-slate-400">{text}</p></Reveal>)}</div>
    </AboutSection>

    <AboutSection eyebrow="Founders" title="The People Who Started The Journey">
      <div className="grid gap-5 md:grid-cols-2">
        <FounderCard initials="RC" name="Mr. Raju Chevva" />
        <FounderCard initials="BK" name="Mr. Balaraju Katepalli" />
      </div>
    </AboutSection>

    <AboutSection eyebrow="Achievements" title="Our Journey In Numbers" alternate>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{achievements.map(([label, value]) => <Reveal className="rounded-3xl border border-[#d4af37]/14 bg-[#101d35] p-6" key={label}><strong className="text-4xl font-black text-[#e5c158]">{value}</strong><p className="mt-3 text-xs font-black tracking-[.12em] text-slate-400 uppercase">{label}</p></Reveal>)}</div>
    </AboutSection>

    <AboutSection eyebrow="Future vision" title="Building The Next Chapter Of Community Sport">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{futureGoals.map(([title, text, Icon]) => <Reveal className="rounded-3xl border border-white/8 bg-[#101d35] p-6" key={title}><Icon className="size-6 text-[#d4af37]" /><h3 className="mt-8 text-lg font-black leading-6 text-white uppercase">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{text}</p></Reveal>)}</div>
    </AboutSection>

    <section className="pb-16 md:pb-24"><div className="mx-auto grid w-[calc(100%-1.5rem)] max-w-7xl gap-6 rounded-[2rem] border border-[#d4af37]/24 bg-[radial-gradient(circle_at_85%_20%,rgba(212,175,55,.2),transparent_30%),linear-gradient(135deg,#10254a,#08172f)] p-8 md:w-[calc(100%-3rem)] md:grid-cols-[1fr_auto] md:items-center md:p-12"><div><p className="text-xs font-black tracking-[.18em] text-[#d4af37] uppercase">Join the journey</p><h2 className="mt-3 max-w-3xl text-3xl font-black leading-none text-white uppercase md:text-5xl">Create the next sporting opportunity with us.</h2></div><div className="flex flex-wrap gap-3"><Link className="inline-flex min-h-12 items-center rounded-full bg-[#d4af37] px-6 font-black text-[#07152e] uppercase" href="/register">Register team</Link><Link className="inline-flex min-h-12 items-center rounded-full border border-white/15 px-6 font-black text-white uppercase" href="/contact">Contact us</Link></div></div></section>
  </>;
}

function AboutSection({ alternate = false, children, eyebrow, title }: { alternate?: boolean; children: React.ReactNode; eyebrow: string; title: string }) {
  return <section className={`py-16 md:py-24 ${alternate ? "bg-[#0a1933]" : "bg-[#07152e]"}`}><div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]"><div className="mb-9 md:mb-12"><p className="text-xs font-black tracking-[.2em] text-[#d4af37] uppercase">{eyebrow}</p><h2 className="mt-3 max-w-4xl text-3xl font-black leading-none tracking-[-.035em] text-white uppercase md:text-5xl">{title}</h2></div>{children}</div></section>;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 20 }} transition={{ duration: reduce ? 0 : .55, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true, margin: "-70px" }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }}>{children}</motion.div>;
}

function StatementCard({ children, icon: Icon, label }: { children: React.ReactNode; icon: typeof Compass; label: string }) { return <Reveal className="rounded-[2rem] border border-[#d4af37]/18 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,.12),transparent_38%),#101d35] p-7 md:p-9"><span className="grid size-14 place-items-center rounded-2xl bg-[#d4af37]/10 text-[#d4af37]"><Icon className="size-7" /></span><h3 className="mt-7 text-2xl font-black text-white uppercase">{label}</h3><p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">{children}</p></Reveal>; }

function FounderCard({ initials, name }: { initials: string; name: string }) { return <Reveal className="grid overflow-hidden rounded-[2rem] border border-white/8 bg-[#101d35] sm:grid-cols-[180px_1fr]"><div className="grid min-h-48 place-items-center bg-[radial-gradient(circle,rgba(212,175,55,.18),transparent_65%),#0b1d3d] text-5xl font-black text-[#d4af37]">{initials}</div><div className="flex flex-col justify-center p-7"><p className="text-xs font-black tracking-[.16em] text-[#d4af37] uppercase">Founder &amp; Director</p><h3 className="mt-3 text-2xl font-black text-white">{name}</h3><p className="mt-3 leading-7 text-slate-400">Co-founder of Viva Sports Association and advocate for professional opportunities in grassroots sport.</p></div></Reveal>; }
