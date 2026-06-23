import type { Metadata } from "next";
import OrganizationShell from "@/components/organization/OrganizationShell";
import { HistoryContent } from "@/components/organization/OrganizationPages";
export const metadata: Metadata = { title: "Tournament History | Viva Sports", description: "Follow the history, champions and memorable moments of Viva Sports tournaments.", alternates: { canonical: "/history" }, openGraph: { title: "Viva Sports Tournament History", description: "A growing legacy of community cricket.", type: "website" }, twitter: { card: "summary_large_image" } };
export default function Page() { return <OrganizationShell><HistoryContent /></OrganizationShell>; }
