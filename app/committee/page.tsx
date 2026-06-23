import type { Metadata } from "next";
import OrganizationShell from "@/components/organization/OrganizationShell";
import { CommitteeContent } from "@/components/organization/OrganizationPages";
export const metadata: Metadata = { title: "Viva Sports Committee & Leadership", description: "Meet the committee and leadership team responsible for Viva Sports.", alternates: { canonical: "/committee" }, openGraph: { title: "Viva Sports Leadership", description: "Meet the team behind Viva Sports.", type: "website" }, twitter: { card: "summary_large_image" } };
export default function Page() { return <OrganizationShell><CommitteeContent /></OrganizationShell>; }
