import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

import FixturesList from "@/components/fixtures/FixturesList";

export default function FixturesPage() {
  return (
    <main className="bg-[#050B18] min-h-screen">
      <Navbar />

      <FixturesList />

      <Footer />
    </main>
  );
}