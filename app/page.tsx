import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import TournamentPortal from "@/components/home/TournamentPortal";

export default function HomePage() {
  return (
    <main className="vs-page">
      <Navbar />
      <TournamentPortal />
      <Footer />
    </main>
  );
}
