import type { Metadata } from "next";

import "./globals.css";

import { MatchProvider } from "../context/MatchContext";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vivasports.local"),
  title: {
    default: "Viva Sports",
    template: "%s | Viva Sports",
  },
  description: "Viva Sports live cricket tournament platform with scores, fixtures, results, standings, profiles, and broadcast tools.",
  manifest: "/manifest.json",
  icons: {
    icon: "/viva-sports-icon.svg",
    apple: "/viva-sports-icon.svg",
  },
  applicationName: "Viva Sports",
  openGraph: {
    title: "Viva Sports",
    description: "Live cricket scores, tournament standings, profiles, and broadcasts from Viva Sports.",
    siteName: "Viva Sports",
    type: "website",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Viva Sports",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-[var(--vs-navy)] text-white">

        <MatchProvider>
          {children}
        </MatchProvider>

      </body>
    </html>
  );
}
