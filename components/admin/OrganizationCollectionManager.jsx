"use client";

import { useEffect, useState } from "react";
import {
  createOrganizationItem,
  deleteOrganizationItem,
  subscribeToOrganizationCollection,
  updateOrganizationItem,
} from "@/services/organizationService";

export const organizationConfigs = {
  committee: { title: "Committee", fields: [["name","Name"],["role","Position"],["image","Photo URL"],["bio","Short bio","textarea"],["priority","Display priority","number"]] },
  champions: { title: "Champions", fields: [["season","Season / year"],["tournamentName","Tournament name"],["champion","Champion"],["runnerUp","Runner-up"],["bestBatter","Best batter"],["bestBowler","Best bowler"],["playerOfTournament","Player of tournament"],["teamPhoto","Team photo URL"],["trophyPhoto","Trophy photo URL"]] },
  gallery: { title: "Gallery", fields: [["image","Image URL"],["title","Image title"],["category","Category"],["uploadedAt","Display date"]] },
  sponsors: { title: "Sponsors", fields: [["name","Sponsor name"],["logo","Logo URL"],["website","Website"],["category","Category"],["supportLevel","Support level"],["description","Description","textarea"]] },
  history: { title: "Tournament History", fields: [["year","Year"],["tournamentName","Tournament name"],["champion","Champion"],["runnerUp","Runner-up"],["specialMoments","Special moments","textarea"],["awards","Awards","textarea"],["photo","Photo URL"],["video","Video URL"]] },
};

export default function OrganizationCollectionManager({ collectionName }) {
  const config = organizationConfigs[collectionName];
  const empty = Object.fromEntries(config.fields.map(([name]) => [name, ""]));
  const [items, setItems] = useState([]); const [form, setForm] = useState(empty); const [editing, setEditing] = useState(null); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  useEffect(() => subscribeToOrganizationCollection(collectionName, setItems, () => setError("This collection is not available yet. Update Firestore access rules before publishing content.")), [collectionName]);
  async function submit(event) { event.preventDefault(); setSaving(true); const data = { ...form }; config.fields.filter(([, , type]) => type === "number").forEach(([name]) => { data[name] = Number(data[name]) || 0; }); if (editing) await updateOrganizationItem(collectionName, editing, data); else await createOrganizationItem(collectionName, data); setForm(empty); setEditing(null); setSaving(false); }
  function edit(item) { setEditing(item.id); setForm(Object.fromEntries(config.fields.map(([name]) => [name, item[name] ?? ""]))); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function remove(id) { if (!window.confirm("Delete this item? This cannot be undone.")) return; await deleteOrganizationItem(collectionName, id); }
  return <main className="min-h-screen bg-[#050B18] px-4 py-8 text-white sm:px-6 lg:px-10"><div className="mx-auto max-w-6xl"><a href="/admin" className="text-sm font-bold text-[#E5C158]">← Admin dashboard</a><h1 className="mt-5 text-4xl font-black">Manage {config.title}</h1><p className="mt-2 text-slate-400">Content updates publish automatically to the public website.</p>{error && <div className="mt-5 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-200">{error}</div>}<form onSubmit={submit} className="mt-8 rounded-2xl border border-[#D8B45A]/20 bg-[#0A1428] p-5"><div className="grid gap-4 md:grid-cols-2">{config.fields.map(([name,label,type]) => <label key={name} className={type === "textarea" ? "md:col-span-2" : ""}><span className="text-sm font-semibold text-slate-400">{label}</span>{type === "textarea" ? <textarea value={form[name]} onChange={(e) => setForm((v) => ({...v,[name]:e.target.value}))} rows={4} className="mt-2 w-full rounded-xl border border-white/10 bg-[#101D35] p-4" /> : <input type={type || "text"} value={form[name]} onChange={(e) => setForm((v) => ({...v,[name]:e.target.value}))} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#101D35] px-4" />}</label>)}</div><div className="mt-5 flex gap-3"><button disabled={saving} className="rounded-xl bg-[#D4AF37] px-5 py-3 font-black text-[#06152F]">{saving ? "Saving…" : editing ? "Update item" : "Add item"}</button>{editing && <button type="button" onClick={() => {setEditing(null);setForm(empty)}} className="rounded-xl border border-white/15 px-5 py-3">Cancel</button>}</div></form><div className="mt-8 grid gap-4 md:grid-cols-2">{items.map((item) => <article key={item.id} className="rounded-xl border border-white/10 bg-[#0A1428] p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#D8B45A]">{item.role || item.category || item.season || item.year || config.title}</p><h2 className="mt-2 text-xl font-black">{item.name || item.title || item.tournamentName || item.champion || "Untitled item"}</h2><p className="mt-2 line-clamp-3 text-sm text-slate-400">{item.bio || item.description || item.specialMoments}</p><div className="mt-4 flex gap-2"><button onClick={() => edit(item)} className="rounded-lg bg-[#101D35] px-4 py-2 text-sm font-bold">Edit</button><button onClick={() => remove(item.id)} className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300">Delete</button></div></article>)}</div></div></main>;
}
