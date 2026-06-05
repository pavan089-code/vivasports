"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { auditStandings } from "@/services/tournamentOperationsService";

const fields = ["played", "won", "lost", "tied", "points", "nrr"];

export default function AuditPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAudit() {
      setRows(await auditStandings());
      setLoading(false);
    }

    Promise.resolve().then(loadAudit);
  }, []);

  if (loading) return <LoadingSkeleton title="AUDIT MODE" />;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050B18] px-4 py-8 text-white">
      <section className="mx-auto max-w-7xl space-y-6">
        <Link href="/admin" className="text-sm font-bold text-cyan-300">
          Back to Admin
        </Link>

        <div>
          <p className="text-sm font-semibold tracking-widest text-cyan-400">
            ADMIN OPERATIONS
          </p>
          <h1 className="mt-2 text-4xl font-black">Audit Mode</h1>
          <p className="mt-2 text-slate-400">
            Compares stored team standings with values calculated from completed,
            historical, abandoned, and walkover matches.
          </p>
        </div>

        <div className="grid gap-5">
          {rows.map(({ team, calculated, mismatches }) => (
            <article
              key={team.id}
              className="rounded-2xl border border-white/10 bg-[#101D35] p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-black">{team.name}</h2>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${
                    mismatches.length
                      ? "bg-red-500/15 text-red-300"
                      : "bg-green-500/15 text-green-300"
                  }`}
                >
                  {mismatches.length ? `${mismatches.length} mismatch` : "Clean"}
                </span>
              </div>

              <div className="mt-5 overflow-x-auto rounded-xl bg-[#0A1428]">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="py-3 text-left pl-4">Field</th>
                      <th>Stored</th>
                      <th>Calculated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field) => {
                      const mismatch = mismatches.includes(field);

                      return (
                        <tr
                          key={field}
                          className={`border-b border-white/5 text-center ${
                            mismatch ? "bg-red-500/10" : ""
                          }`}
                        >
                          <td className="py-3 text-left pl-4 font-bold">{field}</td>
                          <td>{team[field] ?? 0}</td>
                          <td>{calculated[field] ?? 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
