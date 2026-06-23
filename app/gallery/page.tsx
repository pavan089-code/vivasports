import type { Metadata } from "next";
import OrganizationShell from "@/components/organization/OrganizationShell";
import { GalleryContent } from "@/components/organization/OrganizationPages";
export const metadata: Metadata = { title: "Gallery | Viva Sports", description: "Match action, champions, awards and community moments from Viva Sports.", alternates: { canonical: "/gallery" }, openGraph: { title: "Viva Sports Gallery", description: "The moments around the match.", type: "website" }, twitter: { card: "summary_large_image" } };
export default function Page() { return <OrganizationShell><GalleryContent /></OrganizationShell>; }
