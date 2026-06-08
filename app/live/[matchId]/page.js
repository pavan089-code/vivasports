import LiveMatchScreen from "@/components/live/LiveMatchScreen";
import { sponsors } from "@/Lib/sponsors";

export async function generateMetadata({ params }) {
  const { matchId } = await params;

  return {
    title: "Live Cricket Match",
    description:
      "Follow this Viva Sports live cricket match with real-time scores, scorecard updates and streaming coverage.",
    alternates: {
      canonical: `/live/${matchId}`,
    },
  };
}

export default async function LivePage({
  params,
}) {
  const { matchId } = await params;

  return (
    <LiveMatchScreen matchId={matchId} sponsors={sponsors} />
  );
}
