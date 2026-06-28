import type { Metadata } from "next";
import OrganizationShell from "@/components/organization/OrganizationShell";
import AboutPageContent from "@/components/organization/AboutPageContent";

const description = "Learn about Viva Sports Association, our journey since 2021, our founders, mission, vision, and commitment to promoting grassroots cricket through professionally managed tournaments.";

export const metadata: Metadata = {
  title: { absolute: "About Viva Sports | Viva Sports" },
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About Viva Sports | Viva Sports", description, type: "website" },
  twitter: { card: "summary_large_image", title: "About Viva Sports | Viva Sports", description },
};

export default function Page() { return <OrganizationShell><AboutPageContent /></OrganizationShell>; }
