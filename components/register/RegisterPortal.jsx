"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

import { createTournamentRegistration } from "@/services/registrationService";

const categories = ["Open", "Corporate", "U19", "U16", "Women's", "Veterans"];
const initialForm = {
  teamName: "",
  captainName: "",
  managerName: "",
  phone: "",
  whatsapp: "",
  email: "",
  city: "Hyderabad",
  district: "",
  playingCategory: "Open",
  teamLogoName: "",
  jerseyColor: "",
  previousExperience: "",
  numberOfPlayers: "15",
  message: "",
  agreed: false,
};

export default function RegisterPortal() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.agreed) {
      setError("Please agree to the tournament rules before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const id = await createTournamentRegistration({
        form: {
          team: {
            name: form.teamName.trim(),
            city: form.city.trim(),
            district: form.district.trim(),
            logo: form.teamLogoName,
            jerseyColors: form.jerseyColor.trim(),
          },
          captain: {
            fullName: form.captainName.trim(),
            phone: form.phone.trim(),
            whatsapp: form.whatsapp.trim(),
            email: form.email.trim(),
          },
          manager: {
            fullName: form.managerName.trim(),
          },
          tournament: {
            category: form.playingCategory,
            edition: "Dr. APJ Abdul Kalam Trophy 2026",
          },
          experience: form.previousExperience.trim(),
          players: {
            count: Number(form.numberOfPlayers) || 0,
          },
          message: form.message.trim(),
          declaration: {
            rules: form.agreed,
          },
        },
      });

      setSubmitted({ id, teamName: form.teamName, phone: form.phone });
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError?.message || "Unable to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="reg-status-page">
        <div className="reg-container">
          <motion.div
            className="reg-success-card premium-card"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle2 />
            <p className="reg-kicker">Registration Submitted</p>
            <h1>{submitted.teamName || "Your team"} is under review</h1>
            <p>
              Registration ID: <strong>{submitted.id}</strong>. The admin team can now review and approve this Firestore submission.
            </p>
            <div className="viva-hero-actions">
              <Link href={`/register/status?id=${encodeURIComponent(submitted.id)}&phone=${encodeURIComponent(submitted.phone)}`} className="viva-button viva-button-gold">
                View Status <ArrowRight />
              </Link>
              <Link href="/" className="viva-button viva-button-ghost">Back Home</Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="reg-page">
      <div className="reg-container reg-single-grid">
        <motion.div
          className="reg-hero"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="reg-kicker">Tournament Registration</p>
          <h1>Register Your Team</h1>
          <p>
            Submit your team for the Dr. APJ Abdul Kalam Trophy. Entries are stored in Firestore for admin approval.
          </p>
          <div className="reg-info-grid">
            <InfoCard icon={BadgeCheck} title="20 Teams" text="Limited slots for the 2026 edition." />
            <InfoCard icon={ShieldCheck} title="Admin Review" text="Every registration is verified before approval." />
            <InfoCard icon={UploadCloud} title="Team Identity" text="Share logo name and jersey colors." />
          </div>
        </motion.div>

        <motion.form
          className="reg-form-card premium-card"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="reg-field-grid">
            <Field label="Team Name" name="teamName" value={form.teamName} onChange={updateField} required />
            <Field label="Captain Name" name="captainName" value={form.captainName} onChange={updateField} required />
            <Field label="Manager Name" name="managerName" value={form.managerName} onChange={updateField} required />
            <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={updateField} required />
            <Field label="WhatsApp" name="whatsapp" type="tel" value={form.whatsapp} onChange={updateField} required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={updateField} required />
            <Field label="City" name="city" value={form.city} onChange={updateField} required />
            <Field label="District" name="district" value={form.district} onChange={updateField} required />
            <label>
              <span>Playing Category</span>
              <select value={form.playingCategory} onChange={(event) => updateField("playingCategory", event.target.value)}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              <span>Team Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => updateField("teamLogoName", event.target.files?.[0]?.name || "")}
              />
            </label>
            <Field label="Jersey Color" name="jerseyColor" value={form.jerseyColor} onChange={updateField} required />
            <Field label="Number of Players" name="numberOfPlayers" type="number" min="11" max="20" value={form.numberOfPlayers} onChange={updateField} required />
          </div>

          <label>
            <span>Previous Tournament Experience</span>
            <textarea value={form.previousExperience} onChange={(event) => updateField("previousExperience", event.target.value)} rows={4} />
          </label>

          <label>
            <span>Message</span>
            <textarea value={form.message} onChange={(event) => updateField("message", event.target.value)} rows={4} />
          </label>

          <label className="reg-check-row">
            <input type="checkbox" checked={form.agreed} onChange={(event) => updateField("agreed", event.target.checked)} />
            <span>I agree to tournament rules</span>
          </label>

          {error && <p className="reg-error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Registration"} <ArrowRight />
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Field({ label, name, value, onChange, type = "text", ...props }) {
  return (
    <label>
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        {...props}
      />
    </label>
  );
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <article className="premium-card">
      <Icon />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
