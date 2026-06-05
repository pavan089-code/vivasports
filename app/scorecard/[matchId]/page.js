import ScorecardScreen from "@/components/scorecard/ScorecardScreen";

export default async function ScorecardPage({
  params,
}) {
  const { matchId } = await params;

  return (
    <ScorecardScreen matchId={matchId} />
  );
}
