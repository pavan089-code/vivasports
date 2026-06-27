import { ArrowRight, Mail, MapPin, MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Sponsor } from "@/Lib/sponsors";

const galleryMoments = [
  { title: "Champions under the lights", label: "Finals", image: "/highlights/champions.png" },
  { title: "Ready for match night", label: "Matchday", image: "/highlights/match-night.png" },
  { title: "A trophy worth chasing", label: "Viva archive", image: "/highlights/champions.png" },
];

export default function TournamentPortal({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <div className="bg-[#07152e]">
      <AboutViva />
      <Gallery />
      {sponsors.length > 0 && <Sponsors sponsors={sponsors} />}
      <Contact />
    </div>
  );
}

function AboutViva() {
  const stats = [
    ["5", "Tournament editions"],
    ["80+", "Teams participated"],
    ["1,200+", "Players registered"],
  ];

  return (
    <HomeSection
      eyebrow="About Viva Sports"
      id="about"
      title="Community Cricket, Presented Professionally"
    >
      <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <article className="rounded-3xl border border-white/8 bg-[#101d35] p-7 md:p-10">
          <span className="grid size-14 place-items-center rounded-2xl bg-[#d4af37]/12 text-[#d4af37]"><Sparkles aria-hidden="true" /></span>
          <h3 className="mt-7 max-w-2xl text-2xl font-black text-white uppercase md:text-3xl">Built for players, captains, supporters and partners.</h3>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400 md:text-lg">
            Viva Sports brings tournament operations, live scoring, fixtures, standings, player records and sponsor visibility into one active cricket platform.
          </p>
          <Link className="mt-7 inline-flex items-center gap-2 font-black text-[#e5c158] uppercase hover:text-white" href="/about">
            Our story <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </article>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map(([value, label]) => (
            <article className="rounded-3xl border border-[#d4af37]/16 bg-[#0b1d3d] p-6" key={label}>
              <strong className="block text-3xl font-black text-[#d4af37]">{value}</strong>
              <span className="mt-1 block text-sm text-slate-400">{label}</span>
            </article>
          ))}
        </div>
      </div>
    </HomeSection>
  );
}

function Gallery() {
  return (
    <HomeSection action="Explore gallery" eyebrow="Gallery" href="/gallery" title="Moments Beyond The Scorecard">
      <div className="grid gap-5 md:grid-cols-3">
        {galleryMoments.map((moment, index) => (
          <Link className={`group relative min-h-80 overflow-hidden rounded-3xl border border-white/8 ${index === 0 ? "md:col-span-2" : ""}`} href="/gallery" key={moment.title}>
            <Image alt={moment.title} className="object-cover transition duration-700 group-hover:scale-105" fill sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"} src={moment.image} />
            <span className="absolute inset-0 bg-gradient-to-t from-[#050f23] via-[#050f23]/20 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 z-10 p-6">
              <small className="font-black tracking-[0.18em] text-[#d4af37] uppercase">{moment.label}</small>
              <strong className="mt-2 block text-xl font-black text-white uppercase">{moment.title}</strong>
            </span>
          </Link>
        ))}
      </div>
    </HomeSection>
  );
}

function Sponsors({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <HomeSection action="Meet our partners" eyebrow="Sponsors" href="/sponsors" title="Partners Backing The Game">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {sponsors.slice(0, 8).map((sponsor) => (
          <article className="rounded-3xl border border-white/8 bg-[#101d35] p-4 text-center md:p-6" key={sponsor.id}>
            <div className="grid h-28 place-items-center rounded-2xl bg-white/95 p-4">
              <Image alt={sponsor.name} className="h-full w-full object-contain" height={120} src={sponsor.image} width={220} />
            </div>
            <p className="mt-4 text-[0.65rem] font-black tracking-wider text-[#d4af37] uppercase">{sponsor.category}</p>
            <h3 className="mt-1 text-sm font-black text-white md:text-base">{sponsor.name}</h3>
          </article>
        ))}
      </div>
    </HomeSection>
  );
}

function Contact() {
  const channels = [
    { label: "Email", value: "hello@vivasports.in", href: "mailto:hello@vivasports.in", icon: Mail },
    { label: "WhatsApp", value: "+91 90000 00000", href: "https://wa.me/919000000000", icon: MessageCircle },
    { label: "Based in", value: "Hyderabad, Telangana", href: "/contact", icon: MapPin },
  ];

  return (
    <section className="py-16 md:py-24" id="contact" aria-labelledby="contact-title">
      <div className="mx-auto grid w-[calc(100%-1.5rem)] max-w-7xl gap-8 rounded-[2rem] border border-[#d4af37]/25 bg-[linear-gradient(135deg,#10254a,#08172f)] p-7 shadow-[0_28px_80px_rgba(0,0,0,.28)] md:w-[calc(100%-3rem)] md:grid-cols-[1fr_auto] md:items-end md:p-12">
        <div>
          <p className="text-xs font-black tracking-[0.2em] text-[#d4af37] uppercase">Contact</p>
          <h2 id="contact-title" className="mt-3 max-w-2xl text-3xl leading-none font-black text-white uppercase md:text-5xl">Let’s Build The Next Matchday Together</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {channels.map(({ icon: Icon, ...channel }) => (
              <a className="rounded-2xl border border-white/8 bg-white/5 p-4 transition hover:bg-white/10" href={channel.href} key={channel.label}>
                <Icon aria-hidden="true" className="size-5 text-[#d4af37]" />
                <span className="mt-3 block text-xs font-black text-slate-500 uppercase">{channel.label}</span>
                <strong className="mt-1 block text-sm text-white">{channel.value}</strong>
              </a>
            ))}
          </div>
        </div>
        <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d4af37] px-7 py-3 font-black text-[#07152e] uppercase transition hover:-translate-y-0.5 hover:bg-[#e5c158]" href="/contact">
          Contact Viva Sports <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function HomeSection({
  action,
  children,
  eyebrow,
  href,
  id,
  title,
}: {
  action?: string;
  children: React.ReactNode;
  eyebrow: string;
  href?: string;
  id?: string;
  title: string;
}) {
  const headingId = `${id ?? eyebrow.toLowerCase().replaceAll(" ", "-")}-title`;

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-24" id={id}>
      <div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#d4af37] uppercase">{eyebrow}</p>
            <h2 className="mt-3 max-w-4xl text-3xl leading-none font-black tracking-[-0.03em] text-white uppercase md:text-5xl" id={headingId}>{title}</h2>
          </div>
          {action && href && (
            <Link className="inline-flex w-fit items-center gap-2 text-sm font-black text-[#e5c158] uppercase hover:text-white" href={href}>
              {action} <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
