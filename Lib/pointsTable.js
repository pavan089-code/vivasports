import {
  getTeams,
  updateTeamByName,
} from "@/services/teamService";

export async function updatePointsTable(
  match,
  resultData
) {
  const winner =
    resultData?.winner;

  if (!winner) return;

  const loser =
    winner === match.teamA
      ? match.teamB
      : match.teamA;

  const teams =
    await getTeams();

  const winnerTeam =
    teams.find(
      (team) =>
        team.name === winner
    );

  const loserTeam =
    teams.find(
      (team) =>
        team.name === loser
    );

  if (
    !winnerTeam ||
    !loserTeam
  )
    return;

  await updateTeamByName(
    winner,
    {
      played:
        (winnerTeam.played || 0) + 1,

      won:
        (winnerTeam.won || 0) + 1,

      points:
        (winnerTeam.points || 0) + 2,
    }
  );

  await updateTeamByName(
    loser,
    {
      played:
        (loserTeam.played || 0) + 1,

      lost:
        (loserTeam.lost || 0) + 1,
    }
  );
}