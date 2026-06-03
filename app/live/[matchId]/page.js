import LiveMatchScreen from "@/components/live/LiveMatchScreen";

export default async function LivePage({
  params,
}) {
  const { matchId } = await params;

  return (
    <LiveMatchScreen matchId={matchId} />
  );
}