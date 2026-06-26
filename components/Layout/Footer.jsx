import Image from "next/image";
import Link from "next/link";

import Container from "./Container";

const quickLinks = [
  ["Live Matches", "/live"],
  ["Fixtures", "/fixtures"],
  ["Results", "/results"],
  ["Gallery", "/gallery"],
  ["Sponsors", "/sponsors"],
  ["Register", "/register"],
  ["Contact", "/contact"],
];

const tournamentLinks = [
  ["Points Table", "/pointstable"],
  ["Teams", "/teams"],
  ["Players", "/players"],
  ["Leaderboards", "/leaderboards"],
  ["Scorecards", "/results"],
  ["Hall Of Fame", "/hall-of-fame"],
];

const platformLinks = [
  ["Analytics", "/analytics"],
  ["Statistics", "/stats"],
  ["Seasons", "/seasons"],
  ["Match Reports", "/match-reports"],
  ["MVP", "/mvp"],
  ["Power Rankings", "/power-rankings"],
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050B1E]">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-[1.35fr_1fr_1fr_1fr] lg:py-20">
          <div>
            <div className="flex items-center gap-4">
              <span className="relative h-16 w-16 overflow-hidden rounded-full border border-[#F4C95D]/40 bg-black">
                <Image
                  src="/logo.jpeg"
                  alt="Viva Sports"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <div>
                <h2 className="text-3xl font-black tracking-wide text-white">Viva Sports</h2>
                <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#F4C95D]">
                  Premium cricket ecosystem
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#B6C1D9]">
              Live cricket tournaments, fixtures, scoring, statistics,
              leaderboards and community sport presented with professional
              match-day polish.
            </p>
          </div>

          <FooterColumn title="Explore" links={quickLinks} />
          <FooterColumn title="Competition" links={tournamentLinks} />
          <FooterColumn title="Platform" links={platformLinks} />
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-[#B6C1D9] md:flex-row md:items-center md:justify-between">
          <p>Copyright {new Date().getFullYear()} Viva Sports. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="transition hover:text-[#F4C95D]">Instagram</a>
            <a href="#" className="transition hover:text-[#F4C95D]">YouTube</a>
            <a href="#" className="transition hover:text-[#F4C95D]">Facebook</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-5 text-sm font-black uppercase tracking-[.18em] text-white">{title}</h3>
      <div className="space-y-3 text-sm text-[#B6C1D9]">
        {links.map(([label, href]) => (
          <Link
            key={`${label}-${href}`}
            href={href}
            className="block transition hover:text-[#F4C95D]"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
