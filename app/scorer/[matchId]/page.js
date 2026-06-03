import ScorerScreen from "@/components/scorer/ScorerScreen";

export default async function Page({
  params,
}) {

  const { matchId } = await params;

  return (
    <ScorerScreen matchId={matchId} />
  );
}