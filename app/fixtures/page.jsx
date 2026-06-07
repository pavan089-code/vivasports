import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

import FixturesList from "@/components/fixtures/FixturesList";

export const metadata = {
  title: "Cricket Fixtures",
  description:
    "View Viva Sports cricket fixtures, upcoming matches, teams, venues and tournament schedules.",
  alternates: {
    canonical: "/fixtures",
  },
};

export default function FixturesPage() {
  return (
    <main className="vs-page">
      <Navbar />

      <FixturesList />

      <Footer />
    </main>
  );
}
