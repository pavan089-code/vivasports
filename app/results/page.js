import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

import ResultsList from "@/components/results/ResultsList";

export const metadata = {
  title: "Cricket Results",
  description:
    "Follow Viva Sports cricket results, completed match summaries, winners and scorecard links.",
  alternates: {
    canonical: "/results",
  },
};

export default function ResultsPage() {
  return (
    <main className="vs-page">
      <Navbar />

      <ResultsList />

      <Footer />
    </main>
  );
}
