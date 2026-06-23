import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";

export default function OrganizationShell({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["SportsOrganization", "Organization"],
    name: "Viva Sports",
    url: "https://vivasports.in",
    logo: "https://vivasports.in/logo.jpeg",
    description: "Community cricket organization promoting sportsmanship, local talent and competitive excellence.",
    sport: "Cricket",
  };
  return <main className="vs-page"><Navbar /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />{children}<Footer /></main>;
}
