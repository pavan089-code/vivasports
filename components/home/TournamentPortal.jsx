"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  CalendarDays,
  ChevronRight,
  CirclePlay,
  Medal,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";

import sponsors from "@/data/Sponsers";
import { getSettings } from "@/services/SettingServices";
import { subscribeToMatches } from "@/services/matchService";
import { getPlayerStats } from "@/services/playerStatsService";
import { subscribeToTeams } from "@/services/teamService";
import {
  getTopBatters,
  getTopBowlers,
} from "@/utils/leaderboardUtils";
import {
  rankTeams,
  sortRecentMatches,
  sortUpcomingMatches,
} from "@/utils/tournamentUtils";
import {
  getAwards,
  getMatchAnalytics,
  getTournamentStats,
} from "@/utils/tournamentAnalyticsUtils";

const liveStatuses = ["live", "paused", "innings_break"];

const quickLinks = [
  { label: "Teams", href: "/teams", icon: Shield },
  { label: "Players", href: "/players", icon: Users },
  { label: "Leaderboards", href: "/leaderboards", icon: Trophy },
  { label: "Awards", href: "/awards", icon: Medal },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Statistics", href: "/stats", icon: Star },
];

function getResultText(match) {
  if (!match?.result) return match?.status === "abandoned" ? "No Result" : "Completed";
  if (typeof match.result === "string") return match.result;
  return match.result.result || "Completed";
}

function getScoreLine(match) {
  return `${match.score ?? match.currentScore ?? 0}/${match.wickets ?? 0}`;
}

function getOversLine(match) {
  return match.overs || match.currentOvers || "0.0";
}

function formatDateTime(match) {
  return [match.date, match.time].filter(Boolean).join(" | ") || "Schedule TBA";
}

function formatNrr(value) {
  return Number(value || 0).toFixed(3);
}

function getTournamentStatus(liveCount, upcomingCount, completedCount) {
  if (liveCount > 0) return "Live Now";
  if (upcomingCount > 0) return "In Progress";
  if (completedCount > 0) return "Completed";
  return "Setup";
}

function getTournamentStage(settings, matches) {
  if (settings?.tournamentStage) return settings.tournamentStage;

  const completed = matches.filter(
    (match) => match.status === "completed" || match.status === "abandoned"
  ).length;
  const remaining = matches.length - completed;

  if (remaining === 1 && matches.length > 1) return "Final";
  if (remaining <= 2 && matches.length > 3) return "Semi Final";
  return "League Stage";
}

function formatStageLabel(stage) {
  if (!stage) return "LEAGUE STAGE";
  if (stage === "Semi Final") return "SEMI FINAL STAGE";
  if (stage === "League Stage") return "LEAGUE STAGE";
  if (stage === "Final") return "FINAL";
  return String(stage).toUpperCase();
}

function getRequiredLine(match) {
  const target = match.revisedTarget || match.target;
  const score = match.score ?? match.currentScore ?? 0;
  const wickets = match.wickets ?? 0;
  const ballsUsed = match.totalBalls || 0;
  const oversLimit = match.revisedOvers || match.oversLimit || 0;
  const ballsLimit = oversLimit ? Number(oversLimit) * 6 : 0;

  if (!target || !ballsLimit || wickets >= 10) {
    return {
      runs: "-",
      balls: "-",
      label: "Target not set",
    };
  }

  return {
    runs: Math.max(target - score, 0),
    balls: Math.max(ballsLimit - ballsUsed, 0),
    label: `Need ${Math.max(target - score, 0)} from ${Math.max(
      ballsLimit - ballsUsed,
      0
    )}`,
  };
}

function getMatchPriority(match) {
  if (match.featured) return 1;

  const stage = String(match.matchStage || "").toLowerCase();
  if (stage.includes("final") && !stage.includes("semi") && !stage.includes("quarter")) return 2;
  if (stage.includes("semi")) return 3;
  if (stage.includes("quarter")) return 4;
  return 5;
}

function sortLiveMatches(matches) {
  return [...matches].sort((a, b) => getMatchPriority(a) - getMatchPriority(b));
}

function getBestStrikeRate(players) {
  return [...players]
    .filter((player) => (player.runs || 0) > 0 && (player.ballsFaced || 0) > 0)
    .sort((a, b) => {
      if ((b.strikeRate || 0) !== (a.strikeRate || 0)) {
        return (b.strikeRate || 0) - (a.strikeRate || 0);
      }

      return (b.runs || 0) - (a.runs || 0);
    })[0];
}

function splitSponsorTiers(items) {
  return {
    gold: items.slice(0, 2),
    silver: items.slice(2, 4),
    partners: items.slice(4),
  };
}

export default function TournamentPortal() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeMatches = subscribeToMatches((data) => {
      setMatches(data);
      setLoading(false);
    });
    const unsubscribeTeams = subscribeToTeams((data) => {
      setTeams(data);
    });

    getPlayerStats().then(setPlayers).catch(() => setPlayers([]));
    getSettings().then(setSettings).catch(() => setSettings(null));

    return () => {
      unsubscribeMatches();
      unsubscribeTeams();
    };
  }, []);

  const liveMatches = useMemo(
    () => sortLiveMatches(matches.filter((match) => liveStatuses.includes(match.status))),
    [matches]
  );
  const upcomingMatches = useMemo(
    () =>
      sortUpcomingMatches(
        matches.filter((match) => match.status === "scheduled")
      ).slice(0, 4),
    [matches]
  );
  const recentResults = useMemo(
    () =>
      sortRecentMatches(
        matches.filter(
          (match) => match.status === "completed" || match.status === "abandoned"
        )
      ).slice(0, 3),
    [matches]
  );
  const primaryLiveMatch = liveMatches[0];
  const secondaryLiveMatches = liveMatches.slice(1);
  const rankedTeams = useMemo(() => rankTeams(teams), [teams]);
  const topBatter = useMemo(() => getTopBatters(players)[0], [players]);
  const topBowler = useMemo(() => getTopBowlers(players)[0], [players]);
  const bestStrikeRate = useMemo(() => getBestStrikeRate(players), [players]);
  const awards = useMemo(() => getAwards(players, matches), [players, matches]);
  const tournamentStats = useMemo(
    () => getTournamentStats(matches, players),
    [matches, players]
  );
  const matchAnalytics = useMemo(() => getMatchAnalytics(matches), [matches]);

  const completedCount = matches.filter(
    (match) => match.status === "completed" || match.status === "abandoned"
  ).length;
  const remainingCount = Math.max(matches.length - completedCount, 0);
  const tournamentName =
    settings?.tournamentName || settings?.name || "Viva Sports Championship";
  const tournamentStage = getTournamentStage(settings, matches);
  const tournamentStatus = getTournamentStatus(
    liveMatches.length,
    upcomingMatches.length,
    completedCount
  );
  const sponsorTiers = splitSponsorTiers(sponsors);

  return (
    <div className="bg-[radial-gradient(circle_at_top,#18233B_0%,#050914_45%,#020611_100%)] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:gap-10 sm:px-6 sm:py-6 lg:px-8">
        <section className="space-y-4">
          <SectionHeader
            icon={CirclePlay}
            title="Live Match Center"
            subtitle="Score, stream and match situation"
            href="/live"
            action="Live Centre"
          />
          {loading ? (
            <SkeletonGrid />
          ) : primaryLiveMatch ? (
            <div className="space-y-4">
              <LiveMatchCard
                match={primaryLiveMatch}
                tournamentName={primaryLiveMatch.tournamentName || tournamentName}
                tournamentYear={primaryLiveMatch.tournamentYear}
              />
              {secondaryLiveMatches.length > 0 && (
                <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
                  <div className="flex snap-x gap-4">
                    {secondaryLiveMatches.map((match) => (
                      <div key={match.id} className="w-[86vw] shrink-0 snap-start sm:w-[26rem]">
                        <CompactLiveMatchCard match={match} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <RecentResultHero match={recentResults[0]} />
          )}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-5">
            <SectionHeader
              icon={CalendarDays}
              title="Upcoming Matches"
              subtitle="Next fixtures on the tournament calendar"
              href="/fixtures"
              action="All Fixtures"
            />
            {upcomingMatches.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {upcomingMatches.map((match) => (
                  <UpcomingCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <EmptyCard
                title="No fixtures scheduled"
                body="Upcoming matches will appear once the schedule is published."
              />
            )}
          </section>

          <section className="space-y-5">
            <SectionHeader
              icon={Award}
              title="Recent Results"
              subtitle="Latest completed matches"
              href="/results"
              action="All Results"
            />
            {recentResults.length ? (
              <div className="grid gap-4">
                {recentResults.map((match) => (
                  <ResultCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <EmptyCard
                title="No completed matches yet"
                body="Final scores and player awards will appear here."
              />
            )}
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="space-y-5">
            <SectionHeader
              icon={BarChart3}
              title="Points Table Preview"
              subtitle="Top five teams in the race"
              href="/pointstable"
              action="View Full Table"
            />
            <PointsPreview teams={rankedTeams.slice(0, 5)} />
          </section>

          <section className="hidden space-y-5 md:block">
            <SectionHeader
              icon={Trophy}
              title="Top Performers"
              subtitle="Players shaping the tournament"
              href="/leaderboards"
              action="Leaderboards"
            />
            <PerformersPanel
              topBatter={topBatter}
              topBowler={topBowler}
              bestStrikeRate={bestStrikeRate}
              mostPom={awards.mostPlayerOfMatchAwards}
            />
          </section>
        </div>

        <HeroSection
          tournamentName={tournamentName}
          tournamentStage={tournamentStage}
          tournamentStatus={tournamentStatus}
          completedCount={completedCount}
          remainingCount={remainingCount}
          teamsCount={teams.length}
          liveCount={liveMatches.length}
        />

        <SnapshotSection
          teams={teams.length}
          matches={matches.length}
          completed={completedCount}
          live={liveMatches.length}
          upcoming={upcomingMatches.length}
        />

        <SeoOverviewSection />

        <section className="hidden space-y-5 md:block">
          <SectionHeader
            icon={Medal}
            title="Tournament Records"
            subtitle="Headline achievements from completed matches"
            href="/stats"
            action="Statistics"
          />
          <RecordsPanel
            stats={tournamentStats}
            highestPartnership={matchAnalytics.highestPartnerships?.[0]}
          />
        </section>

        <SponsorsSection tiers={sponsorTiers} />

        <section className="hidden space-y-5 pb-6 md:block">
          <SectionHeader
            icon={Sparkles}
            title="Quick Access"
            subtitle="Explore every public tournament section"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between rounded-xl border border-[#D8B45A]/15 bg-[#07101F] p-5 transition hover:border-[#D8B45A]/50 hover:bg-[#0D172A]"
              >
                <span className="flex items-center gap-3 font-bold">
                  <Icon className="h-5 w-5 text-[#D8B45A]" />
                  {label}
                </span>
                <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:text-[#F1D58A]" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function HeroSection({
  tournamentName,
  tournamentStage,
  tournamentStatus,
  completedCount,
  remainingCount,
  teamsCount,
  liveCount,
}) {
  const stageLabel = formatStageLabel(tournamentStage);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#D8B45A]/25 bg-[#050914] p-5 shadow-2xl shadow-black/40 sm:p-8 lg:p-10">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(216,180,90,0.16),transparent_35%,rgba(255,255,255,0.04))]" />
      <div className="absolute right-0 top-0 h-full w-2/5 bg-[radial-gradient(circle_at_center,rgba(216,180,90,0.18),transparent_60%)]" />

      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative h-16 w-16 overflow-hidden rounded-full border border-[#D8B45A]/50 bg-black shadow-xl">
              <Image
                src="/logo.jpeg"
                alt="Viva Sports"
                fill
                sizes="64px"
                className="object-cover"
                priority
              />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#D8B45A]">
                VIVA SPORTS
              </p>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-300">
                {stageLabel}
              </p>
            </div>
          </div>

          <h1 className="mt-7 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">
            {tournamentName}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Competition, prestige and live cricket coverage in one professional
            match centre.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <HeroBadge label="Stage" value={stageLabel} />
            <HeroBadge label="Status" value={tournamentStatus} />
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8B45A]/20 bg-black/35 p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D8B45A]">
                Tournament Pulse
              </p>
              <h2 className="mt-2 text-2xl font-black">Road To Glory</h2>
            </div>
            <Trophy className="h-10 w-10 text-[#D8B45A]" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroMetric label="Matches Completed" value={completedCount} />
            <HeroMetric label="Matches Remaining" value={remainingCount} />
            <HeroMetric label="Teams Participating" value={teamsCount} />
            <HeroMetric label="Live Matches" value={liveCount} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBadge({ label, value }) {
  return (
    <span className="rounded-full border border-[#D8B45A]/30 bg-[#D8B45A]/10 px-4 py-2 text-sm font-bold text-[#F1D58A]">
      {label}: {value}
    </span>
  );
}

function HeroMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center">
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, href, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="rounded-xl border border-[#D8B45A]/20 bg-[#D8B45A]/10 p-2 text-[#D8B45A]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-black sm:text-3xl">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      {href && action && (
        <Link
          href={href}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#D8B45A]/20 bg-[#07101F] px-4 py-2 text-sm font-bold text-[#F1D58A]"
        >
          {action}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function LiveMatchCard({ match, tournamentName, tournamentYear }) {
  const requirement = getRequiredLine(match);
  const stage = match.matchStage || "League Match";
  const rrr =
    match.target && requirement.balls !== "-"
      ? ((Number(requirement.runs) / Math.max(Number(requirement.balls), 1)) * 6).toFixed(2)
      : "-";

  return (
    <article className="overflow-hidden rounded-2xl border border-[#D8B45A]/25 bg-[#07101F] shadow-2xl shadow-black/30">
      <div className="border-b border-white/10 bg-black/25 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--emerald)] px-3 py-1 text-xs font-black uppercase text-white">
              Live
            </span>
            {match.featured && (
              <span className="rounded-full bg-[#D8B45A] px-3 py-1 text-xs font-black uppercase text-[#050914]">
                Featured
              </span>
            )}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-300 sm:text-sm">
            {match.ground || "Ground TBA"}
          </span>
        </div>
        <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-[#D8B45A]">
          {[tournamentName || match.tournamentName, tournamentYear || match.tournamentYear, stage]
            .filter(Boolean)
            .join(" | ")}
        </p>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:p-7">
        <TeamScore
          team={match.battingTeam || match.teamA}
          score={getScoreLine(match)}
          overs={getOversLine(match)}
          highlight
        />
        <div className="text-center text-sm font-black uppercase tracking-[0.22em] text-[#D8B45A]">
          VS
        </div>
        <TeamScore
          team={
            match.battingTeam === match.teamA
              ? match.teamB
              : match.teamA || match.teamB
          }
          score={match.firstInningsScore ? `${match.firstInningsScore}` : "-"}
          overs={match.firstInningsOvers || match.oversLimit || "-"}
        />
      </div>

      <div className="grid gap-3 border-t border-white/10 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center lg:px-7">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <MiniStat label="Target" value={match.target || "-"} />
          <MiniStat label="Need" value={requirement.runs} />
          <MiniStat label="RRR" value={rrr} />
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/live/${match.id}`}
            className="min-h-11 rounded-xl bg-[#D8B45A] px-4 py-2 text-sm font-black uppercase text-[#050914]"
          >
            Watch Live
          </Link>
          <Link
            href={`/scorecard/${match.id}`}
            className="min-h-11 rounded-xl border border-white/10 px-4 py-2 text-sm font-black uppercase text-white"
          >
            Scorecard
          </Link>
        </div>
      </div>
    </article>
  );
}

function TeamScore({ team, score, overs, highlight = false }) {
  return (
    <div className={highlight ? "text-left lg:text-right" : "text-left"}>
      <p className="text-xl font-black uppercase text-white sm:text-3xl">
        {team || "Team TBA"}
      </p>
      <p className="mt-2 text-5xl font-black text-white sm:text-6xl">{score}</p>
      <p className="mt-1 text-sm font-bold uppercase tracking-wider text-slate-400">
        {overs} overs
      </p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-2.5 sm:p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-white sm:text-xl">{value}</p>
    </div>
  );
}

function CompactLiveMatchCard({ match }) {
  return (
    <Link
      href={`/live/${match.id}`}
      className="block rounded-xl border border-[#D8B45A]/20 bg-[#07101F] p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-[var(--emerald)] px-3 py-1 text-xs font-black uppercase text-white">
          {match.matchStage || "Live"}
        </span>
        <span className="text-sm font-bold text-[#F1D58A]">
          {getScoreLine(match)} ({getOversLine(match)})
        </span>
      </div>
      <h3 className="mt-3 text-lg font-black text-white">
        {match.teamA} vs {match.teamB}
      </h3>
      <p className="mt-2 text-sm text-slate-300">{match.ground || "Ground TBA"}</p>
    </Link>
  );
}

function RecentResultHero({ match }) {
  if (!match) {
    return (
      <EmptyCard
        title="No live matches"
        body="Live action and recent results will appear here as soon as matches begin."
      />
    );
  }

  return (
    <article className="rounded-2xl border border-[#D8B45A]/20 bg-[#07101F] p-5 shadow-2xl shadow-black/30">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D8B45A]">
        Most Recent Result
      </p>
      <h2 className="mt-3 text-2xl font-black text-white">
        {match.winner || "No Result"}
      </h2>
      <p className="mt-2 text-lg font-bold text-[var(--vs-success)]">
        {getResultText(match)}
      </p>
      <p className="mt-3 text-slate-300">
        {match.teamA} vs {match.teamB}
      </p>
      <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
        <p>{match.teamA}: {match.firstInningsScore ?? "-"}/{match.firstInningsWickets ?? "-"}</p>
        <p>{match.teamB}: {match.secondInningsScore ?? "-"}/{match.secondInningsWickets ?? "-"}</p>
      </div>
      <Link
        href={`/scorecard/${match.id}`}
        className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#D8B45A] px-4 py-2 text-sm font-black uppercase text-[#050914]"
      >
        View Scorecard
      </Link>
    </article>
  );
}

function SnapshotSection({ teams, matches, completed, live, upcoming }) {
  const cards = [
    ["Teams", teams],
    ["Matches", matches],
    ["Completed", completed],
    ["Live", live],
    ["Upcoming", upcoming],
  ];

  return (
    <section className="hidden gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-5">
      {cards.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-[#D8B45A]/15 bg-[#07101F] p-5"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D8B45A]">
            {label}
          </p>
          <p className="mt-3 text-4xl font-black">{value}</p>
        </div>
      ))}
    </section>
  );
}

function SeoOverviewSection() {
  const highlights = [
    {
      title: "Live Cricket Scores",
      body: "Follow ball-by-ball cricket live scores, match status, required runs, overs and scorecards from the Viva Sports live match centre.",
    },
    {
      title: "Cricket Tournament Management",
      body: "Manage tournament fixtures, teams, players, results, standings and match reports from one professional cricket tournament platform.",
    },
    {
      title: "Fixtures",
      body: "Browse upcoming cricket fixtures with team matchups, venues, dates and schedule updates for every Viva Sports tournament.",
    },
    {
      title: "Results",
      body: "Track completed match results, winners, score summaries and player of the match highlights as soon as games finish.",
    },
    {
      title: "Points Table",
      body: "View the cricket points table with played matches, points, net run rate and team rankings updated throughout the competition.",
    },
    {
      title: "Live Streaming",
      body: "Connect cricket live streaming and broadcast overlays with match scoring so fans can watch and follow the tournament in real time.",
    },
  ];

  return (
    <section className="hidden rounded-2xl border border-[#D8B45A]/15 bg-[#07101F] p-5 sm:p-7 md:block">
      <div className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D8B45A]">
          Viva Sports India
        </p>
        <h2 className="mt-3 text-3xl font-black text-white">
          Cricket live scores, fixtures, results and tournament operations
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          Viva Sports brings cricket tournament management, live scoring,
          points tables, player statistics, match administration and streaming
          tools together for organizers, scorers, teams and fans.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-white/10 bg-black/20 p-4"
          >
            <h2 className="text-xl font-black text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function UpcomingCard({ match }) {
  return (
    <article className="rounded-xl border border-white/10 bg-[#07101F] p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-[#D8B45A]">
        Upcoming Fixture
      </p>
      <h3 className="mt-3 text-lg font-black">
        {match.teamA} vs {match.teamB}
      </h3>
      <p className="mt-3 text-sm text-slate-300">{formatDateTime(match)}</p>
      <p className="mt-1 text-sm text-slate-400">{match.ground || "Ground TBA"}</p>
    </article>
  );
}

function ResultCard({ match }) {
  const playerOfMatch =
    match.playerOfMatch?.playerName || match.playerOfMatch?.name || "To be confirmed";

  return (
    <article className="rounded-xl border border-white/10 bg-[#07101F] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-black">{match.teamA} vs {match.teamB}</h3>
        <Link
          href={`/scorecard/${match.id}`}
          className="text-sm font-bold text-[#F1D58A]"
        >
          Scorecard
        </Link>
      </div>
      <p className="mt-3 text-sm font-bold text-emerald-200">
        Winner: {match.winner || "No Result"}
      </p>
      <p className="mt-1 text-sm text-slate-300">{getResultText(match)}</p>
      <p className="mt-2 text-sm text-[#F1D58A]">
        Player Of Match: {playerOfMatch}
      </p>
    </article>
  );
}

function PointsPreview({ teams }) {
  if (!teams.length) {
    return (
      <EmptyCard
        title="No standings available"
        body="The points table will appear once teams are added."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#D8B45A]/15 bg-[#07101F]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Position</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-center">Played</th>
              <th className="px-4 py-3 text-center">Points</th>
              <th className="px-4 py-3 text-center">NRR</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={team.id || team.name} className="border-b border-white/5">
                <td className="px-4 py-3 font-bold">{index + 1}</td>
                <td className="px-4 py-3 font-bold">{team.name}</td>
                <td className="px-4 py-3 text-center">{team.played || 0}</td>
                <td className="px-4 py-3 text-center font-black text-[#F1D58A]">
                  {team.points || 0}
                </td>
                <td className="px-4 py-3 text-center">{formatNrr(team.nrr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PerformersPanel({ topBatter, topBowler, bestStrikeRate, mostPom }) {
  const rows = [
    {
      label: "Top Run Scorer",
      player: topBatter,
      value: `${topBatter?.runs || 0} runs`,
    },
    {
      label: "Top Wicket Taker",
      player: topBowler,
      value: `${topBowler?.wickets || 0} wickets`,
    },
    {
      label: "Best Strike Rate",
      player: bestStrikeRate,
      value: `${bestStrikeRate?.strikeRate || 0}`,
    },
    {
      label: "Most Player Of Match Awards",
      player: mostPom,
      value: `${mostPom?.awards || 0} awards`,
    },
  ];

  if (!topBatter && !topBowler && !bestStrikeRate && !mostPom) {
    return (
      <EmptyCard
        title="No player statistics available"
        body="Top performers will appear after player statistics are recorded."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <PerformerCard key={row.label} {...row} />
      ))}
    </div>
  );
}

function PerformerCard({ label, player, value }) {
  const playerName = player?.playerName || "To be decided";
  const initials = playerName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-xl border border-white/10 bg-[#07101F] p-4">
      <div className="flex items-center gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D8B45A]/30 bg-black text-sm font-black text-[#F1D58A]">
          {player?.photoUrl ? (
            <Image
              src={player.photoUrl}
              alt={playerName}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            initials || "VS"
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-[#D8B45A]">
            {label}
          </p>
          <p className="truncate text-lg font-black">{playerName}</p>
          <p className="truncate text-sm text-slate-400">
            {player?.teamName || "Team TBA"}
          </p>
        </div>
      </div>
      <p className="mt-4 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function RecordsPanel({ stats, highestPartnership }) {
  const highestTeamScore = stats?.highestTeamScore;
  const highestIndividualScore = stats?.highestIndividualScore;
  const bestBowlingFigures = stats?.bestBowlingFigures;

  const records = [
    {
      label: "Highest Team Score",
      title: highestTeamScore?.battingTeam || "No record yet",
      value: highestTeamScore
        ? `${highestTeamScore.score}/${highestTeamScore.wickets}`
        : "-",
    },
    {
      label: "Highest Individual Score",
      title: highestIndividualScore?.playerName || "No record yet",
      value: highestIndividualScore
        ? `${highestIndividualScore.runs} runs`
        : "-",
    },
    {
      label: "Best Bowling Figures",
      title: bestBowlingFigures?.playerName || "No record yet",
      value: bestBowlingFigures
        ? `${bestBowlingFigures.wickets}/${bestBowlingFigures.runsConceded}`
        : "-",
    },
    {
      label: "Highest Partnership",
      title: highestPartnership
        ? `${highestPartnership.batterA} and ${highestPartnership.batterB}`
        : "No record yet",
      value: highestPartnership ? `${highestPartnership.runs} runs` : "-",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {records.map((record) => (
        <article
          key={record.label}
          className="rounded-xl border border-[#D8B45A]/15 bg-[#07101F] p-5"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[#D8B45A]">
            {record.label}
          </p>
          <h3 className="mt-3 text-lg font-black">{record.title}</h3>
          <p className="mt-2 text-2xl font-black text-white">{record.value}</p>
        </article>
      ))}
    </div>
  );
}

function SponsorsSection({ tiers }) {
  return (
    <section className="hidden space-y-5 md:block">
      <SectionHeader
        icon={Star}
        title="Sponsors"
        subtitle="Tournament partners powering the competition"
      />
      <div className="overflow-hidden rounded-2xl border border-[#D8B45A]/15 bg-[#07101F] p-5">
        <SponsorTier title="Gold Sponsors" items={tiers.gold} emphasis />
        <SponsorTier title="Silver Sponsors" items={tiers.silver} />
        <SponsorTier title="Partner Sponsors" items={tiers.partners} />
      </div>
    </section>
  );
}

function SponsorTier({ title, items, emphasis = false }) {
  if (!items.length) return null;

  return (
    <div className="mb-6 last:mb-0">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#D8B45A]">
        {title}
      </p>
      <div className="overflow-hidden">
        <div className="sponsor-marquee flex w-max gap-3">
          {[...items, ...items].map((sponsor, index) => (
            <div
              key={`${sponsor}-${index}`}
              className={`flex min-w-40 items-center justify-center rounded-xl border bg-black/25 px-5 py-4 text-center font-black uppercase tracking-wide ${
                emphasis
                  ? "border-[#D8B45A]/40 text-[#F1D58A]"
                  : "border-white/10 text-white"
              }`}
            >
              {sponsor}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyCard({ title, body }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D8B45A]/20 bg-[#07101F]/80 p-6 text-center">
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">{body}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4">
      {[0, 1].map((item) => (
        <div
          key={item}
          className="h-72 animate-pulse rounded-2xl border border-white/10 bg-[#07101F]"
        />
      ))}
    </div>
  );
}
