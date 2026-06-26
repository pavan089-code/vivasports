import type { Metadata } from "next";
import OrganizationShell from "@/components/organization/OrganizationShell";

export const metadata: Metadata = {
  title: "FAQs | Viva Sports",
  description: "Frequently asked questions for Viva Sports teams, players and supporters.",
  alternates: { canonical: "/faqs" },
};

const faqs = [
  {
    question: "Where do teams register?",
    answer: "Team registration happens only on the dedicated /register page.",
  },
  {
    question: "Where can supporters follow live matches?",
    answer: "Live fixtures appear in the Live Match Center and on individual live match pages when scorers start a match.",
  },
  {
    question: "How are standings calculated?",
    answer: "The points table uses the existing Viva Sports ranking logic from official team and match records.",
  },
  {
    question: "Where are player statistics shown?",
    answer: "Player performance appears across leaderboards, player profiles and live match scorecards.",
  },
];

export default function Page() {
  return (
    <OrganizationShell>
      <section className="viva-section">
        <div className="viva-container">
          <div className="viva-heading">
            <div>
              <p className="viva-kicker">Support</p>
              <h2>FAQs</h2>
              <p className="viva-heading-copy">
                Quick answers for teams, captains, supporters and sponsors.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map((item) => (
              <article className="premium-card p-6" key={item.question}>
                <h3 className="text-2xl font-black text-[#F8FAFC]">{item.question}</h3>
                <p className="mt-3 leading-7 text-[#AAB8D5]">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </OrganizationShell>
  );
}
