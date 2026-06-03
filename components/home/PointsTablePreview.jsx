"use client";

import { useEffect, useState } from "react";

import Container from "../Layout/Container";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";

import { getTeams } from "@/services/teamService";

export default function PointsTablePreview() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function loadTeams() {
      const data = await getTeams();

      const sortedTeams = [...data].sort(
        (a, b) => {
          if (
            (b.points || 0) !==
            (a.points || 0)
          ) {
            return (
              (b.points || 0) -
              (a.points || 0)
            );
          }

          return (
            (b.won || 0) -
            (a.won || 0)
          );
        }
      );

      setTeams(sortedTeams);
    }

    loadTeams();
  }, []);

  return (
    <section className="py-16">
      <Container>
        <SectionTitle
          title="Points Table"
          subtitle="Current tournament standings"
        />

        <Card className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr
                className="
                  border-b
                  border-white/10
                  text-slate-400
                  text-sm
                "
              >
                <th className="text-left py-4">
                  #
                </th>

                <th className="text-left py-4">
                  Team
                </th>

                <th>P</th>

                <th>W</th>

                <th>L</th>

                <th>PTS</th>
              </tr>
            </thead>

            <tbody>
              {teams.map(
                (team, index) => (
                  <tr
                    key={team.id}
                    className="
                      border-b
                      border-white/5
                      text-white
                    "
                  >
                    <td className="py-4">
                      {index + 1}
                    </td>

                    <td className="py-4 font-semibold">
                      {team.name}
                    </td>

                    <td className="text-center">
                      {team.played || 0}
                    </td>

                    <td className="text-center text-green-400">
                      {team.won || 0}
                    </td>

                    <td className="text-center text-red-400">
                      {team.lost || 0}
                    </td>

                    <td className="text-center font-bold text-cyan-400">
                      {team.points || 0}
                    </td>
                  </tr>
                )
              )}

              {teams.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="
                      text-center
                      py-10
                      text-slate-400
                    "
                  >
                    No teams found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </Container>
    </section>
  );
}