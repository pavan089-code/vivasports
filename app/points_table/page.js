import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

import PointsTablePreview from "@/components/home/PointsTablePreview";

export default function PointsTablePage() {
  return (
    <main className="min-h-screen bg-[#050B18]">
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