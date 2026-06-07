import TeamsClient from "./TeamsClient";

export const metadata = {
  title: "Cricket Teams",
  description:
    "Browse Viva Sports cricket teams, tournament squads, captains and player lists.",
  alternates: {
    canonical: "/teams",
  },
};

export default function TeamsPage() {
  return <TeamsClient />;
}
