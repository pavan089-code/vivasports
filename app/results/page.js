import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

import ResultsList from "@/components/results/ResultsList";

export default function ResultsPage() {
  return (
    <main className="vs-page">
      <Navbar />

      <ResultsList />

      <Footer />
    </main>
  );
}
