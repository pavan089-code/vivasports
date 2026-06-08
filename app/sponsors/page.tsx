import type { Metadata } from "next";

import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import SponsorGrid from "@/components/sponsors/SponsorGrid";
import { sponsorGroups } from "@/Lib/sponsors";

export const metadata: Metadata = {
  title: "Viva Sports Sponsors",
  description:
    "Official sponsors and partners supporting Viva Sports tournaments and live cricket coverage.",
  alternates: {
    canonical: "/sponsors",
  },
};

export default function SponsorsPage() {
  return (
    <main className="vs-page">
      <Navbar />
      <div className="bg-[radial-gradient(circle_at_top,#18233B_0%,#050914_45%,#020611_100%)] text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-2xl border border-[#D8B45A]/25 bg-[#050914] p-6 shadow-2xl shadow-black/40 sm:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(216,180,90,0.16),transparent_35%,rgba(255,255,255,0.04))]" />
            <div className="relative max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[#D8B45A]">
                Our Tournament Partners
              </p>
              <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">
                Sponsors
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                Official sponsors and partners supporting Viva Sports tournaments,
                live cricket coverage, and competition experiences.
              </p>
            </div>
          </section>

          <section className="space-y-8">
            {sponsorGroups.length ? (
              sponsorGroups.map((group) => (
                <div key={group.key} className="space-y-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D8B45A]">
                      Sponsor Group
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white">
                      {group.title}
                    </h2>
                  </div>
                  <SponsorGrid sponsors={group.sponsors} />
                </div>
              ))
            ) : (
              <SponsorGrid sponsors={[]} />
            )}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
