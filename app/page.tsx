import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import TournamentPortal from "@/components/home/TournamentPortal";
import HomepageMatchCenter from "@/components/home/HomepageMatchCenter";
import ScrollingAnnouncementBanner from "@/components/home/ScrollingAnnouncementBanner";
import TournamentSection from "@/components/home/TournamentSection";
import TournamentHighlightsCarousel from "@/components/home/TournamentHighlightsCarousel";
import { sponsors } from "@/Lib/sponsors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Viva Sports | Community Cricket & Professional Tournaments",
  description:
    "Viva Sports promotes local cricket talent through professionally organized tournaments, live scoring and modern sports technology.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className="vs-page">
      <Navbar />
      <TournamentHighlightsCarousel />
      <ScrollingAnnouncementBanner />
      <TournamentSection />
      <HomepageMatchCenter />
      <TournamentPortal sponsors={sponsors} />
      <Footer />
    </main>
  );
}
