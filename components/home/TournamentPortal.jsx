"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  CirclePlay,
  Clock3,
  ExternalLink,
  MapPin,
  Radio,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { getSettings } from "@/services/SettingServices";
import {
  getAboutSettings,
  subscribeToOrganizationCollection,
} from "@/services/organizationService";
import { subscribeToMatches } from "@/services/matchService";
import { getPlayerStats } from "@/services/playerStatsService";
import { subscribeToTeams } from "@/services/teamService";
import {
  getLatestEvent,
  getNeedLine,
  getRequiredRate,
  getRunRate,
} from "@/utils/broadcastUtils";
import { getTopBatters, getTopBowlers } from "@/utils/leaderboardUtils";
import {
  rankTeams,
  sortRecentMatches,
  sortUpcomingMatches,
} from "@/utils/tournamentUtils";

const liveStatuses = ["live", "paused", "innings_break"];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const capabilityCards = [
  {
    icon: Radio,
    title: "Live Match Engine",
    text: "Realtime scoring, match status, score overlays and ball-by-ball context built for tournament days.",
  },
  {
    icon: CalendarDays,
    title: "Fixtures And Results",
    text: "Professional scheduling, recent results and scorecards surfaced cleanly for players and spectators.",
  },
  {
    icon: BarChart3,
    title: "Player Statistics",
    text: "Leaderboards, profiles and performance records that make local cricket feel properly documented.",
  },
  {
    icon: Trophy,
    title: "Tournament Ecosystem",
    text: "Teams, standings, seasons, sponsors and broadcast tools in one premium public experience.",
  },
];

function textResult(match) {
  if (typeof match?.result === "string") return match.result;
  return match?.result?.result || (match?.status === "abandoned" ? "No result" : "Match completed");
}

function formatSchedule(match) {
  return [match?.date, match?.time].filter(Boolean).join(" | ") || "Schedule TBA";
}

function playerName(player) {
  return player?.playerName || player?.name || "";
}

function parseList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function scoreLine(match) {
  return `${match?.score ?? match?.currentScore ?? 0}/${match?.wickets ?? 0}`;
}

function oversLine(match) {
  return match?.overs || match?.currentOvers || "0.0";
}

function lastOverLine(match) {
  const currentOver = match?.currentOver || [];
  const events = currentOver.length ? currentOver : (match?.commentary || match?.balls || []).slice(-6);
  const labels = events
    .map((ball) => {
      if (ball.type === "wicket") return "W";
      if (Number.isFinite(Number(ball.batterRuns))) return String(ball.batterRuns);
      return ball.label || "";
    })
    .filter(Boolean);

  return labels.length ? labels.join("  ") : "-";
}

function teamInitials(name = "VS") {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "VS";
}

function getCountdown(match) {
  const timestamp = match?.date ? new Date(`${match.date}T${match.time || "00:00"}`).getTime() : NaN;
  if (!Number.isFinite(timestamp)) return "Schedule TBA";

  const diff = timestamp - Date.now();
  if (diff <= 0) return "Starting soon";

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);

  if (days > 0) return `${days}d ${hours}h`;
  return `${Math.max(hours, 1)}h`;
}

function matchTitle(match) {
  return `${match?.teamA || "Team A"} vs ${match?.teamB || "Team B"}`;
}

function getBestEconomy(players) {
  return [...players]
    .filter((player) => Number(player?.ballsBowled || 0) >= 6 || Number(player?.wickets || 0) > 0)
    .sort((a, b) => (Number(a.economy || 99) - Number(b.economy || 99)) || (b.wickets || 0) - (a.wickets || 0))[0];
}

export default function TournamentPortal({ sponsors }) {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [aboutSettings, setAboutSettings] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stopMatches = subscribeToMatches(
      (data) => {
        setMatches(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    const stopTeams = subscribeToTeams(setTeams, () => setTeams([]));
    const stopSeasons = subscribeToOrganizationCollection(
      "seasons",
      setSeasons,
      () => setSeasons([])
    );

    getPlayerStats().then(setPlayers).catch(() => setPlayers([]));
    getSettings().then(setSettings).catch(() => setSettings(null));
    getAboutSettings().then(setAboutSettings).catch(() => setAboutSettings(null));

    return () => {
      stopMatches();
      stopTeams();
      stopSeasons();
    };
  }, []);

  const liveMatches = useMemo(
    () => matches.filter((match) => liveStatuses.includes(match.status)),
    [matches]
  );
  const fixtures = useMemo(
    () => sortUpcomingMatches(matches.filter((match) => match.status === "scheduled")).slice(0, 4),
    [matches]
  );
  const results = useMemo(
    () => sortRecentMatches(matches.filter((match) => ["completed", "abandoned"].includes(match.status))).slice(0, 4),
    [matches]
  );
  const standings = useMemo(() => rankTeams(teams).slice(0, 5), [teams]);
  const topBatter = useMemo(() => getTopBatters(players)[0], [players]);
  const topBowler = useMemo(() => getTopBowlers(players)[0], [players]);
  const mostSixes = useMemo(() => [...players].sort((a, b) => (b.sixes || 0) - (a.sixes || 0))[0], [players]);
  const bestEconomy = useMemo(() => getBestEconomy(players), [players]);
  const heroMatch = liveMatches[0] || fixtures[0] || results[0] || null;
  const galleryImages = parseList(settings?.galleryImages);
  const testimonials = Array.isArray(settings?.testimonials) ? settings.testimonials : [];
  const latestEvents = useMemo(
    () => matches.map(getLatestEvent).filter(Boolean).slice(0, 5),
    [matches]
  );
  const boundaryEvents = useMemo(
    () =>
      matches
        .flatMap((match) => (match.commentary || match.balls || []).map((ball) => ({ ...ball, match })))
        .filter((ball) => ball.batterRuns === 4 || ball.batterRuns === 6)
        .slice(-6)
        .reverse(),
    [matches]
  );

  const tournamentsCount = seasons.length || aboutSettings?.tournamentsConducted || settings?.tournamentsConducted || "-";
  const teamsCount = teams.length || aboutSettings?.teamsParticipated || settings?.teamsParticipated || "-";
  const playersCount = players.length || aboutSettings?.playersRegistered || settings?.playersRegistered || "-";
  const matchesCount = matches.length || aboutSettings?.matchesHosted || "-";

  return (
    <div className="viva-home viva-premium">
      <Hero match={heroMatch} loading={loading} />
      <LiveTicker matches={liveMatches} results={results} events={latestEvents} />

      <PlatformFeatures />
      <LiveMatchCenter loading={loading} liveMatches={liveMatches} />
      <UpcomingFixtures fixtures={fixtures} />
      <PointsTable teams={standings} />
      <TopPlayers
        topBatter={topBatter}
        topBowler={topBowler}
        mostSixes={mostSixes}
        bestEconomy={bestEconomy}
      />
      <InsightWidgets
        results={results}
        topBatter={topBatter}
        topBowler={topBowler}
        fixtures={fixtures}
        events={latestEvents}
        boundaries={boundaryEvents}
      />
      <About
        tournamentsCount={tournamentsCount}
        teamsCount={teamsCount}
        playersCount={playersCount}
        matchesCount={matchesCount}
      />
      <TournamentEditions seasons={seasons} />
      {galleryImages.length > 0 && <Gallery images={galleryImages.slice(0, 12)} />}
      {sponsors?.length > 0 && <Sponsors sponsors={sponsors} />}
      {testimonials.length > 0 && <Testimonials items={testimonials} />}
      <Registration />
    </div>
  );
}

function Hero({ match, loading }) {
  return (
    <section className="viva-hero viva-hero-live">
      <Image
        src="/viva-cricket-hero.png"
        alt="Cricketer playing under stadium lights"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center]"
      />
      <div className="viva-hero-shade" />
      <div className="viva-container viva-hero-grid">
        <motion.div
          className="viva-hero-copy"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <p className="viva-hero-eyebrow"><span /> Live tournaments. Real scores. Player stories.</p>
          <h1>India&apos;s Premium Cricket Platform</h1>
          <h2>Live tournaments, fixtures, match center and player statistics in one professional cricket ecosystem.</h2>
          <p>Follow every fixture, live score, table movement, boundary, wicket and leaderboard moment from Viva Sports.</p>
          <div className="viva-hero-actions">
            <Link href="/live" className="viva-button viva-button-gold"><CirclePlay /> Watch live</Link>
            <Link href="/fixtures" className="viva-button viva-button-ghost"><CalendarDays /> View fixtures</Link>
            <Link href="/register" className="viva-button viva-button-ghost"><Trophy /> Register team</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 34, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
        >
          {loading ? <LoadingCard /> : <HeroMatchCard match={match} />}
        </motion.div>
      </div>
    </section>
  );
}

function HeroMatchCard({ match }) {
  if (!match) {
    return (
      <ProfessionalEmpty
        icon={Clock3}
        title="Match center standing by"
        text="Live and scheduled matches will appear here as soon as the tournament feed updates."
        href="/fixtures"
        action="View fixtures"
      />
    );
  }

  const isLive = liveStatuses.includes(match.status);
  const needLine = getNeedLine(match);
  const statusLabel = isLive ? "Live now" : match.status === "scheduled" ? "Next match" : "Recent result";
  const battingTeam = match.battingTeam || match.teamA || "Batting Team";
  const opponent = match.bowlingTeam || match.teamB || "Opposition";

  return (
    <article className="viva-hero-match-card">
      <div className="viva-live-top">
        <span className={isLive ? "viva-live-pill" : "viva-scheduled-pill"}>
          {isLive && <i />} {statusLabel}
        </span>
        <span>{match.ground || "Venue TBA"}</span>
      </div>
      <div className="viva-team-strip">
        <TeamMark name={battingTeam} />
        <span>vs</span>
        <TeamMark name={opponent} />
      </div>
      <div className="viva-hero-score">
        <p>{battingTeam}</p>
        <strong>{isLive ? scoreLine(match) : matchTitle(match)}</strong>
        <span>{isLive ? `${oversLine(match)} overs` : formatSchedule(match)}</span>
      </div>
      <div className="viva-match-metrics">
        <Metric label="CRR" value={isLive ? getRunRate(match.score || 0, match.totalBalls || 0) : "-"} />
        <Metric label="RRR" value={isLive ? getRequiredRate(match) : "-"} />
        <Metric label="Target" value={match.target || "-"} />
      </div>
      <div className="viva-last-over">
        <span>Last over</span>
        <strong>{isLive ? lastOverLine(match) : getCountdown(match)}</strong>
      </div>
      <div className="viva-need-line">{needLine || (isLive ? "Realtime score syncing from Firebase" : "Countdown begins once schedule is locked")}</div>
      <Link href={isLive ? `/live/${match.id}` : "/fixtures"} className="viva-card-link">
        {isLive ? "View match" : "View fixture"} <ArrowRight />
      </Link>
    </article>
  );
}

function LiveTicker({ matches, results, events }) {
  const items = [
    ...matches.map((match) => `LIVE NOW: ${matchTitle(match)} ${scoreLine(match)} (${oversLine(match)})`),
    ...events.map((event) => `${event.title}: ${event.subtitle} ${event.detail || ""}`),
    ...results.slice(0, 2).map((match) => `RESULT: ${textResult(match)}`),
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="viva-ticker" aria-label="Live cricket ticker">
      <div>
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function PlatformFeatures() {
  return (
    <PremiumSection
      eyebrow="Platform"
      title="A COMPLETE CRICKET ECOSYSTEM"
      copy="The existing Viva Sports systems are now surfaced as premium, scannable public modules."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {capabilityCards.map(({ icon: Icon, title, text }) => (
          <motion.article
            whileHover={{ y: -8 }}
            className="viva-capability-card premium-card"
            key={title}
          >
            <span className="viva-capability-icon"><Icon /></span>
            <h3>{title}</h3>
            <p>{text}</p>
            <Link href="/live">Explore <ArrowRight /></Link>
          </motion.article>
        ))}
      </div>
    </PremiumSection>
  );
}

function LiveMatchCenter({ loading, liveMatches }) {
  return (
    <PremiumSection id="live" eyebrow="Live Match Center" title="LIVE MATCHES" copy="Realtime scorecards from the active Viva Sports match feed." action="Open match center" href="/live">
      {loading ? <LoadingCard /> : liveMatches.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {liveMatches.slice(0, 4).map((match) => <LiveCard key={match.id} match={match} />)}
        </div>
      ) : (
        <ProfessionalEmpty icon={Clock3} title="No live matches right now" text="When the scorer starts a match, this section updates in realtime." href="/fixtures" action="View fixtures" />
      )}
    </PremiumSection>
  );
}

function UpcomingFixtures({ fixtures }) {
  return (
    <PremiumSection eyebrow="Upcoming Fixtures" title="NEXT ON THE CALENDAR" copy="Ground, time and match links for the next scheduled fixtures." action="View fixtures" href="/fixtures">
      {fixtures.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {fixtures.map((match) => <FixtureCard key={match.id} match={match} />)}
        </div>
      ) : (
        <ProfessionalEmpty icon={CalendarDays} title="Fixtures are being prepared" text="The next confirmed matches will appear here automatically." href="/fixtures" action="Explore fixtures" />
      )}
    </PremiumSection>
  );
}

function PointsTable({ teams }) {
  return (
    <PremiumSection eyebrow="Points Table" title="TOURNAMENT STANDINGS" copy="Top five teams ranked by points, wins and net run rate." action="View full table" href="/pointstable">
      {teams.length ? <Standings teams={teams} /> : <ProfessionalEmpty icon={BarChart3} title="Standings will update after results" text="The points table uses the existing team records and ranking rules." href="/pointstable" action="View table" />}
    </PremiumSection>
  );
}

function TopPlayers({ topBatter, topBowler, mostSixes, bestEconomy }) {
  const leaders = [
    { icon: Target, label: "Top Batter", player: topBatter, value: topBatter ? `${topBatter.runs || 0} runs` : "" },
    { icon: Zap, label: "Top Bowler", player: topBowler, value: topBowler ? `${topBowler.wickets || 0} wickets` : "" },
    { icon: Trophy, label: "Most Sixes", player: mostSixes, value: mostSixes?.sixes ? `${mostSixes.sixes} sixes` : "" },
    { icon: BarChart3, label: "Best Economy", player: bestEconomy, value: bestEconomy ? `${Number(bestEconomy.economy || 0).toFixed(2)} econ` : "" },
  ].filter((item) => playerName(item.player) && item.value);

  if (!leaders.length) return null;

  return (
    <PremiumSection eyebrow="Player Leaderboards" title="PLAYERS SETTING THE STANDARD" copy="The leading performers across batting, bowling and impact categories." action="All leaderboards" href="/leaderboards">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {leaders.map((leader) => <Leader key={leader.label} {...leader} />)}
      </div>
    </PremiumSection>
  );
}

function InsightWidgets({ results, topBatter, topBowler, fixtures, events, boundaries }) {
  return (
    <PremiumSection eyebrow="Live Features" title="THE TOURNAMENT SIGNAL" copy="Fast access to the moments supporters look for during a competition.">
      <div className="grid gap-5 lg:grid-cols-3">
        <MiniPanel title="Recent Results" icon={CheckCircle2} items={results.map(textResult)} href="/results" />
        <MiniPanel
          title="Player Of The Week"
          icon={Star}
          items={[
            topBatter ? `${playerName(topBatter)} leads batting with ${topBatter.runs || 0} runs` : "",
            topBowler ? `${playerName(topBowler)} leads bowling with ${topBowler.wickets || 0} wickets` : "",
          ]}
          href="/players"
        />
        <MiniPanel
          title="Match Highlights"
          icon={Radio}
          items={[
            fixtures[0] ? `Next countdown: ${matchTitle(fixtures[0])} - ${formatSchedule(fixtures[0])}` : "",
            ...events.map((event) => `${event.title}: ${event.subtitle}`),
            ...boundaries.map((ball) => `${ball.batterRuns === 6 ? "Six" : "Four"} by ${ball.striker || "batter"}`),
          ]}
          href="/live"
        />
      </div>
    </PremiumSection>
  );
}

function About({ tournamentsCount, teamsCount, playersCount, matchesCount }) {
  return (
    <PremiumSection id="about" eyebrow="About Viva Sports" title="BUILT FOR SERIOUS COMMUNITY CRICKET" copy="Viva Sports brings players, teams and supporters together through well-run competitions, modern scoring and respect for the game.">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="viva-story-card premium-card">
          <span className="viva-icon"><Target /></span>
          <div>
            <p className="viva-kicker">Mission</p>
            <h3>Create opportunity. Reward talent. Raise standards.</h3>
            <p>We give local cricketers a credible platform to compete, improve and be recognized through fair organization and reliable match data.</p>
          </div>
        </article>
        <article className="viva-story-card premium-card">
          <span className="viva-icon"><Sparkles /></span>
          <div>
            <p className="viva-kicker">Vision</p>
            <h3>Community cricket with a professional future.</h3>
            <p>Every promising player should feel seen and every tournament should feel worthy of the talent taking part.</p>
          </div>
        </article>
      </div>
      <div className="viva-stat-grid">
        <Stat value={tournamentsCount} label="Tournament editions" />
        <Stat value={teamsCount} label="Teams participated" />
        <Stat value={playersCount} label="Players registered" />
        <Stat value={matchesCount} label="Matches hosted" />
      </div>
    </PremiumSection>
  );
}

function TournamentEditions({ seasons }) {
  const editionItems = seasons.length
    ? seasons.slice(0, 3)
    : [
        { id: "current", season: "Current", tournamentName: "Current Edition", description: "Live standings, fixtures and performances." },
        { id: "upcoming", season: "Upcoming", tournamentName: "Upcoming Edition", description: "The next competition calendar." },
        { id: "past", season: "Past", tournamentName: "Past Editions", description: "Champions, awards and memories." },
      ];

  return (
    <PremiumSection eyebrow="Tournament Editions" title="CURRENT, UPCOMING AND PAST" copy="A cleaner gateway into the tournament history and active season." action="Explore seasons" href="/seasons">
      <div className="grid gap-5 md:grid-cols-3">
        {editionItems.map((season) => (
          <motion.article whileHover={{ y: -8 }} className="premium-card viva-edition-card" key={season.id || season.season}>
            <p className="viva-kicker">{season.season || season.year || "Edition"}</p>
            <h3>{season.tournamentName || season.title || season.champion || "Viva Sports Edition"}</h3>
            <p>{season.description || season.specialMoments || "Fixtures, teams, awards and the story of the season."}</p>
            <Link href="/seasons">View details <ArrowRight /></Link>
          </motion.article>
        ))}
      </div>
    </PremiumSection>
  );
}

function Gallery({ images }) {
  return (
    <PremiumSection eyebrow="Gallery" title="MATCHDAY MOMENTS" copy="A fast moving visual strip from the Viva Sports community." action="Open gallery" href="/gallery">
      <div className="viva-filter-row">
        {["All", "Matchday", "Awards", "Teams"].map((item) => <button type="button" key={item}>{item}</button>)}
      </div>
      <div className="viva-gallery-marquee">
        {[...images, ...images].map((src, index) => (
          <Link href="/gallery" className="viva-gallery-tile" key={`${src}-${index}`}>
            <Image src={src} alt={`Viva Sports gallery moment ${index + 1}`} fill sizes="280px" className="object-cover" unoptimized />
            <span><Camera /></span>
          </Link>
        ))}
      </div>
    </PremiumSection>
  );
}

function Sponsors({ sponsors }) {
  return (
    <PremiumSection eyebrow="Sponsors" title="PARTNERS BACKING THE GAME" copy="Sponsor cards with category, story and a direct path to partner visibility.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {sponsors.slice(0, 8).map((sponsor) => (
          <motion.article whileHover={{ y: -8 }} className="premium-card viva-sponsor-card" key={sponsor.id}>
            <p className="viva-kicker">{sponsor.category || "Sponsor"}</p>
            <div><Image src={sponsor.image} alt={sponsor.name} width={240} height={120} className="h-full w-full object-contain" /></div>
            <h3>{sponsor.name}</h3>
            <span>Supporting professional community cricket experiences.</span>
            <Link href="/sponsors">Visit profile <ExternalLink /></Link>
          </motion.article>
        ))}
      </div>
    </PremiumSection>
  );
}

function Testimonials({ items }) {
  return (
    <PremiumSection eyebrow="Testimonials" title="TRUSTED BY CAPTAINS AND TEAMS" copy="Voices from the people building the tournament from the middle.">
      <div className="viva-testimonial-grid">
        {items.slice(0, 6).map((item, index) => (
          <blockquote className="premium-card" key={`${item.name}-${index}`}>
            <div className="viva-avatar">{String(item.name || "C").slice(0, 1)}</div>
            <div className="viva-stars">*****</div>
            <p>&quot;{item.quote}&quot;</p>
            <footer><strong>{item.name}</strong><span>{item.role || item.team || "Viva Sports community"}</span></footer>
          </blockquote>
        ))}
      </div>
    </PremiumSection>
  );
}

function Registration() {
  const closeDate = new Date("2026-07-14T23:59:59+05:30");
  const daysRemaining = Math.max(0, Math.ceil((closeDate.getTime() - Date.now()) / 86400000));

  return (
    <section id="register" className="viva-registration">
      <div className="viva-container viva-registration-cta">
        <div className="viva-registration-copy">
          <p className="viva-kicker">Registrations Open</p>
          <h2>Ready to compete in Hyderabad&apos;s most professional cricket league?</h2>
          <p>Register your team for the upcoming Viva Sports edition through a dedicated tournament entry portal built for rosters, documents, payment proof and verification.</p>
          <Link href="/register" className="viva-button viva-button-gold">
            Register Your Team <ArrowRight />
          </Link>
        </div>
        <div className="viva-registration-countdown premium-card" aria-label="Registration countdown">
          <span>Registration closes in</span>
          <strong>{daysRemaining}</strong>
          <p>{daysRemaining === 1 ? "Day" : "Days"}</p>
          <Link href="/register/status">Check registration status <ArrowRight /></Link>
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
      {action && href && <Link href={href} className="viva-section-link">{action}<ChevronRight /></Link>}
    </div>
  );
}

function LiveCard({ match }) {
  return (
    <motion.article whileHover={{ y: -8 }} className="viva-live-card premium-card">
      <div className="viva-live-top"><span className="viva-live-pill"><i /> Live</span><span>{match.ground || "Venue TBA"}</span></div>
      <div className="viva-versus">
        <div><small>Batting</small><h3>{match.battingTeam || match.teamA}</h3></div>
        <strong>{scoreLine(match)}<small>{oversLine(match)} ov</small></strong>
      </div>
      <div className="viva-match-opponent"><span>vs</span><b>{match.bowlingTeam || match.teamB}</b><em>{match.matchStage || "League"}</em></div>
      <div className="viva-match-metrics">
        <Metric label="CRR" value={getRunRate(match.score || 0, match.totalBalls || 0)} />
        <Metric label="RRR" value={getRequiredRate(match)} />
        <Metric label="Need" value={getNeedLine(match) || "-"} />
      </div>
      <Link href={`/live/${match.id}`} className="viva-card-link">Watch live <ArrowRight /></Link>
    </motion.article>
  );
}

function FixtureCard({ match }) {
  return (
    <motion.article whileHover={{ y: -8 }} className="viva-fixture-card premium-card">
      <div className="viva-fixture-meta"><CalendarDays /><span>{formatSchedule(match)}</span></div>
      <div className="viva-countdown">{getCountdown(match)}</div>
      <p>{match.matchStage || "Upcoming match"}</p>
      <h3>{match.teamA}</h3><span className="viva-vs">VS</span><h3>{match.teamB}</h3>
      <div className="viva-venue"><MapPin />{match.ground || "Venue to be announced"}</div>
      <Link href={`/live/${match.id}`}>View fixture <ArrowRight /></Link>
    </motion.article>
  );
}

function Standings({ teams }) {
  return (
    <div className="viva-standings premium-card">
      <div className="viva-table-head"><span>Pos</span><span>Team</span><span>P</span><span>W</span><span>NRR</span><span>Pts</span></div>
      {teams.map((team, index) => (
        <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="viva-table-row" key={team.id || team.name}>
          <span className="viva-position">{index + 1}</span><strong>{team.name}</strong><span>{team.played || 0}</span><span>{team.won || 0}</span><span>{Number(team.nrr || 0).toFixed(2)}</span><b>{team.points || 0}</b>
        </motion.div>
      ))}
    </div>
  );
}

function Leader({ icon: Icon, label, player, value }) {
  return (
    <motion.article whileHover={{ y: -8 }} className="viva-leader-card premium-card">
      <span><Icon /></span>
      <div className="viva-avatar">{playerName(player).slice(0, 1)}</div>
      <p>{label}</p>
      <h3>{playerName(player)}</h3>
      <strong>{value}</strong>
      <Link href={`/player/${player?.id || ""}`}>Profile <ArrowRight /></Link>
    </motion.article>
  );
}

function MiniPanel({ title, icon: Icon, items, href }) {
  const visibleItems = items.filter(Boolean).slice(0, 5);
  return (
    <article className="premium-card viva-mini-panel">
      <div><Icon /><h3>{title}</h3></div>
      {visibleItems.length ? visibleItems.map((item, index) => <p key={`${item}-${index}`}>{item}</p>) : <p>Updates will appear from live match and stats data.</p>}
      <Link href={href}>Open <ArrowRight /></Link>
    </article>
  );
}

function Metric({ label, value }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}

function Stat({ value, label }) {
  return (
    <motion.article className="viva-stat" whileInView={{ opacity: [0, 1], y: [16, 0] }} viewport={{ once: true }}>
      <CountUpValue value={value} /><span>{label}</span>
    </motion.article>
  );
}

function CountUpValue({ value }) {
  const numeric = Number(value);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(numeric)) return;

    let frame = 0;
    const totalFrames = 42;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      setDisplayValue(Math.round(numeric * progress));

      if (frame >= totalFrames) window.clearInterval(timer);
    }, 24);

    return () => window.clearInterval(timer);
  }, [numeric, value]);

  return <strong>{Number.isFinite(numeric) ? displayValue : value}</strong>;
}

function TeamMark({ name }) {
  return (
    <div className="viva-team-mark">
      <span>{teamInitials(name)}</span>
      <strong>{name}</strong>
    </div>
  );
}

function ProfessionalEmpty({ icon: Icon, title, text, href, action, light = false }) {
  return <article className={`viva-empty ${light ? "viva-empty-light" : ""}`}><span><Icon /></span><div><h3>{title}</h3><p>{text}</p></div><Link href={href}>{action}<ArrowRight /></Link></article>;
}

function LoadingCard() {
  return <div className="viva-loading"><span /><span /><span /></div>;
}
