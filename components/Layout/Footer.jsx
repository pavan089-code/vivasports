import Image from "next/image";
import Link from "next/link";

import Container from "./Container";

const quickLinks = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Tournaments", "/seasons"],
  ["Gallery", "/gallery"],
  ["Sponsors", "/sponsors"],
  ["Contact", "/contact"],
];

const tournamentLinks = [
  ["Live Matches", "/live"],
  ["Fixtures", "/fixtures"],
  ["Results", "/results"],
  ["Points Table", "/pointstable"],
  ["Team Rankings", "/power-rankings"],
  ["Player Statistics", "/leaderboards"],
];

const supportLinks = [
  ["Register Team", "/register"],
  ["Rules", "/rules"],
  ["FAQs", "/faqs"],
  ["Hall Of Fame", "/hall-of-fame"],
];

const socialLinks = [
  ["Instagram", "#"],
  ["YouTube", "#"],
  ["Facebook", "#"],
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07152E]">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr] lg:py-20">
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
                <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#F4C84B]">
                  Premium cricket ecosystem
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#AAB8D5]">
              Live cricket tournaments, fixtures, scoring, statistics,
              leaderboards and community sport presented with professional
              match-day polish.
            </p>

            <Link
              href="/sponsors"
              className="mt-7 inline-flex min-h-11 items-center rounded-full bg-[#F4C84B] px-5 text-sm font-black uppercase text-[#07152E] transition hover:bg-[#FFD96A]"
            >
              Become a Sponsor
            </Link>
          </div>

          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Tournament" links={tournamentLinks} />
          <FooterColumn title="Support" links={supportLinks} />
          <FooterColumn title="Social" links={socialLinks} />
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-[#AAB8D5] md:flex-row md:items-center md:justify-between">
          <p>Copyright {new Date().getFullYear()} Viva Sports. All rights reserved.</p>
          <p>Hyderabad cricket tournament platform</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-5 text-sm font-black uppercase tracking-[.18em] text-white">{title}</h3>
      <div className="space-y-3 text-sm text-[#AAB8D5]">
        {links.map(([label, href]) => (
          <Link
            key={`${label}-${href}`}
            href={href}
            className="block transition hover:text-[#F4C84B]"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
