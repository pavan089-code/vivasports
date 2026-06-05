import BroadcastLiveOverlay from "@/components/broadcast/BroadcastLiveOverlay";

export default async function BroadcastOverlayPage({
  params,
}) {
  const { matchId } = await params;

  return (
    <BroadcastLiveOverlay matchId={matchId} />
  );
}
