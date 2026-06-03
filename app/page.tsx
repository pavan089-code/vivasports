import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

import Hero from "@/components/home/Hero";
import MatchCenter from "@/components/home/MatchCenter";

import PointsTablePreview from "@/components/home/PointsTablePreview";
import Sponsors from "@/components/home/Sponsors";

export default function HomePage() {
  return (
    <main className="bg-[#050B18] min-h-screen">
      <Navbar />

      <Hero />

      <MatchCenter />

      <PointsTablePreview />

      <Sponsors />

      <Footer />
    </main>
  );
}