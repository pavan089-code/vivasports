import type { Metadata } from "next";
import OrganizationShell from "@/components/organization/OrganizationShell";
import { AboutContent } from "@/components/organization/OrganizationPages";
export const metadata: Metadata = { title: "About Viva Sports | Mission, Vision & Community Impact", description: "Discover the Viva Sports story, mission, values and impact on community cricket.", alternates: { canonical: "/about" }, openGraph: { title: "About Viva Sports", description: "Building communities through sport.", type: "website" }, twitter: { card: "summary_large_image", title: "About Viva Sports", description: "Building communities through sport." } };
export default function Page() { return <OrganizationShell><AboutContent /></OrganizationShell>; }
