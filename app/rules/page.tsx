import type { Metadata } from "next";
import OrganizationShell from "@/components/organization/OrganizationShell";

export const metadata: Metadata = {
  title: "Tournament Rules | Viva Sports",
  description: "Core Viva Sports tournament rules, match conduct and registration guidance.",
  alternates: { canonical: "/rules" },
};

const rules = [
  "Final squads, documents and eligibility checks are completed through the registration process.",
  "Fixtures, toss, scoring, revised targets and results are managed through the official match engine.",
  "Teams must follow umpire decisions, venue discipline and tournament committee instructions.",
  "Points table, rankings and statistics are calculated from official match records.",
  "Award decisions use verified scorecards, live scoring data and committee review where required.",
];

export default function Page() {
  return (
    <OrganizationShell>
      <section className="viva-section">
        <div className="viva-container">
          <div className="viva-heading">
            <div>
              <p className="viva-kicker">Tournament</p>
              <h2>Rules</h2>
              <p className="viva-heading-copy">
                The official rulebook can be expanded by the committee as tournament details are finalized.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-4">
            {rules.map((rule, index) => (
              <article className="premium-card p-5" key={rule}>
                <p className="text-sm font-black uppercase text-[#F4C84B]">Rule {index + 1}</p>
                <p className="mt-2 text-lg leading-8 text-[#F8FAFC]">{rule}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </OrganizationShell>
  );
}
