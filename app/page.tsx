import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import TournamentPortal from "@/components/home/TournamentPortal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className="vs-page">
      <Navbar />
      <TournamentPortal />
      <Footer />
    </main>
  );
}
