import DebugMatchClient from "./DebugMatchClient";

export const metadata = {
  title: "Match Debug",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminMatchDebugPage({ params }) {
  const { id } = await params;

  return <DebugMatchClient matchId={id} />;
}
