"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  CirclePlay,
  Clock3,
  Mail,
  MapPin,
  Medal,
  MessageCircle,
  Phone,
  Radio,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { getSettings } from "@/services/SettingServices";
import { getAboutSettings, subscribeToOrganizationCollection } from "@/services/organizationService";
import { subscribeToMatches } from "@/services/matchService";
import { getPlayerStats } from "@/services/playerStatsService";
import { subscribeToTeams } from "@/services/teamService";
import { getTopBatters, getTopBowlers } from "@/utils/leaderboardUtils";
import { rankTeams, sortRecentMatches, sortUpcomingMatches } from "@/utils/tournamentUtils";

const liveStatuses = ["live", "paused", "innings_break"];

const capabilityCards = [
  {
    icon: Trophy,
    title: "Tournament Management",
    text: "Well-planned competitions, transparent scheduling and a professional match-day experience for every team.",
  },
  {
    icon: Radio,
    title: "Live Scoring",
    text: "Ball-by-ball updates keep players, families and supporters connected to the action from anywhere.",
  },
  {
    icon: BarChart3,
    title: "Player Statistics",
    text: "Reliable performance records help local talent build a sporting profile that lasts beyond one tournament.",
  },
  {
    icon: Camera,
    title: "Broadcast Support",
    text: "Stream-ready score graphics and match coverage give community cricket a bigger, more polished stage.",
  },
];

function textResult(match) {
  if (typeof match?.result === "string") return match.result;
  return match?.result?.result || (match?.status === "abandoned" ? "No result" : "Match completed");
}

function formatSchedule(match) {
  return [match?.date, match?.time].filter(Boolean).join(" · ") || "Schedule to be announced";
}

function playerName(player) {
  return player?.playerName || player?.name || "";
}

function parseList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  return value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function asUrl(value, fallback = "#") {
  return value && String(value).trim() ? String(value).trim() : fallback;
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
    const stopMatches = subscribeToMatches((data) => {
      setMatches(data);
      setLoading(false);
    }, () => setLoading(false));
    const stopTeams = subscribeToTeams(setTeams, () => setTeams([]));
    const stopSeasons = subscribeToOrganizationCollection("seasons", setSeasons, () => setSeasons([]));

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
    () => sortRecentMatches(matches.filter((match) => ["completed", "abandoned"].includes(match.status))).slice(0, 3),
    [matches]
  );
  const standings = useMemo(() => rankTeams(teams).slice(0, 5), [teams]);
  const topBatter = useMemo(() => getTopBatters(players)[0], [players]);
  const topBowler = useMemo(() => getTopBowlers(players)[0], [players]);
  const mostSixes = useMemo(() => [...players].sort((a, b) => (b.sixes || 0) - (a.sixes || 0))[0], [players]);
  const mostFours = useMemo(() => [...players].sort((a, b) => (b.fours || 0) - (a.fours || 0))[0], [players]);
  const playerOfTournament = settings?.playerOfTournament || settings?.pastPlayerOfTournament || "";
  const galleryImages = parseList(settings?.galleryImages);
  const testimonials = Array.isArray(settings?.testimonials) ? settings.testimonials : [];
  const hasLeaders = Boolean(topBatter || topBowler || playerOfTournament || mostSixes?.sixes || mostFours?.fours);
  const hasHighlights = Boolean(
    settings?.pastChampion || settings?.pastRunnerUp || settings?.pastBestBatter ||
    settings?.pastBestBowler || settings?.pastPlayerOfTournament
  );

  const tournamentsCount = seasons.length || aboutSettings?.tournamentsConducted || settings?.tournamentsConducted || "—";
  const teamsCount = teams.length || aboutSettings?.teamsParticipated || settings?.teamsParticipated || "—";
  const playersCount = players.length || aboutSettings?.playersRegistered || settings?.playersRegistered || "—";
  const matchesCount = matches.length || aboutSettings?.matchesHosted || "—";

  return (
    <div className="viva-home">
      <Hero settings={settings} />

      <section id="about" className="viva-section viva-about">
        <div className="viva-container">
          <SectionHeading
            eyebrow="Who we are"
            title="Building a stronger sporting community"
            copy="Viva Sports brings players, teams and supporters together through well-run competitions, modern technology and a genuine respect for the game."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="viva-story-card">
              <span className="viva-icon"><Target /></span>
              <div>
                <p className="viva-kicker">Our mission</p>
                <h3>Create opportunity. Reward talent. Raise standards.</h3>
                <p>We give local cricketers a credible platform to compete, improve and be recognized—supported by fair organization and reliable match data.</p>
              </div>
            </article>
            <article className="viva-story-card">
              <span className="viva-icon"><Sparkles /></span>
              <div>
                <p className="viva-kicker">Our vision</p>
                <h3>Community sport with a professional future.</h3>
                <p>We want every promising player to feel seen and every tournament to feel worthy of the talent taking part.</p>
              </div>
            </article>
          </div>
          <div className="viva-stat-grid">
            <Stat value={tournamentsCount} label="Tournament seasons" />
            <Stat value={teamsCount} label="Teams participated" />
            <Stat value={playersCount} label="Players registered" />
            <Stat value={matchesCount} label="Matches hosted" />
          </div>
        </div>
      </section>

      <section className="viva-section viva-cream">
        <div className="viva-container">
          <SectionHeading eyebrow="What we do" title="A complete platform for better cricket" copy="From the first fixture to the final presentation, Viva Sports gives every competition structure, visibility and momentum." dark />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {capabilityCards.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="viva-capability-card">
                <span className="viva-card-number">0{index + 1}</span>
                <span className="viva-capability-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="live" className="viva-section viva-data-section">
        <div className="viva-container">
          <SectionHeading eyebrow="Match centre" title="Live cricket, as it happens" copy="Follow the score, match situation and every important moment in real time." action="View live centre" href="/live" />
          <div className="mt-10">
            {loading ? <LoadingCard /> : liveMatches.length ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {liveMatches.slice(0, 4).map((match) => <LiveCard key={match.id} match={match} />)}
              </div>
            ) : (
              <ProfessionalEmpty icon={Clock3} title="No live matches currently in progress." text="The next contest is never far away. Explore the fixture list and plan your match day." href="/fixtures" action="View fixtures" />
            )}
          </div>
        </div>
      </section>

      <section className="viva-section viva-cream">
        <div className="viva-container">
          <SectionHeading eyebrow="On the calendar" title="Upcoming fixtures" copy="The next matches from the current Viva Sports competition calendar." action="View all fixtures" href="/fixtures" dark />
          <div className="mt-10">
            {fixtures.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {fixtures.map((match) => <FixtureCard key={match.id} match={match} />)}
              </div>
            ) : (
              <ProfessionalEmpty icon={CalendarDays} title="The next fixtures are being prepared" text="Team line-ups, venues and start times will appear here as soon as the schedule is confirmed." href="/fixtures" action="Explore fixtures" light />
            )}
          </div>
        </div>
      </section>

      <section className="viva-section viva-data-section">
        <div className="viva-container">
          <SectionHeading eyebrow="Latest action" title="Recent results" copy="Final outcomes from the latest completed Viva Sports matches." action="View all results" href="/results" />
          <div className="mt-10">
            {results.length ? (
              <div className="grid gap-5 lg:grid-cols-3">
                {results.map((match) => <ResultCard key={match.id} match={match} />)}
              </div>
            ) : (
              <ProfessionalEmpty icon={Award} title="Results will take shape when the action begins" text="Completed matches will be published here with the winner, margin and match date." href="/fixtures" action="See what’s ahead" />
            )}
          </div>
        </div>
      </section>

      {standings.length > 0 && (
        <section className="viva-section viva-cream">
          <div className="viva-container">
            <SectionHeading eyebrow="Tournament race" title="Standings preview" copy="The leading five teams based on points and net run rate." action="View full points table" href="/pointstable" dark />
            <Standings teams={standings} />
          </div>
        </section>
      )}

      {hasLeaders && (
        <section className="viva-section viva-leaders">
          <div className="viva-container">
            <SectionHeading eyebrow="Tournament leaders" title="The names setting the standard" copy="Recognizing the players making the biggest impact on this competition." action="All leaderboards" href="/leaderboards" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Leader icon={Target} label="Top batter" name={playerName(topBatter)} value={topBatter ? `${topBatter.runs || 0} runs` : ""} />
              <Leader icon={Zap} label="Top bowler" name={playerName(topBowler)} value={topBowler ? `${topBowler.wickets || 0} wickets` : ""} />
              <Leader icon={Trophy} label="Player of tournament" name={playerOfTournament} value="Outstanding impact" />
              <Leader icon={Sparkles} label="Most sixes" name={playerName(mostSixes)} value={mostSixes?.sixes ? `${mostSixes.sixes} sixes` : ""} />
              <Leader icon={Award} label="Most fours" name={playerName(mostFours)} value={mostFours?.fours ? `${mostFours.fours} fours` : ""} />
            </div>
          </div>
        </section>
      )}

      {hasHighlights && <Highlights settings={settings} />}
      {galleryImages.length > 0 && <Gallery images={galleryImages.slice(0, 8)} />}
      {sponsors?.length > 0 && <Sponsors sponsors={sponsors} />}
      {testimonials.length > 0 && <Testimonials items={testimonials} />}
      <Contact settings={settings} />
    </div>
  );
}

function Hero({ settings }) {
  return (
    <section className="viva-hero">
      <Image src="/viva-cricket-hero.png" alt="Cricketer playing an attacking shot under stadium lights" fill priority sizes="100vw" className="object-cover object-[66%_center]" />
      <div className="viva-hero-shade" />
      <div className="viva-container viva-hero-content">
        <div className="viva-hero-copy">
          <p className="viva-hero-eyebrow"><span /> The home of community cricket</p>
          <h1>Viva<br /><em>Sports</em></h1>
          <h2>Promoting sportsmanship, talent & competitive excellence</h2>
          <p>Supporting local cricket and community sports through professionally organized tournaments and modern technology.</p>
          <div className="viva-hero-actions">
            <Link href="/live" className="viva-button viva-button-gold"><CirclePlay /> View live matches</Link>
            <Link href="/fixtures" className="viva-button viva-button-ghost">Upcoming tournaments</Link>
            <Link href={asUrl(settings?.teamRegistrationUrl, "/contact")} className="viva-button viva-button-ghost">Register team</Link>
            <Link href="#contact" className="viva-button viva-button-text">Contact us <ArrowRight /></Link>
          </div>
        </div>
        <div className="viva-hero-mark" aria-hidden="true"><span>VS</span><small>EST. {settings?.establishedYear || "2021"}</small></div>
      </div>
      <a href="#about" className="viva-scroll-cue" aria-label="Scroll to learn about Viva Sports"><span /> Discover Viva Sports</a>
    </section>
  );
}

function SectionHeading({ eyebrow, title, copy, action, href, dark = false }) {
  return (
    <div className={`viva-heading ${dark ? "viva-heading-dark" : ""}`}>
      <div>
        <p className="viva-kicker">{eyebrow}</p>
        <h2>{title}</h2>
        {copy && <p className="viva-heading-copy">{copy}</p>}
      </div>
      {action && href && <Link href={href} className="viva-section-link">{action}<ChevronRight /></Link>}
    </div>
  );
}

function Stat({ value, label }) {
  return <article className="viva-stat"><strong>{value}</strong><span>{label}</span></article>;
}

function LiveCard({ match }) {
  const score = `${match.score ?? match.currentScore ?? 0}/${match.wickets ?? 0}`;
  return (
    <article className="viva-live-card">
      <div className="viva-live-top"><span className="viva-live-pill"><i /> Live</span><span>{match.ground || "Venue TBA"}</span></div>
      <div className="viva-versus"><div><small>Batting</small><h3>{match.battingTeam || match.teamA}</h3></div><strong>{score}<small>{match.overs || match.currentOvers || "0.0"} ov</small></strong></div>
      <div className="viva-match-opponent"><span>vs</span><b>{match.bowlingTeam || match.teamB}</b><em>{match.matchStage || "League match"}</em></div>
      <Link href={`/live/${match.id}`} className="viva-card-link">Open live match <ArrowRight /></Link>
    </article>
  );
}

function FixtureCard({ match }) {
  return (
    <article className="viva-fixture-card">
      <div className="viva-fixture-meta"><CalendarDays /><span>{formatSchedule(match)}</span></div>
      <p>{match.matchStage || "Upcoming match"}</p>
      <h3>{match.teamA}</h3><span className="viva-vs">VS</span><h3>{match.teamB}</h3>
      <div className="viva-venue"><MapPin />{match.ground || "Venue to be announced"}</div>
      <Link href={`/live/${match.id}`}>Match details <ArrowRight /></Link>
    </article>
  );
}

function ResultCard({ match }) {
  return (
    <article className="viva-result-card">
      <div className="viva-result-date"><CheckCircle2 /> Final <span>{match.date || "Date TBA"}</span></div>
      <p>{match.teamA} <span>vs</span> {match.teamB}</p>
      <h3>{match.winner || "Result confirmed"}</h3>
      <strong>{textResult(match)}</strong>
      <Link href={`/scorecard/${match.id}`}>View scorecard <ArrowRight /></Link>
    </article>
  );
}

function Standings({ teams }) {
  return (
    <div className="viva-standings">
      <div className="viva-table-head"><span>Pos</span><span>Team</span><span>P</span><span>W</span><span>NRR</span><span>Pts</span></div>
      {teams.map((team, index) => (
        <div className="viva-table-row" key={team.id || team.name}>
          <span className="viva-position">{index + 1}</span><strong>{team.name}</strong><span>{team.played || 0}</span><span>{team.won || 0}</span><span>{Number(team.nrr || 0).toFixed(2)}</span><b>{team.points || 0}</b>
        </div>
      ))}
    </div>
  );
}

function Leader({ icon: Icon, label, name, value }) {
  if (!name || !value) return null;
  return <article className="viva-leader-card"><span><Icon /></span><p>{label}</p><h3>{name}</h3><strong>{value}</strong></article>;
}

function Highlights({ settings }) {
  const items = [
    ["Champion", settings.pastChampion, Trophy],
    ["Runner-up", settings.pastRunnerUp, Medal],
    ["Best batter", settings.pastBestBatter, Target],
    ["Best bowler", settings.pastBestBowler, Zap],
    ["Player of tournament", settings.pastPlayerOfTournament, Star],
  ].filter(([, value]) => value);
  return (
    <section className="viva-section viva-cream">
      <div className="viva-container">
        <SectionHeading eyebrow="Honour roll" title="Past tournament highlights" copy="Celebrating the teams and players who left their mark on Viva Sports history." dark />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(([label, value, Icon]) => <article className="viva-honour-card" key={label}><Icon /><p>{label}</p><h3>{value}</h3><span>{settings.pastTournamentName || "Viva Sports Championship"}</span></article>)}
        </div>
      </div>
    </section>
  );
}

function Gallery({ images }) {
  return (
    <section className="viva-section viva-data-section">
      <div className="viva-container">
        <SectionHeading eyebrow="From the boundary" title="Moments that make the game" copy="A glimpse of the energy, emotion and community around Viva Sports." action="View full gallery" href="/gallery" />
        <div className="viva-gallery">
          {images.map((src, index) => <Link href="/gallery" className="viva-gallery-item" key={`${src}-${index}`}><Image src={src} alt={`Viva Sports gallery moment ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" unoptimized /><span><Camera /></span></Link>)}
        </div>
      </div>
    </section>
  );
}

function Sponsors({ sponsors }) {
  const labels = ["Title sponsor", "Powered by", "Equipment partner", "Media partner", "Associate partner"];
  return (
    <section className="viva-section viva-sponsors">
      <div className="viva-container">
        <SectionHeading eyebrow="Our partners" title="Backed by people who believe in the game" copy="Our partners help us create better opportunities and a stronger stage for local sport." dark />
        <div className="viva-sponsor-grid">
          {sponsors.slice(0, 12).map((sponsor, index) => (
            <article className={`viva-sponsor ${index === 0 ? "viva-sponsor-featured" : ""}`} key={sponsor.id}>
              <p>{index < 4 ? labels[index] : labels[4]}</p>
              <div><Image src={sponsor.image} alt={sponsor.name} width={220} height={120} className="h-full w-full object-contain" /></div>
              <span>{sponsor.name}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ items }) {
  return (
    <section className="viva-section viva-data-section">
      <div className="viva-container">
        <SectionHeading eyebrow="Community voices" title="Trusted across the sporting community" copy="What captains, players, sponsors and organizers say about Viva Sports." />
        <div className="viva-testimonials">
          {items.slice(0, 6).map((item, index) => <blockquote key={`${item.name}-${index}`}><div className="viva-stars">★★★★★</div><p>“{item.quote}”</p><footer><strong>{item.name}</strong><span>{item.role}</span></footer></blockquote>)}
        </div>
      </div>
    </section>
  );
}

function Contact({ settings }) {
  const phone = settings?.contactPhone || "+91 00000 00000";
  const email = settings?.contactEmail || "hello@vivasports.in";
  const location = settings?.contactLocation || "India";
  return (
    <section id="contact" className="viva-contact">
      <div className="viva-contact-map" style={settings?.googleMapsEmbed ? { backgroundImage: `linear-gradient(rgba(3,12,26,.76),rgba(3,12,26,.76)),url(${settings.googleMapsEmbed})` } : undefined} />
      <div className="viva-container viva-contact-inner">
        <div><p className="viva-kicker">Let’s play</p><h2>Bring your team into the Viva Sports community.</h2><p>For tournament participation, partnerships or general enquiries, our team would be glad to hear from you.</p><Link href={`mailto:${email}`} className="viva-button viva-button-gold">Contact Viva Sports <ArrowRight /></Link></div>
        <div className="viva-contact-card">
          <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone.replace(/\s/g, "")}`} />
          <ContactRow icon={MessageCircle} label="WhatsApp" value={settings?.whatsapp || phone} href={settings?.whatsappUrl || `https://wa.me/${phone.replace(/\D/g, "")}`} />
          <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
          <ContactRow icon={MapPin} label="Location" value={location} href={settings?.googleMapsUrl || "#"} />
          <div className="viva-socials">
            <a href={settings?.instagramUrl || "#"} aria-label="Instagram"><Camera /></a>
            <a href={settings?.youtubeChannel || "#"} aria-label="YouTube"><CirclePlay /></a>
            <a href={settings?.facebookUrl || "#"} aria-label="Facebook"><Radio /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, label, value, href }) {
  return <a href={href} className="viva-contact-row"><span><Icon /></span><div><small>{label}</small><strong>{value}</strong></div><ChevronRight /></a>;
}

function ProfessionalEmpty({ icon: Icon, title, text, href, action, light = false }) {
  return <article className={`viva-empty ${light ? "viva-empty-light" : ""}`}><span><Icon /></span><div><h3>{title}</h3><p>{text}</p></div><Link href={href}>{action}<ArrowRight /></Link></article>;
}

function LoadingCard() {
  return <div className="viva-loading"><span /><span /><span /></div>;
}
