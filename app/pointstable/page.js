import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

import PointsTablePreview from "@/components/home/PointsTablePreview";

export const metadata = {
  title: "Cricket Points Table",
  description:
    "View the Viva Sports cricket points table with team rankings, points, matches played and net run rate.",
  alternates: {
    canonical: "/pointstable",
  },
};

export default function PointsTablePage() {
  return (
    <main className="vs-page">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-10">
        <h1 className="text-5xl font-black text-white mb-3">
          Tournament Standings
        </h1>

        <p className="text-slate-400 mb-10">
          Live points table updated automatically after every match.
        </p>
      </div>

      <PointsTablePreview />

      <Footer />
    </main>
  );
}
