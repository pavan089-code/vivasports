"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { Sponsor } from "@/Lib/sponsors";
import { getHomepageData, type HomepageData } from "@/services/homepageService";
import ScrollingAnnouncementBanner from "./ScrollingAnnouncementBanner";

const CurrentTournamentHub = dynamic(() => import("./CurrentTournamentHub"), { loading: SectionLoader });
const TournamentStatistics = dynamic(() => import("./TournamentStatistics"), { loading: SectionLoader });
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
    type: String(item.type || item.label || "Announcement"),
    message: String(item.message || item.text || item.title || ""),
  })).filter((item) => item.message) ?? [];

  return <>
    {announcements.length > 0 && <ScrollingAnnouncementBanner announcements={announcements} />}
    <CurrentTournamentHub data={data} loading={!data} />
    <TournamentStatistics statistics={data?.statistics ?? null} loading={!data} />
    <TournamentPortal data={data} loading={!data} />
  </>;
}

function SectionLoader() {
  return <div aria-label="Loading homepage section" className="mx-auto my-20 h-64 w-[calc(100%-1.5rem)] max-w-7xl animate-pulse rounded-[2rem] bg-white/5 md:w-[calc(100%-3rem)]" />;
}
