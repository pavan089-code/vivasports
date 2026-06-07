import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import MatchCenter from "@/components/home/MatchCenter";

export const metadata = {
  title: "Cricket Matches",
  description:
    "Explore Viva Sports cricket matches, live games, upcoming fixtures and completed tournament results.",
  alternates: {
    canonical: "/matches",
  },
};

export default function MatchesAliasPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050B18]">
      <Navbar />
      <MatchCenter />
      <Footer />
    </main>
  );
}
