import Card from "../ui/Card";

export default function FullPointsTable({ teams }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="vs-table-wrap border-0">
        <table className="vs-table min-w-[860px]">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>L</th>
              <th>T</th>
              <th>PTS</th>
              <th>RF</th>
              <th>OF</th>
              <th>RA</th>
              <th>OB</th>
              <th>NRR</th>
            </tr>
          </thead>

          <tbody>
            {teams.map((team, index) => (
              <tr key={team.id || team.name} className="text-center">
                <td className="py-4 text-left">{index + 1}</td>
                <td className="py-4 text-left font-semibold">{team.name}</td>
                <td>{team.played || 0}</td>
                <td className="text-[var(--vs-success)]">{team.won || 0}</td>
                <td className="text-[var(--vs-danger)]">{team.lost || 0}</td>
                <td className="text-[var(--vs-gold-soft)]">{team.tied || 0}</td>
                <td className="font-bold text-[var(--vs-gold-soft)]">{team.points || 0}</td>
                <td>{team.runsFor || 0}</td>
                <td>{team.oversFaced || "0.0"}</td>
                <td>{team.runsAgainst || 0}</td>
                <td>{team.oversBowled || "0.0"}</td>
                <td
                  className={
                    (team.nrr || 0) >= 0
                      ? "text-[var(--vs-success)]"
                      : "text-[var(--vs-danger)]"
                  }
                >
                  {formatNrr(team.nrr)}
                </td>
              </tr>
            ))}

            {teams.length === 0 && (
              <tr>
                <td colSpan="12" className="py-10 text-center text-slate-400">
                  No teams found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function formatNrr(value = 0) {
  const numericValue = Number(value) || 0;

  return numericValue.toFixed(3);
}
