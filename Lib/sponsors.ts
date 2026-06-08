import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

export interface Sponsor {
  id: string;
  name: string;
  category: string;
  group: SponsorGroupKey;
  image: string;
}

export type SponsorGroupKey =
  | "title"
  | "tournament"
  | "major"
  | "prize"
  | "runnerUp"
  | "seriesPrize";

export interface SponsorGroup {
  key: SponsorGroupKey;
  title: string;
  sponsors: Sponsor[];
}

const sponsorsDirectory = path.join(process.cwd(), "public", "sponsors");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg"]);

const sponsorMetadata: Record<
  string,
  Pick<Sponsor, "category" | "group" | "name">
> = {
  sp1: {
    name: "USA Sponsors",
    category: "Title Sponsor",
    group: "title",
  },
  sp2: {
    name: "Cup Sponsor",
    category: "Cup Sponsor",
    group: "tournament",
  },
  sp3: {
    name: "Tournament Sponsor",
    category: "Official Tournament Sponsor",
    group: "tournament",
  },
  sp4: {
    name: "United Cricket Fest",
    category: "Major Sponsor",
    group: "major",
  },
  sp5: {
    name: "United Cricket Fest",
    category: "Major Sponsor",
    group: "major",
  },
  sp6: {
    name: "United Cricket Fest",
    category: "Major Sponsor",
    group: "major",
  },
  sp7: {
    name: "United Cricket Fest",
    category: "Major Sponsor",
    group: "major",
  },
  sp8: {
    name: "Man of the Series Sponsor",
    category: "Prize Sponsor",
    group: "prize",
  },
  sp9: {
    name: "Man of the Series Sponsor",
    category: "Prize Sponsor",
    group: "prize",
  },
  sp10: {
    name: "Runner-Up Prize Sponsor",
    category: "Runner-Up Prize Sponsor",
    group: "runnerUp",
  },
  sp11: {
    name: "Runner-Up Prize Sponsor",
    category: "Runner-Up Prize Sponsor",
    group: "runnerUp",
  },
  sp12: {
    name: "Man of the Series Prize Sponsor",
    category: "Man of the Series Prize Sponsor",
    group: "seriesPrize",
  },
};

const sponsorGroupOrder: Array<Pick<SponsorGroup, "key" | "title">> = [
  { key: "title", title: "🏆 Title Sponsors" },
  { key: "tournament", title: "🏏 Tournament Sponsors" },
  { key: "major", title: "⭐ Major Sponsors" },
  { key: "prize", title: "💰 Prize Sponsors" },
  { key: "runnerUp", title: "🥈 Runner-Up Prize Sponsors" },
  { key: "seriesPrize", title: "🏆 Man of the Series Prize Sponsor" },
];

function toFallbackName(value: string) {
  return value.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
}

export const sponsors: Sponsor[] = existsSync(sponsorsDirectory)
  ? readdirSync(sponsorsDirectory, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((filename) => supportedExtensions.has(path.extname(filename).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
      .map((filename) => ({
        id: filename.replace(/\.[^.]+$/, "").toLowerCase(),
        name:
          sponsorMetadata[filename.replace(/\.[^.]+$/, "").toLowerCase()]?.name ||
          toFallbackName(filename),
        category:
          sponsorMetadata[filename.replace(/\.[^.]+$/, "").toLowerCase()]?.category ||
          "Sponsor",
        group:
          sponsorMetadata[filename.replace(/\.[^.]+$/, "").toLowerCase()]?.group ||
          "major",
        image: `/sponsors/${filename}`,
      }))
  : [];

export const featuredSponsor =
  sponsors.find((sponsor) => sponsor.id === "sp1") || sponsors[0] || null;

export const sponsorGroups: SponsorGroup[] = sponsorGroupOrder
  .map((group) => ({
    ...group,
    sponsors: sponsors.filter((sponsor) => sponsor.group === group.key),
  }))
  .filter((group) => group.sponsors.length > 0);
