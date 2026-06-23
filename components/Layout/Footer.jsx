import Image from "next/image";
import Link from "next/link";

import Container from "./Container";

const quickLinks = [
  ["About", "/#about"],
  ["Committee", "/committee"],
  ["Champions", "/champions"],
  ["Fixtures", "/fixtures"],
  ["Results", "/results"],
  ["Live Matches", "/live"],
  ["Gallery", "/gallery"],
  ["Sponsors", "/sponsors"],
  ["History", "/history"],
  ["Contact", "/#contact"],
];

const tournamentLinks = [
  ["Points Table", "/pointstable"],
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
    <footer className="border-t border-[#D8B45A]/20 bg-[#020914]">
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
                <h2 className="font-serif text-2xl text-white">Viva Sports</h2>
                <p className="text-[9px] font-black uppercase tracking-[.18em] text-[#D8B45A]">Play with purpose</p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Promoting sportsmanship, local talent and competitive excellence
              through professionally organized community cricket.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Explore</h3>
            <div className="space-y-2 text-sm text-slate-400">
              {quickLinks.map(([label, href]) => (
                <Link
                  key={`${label}-${href}`}
                  href={href}
                  className="block transition hover:text-[#F1D58A]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Competition</h3>
            <div className="space-y-2 text-sm text-slate-400">
              {tournamentLinks.map(([label, href]) => (
                <Link
                  key={`${label}-${href}`}
                  href={href}
                  className="block transition hover:text-[#F1D58A]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Get involved</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <Link
                href="/sponsors"
                className="block transition hover:text-[#F1D58A]"
              >
                Partner with Viva Sports
              </Link>
              <Link href="/#contact" className="mt-2 block transition hover:text-[#F1D58A]">Register a team</Link>
              <Link href="/#contact" className="mt-2 block transition hover:text-[#F1D58A]">Contact us</Link>
            </div>

            <h3 className="mb-4 mt-7 font-semibold text-white">Social Links</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <a href="#" className="block transition hover:text-[#F1D58A]">Instagram</a>
              <a href="#" className="block transition hover:text-[#F1D58A]">YouTube</a>
              <a href="#" className="block transition hover:text-[#F1D58A]">Facebook</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-sm text-slate-500">
          © {new Date().getFullYear()} Viva Sports. Sportsmanship, talent and competitive excellence.
        </div>
      </Container>
    </footer>
  );
}
