import LiveMatchesClient from "./LiveMatchesClient";

export const metadata = {
  title: "Live Cricket Scores",
  description:
    "Watch Viva Sports live cricket scores, real-time scorecards, match status and streaming-ready tournament coverage.",
  alternates: {
    canonical: "/live",
  },
};

export default function LiveMatchesPage() {
  return <LiveMatchesClient />;
}
