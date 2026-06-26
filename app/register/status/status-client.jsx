"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck } from "lucide-react";

const SUBMISSIONS_KEY = "vivaTournamentRegistrations";
const statuses = ["Pending", "Approved", "Rejected", "Needs Changes", "Payment Pending", "Fixture Assigned"];

function readRegistrations() {
  try {
    return JSON.parse(window.localStorage.getItem(SUBMISSIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function StatusClient() {
  const searchParams = useSearchParams();
  const [registrationId, setRegistrationId] = useState(() => searchParams.get("id") || "");
  const [phone, setPhone] = useState(() => searchParams.get("phone") || "");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id") || "";
    const phoneParam = searchParams.get("phone") || "";
    if (!id && !phoneParam) return undefined;
    const frame = window.requestAnimationFrame(() => {
      setRegistrationId(id);
      setPhone(phoneParam);
      setResult(findRegistration(id, phoneParam));
      setSearched(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [searchParams]);

  function findRegistration(id, phoneNumber) {
    return readRegistrations().find((item) => {
      const captainPhone = item.form?.captain?.phone || "";
      return item.id?.toLowerCase() === id.toLowerCase() && captainPhone.replace(/\D/g, "").endsWith(phoneNumber.replace(/\D/g, "").slice(-10));
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setResult(findRegistration(registrationId, phone));
    setSearched(true);
  }

  return (
    <section className="reg-status-page">
      <div className="reg-container reg-status-grid">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="reg-kicker">Registration Status</p>
          <h1>Track your team verification</h1>
          <p>Enter your registration ID and captain phone number to view the latest registration state.</p>
          <div className="reg-status-list">
            {statuses.map((status) => <span key={status}>{status}</span>)}
          </div>
        </motion.div>

        <form className="reg-status-card" onSubmit={handleSubmit}>
          <label>
            <span>Registration ID</span>
            <input value={registrationId} onChange={(event) => setRegistrationId(event.target.value)} placeholder="VS-2026-00042" />
          </label>
          <label>
            <span>Phone Number</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91" />
          </label>
          <button type="submit"><Search /> View Status</button>

          {searched && (
            <div className="reg-status-result">
              {result ? (
                <>
                  <ShieldCheck />
                  <h2>{result.form?.team?.name || "Registered Team"}</h2>
                  <strong>{result.status}</strong>
                  <p>Fee Status: {result.feeStatus || "Payment Pending"}</p>
                  <p>Players: {result.form?.players?.length || 0}</p>
                </>
              ) : (
                <p>No registration found for those details.</p>
              )}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
