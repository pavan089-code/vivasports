"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Filter, MessageSquare, Search, ShieldAlert, XCircle } from "lucide-react";

const STORAGE_KEY = "vivaTournamentRegistrations";
const statuses = ["All", "Pending Verification", "Approved", "Rejected", "Needs Changes", "Payment Pending", "Verified"];

function readRegistrations() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRegistrations(items) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function TournamentRegistrationsAdminPage() {
  const [registrations, setRegistrations] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setRegistrations(readRegistrations());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const filtered = useMemo(() => {
    return registrations.filter((item) => {
      const haystack = [
        item.id,
        item.form?.team?.name,
        item.form?.captain?.fullName,
        item.form?.captain?.phone,
        item.form?.tournament?.category,
      ].join(" ").toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesStatus = status === "All" || item.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [registrations, query, status]);

  function updateStatus(id, nextStatus) {
    const next = registrations.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        status: nextStatus,
        feeStatus: nextStatus === "Approved" || nextStatus === "Verified" ? "Paid" : item.feeStatus,
        activity: [
          `${nextStatus} update saved`,
          nextStatus === "Approved" ? "Approval email queued" : "Status email queued",
          nextStatus === "Approved" ? "WhatsApp approval queued" : "WhatsApp status update queued",
          ...(item.activity || []),
        ],
      };
    });
    setRegistrations(next);
    saveRegistrations(next);
  }

  return (
    <main className="admin-reg-page">
      <section className="admin-reg-hero">
        <div>
          <p className="reg-kicker">Admin / Tournament Registrations</p>
          <h1>Registration CRM</h1>
          <p>Review team entries, roster counts, documents, payment state and verification actions from the dedicated registration portal.</p>
        </div>
        <Link href="/admin">Back to Admin</Link>
      </section>

      <section className="admin-reg-toolbar">
        <label>
          <Search />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search team, captain, phone, category..." />
        </label>
        <div>
          <Filter />
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="admin-reg-grid">
        {filtered.map((registration) => (
          <article className="admin-reg-card" key={registration.id}>
            <div className="admin-reg-top">
              <div className="admin-reg-logo">{registration.form?.team?.name?.slice(0, 2).toUpperCase() || "VS"}</div>
              <div>
                <span>{registration.id}</span>
                <h2>{registration.form?.team?.name || "Unnamed Team"}</h2>
                <p>{registration.form?.tournament?.category || "Open"} / {registration.status}</p>
              </div>
            </div>
            <div className="admin-reg-meta">
              <p><span>Captain</span><strong>{registration.form?.captain?.fullName || "-"}</strong></p>
              <p><span>Phone</span><strong>{registration.form?.captain?.phone || "-"}</strong></p>
              <p><span>Fee Status</span><strong>{registration.feeStatus || "Payment Pending"}</strong></p>
              <p><span>Players</span><strong>{registration.form?.players?.length || 0}</strong></p>
              <p><span>Documents</span><strong>{Object.values(registration.form?.documents || {}).filter(Boolean).length}/6</strong></p>
            </div>
            <div className="admin-reg-actions">
              <button type="button" onClick={() => updateStatus(registration.id, "Approved")}><CheckCircle2 /> Approve</button>
              <button type="button" onClick={() => updateStatus(registration.id, "Rejected")}><XCircle /> Reject</button>
              <button type="button" onClick={() => updateStatus(registration.id, "Needs Changes")}><MessageSquare /> Request Changes</button>
              <button type="button" onClick={() => updateStatus(registration.id, "Payment Pending")}><ShieldAlert /> Payment Pending</button>
            </div>
            <div className="admin-reg-activity">
              {(registration.activity || []).slice(0, 4).map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
            </div>
          </article>
        ))}

        {!filtered.length && (
          <div className="admin-reg-empty">
            <h2>No registrations found</h2>
            <p>Submitted entries from the new portal will appear here for review.</p>
          </div>
        )}
      </section>
    </main>
  );
}
