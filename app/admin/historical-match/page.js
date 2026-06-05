"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getTeams } from "@/services/teamService";
import { importHistoricalMatch } from "@/services/tournamentOperationsService";

const emptyForm = {
  teamA: "",
  teamB: "",
  teamAScore: "",
  teamAWickets: "",
  teamAOvers: "20.0",
  teamBScore: "",
  teamBWickets: "",
  teamBOvers: "20.0",
  winner: "",
  result: "",
  date: "",
  time: "",
  ground: "",
};

export default function HistoricalMatchPage() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTeams() {
      setTeams(await getTeams());
    }

    Promise.resolve().then(loadTeams);
  }, []);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitHistoricalMatch() {
    if (!form.teamA || !form.teamB || form.teamA === form.teamB) {
      alert("Select two different teams.");
      return;
    }

    setSaving(true);
    const matchId = await importHistoricalMatch(form);
    setSaving(false);
    setForm(emptyForm);
    alert(`Historical match imported: ${matchId}`);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050B18] px-4 py-8 text-white">
      <section className="mx-auto max-w-5xl">
        <Link href="/admin" className="text-sm font-bold text-cyan-300">
          Back to Admin
        </Link>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#101D35] p-5 md:p-8">
          <p className="text-sm font-semibold tracking-widest text-cyan-400">
            ADMIN OPERATIONS
          </p>
          <h1 className="mt-2 text-4xl font-black">Historical Match Import</h1>
          <p className="mt-2 text-slate-400">
            Creates a completed match and rebuilds standings. No ball-by-ball
            scorecard data is required.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <SelectTeam
              label="Team A"
              value={form.teamA}
              teams={teams}
              onChange={(value) => updateField("teamA", value)}
            />
            <SelectTeam
              label="Team B"
              value={form.teamB}
              teams={teams}
              onChange={(value) => updateField("teamB", value)}
            />
            <Field label="Team A Score" value={form.teamAScore} onChange={(value) => updateField("teamAScore", value)} />
            <Field label="Team A Wickets" value={form.teamAWickets} onChange={(value) => updateField("teamAWickets", value)} />
            <Field label="Team A Overs" value={form.teamAOvers} onChange={(value) => updateField("teamAOvers", value)} />
            <Field label="Team B Score" value={form.teamBScore} onChange={(value) => updateField("teamBScore", value)} />
            <Field label="Team B Wickets" value={form.teamBWickets} onChange={(value) => updateField("teamBWickets", value)} />
            <Field label="Team B Overs" value={form.teamBOvers} onChange={(value) => updateField("teamBOvers", value)} />
            <SelectTeam
              label="Winner"
              value={form.winner}
              teams={teams.filter((team) => team.name === form.teamA || team.name === form.teamB)}
              includeTie
              onChange={(value) => updateField("winner", value)}
            />
            <Field label="Result Text" value={form.result} onChange={(value) => updateField("result", value)} />
            <Field label="Date" type="date" value={form.date} onChange={(value) => updateField("date", value)} />
            <Field label="Time" type="time" value={form.time} onChange={(value) => updateField("time", value)} />
            <Field label="Ground" value={form.ground} onChange={(value) => updateField("ground", value)} />
          </div>

          <button
            onClick={submitHistoricalMatch}
            className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-black text-black"
          >
            {saving ? "Importing..." : "Import Historical Match"}
          </button>
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label>
      <span className="text-sm font-semibold text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 py-3 text-white"
      />
    </label>
  );
}

function SelectTeam({ label, value, teams, onChange, includeTie = false }) {
  return (
    <label>
      <span className="text-sm font-semibold text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 py-3 text-white"
      >
        <option value="">{includeTie ? "Tie / No Winner" : "Select team"}</option>
        {teams.map((team) => (
          <option key={team.id} value={team.name}>
            {team.name}
          </option>
        ))}
      </select>
    </label>
  );
}
