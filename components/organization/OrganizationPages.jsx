"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, HeartHandshake, Scale, ShieldCheck, Sparkles, Target, Trophy, Users, X } from "lucide-react";

import { getAboutSettings, subscribeToOrganizationCollection } from "@/services/organizationService";

const values = [
  ["Sportsmanship", "Respect for opponents, officials and the spirit of the game.", HeartHandshake],
  ["Fair Play", "Clear competition standards and equal opportunity for every team.", Scale],
  ["Community", "Sport as a way to create stronger, more connected local communities.", Users],
  ["Excellence", "Professional standards in every fixture, score and presentation.", Trophy],
  ["Growth", "A platform where players and organizers can keep moving forward.", Sparkles],
];

function useCollection(name) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => subscribeToOrganizationCollection(name, (data) => { setItems(data); setLoading(false); }, () => setLoading(false)), [name]);
  return { items, loading };
}

function PageHero({ eyebrow, title, text }) {
  return <section className="org-hero"><div className="viva-container"><p>{eyebrow}</p><h1>{title}</h1><span>{text}</span></div></section>;
}

function Empty({ text }) { return <div className="org-empty"><ShieldCheck /><h2>{text}</h2><p>Verified organization information will be published here by the Viva Sports team.</p></div>; }

export function AboutContent() {
  const [about, setAbout] = useState(null);
  useEffect(() => { getAboutSettings().then(setAbout).catch(() => setAbout(null)); }, []);
  const impact = [
    [about?.tournamentsConducted, "Tournaments conducted"], [about?.teamsParticipated, "Teams participated"],
    [about?.playersRegistered, "Players registered"], [about?.matchesHosted, "Matches hosted"], [about?.groundsUsed, "Grounds used"],
  ];
  return <>
    <PageHero eyebrow="Viva Sports" title="Building communities through sport" text="Professional tournaments. Local talent development. Sportsmanship and excellence." />
    <section className="org-section org-light"><div className="viva-container org-story"><div><p className="viva-kicker">Our story</p><h2>Founded with a belief that local sport deserves a professional stage.</h2></div><div><p>{about?.story || "Viva Sports was created to bring structure, visibility and lasting opportunity to community cricket. We combine committed local organization with modern match technology so that players can focus on performing at their best."}</p><div className="org-timeline"><article><b>Why we began</b><span>{about?.foundedPurpose || "To create fair, memorable competitions that recognize local talent."}</span></article><article><b>Where we are going</b><span>{about?.communityImpact || "Toward a stronger sporting ecosystem built around opportunity, trust and participation."}</span></article></div></div></div></section>
    <section className="org-section"><div className="viva-container"><div className="org-duo"><article><Target /><p>Our mission</p><h3>{about?.mission || "Create opportunity, reward talent and raise the standard of community sport."}</h3></article><article><Sparkles /><p>Our vision</p><h3>{about?.vision || "A future where every promising player has a credible platform to be seen."}</h3></article></div></div></section>
    <section className="org-section org-light"><div className="viva-container"><p className="viva-kicker">What guides us</p><h2 className="org-title">Our core values</h2><div className="org-values">{values.map(([title, text, Icon]) => <article key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="org-impact"><div className="viva-container"><p className="viva-kicker">Community impact</p><h2>Our journey in numbers</h2><div>{impact.map(([value, label]) => value ? <article key={label}><strong>{value}</strong><span>{label}</span></article> : null)}</div></div></section>
  </>;
}

export function CommitteeContent() {
  const { items, loading } = useCollection("committee");
  const members = useMemo(() => [...items].sort((a,b) => (a.priority || 99) - (b.priority || 99)), [items]);
  return <><PageHero eyebrow="Leadership" title="The people behind Viva Sports" text="Committed organizers working together for better community sport." /><section className="org-section org-light"><div className="viva-container">{!loading && !members.length ? <Empty text="Leadership profiles are being prepared" /> : <div className="org-people">{members.map((member, index) => <article key={member.id} className={index < 2 ? "featured" : ""}><div>{member.image ? <Image src={member.image} alt={member.name} fill sizes="(max-width: 700px) 100vw, 33vw" className="object-cover" unoptimized /> : <span>{member.name?.slice(0,2).toUpperCase()}</span>}</div><p>{member.role}</p><h2>{member.name}</h2><small>{member.bio}</small></article>)}</div>}</div></section></>;
}

function HonourGrid({ item }) {
  return <div className="org-honours"><article><span>Champion</span><strong>{item.champion}</strong></article><article><span>Runner-up</span><strong>{item.runnerUp}</strong></article><article><span>Best batter</span><strong>{item.bestBatter}</strong></article><article><span>Best bowler</span><strong>{item.bestBowler}</strong></article><article><span>Player of tournament</span><strong>{item.playerOfTournament}</strong></article></div>;
}

export function ChampionsContent() {
  const { items, loading } = useCollection("champions"); const seasons = useMemo(() => [...items].sort((a,b) => String(b.season).localeCompare(String(a.season))), [items]);
  return <><PageHero eyebrow="Hall of champions" title="Where achievement becomes history" text="Celebrating the teams and players who defined every Viva Sports season." /><section className="org-section org-light"><div className="viva-container">{!loading && !seasons.length ? <Empty text="The champions archive is being assembled" /> : <div className="org-seasons">{seasons.map((item) => <article key={item.id}><div className="org-season-year">{item.season}</div><div className="org-season-content"><p className="viva-kicker">{item.tournamentName || `${item.season} Viva Sports League`}</p><h2>{item.champion}</h2><HonourGrid item={item} /></div>{item.teamPhoto && <div className="org-season-photo"><Image src={item.teamPhoto} alt={`${item.champion} champions`} fill sizes="40vw" className="object-cover" unoptimized /></div>}</article>)}</div>}</div></section></>;
}

export function HistoryContent() {
  const { items, loading } = useCollection("history"); const history = useMemo(() => [...items].sort((a,b) => String(b.year).localeCompare(String(a.year))), [items]);
  return <><PageHero eyebrow="Our history" title="A growing legacy of local sport" text="The tournaments, champions and special moments that shaped Viva Sports." /><section className="org-section"><div className="viva-container">{!loading && !history.length ? <Empty text="Our tournament timeline is coming soon" /> : <div className="org-history">{history.map((item) => <article key={item.id}><div><strong>{item.year}</strong><span /></div><section><p className="viva-kicker">{item.tournamentName}</p><h2>{item.champion}</h2><p>Champion · <b>{item.champion}</b> &nbsp; Runner-up · <b>{item.runnerUp}</b></p>{item.specialMoments && <blockquote>{item.specialMoments}</blockquote>}<div>{item.photo && <Image src={item.photo} alt={item.tournamentName} width={520} height={300} unoptimized />}{item.video && <a href={item.video}>Watch season video <ChevronRight /></a>}</div></section></article>)}</div>}</div></section></>;
}

export function GalleryContent() {
  const { items, loading } = useCollection("gallery"); const [active, setActive] = useState("All"); const [selected, setSelected] = useState(null);
  const categories = ["All", "Match Action", "Teams", "Champions", "Award Ceremonies", "Sponsors", "Community Events"];
  const shown = active === "All" ? items : items.filter((item) => item.category === active);
  return <><PageHero eyebrow="Gallery" title="The moments around the match" text="Action, achievement and community—captured across Viva Sports." /><section className="org-section org-light"><div className="viva-container"><div className="org-filters">{categories.map((category) => <button key={category} onClick={() => setActive(category)} className={active === category ? "active" : ""}>{category}</button>)}</div>{!loading && !shown.length ? <Empty text="Gallery moments will appear here" /> : <div className="org-masonry">{shown.map((item) => <button key={item.id} onClick={() => setSelected(item)}><Image src={item.image} alt={item.title || "Viva Sports gallery"} width={700} height={500} unoptimized /><span>{item.category}<strong>{item.title}</strong></span></button>)}</div>}</div></section>{selected && <div className="org-lightbox" role="dialog" aria-modal="true"><button onClick={() => setSelected(null)} aria-label="Close gallery image"><X /></button><Image src={selected.image} alt={selected.title || "Viva Sports gallery"} width={1400} height={900} unoptimized /><p>{selected.title}</p></div>}</>;
}

export function SponsorsContent({ fallbackSponsors }) {
  const { items, loading } = useCollection("sponsors");
  const sponsors = items.length ? items : (fallbackSponsors || []).map((item) => ({ ...item, logo: item.image, description: "Official partner supporting Viva Sports and community cricket." }));
  const order = ["Title Sponsor", "Powered By Sponsor", "Equipment Partner", "Media Partner", "Associate Sponsors", "Community Partners"];
  return <><PageHero eyebrow="Our partners" title="Backing the future of community sport" text="Partners whose support helps local talent compete on a bigger stage." /><section className="org-section org-light"><div className="viva-container">{!loading && !sponsors.length ? <Empty text="Partnership profiles are being prepared" /> : order.map((category) => { const group = sponsors.filter((s) => s.category === category || (category === "Associate Sponsors" && !order.includes(s.category))); if (!group.length) return null; return <section className="org-sponsor-group" key={category}><p className="viva-kicker">{category}</p><div>{group.map((sponsor) => <article key={sponsor.id}><div><Image src={sponsor.logo} alt={sponsor.name} width={260} height={150} className="h-full w-full object-contain" unoptimized /></div><h2>{sponsor.name}</h2><p>{sponsor.description}</p>{sponsor.website && <a href={sponsor.website}>Visit website <ChevronRight /></a>}</article>)}</div></section>; })}</div></section></>;
}
