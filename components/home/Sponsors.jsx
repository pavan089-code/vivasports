import Container from "../Layout/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";

import sponsors from "../../data/Sponsers";

export default function Sponsors() {
  return (
    <section className="py-16">
      <Container>

        <SectionTitle
          title="Sponsors"
          subtitle="Proud partners of Viva Sports"
          align="center"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {sponsors.map((sponsor, index) => (
            <Card
              key={index}
              className="flex items-center justify-center h-28 hover:border-cyan-400 transition-all duration-300"
            >
              <h3 className="text-white font-bold text-lg">
                {sponsor}
              </h3>
            </Card>
          ))}

        </div>
      </Container>
    </section>
  );
}
