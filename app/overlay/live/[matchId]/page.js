import BroadcastLiveOverlay from "@/components/broadcast/BroadcastLiveOverlay";

export default async function BroadcastOverlayPage({
  params,
  searchParams,
}) {
  const { matchId } = await params;
  const query = await searchParams;
  const demo = query?.demo === "true";

  return (
    <BroadcastLiveOverlay matchId={matchId} demo={demo} />
  );
}
