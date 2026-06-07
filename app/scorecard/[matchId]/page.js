import ScorecardScreen from "@/components/scorecard/ScorecardScreen";

export async function generateMetadata({ params }) {
  const { matchId } = await params;

  return {
    title: "Cricket Match Scorecard",
    description:
      "View the full Viva Sports cricket scorecard with innings, batting, bowling and match result details.",
    alternates: {
      canonical: `/scorecard/${matchId}`,
    },
  };
}

export default async function ScorecardPage({
  params,
}) {
  const { matchId } = await params;

  return (
    <ScorecardScreen matchId={matchId} />
  );
}
