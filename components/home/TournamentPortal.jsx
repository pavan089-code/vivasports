"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CalendarDays,
  Download,
  ExternalLink,
  MapPin,
  Radio,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { getSettings } from "@/services/SettingServices";
import {
  getAboutSettings,
  subscribeToOrganizationCollection,
} from "@/services/organizationService";

const TOURNAMENT_START_MS = Date.parse("2026-07-10T09:00:00+05:30");
const REGISTRATION_CLOSE_MS = Date.parse("2026-07-09T23:59:59+05:30");
const stableCountdown = { days: "--", hours: "--", minutes: "--", seconds: "--" };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const heroChips = [
  ["₹2,00,000 Prize Pool", Trophy],
  ["47 Matches", CalendarDays],
  ["20 Teams", Users],
  ["T20 Format", Zap],
  ["10-25 July 2026", MapPin],
];

const announcementItems = [
  "Registrations Open",
  "20 Teams Only",
  "Prize Pool ₹2,00,000",
  "Hyderabad",
  "Starts 10 July",
  "Live Streaming",
  "Live Scoreboard",
  "Limited Slots",
];

const highlightItems = [
  "United Nalgonda won Kapil Dev Trophy",
  "Rahul scored 96 (43)",
  "Arjun took 5 wickets",
  "Final livestream crossed 40K views",
  "Player of Tournament announced",
  "Awards night returns for the 5th edition",
];

const featureCards = [
  {
    icon: Trophy,
    title: "₹2,00,000 Prize Pool",
    text: "A serious reward pool for a serious edition, with champion and individual awards.",
  },
  {
    icon: Users,
    title: "20 Teams",
    text: "Limited team slots create a focused, competitive tournament structure.",
  },
  {
    icon: CalendarDays,
    title: "47 Matches",
    text: "A complete league and knockout journey across the July competition window.",
  },
  {
    icon: Zap,
    title: "T20 Format",
    text: "Fast, tactical cricket designed for exciting matchdays and clean scheduling.",
  },
  {
    icon: Radio,
    title: "Live Streaming",
    text: "Selected matchdays supported by live coverage, scoreboard pages and digital moments.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Umpires",
    text: "Professional match control, clear rules and disciplined tournament operations.",
  },
];

const upcomingCards = [
  {
    title: "Official 5th Edition",
    text: "The Dr. APJ Abdul Kalam Trophy returns as Viva Sports' premium T20 tournament for Hyderabad teams.",
    image: "/upcoming.png",
  },
  {
    title: "Professional Venues",
    text: "Grounds, fixtures and matchday operations are planned for a polished player experience.",
    image: "/viva-cricket-hero.png",
  },
  {
    title: "Digital Tournament Engine",
    text: "Registration, scoring, match pages, results and statistics remain powered by the existing Viva platform.",
    image: "/upcoming.png",
  },
];

const fallbackTestimonials = [
  {
    name: "Rahul Sharma",
    role: "Captain, Warriors XI",
    quote: "Viva Sports makes community cricket feel organized, visible and genuinely competitive.",
  },
  {
    name: "Imran Khan",
    role: "Team Manager",
    quote: "The fixtures, live scoring and communication helped our team follow the whole tournament smoothly.",
  },
  {
    name: "Arjun Reddy",
    role: "All-rounder",
    quote: "The platform gives local players the stage and recognition they have been waiting for.",
  },
];

function useCountdown(targetMs) {
  const [countdown, setCountdown] = useState(stableCountdown);

  useEffect(() => {
    function updateCountdown() {
      const diff = Math.max(0, targetMs - Date.now());
      setCountdown({
        days: String(Math.floor(diff / 86400000)).padStart(2, "0"),
        hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
        minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    }

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [targetMs]);

  return countdown;
}

function parseTestimonials(value) {
  return Array.isArray(value) && value.length ? value : fallbackTestimonials;
}

export default function TournamentPortal({ sponsors }) {
  const tournamentCountdown = useCountdown(TOURNAMENT_START_MS);
  const registrationCountdown = useCountdown(REGISTRATION_CLOSE_MS);
  const [settings, setSettings] = useState(null);
  const [aboutSettings, setAboutSettings] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [contentError, setContentError] = useState("");

  useEffect(() => {
    let active = true;
    let stopSeasons = () => {};

    try {
      stopSeasons = subscribeToOrganizationCollection(
        "seasons",
        (items) => {
          if (active) setSeasons(items);
        },
        (error) => {
          if (active) {
            setSeasons([]);
            setContentError(error?.code === "permission-denied" ? "Some tournament records are private right now." : "Live content is temporarily unavailable.");
          }
        }
      );
    } catch {
      const frame = window.requestAnimationFrame(() => {
        if (!active) return;
        setSeasons([]);
        setContentError("Live content is temporarily unavailable.");
      });
      return () => {
        active = false;
        window.cancelAnimationFrame(frame);
      };
    }

    Promise.allSettled([getSettings(), getAboutSettings()])
      .then(([settingsResult, aboutResult]) => {
        if (!active) return;
        if (settingsResult.status === "fulfilled") setSettings(settingsResult.value);
        if (aboutResult.status === "fulfilled") setAboutSettings(aboutResult.value);
        if (settingsResult.status === "rejected" || aboutResult.status === "rejected") {
          setContentError("Some live content is temporarily unavailable.");
        }
      })
      .finally(() => {
        if (active) setIsLoadingContent(false);
      });

    return () => {
      active = false;
      stopSeasons();
    };
  }, []);

  const testimonials = useMemo(() => parseTestimonials(settings?.testimonials), [settings]);
  const editions = useMemo(() => {
    if (seasons.length) return seasons.slice(0, 3);
    return [
      { id: "current", season: "Current", tournamentName: "Kapil Dev Trophy", description: "Recent champions, awards and tournament memories." },
      { id: "upcoming", season: "Upcoming", tournamentName: "Dr. APJ Abdul Kalam Trophy", description: "The 5th edition opening for 20 Hyderabad teams." },
      { id: "past", season: "Past", tournamentName: "Viva Sports Archive", description: "Previous editions, community stories and title runs." },
    ];
  }, [seasons]);

  return (
    <div className="viva-home viva-luxury">
      <Hero countdown={tournamentCountdown} />
      <AnnouncementTicker />
      <HighlightsStrip />
      <UpcomingTournament />
      <TournamentFeatures />
      <AboutViva
        aboutSettings={aboutSettings}
        isLoading={isLoadingContent}
        error={contentError}
      />
      <TournamentEditions editions={editions} isLoading={isLoadingContent} />
      {sponsors?.length > 0 && <Sponsors sponsors={sponsors} />}
      <Testimonials items={testimonials} />
      <RegistrationCTA countdown={registrationCountdown} />
    </div>
  );
}

function Hero({ countdown }) {
  return (
    <section className="viva-next-hero">
      <div className="viva-container viva-next-hero-grid">
        <motion.div
          className="viva-next-copy"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="viva-kicker">Upcoming Tournament</p>
          <h1>Dr. APJ Abdul Kalam Trophy</h1>
          <h2>5th Edition • Hyderabad</h2>
          <p>
            Registration for Viva T20 Cricket Tournament 2026 is now open.
            Limited to 20 teams.
          </p>

          <div className="viva-hero-chip-grid">
            {heroChips.map(([label, Icon]) => (
              <span key={label}><Icon />{label}</span>
            ))}
          </div>

          <div className="viva-countdown-panel" aria-label="Tournament countdown">
            <p className="viva-kicker">Tournament starts in</p>
            <CountdownGrid countdown={countdown} />
          </div>

          <div className="viva-hero-actions">
            <Link href="/register" className="viva-button viva-button-gold">Register Team <ArrowRight /></Link>
            <Link href="/seasons" className="viva-button viva-button-ghost">Tournament Details <Trophy /></Link>
            <Link href="/rules" className="viva-button viva-button-ghost">Download Brochure <Download /></Link>
          </div>
        </motion.div>

        <motion.div
          className="viva-next-banner-card"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ y: -8, rotateX: 1.5, rotateY: -1.5 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <Image
            src="/upcoming.png"
            alt="Dr. APJ Abdul Kalam Trophy official announcement banner"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}

function CountdownGrid({ countdown }) {
  return (
    <div className="viva-countdown-grid">
      <TimeBox value={countdown.days} label="Days" />
      <TimeBox value={countdown.hours} label="Hours" />
      <TimeBox value={countdown.minutes} label="Minutes" />
      <TimeBox value={countdown.seconds} label="Seconds" />
    </div>
  );
}

function TimeBox({ value, label }) {
  return <div><strong>{value}</strong><span>{label}</span></div>;
}

function AnnouncementTicker() {
  return (
    <section className="viva-announcement-strip" aria-label="Tournament announcements">
      <div>
        {[...announcementItems, ...announcementItems].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function HighlightsStrip() {
  return (
    <section className="viva-highlights-strip" aria-label="Tournament highlights">
      <div>
        {[...highlightItems, ...highlightItems].map((item, index) => (
          <motion.article
            whileHover={{ y: -6 }}
            className="premium-card"
            key={`${item}-${index}`}
          >
            <span>{index % 2 === 0 ? <Trophy /> : <Star />}</span>
            <strong>{item}</strong>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function UpcomingTournament() {
  return (
    <PremiumSection
      eyebrow="Upcoming Tournament"
      title="The Next Viva T20 Chapter"
      copy="The homepage now focuses on the next tournament and the open registration window."
    >
      <div className="viva-upcoming-grid">
        {upcomingCards.map((card) => (
          <motion.article whileHover={{ y: -8 }} className="premium-card viva-upcoming-card" key={card.title}>
            <div>
              <Image src={card.image} alt={card.title} fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover" />
            </div>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </motion.article>
        ))}
      </div>
    </PremiumSection>
  );
}

function TournamentFeatures() {
  return (
    <PremiumSection eyebrow="Tournament Features" title="Premium Matchday Infrastructure">
      <div className="viva-feature-grid">
        {featureCards.map(({ icon: Icon, title, text }) => (
          <motion.article whileHover={{ y: -8, scale: 1.015 }} className="premium-card viva-feature-card" key={title}>
            <span><Icon /></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.article>
        ))}
      </div>
    </PremiumSection>
  );
}

function AboutViva({ aboutSettings, isLoading, error }) {
  const stats = [
    ["Tournament editions", aboutSettings?.tournamentsConducted || "5"],
    ["Teams participated", aboutSettings?.teamsParticipated || "80+"],
    ["Players registered", aboutSettings?.playersRegistered || "1200+"],
  ];

  return (
    <PremiumSection
      id="about"
      eyebrow="About Viva Sports"
      title="Community Cricket With Professional Standards"
      copy="Viva Sports brings tournament operations, live scoring, digital records and sponsor visibility into one polished cricket platform."
    >
      {error && <p className="viva-soft-alert">{error}</p>}
      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <>
          <div className="viva-about-panel premium-card">
            <span><Sparkles /></span>
            <div>
              <h3>Built for players, captains, sponsors and supporters.</h3>
              <p>
                The platform still powers live scoring, admin workflows, scorer panels,
                match pages, points tables, player profiles and team records. The public
                homepage now simply gives the next tournament the spotlight.
              </p>
            </div>
          </div>
          <div className="viva-stat-grid">
            {stats.map(([label, value]) => <Stat key={label} label={label} value={value} />)}
          </div>
        </>
      )}
    </PremiumSection>
  );
}

function TournamentEditions({ editions, isLoading }) {
  return (
    <PremiumSection eyebrow="Tournament Editions" title="Current, Upcoming And Past" action="Explore tournaments" href="/seasons">
      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {editions.map((season) => (
            <motion.article whileHover={{ y: -8, scale: 1.015 }} className="premium-card viva-edition-card" key={season.id || season.season || season.tournamentName}>
              <p className="viva-kicker">{season.season || season.year || "Edition"}</p>
              <h3>{season.tournamentName || season.title || season.champion || "Viva Sports Edition"}</h3>
              <p>{season.description || season.specialMoments || "Fixtures, teams, awards and the story of the season."}</p>
              <Link href="/seasons">View details <ArrowRight /></Link>
            </motion.article>
          ))}
        </div>
      )}
    </PremiumSection>
  );
}

function Sponsors({ sponsors }) {
  return (
    <PremiumSection eyebrow="Sponsors" title="Partners Backing The Game" action="Sponsor with us" href="/sponsors">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {sponsors.slice(0, 8).map((sponsor) => (
          <motion.article whileHover={{ y: -8 }} className="premium-card viva-sponsor-card" key={sponsor.id}>
            <p className="viva-kicker">{sponsor.category || "Sponsor"}</p>
            <div><Image src={sponsor.image} alt={sponsor.name} width={260} height={130} className="h-full w-full object-contain" /></div>
            <h3>{sponsor.name}</h3>
            <span>Official partner supporting the Viva Sports tournament experience.</span>
            <Link href="/sponsors">Website <ExternalLink /></Link>
          </motion.article>
        ))}
      </div>
    </PremiumSection>
  );
}

function Testimonials({ items }) {
  return (
    <PremiumSection eyebrow="Testimonials" title="Trusted By Captains And Teams">
      <div className="viva-testimonial-grid">
        {items.slice(0, 6).map((item, index) => (
          <blockquote className="premium-card" key={`${item.name || "testimonial"}-${index}`}>
            <div className="viva-avatar">{String(item.name || "C").slice(0, 1)}</div>
            <div className="viva-stars">{Array.from({ length: 5 }).map((_, star) => <Star key={star} />)}</div>
            <p>&quot;{item.quote}&quot;</p>
            <footer><strong>{item.name}</strong><span>{item.role || item.team || "Viva Sports community"}</span></footer>
          </blockquote>
        ))}
      </div>
    </PremiumSection>
  );
}

function RegistrationCTA({ countdown }) {
  return (
    <section id="register" className="viva-registration">
      <div className="viva-container viva-registration-cta">
        <div className="viva-registration-copy">
          <p className="viva-kicker">Registrations Open</p>
          <h2>Register Your Team</h2>
          <p>
            Secure one of 20 team slots for the Dr. APJ Abdul Kalam Trophy.
            Full registration happens only on the dedicated registration page.
          </p>
          <div className="viva-hero-actions">
            <Link href="/register" className="viva-button viva-button-gold">Register Now <ArrowRight /></Link>
            <Link href="/rules" className="viva-button viva-button-ghost">Tournament Rules <Award /></Link>
          </div>
        </div>
        <div className="viva-registration-countdown premium-card">
          <span>Registration closes in</span>
          <CountdownGrid countdown={countdown} />
        </div>
      </div>
    </section>
  );
}

function PremiumSection({ id, eyebrow, title, copy, action, href, children }) {
  return (
    <section id={id} className="viva-section viva-section-dark">
      <div className="viva-container">
        <SectionHeading eyebrow={eyebrow} title={title} copy={copy} action={action} href={href} />
        <motion.div
          className="mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, copy, action, href }) {
  return (
    <div className="viva-heading">
      <div>
        <p className="viva-kicker">{eyebrow}</p>
        <h2>{title}</h2>
        {copy && <p className="viva-heading-copy">{copy}</p>}
      </div>
      {action && href && <Link href={href} className="viva-section-link">{action}<ArrowRight /></Link>}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <motion.article className="viva-stat" whileInView={{ opacity: [0, 1], y: [16, 0] }} viewport={{ once: true }}>
      <strong>{value}</strong><span>{label}</span>
    </motion.article>
  );
}

function SkeletonGrid() {
  return (
    <div className="viva-skeleton-grid" aria-label="Loading content">
      {["one", "two", "three"].map((item) => <span key={item} />)}
    </div>
  );
}
