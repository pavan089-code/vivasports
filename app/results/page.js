import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

import ResultsList from "@/components/results/ResultsList";

export default function ResultsPage() {
  return (
    <main className="bg-[#050B18] min-h-screen">
      <Navbar />

      <ResultsList />

      <Footer />
    </main>
  );
}