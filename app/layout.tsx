import type { Metadata, Viewport } from "next";

import "./globals.css";

import { MatchProvider } from "../context/MatchContext";

const siteUrl = "https://vivasports.in";
const siteName = "Viva Sports";
const title = "Viva Sports | Live Cricket Scores, Tournaments & Streaming";
const description =
  "Viva Sports is a professional cricket tournament platform featuring live scoring, fixtures, results, points tables, player statistics, match management, and live streaming integration.";
const socialImage = "/logo.jpeg";
const keywords = [
  "Viva Sports",
  "Viva Sports India",
  "Viva Sports Cricket",
  "Viva Sports Live",
  "Viva Sports Tournament",
  "Viva Sports Live Score",
  "Live Cricket Scores",
  "Cricket Tournament Management",
  "Cricket Scoring App",
  "Tournament Software",
  "Cricket Live Streaming",
  "Cricket Points Table",
  "Cricket Fixtures",
  "Cricket Results",
  "India Cricket Tournament",
];

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
const verification: Metadata["verification"] = {
  ...(googleVerification ? { google: googleVerification } : {}),
  ...(bingVerification
    ? { other: { "msvalidate.01": bingVerification } }
    : {}),
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${siteName}`,
  },
  description,
  keywords,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "sports",
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Viva Sports logo and cricket tournament platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImage],
    creator: process.env.NEXT_PUBLIC_TWITTER_CREATOR,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}${socialImage}`,
      description,
      sameAs: [],
    },
    {
      "@context": "https://schema.org",
      "@type": "SportsOrganization",
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}${socialImage}`,
      sport: "Cricket",
      description,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
      description,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-[var(--vs-navy)] text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <MatchProvider>
          {children}
        </MatchProvider>

      </body>
    </html>
  );
}
