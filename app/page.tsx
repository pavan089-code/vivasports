import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import TournamentHighlightsCarousel from "@/components/home/TournamentHighlightsCarousel";
import HomeBelowFold from "@/components/home/HomeBelowFold";
import ScrollToTop from "@/components/ui/ScrollToTop";
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
      <HomeBelowFold sponsors={sponsors} />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
