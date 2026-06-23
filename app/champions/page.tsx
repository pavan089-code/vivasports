import type { Metadata } from "next";
import OrganizationShell from "@/components/organization/OrganizationShell";
import { ChampionsContent } from "@/components/organization/OrganizationPages";
export const metadata: Metadata = { title: "Previous Champions | Viva Sports", description: "Explore Viva Sports champions, runners-up and award winners from previous seasons.", alternates: { canonical: "/champions" }, openGraph: { title: "Viva Sports Champions", description: "The teams and players who made Viva Sports history.", type: "website" }, twitter: { card: "summary_large_image" } };
export default function Page() { return <OrganizationShell><ChampionsContent /></OrganizationShell>; }
