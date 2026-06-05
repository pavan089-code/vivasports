import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

import FixturesList from "@/components/fixtures/FixturesList";

export default function FixturesPage() {
  return (
    <main className="vs-page">
      <Navbar />

      <FixturesList />

      <Footer />
    </main>
  );
}
