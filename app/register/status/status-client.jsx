"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck } from "lucide-react";

import { getTournamentRegistration } from "@/services/registrationService";

const statuses = ["Pending Verification", "Approved", "Rejected", "Needs Changes", "Payment Pending", "Verified"];

export default function StatusClient() {
  const searchParams = useSearchParams();
  const [registrationId, setRegistrationId] = useState(() => searchParams.get("id") || "");
  const [phone, setPhone] = useState(() => searchParams.get("phone") || "");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = searchParams.get("id") || "";
    const phoneParam = searchParams.get("phone") || "";
    const frame = window.requestAnimationFrame(() => {
      setRegistrationId(id);
      setPhone(phoneParam);
      if (id && phoneParam) void findRegistration(id, phoneParam);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [searchParams]);

  async function findRegistration(id, phoneNumber) {
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const item = await getTournamentRegistration(id);
      const captainPhone = item?.form?.captain?.phone || "";
      const matchesPhone = captainPhone.replace(/\D/g, "").endsWith(phoneNumber.replace(/\D/g, "").slice(-10));
      setResult(item && matchesPhone ? item : null);
    } catch (statusError) {
      setResult(null);
      setError(statusError?.message || "Unable to check registration status.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    void findRegistration(registrationId, phone);
  }

  return (
    <section className="reg-status-page">
      <div className="reg-container reg-status-grid">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="reg-kicker">Registration Status</p>
          <h1>Track your team verification</h1>
          <p>Enter your registration ID and captain phone number to view the latest Firestore registration state.</p>
          <div className="reg-status-list">
            {statuses.map((status) => <span key={status}>{status}</span>)}
          </div>
        </motion.div>

        <form className="reg-status-card" onSubmit={handleSubmit}>
          <label>
            <span>Registration ID</span>
            <input value={registrationId} onChange={(event) => setRegistrationId(event.target.value)} placeholder="Firestore document ID" />
          </label>
          <label>
            <span>Phone Number</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91" />
          </label>
          <button type="submit" disabled={loading}><Search /> {loading ? "Checking..." : "View Status"}</button>

          {error && <p className="reg-error">{error}</p>}

          {searched && !loading && (
            <div className="reg-status-result">
              {result ? (
                <>
                  <ShieldCheck />
                  <h2>{result.form?.team?.name || "Registered Team"}</h2>
                  <strong>{result.status}</strong>
                  <p>Fee Status: {result.feeStatus || "Payment Pending"}</p>
                  <p>Players: {result.form?.players?.count || 0}</p>
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
