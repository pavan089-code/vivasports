import Container from "../Layout/Container";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";

import upcomingMatches from "../../data/Matches";

export default function UpcomingMatches() {
  return (
    <section className="py-16">
      <Container>

        <SectionTitle
          title="Upcoming Matches"
          subtitle="Stay updated with upcoming fixtures"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {upcomingMatches.map((match) => (
            <Card
              key={match.id}
              className="hover:border-cyan-400 transition-all duration-300"
            >
              <div className="space-y-6">

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">
                    Match {match.id}
                  </span>

                  <span className="text-cyan-400 text-sm font-semibold">
                    Upcoming
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-white text-xl font-bold">
                    {match.teamA}
                  </h3>

                  <p className="text-cyan-400 text-2xl font-black my-4">
                    VS
                  </p>

                  <h3 className="text-white text-xl font-bold">
                    {match.teamB}
                  </h3>
                </div>

                <div className="border-t border-white/10 pt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    {match.date}
                  </span>

                  <span className="text-slate-400">
                    {match.time}
                  </span>
                </div>
              </div>
            </Card>
          ))}

        </div>
      </Container>
    </section>
  );
}