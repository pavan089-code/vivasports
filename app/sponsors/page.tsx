import type { Metadata } from "next";
import OrganizationShell from "@/components/organization/OrganizationShell";
import { SponsorsContent } from "@/components/organization/OrganizationPages";
import { sponsors } from "@/Lib/sponsors";
export const metadata: Metadata = { title: "Sponsors & Partners | Viva Sports", description: "Meet the sponsors and community partners supporting Viva Sports and local cricket.", alternates: { canonical: "/sponsors" }, openGraph: { title: "Viva Sports Partners", description: "Backing the future of community sport.", type: "website" }, twitter: { card: "summary_large_image" } };
export default function Page() { return <OrganizationShell><SponsorsContent fallbackSponsors={sponsors} /></OrganizationShell>; }
