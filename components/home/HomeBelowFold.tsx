"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { Sponsor } from "@/Lib/sponsors";
import { getHomepageData, type HomepageData } from "@/services/homepageService";
import ScrollingAnnouncementBanner from "./ScrollingAnnouncementBanner";

const CurrentTournamentHub = dynamic(() => import("./CurrentTournamentHub"), { loading: SectionLoader });
const TournamentSection = dynamic(() => import("./TournamentSection"), { loading: SectionLoader });
const TournamentPortal = dynamic(() => import("./TournamentPortal"), { loading: SectionLoader });

export default function HomeBelowFold({ sponsors }: { sponsors: Sponsor[] }) {
  const [data, setData] = useState<HomepageData | null>(null);

  useEffect(() => {
    let active = true;
    getHomepageData(sponsors).then((result) => {
      if (active) setData(result);
    });
    return () => { active = false; };
  }, [sponsors]);

  const announcements = data?.announcements.map((item) => ({
    title: String(item.title || item.type || item.label || "Viva Sports update"),
    description: String(item.description || item.message || item.text || ""),
    status: String(item.status || item.badge || item.type || "Latest"),
    image: String(item.thumbnail || item.image || "/highlights/match-night.png"),
    cta: String(item.cta || item.buttonText || ""),
    href: String(item.href || item.buttonLink || ""),
  })).filter((item) => item.title || item.description) ?? [];

  return <>
    <ScrollingAnnouncementBanner announcements={announcements.length ? announcements : undefined} />
    <TournamentSection data={data} />
    <CurrentTournamentHub data={data} loading={!data} />
    <TournamentPortal data={data} fallbackSponsors={sponsors} loading={!data} />
  </>;
}

function SectionLoader() {
  return <div aria-label="Loading homepage section" className="mx-auto my-14 h-64 w-[calc(100%-1.5rem)] max-w-7xl animate-pulse rounded-[2rem] bg-white/5 md:my-16 md:w-[calc(100%-3rem)]" />;
}
