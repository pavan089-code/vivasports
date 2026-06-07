import Image from "next/image";
import Link from "next/link";

import Container from "./Container";

const quickLinks = [
  ["Home", "/"],
  ["Live", "/live"],
  ["Fixtures", "/fixtures"],
  ["Results", "/results"],
  ["Points Table", "/pointstable"],
];

const tournamentLinks = [
  ["Teams", "/teams"],
  ["Players", "/players"],
  ["Leaderboards", "/leaderboards"],
  ["Awards", "/awards"],
  ["Analytics", "/analytics"],
  ["Statistics", "/stats"],
  ["Seasons", "/seasons"],
  ["Hall Of Fame", "/hall-of-fame"],
  ["Rivalries", "/rivalries"],
  ["Milestones", "/milestones"],
  ["Match Reports", "/match-reports"],
  ["MVP", "/mvp"],
  ["Fantasy", "/fantasy"],
  ["Power Rankings", "/power-rankings"],
  ["Awards History", "/awards-history"],
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#D8B45A]/20 bg-[#020611]">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative h-14 w-14 overflow-hidden rounded-full border border-[#D8B45A]/40 bg-black">
                <Image
                  src="/logo.jpeg"
                  alt="Viva Sports"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
              <div>
                <h2 className="text-2xl font-black text-white">Viva Sports</h2>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Premium live cricket coverage, tournament standings, match
              centres, player records and broadcast-ready competition updates.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
            <div className="space-y-2 text-sm text-slate-400">
              {quickLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block transition hover:text-[#F1D58A]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Tournament Info</h3>
            <div className="space-y-2 text-sm text-slate-400">
              {tournamentLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block transition hover:text-[#F1D58A]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Sponsors</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>Gold Sponsors</p>
              <p>Silver Sponsors</p>
              <p>Partner Sponsors</p>
            </div>

            <h3 className="mb-4 mt-7 font-semibold text-white">Social Links</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>Instagram</p>
              <p>YouTube</p>
              <p>Facebook</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-sm text-slate-500">
          Viva Sports. Built for premium tournament coverage.
        </div>
      </Container>
    </footer>
  );
}
