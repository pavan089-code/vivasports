"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Camera,
  Check,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  FileText,
  GripVertical,
  IdCard,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  UploadCloud,
  UserRound,
  UsersRound,
  Video,
} from "lucide-react";

const DRAFT_KEY = "vivaTournamentRegistrationDraft";
const SUBMISSIONS_KEY = "vivaTournamentRegistrations";

const categories = ["Open", "Corporate", "U19", "U16", "Women's", "Veterans"];
const roles = ["Batter", "Bowler", "All-rounder", "Wicket keeper"];
const battingStyles = ["Right hand bat", "Left hand bat"];
const bowlingStyles = ["Right arm pace", "Left arm pace", "Right arm spin", "Left arm spin", "Wicket keeper", "None"];

const tournamentInfo = [
  ["Tournament Name", "Viva Sports Premier League 2026"],
  ["Category", "Open, Corporate, U19, U16, Women's, Veterans"],
  ["Entry Fee", "Rs. 15,000"],
  ["Ball Type", "White leather ball"],
  ["Overs", "20 overs"],
  ["Venue", "Hyderabad"],
  ["Start Date", "August 2026"],
  ["Last Date", "14 July 2026"],
  ["Prize Pool", "Rs. 2,00,000+"],
  ["Slots Remaining", "18 teams"],
  ["Registration Status", "Open"],
];

const features = [
  ["Professional Live Scoring", Radio],
  ["Player Statistics", Trophy],
  ["Broadcast Coverage", Video],
  ["Digital Scorecards", ClipboardCheck],
  ["Player Profiles", UserRound],
  ["Awards", Award],
  ["Media Coverage", Camera],
  ["Sponsor Exposure", Sparkles],
];

const timeline = [
  "Submit Registration",
  "Verification",
  "Payment Confirmation",
  "Player Verification",
  "Fixtures Released",
  "Tournament Begins",
];

const rules = [
  ["Eligibility", "Teams must submit accurate captain, roster and contact details before verification."],
  ["Player Limit", "A squad must include a minimum of 11 and a maximum of 16 players."],
  ["Age Rules", "Age-category teams may be asked for government identity proof during verification."],
  ["Ball Type", "Matches use the confirmed tournament ball type published for the edition."],
  ["Match Format", "League and knockout formats are finalized after team slots close."],
  ["Code of Conduct", "Teams must follow umpire decisions, venue rules and Viva Sports discipline standards."],
  ["Rain Rules", "Rain interruptions follow the match committee decision and published playing conditions."],
  ["Tie Rules", "Ties may be resolved through super over, net run rate or committee rules by stage."],
  ["Disputes", "Disputes must be raised by the captain or manager through official channels."],
  ["Prize Distribution", "Prize eligibility requires final roster and payment verification."],
];

const stepMeta = [
  ["Team Details", UsersRound],
  ["Captain", UserRound],
  ["Vice Captain", UserRound],
  ["Manager", IdCard],
  ["Category", Trophy],
  ["Roster", UsersRound],
  ["Documents", UploadCloud],
  ["Declaration", ShieldCheck],
  ["Review", ClipboardCheck],
  ["Submission", BadgeCheck],
];

const initialPlayer = (index) => ({
  photo: "",
  name: "",
  age: "",
  role: index === 0 ? "Captain" : "Batter",
  battingStyle: "Right hand bat",
  bowlingStyle: "None",
  phone: "",
  jerseyNumber: "",
  captain: index === 0,
  viceCaptain: false,
});

const initialForm = {
  team: {
    name: "",
    logo: "",
    city: "Hyderabad",
    homeGround: "",
    jerseyColors: "",
    yearsActive: "",
    instagram: "",
    facebook: "",
    website: "",
    description: "",
  },
  captain: {
    photo: "",
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    address: "",
    emergencyContact: "",
    idProof: "",
  },
  viceCaptain: {
    photo: "",
    fullName: "",
    phone: "",
    email: "",
  },
  manager: {
    photo: "",
    fullName: "",
    phone: "",
    email: "",
  },
  tournament: {
    category: "Open",
    notes: "",
    paymentMode: "UPI",
    paymentStatus: "Payment Pending",
    transactionRef: "",
  },
  players: Array.from({ length: 11 }, (_, index) => initialPlayer(index)),
  documents: {
    teamLogo: "",
    captainPhoto: "",
    playerListPdf: "",
    paymentScreenshot: "",
    identityProof: "",
    sponsorLogo: "",
  },
  declaration: {
    terms: false,
    rules: false,
    accuracy: false,
    signature: "",
  },
};

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

function makeRegistrationId() {
  const sequence = Math.floor(10000 + Math.random() * 89999);
  return `VS-2026-${sequence}`;
}

function getFileName(fileList) {
  return fileList?.[0]?.name || "";
}

function requiredComplete(value) {
  return String(value || "").trim().length > 0;
}

export default function RegisterPortal() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(null);
  const [openRule, setOpenRule] = useState("Eligibility");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setForm(readJson(DRAFT_KEY, initialForm));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    writeJson(DRAFT_KEY, form);
  }, [form]);

  useEffect(() => {
    const warn = (event) => {
      if (!submitted) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [submitted]);

  const progress = useMemo(() => {
    const checks = [
      form.team.name,
      form.team.city,
      form.captain.fullName,
      form.captain.phone,
      form.captain.email,
      form.tournament.category,
      form.players.filter((player) => requiredComplete(player.name)).length >= 11,
      form.documents.paymentScreenshot,
      form.declaration.terms && form.declaration.rules && form.declaration.accuracy,
      form.declaration.signature,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form]);

  function updateGroup(group, field, value) {
    setForm((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [field]: value,
      },
    }));
  }

  function updatePlayer(index, field, value) {
    setForm((current) => {
      const players = current.players.map((player, itemIndex) => {
        if (itemIndex !== index) {
          if (field === "captain" && value) return { ...player, captain: false };
          if (field === "viceCaptain" && value) return { ...player, viceCaptain: false };
          return player;
        }
        return { ...player, [field]: value };
      });
      return { ...current, players };
    });
  }

  function addPlayer() {
    setForm((current) => {
      if (current.players.length >= 16) return current;
      return { ...current, players: [...current.players, initialPlayer(current.players.length)] };
    });
  }

  function removePlayer(index) {
    setForm((current) => {
      if (current.players.length <= 11) return current;
      return { ...current, players: current.players.filter((_, itemIndex) => itemIndex !== index) };
    });
  }

  function movePlayer(index, direction) {
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.players.length) return current;
      const players = [...current.players];
      const [item] = players.splice(index, 1);
      players.splice(nextIndex, 0, item);
      return { ...current, players };
    });
  }

  function stepErrors(step = activeStep) {
    const errors = [];
    if (step === 0 && !requiredComplete(form.team.name)) errors.push("Team name is required.");
    if (step === 1) {
      if (!requiredComplete(form.captain.fullName)) errors.push("Captain full name is required.");
      if (!requiredComplete(form.captain.phone)) errors.push("Captain phone is required.");
      if (!requiredComplete(form.captain.email)) errors.push("Captain email is required.");
    }
    if (step === 5 && form.players.filter((player) => requiredComplete(player.name)).length < 11) {
      errors.push("Add names for at least 11 players.");
    }
    if (step === 7) {
      if (!form.declaration.terms || !form.declaration.rules || !form.declaration.accuracy) errors.push("All declaration checkboxes must be accepted.");
      if (!requiredComplete(form.declaration.signature)) errors.push("Digital signature is required.");
    }
    return errors;
  }

  function goNext() {
    if (stepErrors().length) return;
    setActiveStep((step) => Math.min(step + 1, stepMeta.length - 1));
  }

  function submitRegistration() {
    const id = makeRegistrationId();
    const record = {
      id,
      createdAt: new Date().toISOString(),
      status: "Pending Verification",
      feeStatus: form.tournament.paymentStatus,
      activity: [
        "Confirmation email queued",
        "WhatsApp confirmation queued",
        "PDF receipt generated",
        "Admin verification pending",
      ],
      form,
    };
    const submissions = readJson(SUBMISSIONS_KEY, []);
    writeJson(SUBMISSIONS_KEY, [record, ...submissions]);
    window.localStorage.removeItem(DRAFT_KEY);
    setSubmitted(record);
    setActiveStep(9);
    window.setTimeout(() => router.push(`/register/status?id=${encodeURIComponent(id)}&phone=${encodeURIComponent(form.captain.phone)}`), 2200);
  }

  return (
    <div className="reg-page">
      <Hero progress={progress} />
      <InfoSections openRule={openRule} setOpenRule={setOpenRule} />
      <section id="wizard" className="reg-section">
        <div className="reg-container reg-wizard-shell">
          <aside className="reg-progress-panel">
            <p className="reg-kicker">Draft Mode</p>
            <h2>{progress}% complete</h2>
            <div className="reg-progress-bar"><span style={{ width: `${progress}%` }} /></div>
            <nav aria-label="Registration steps">
              {stepMeta.map(([label, Icon], index) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => setActiveStep(index)}
                  className={activeStep === index ? "active" : index < activeStep ? "done" : ""}
                  aria-current={activeStep === index ? "step" : undefined}
                >
                  <Icon />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="reg-wizard-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
              >
                <StepContent
                  step={activeStep}
                  form={form}
                  updateGroup={updateGroup}
                  updatePlayer={updatePlayer}
                  addPlayer={addPlayer}
                  removePlayer={removePlayer}
                  movePlayer={movePlayer}
                  submitRegistration={submitRegistration}
                  submitted={submitted}
                />
              </motion.div>
            </AnimatePresence>

            {stepErrors().length > 0 && (
              <div className="reg-errors" role="alert">
                {stepErrors().map((error) => <p key={error}>{error}</p>)}
              </div>
            )}

            <div className="reg-step-actions">
              <button type="button" onClick={() => setActiveStep((step) => Math.max(step - 1, 0))} disabled={activeStep === 0}>
                Back
              </button>
              {activeStep < 8 && <button type="button" onClick={goNext}>Continue <ArrowRight /></button>}
              {activeStep === 8 && <button type="button" onClick={submitRegistration}>Submit Registration <Check /></button>}
              {activeStep === 9 && <Link href="/register/status">Open Status Page <ArrowRight /></Link>}
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}

function Hero({ progress }) {
  return (
    <section className="reg-hero">
      <div className="reg-container reg-hero-grid">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <p className="reg-kicker">Registrations Open</p>
          <h1>Register Your Team</h1>
          <p>Join Hyderabad&apos;s most professional community cricket tournament with a polished entry flow for teams, rosters, documents and payment verification.</p>
          <div className="reg-hero-actions">
            <a href="#rules" className="reg-button ghost"><FileText /> Download Rulebook</a>
            <Link href="/fixtures" className="reg-button ghost"><Trophy /> View Tournament</Link>
            <a href="#wizard" className="reg-button gold">Start Registration <ArrowRight /></a>
          </div>
        </motion.div>
        <motion.div className="reg-countdown-card" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, delay: 0.08 }}>
          <span>Registration closes in</span>
          <strong>18</strong>
          <p>Days</p>
          <div className="reg-progress-bar"><span style={{ width: `${progress}%` }} /></div>
          <small>Draft auto-saved locally</small>
        </motion.div>
      </div>
    </section>
  );
}

function InfoSections({ openRule, setOpenRule }) {
  return (
    <>
      <section className="reg-section">
        <div className="reg-container">
          <SectionHeader label="Tournament Information" title="Everything a captain needs before entry" />
          <div className="reg-info-grid">
            {tournamentInfo.map(([label, value], index) => (
              <motion.article key={label} className="reg-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.025 }}>
                <span>{label}</span>
                <strong>{value}</strong>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="reg-section compact">
        <div className="reg-container">
          <SectionHeader label="Why Participate" title="Built like a professional cricket property" />
          <div className="reg-feature-grid">
            {features.map(([title, Icon]) => (
              <article className="reg-card" key={title}>
                <Icon />
                <h3>{title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reg-section compact">
        <div className="reg-container">
          <SectionHeader label="Registration Timeline" title="From entry to fixtures" />
          <div className="reg-timeline">
            {timeline.map((item, index) => (
              <motion.article key={item} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                <span>Step {index + 1}</span>
                <strong>{item}</strong>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="rules" className="reg-section compact">
        <div className="reg-container">
          <SectionHeader label="Rules & Eligibility" title="Clear standards before you submit" />
          <div className="reg-accordion">
            {rules.map(([title, text]) => (
              <article key={title}>
                <button type="button" onClick={() => setOpenRule(openRule === title ? "" : title)} aria-expanded={openRule === title}>
                  {title}<ChevronDown />
                </button>
                {openRule === title && <p>{text}</p>}
              </article>
            ))}
          </div>
          <a href="#rules" className="reg-button gold"><FileText /> Download Rulebook</a>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ label, title }) {
  return (
    <div className="reg-section-header">
      <p className="reg-kicker">{label}</p>
      <h2>{title}</h2>
    </div>
  );
}

function StepContent(props) {
  const { step, submitted } = props;
  if (step === 0) return <TeamStep {...props} />;
  if (step === 1) return <PersonStep title="Captain Information" group="captain" required {...props} />;
  if (step === 2) return <PersonStep title="Vice Captain" group="viceCaptain" optional {...props} />;
  if (step === 3) return <PersonStep title="Manager" group="manager" optional {...props} />;
  if (step === 4) return <CategoryStep {...props} />;
  if (step === 5) return <RosterStep {...props} />;
  if (step === 6) return <DocumentsStep {...props} />;
  if (step === 7) return <DeclarationStep {...props} />;
  if (step === 8) return <ReviewStep {...props} />;
  return <SuccessStep submitted={submitted} />;
}

function TeamStep({ form, updateGroup }) {
  return (
    <StepFrame title="Team Details" text="Create the public identity for your tournament entry.">
      <div className="reg-field-grid">
        <Field label="Team Name" value={form.team.name} onChange={(value) => updateGroup("team", "name", value)} required />
        <UploadField label="Team Logo Upload" value={form.team.logo} onChange={(value) => updateGroup("team", "logo", value)} />
        <Field label="City" value={form.team.city} onChange={(value) => updateGroup("team", "city", value)} />
        <Field label="Home Ground" value={form.team.homeGround} onChange={(value) => updateGroup("team", "homeGround", value)} />
        <Field label="Jersey Colors" value={form.team.jerseyColors} onChange={(value) => updateGroup("team", "jerseyColors", value)} />
        <Field label="Years Active" value={form.team.yearsActive} onChange={(value) => updateGroup("team", "yearsActive", value)} type="number" />
        <Field label="Instagram" value={form.team.instagram} onChange={(value) => updateGroup("team", "instagram", value)} />
        <Field label="Facebook" value={form.team.facebook} onChange={(value) => updateGroup("team", "facebook", value)} />
        <Field label="Website" value={form.team.website} onChange={(value) => updateGroup("team", "website", value)} />
        <Field label="Short Team Description" value={form.team.description} onChange={(value) => updateGroup("team", "description", value)} textarea wide />
      </div>
    </StepFrame>
  );
}

function PersonStep({ title, group, optional, form, updateGroup }) {
  const person = form[group];
  return (
    <StepFrame title={title} text={optional ? "Optional, but useful for communication and matchday coordination." : "Primary verification and tournament communication details."}>
      <div className="reg-field-grid">
        <UploadField label={group === "captain" ? "Captain Photo" : "Photo"} value={person.photo} onChange={(value) => updateGroup(group, "photo", value)} />
        <Field label="Full Name" value={person.fullName} onChange={(value) => updateGroup(group, "fullName", value)} required={!optional} />
        <Field label="Phone" value={person.phone} onChange={(value) => updateGroup(group, "phone", value)} required={!optional} />
        <Field label="Email" value={person.email} onChange={(value) => updateGroup(group, "email", value)} type="email" required={!optional} />
        {group === "captain" && (
          <>
            <Field label="Date of Birth" value={person.dob} onChange={(value) => updateGroup(group, "dob", value)} type="date" />
            <Field label="Emergency Contact" value={person.emergencyContact} onChange={(value) => updateGroup(group, "emergencyContact", value)} />
            <UploadField label="ID Proof Upload" value={person.idProof} onChange={(value) => updateGroup(group, "idProof", value)} />
            <Field label="Address" value={person.address} onChange={(value) => updateGroup(group, "address", value)} textarea wide />
          </>
        )}
      </div>
    </StepFrame>
  );
}

function CategoryStep({ form, updateGroup }) {
  return (
    <StepFrame title="Tournament Category" text="Pick the bracket and add any notes for the organizers.">
      <div className="reg-field-grid">
        <label className="reg-field">
          <span>Dropdown</span>
          <select value={form.tournament.category} onChange={(event) => updateGroup("tournament", "category", event.target.value)}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="reg-field">
          <span>Payment Method</span>
          <select value={form.tournament.paymentMode} onChange={(event) => updateGroup("tournament", "paymentMode", event.target.value)}>
            <option>UPI</option>
            <option>QR Code</option>
            <option>Bank Transfer</option>
            <option>Future Razorpay Integration</option>
          </select>
        </label>
        <Field label="Transaction Reference" value={form.tournament.transactionRef} onChange={(value) => updateGroup("tournament", "transactionRef", value)} />
        <Field label="Additional Notes" value={form.tournament.notes} onChange={(value) => updateGroup("tournament", "notes", value)} textarea wide />
      </div>
      <div className="reg-payment-card">
        <CreditCard />
        <div>
          <h3>Payment Section</h3>
          <p>UPI, QR code and bank transfer are supported. Razorpay can be connected later without changing this user flow.</p>
        </div>
        <strong>Payment Pending</strong>
      </div>
    </StepFrame>
  );
}

function RosterStep({ form, updatePlayer, addPlayer, removePlayer, movePlayer }) {
  return (
    <StepFrame title="Player Roster" text="Minimum 11, maximum 16 players. Reorder using the arrow controls.">
      <div className="reg-roster-top">
        <strong>{form.players.length}/16 players</strong>
        <button type="button" onClick={addPlayer}>Add Player</button>
      </div>
      <div className="reg-roster-list">
        {form.players.map((player, index) => (
          <article key={index} className="reg-player-card">
            <div className="reg-player-order">
              <GripVertical />
              <button type="button" onClick={() => movePlayer(index, -1)} aria-label="Move player up">Up</button>
              <button type="button" onClick={() => movePlayer(index, 1)} aria-label="Move player down">Down</button>
            </div>
            <div className="reg-field-grid">
              <UploadField label="Photo" value={player.photo} onChange={(value) => updatePlayer(index, "photo", value)} />
              <Field label="Name" value={player.name} onChange={(value) => updatePlayer(index, "name", value)} />
              <Field label="Age" value={player.age} onChange={(value) => updatePlayer(index, "age", value)} type="number" />
              <SelectField label="Role" value={player.role} options={roles} onChange={(value) => updatePlayer(index, "role", value)} />
              <SelectField label="Batting Style" value={player.battingStyle} options={battingStyles} onChange={(value) => updatePlayer(index, "battingStyle", value)} />
              <SelectField label="Bowling Style" value={player.bowlingStyle} options={bowlingStyles} onChange={(value) => updatePlayer(index, "bowlingStyle", value)} />
              <Field label="Phone" value={player.phone} onChange={(value) => updatePlayer(index, "phone", value)} />
              <Field label="Jersey Number" value={player.jerseyNumber} onChange={(value) => updatePlayer(index, "jerseyNumber", value)} type="number" />
            </div>
            <div className="reg-toggle-row">
              <label><input type="checkbox" checked={player.captain} onChange={(event) => updatePlayer(index, "captain", event.target.checked)} /> Captain</label>
              <label><input type="checkbox" checked={player.viceCaptain} onChange={(event) => updatePlayer(index, "viceCaptain", event.target.checked)} /> Vice Captain</label>
              <button type="button" onClick={() => removePlayer(index)}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </StepFrame>
  );
}

function DocumentsStep({ form, updateGroup }) {
  return (
    <StepFrame title="Documents" text="Upload previews are represented by filenames in this frontend-only build.">
      <div className="reg-upload-grid">
        {[
          ["teamLogo", "Team Logo"],
          ["captainPhoto", "Captain Photo"],
          ["playerListPdf", "Player List PDF"],
          ["paymentScreenshot", "Payment Screenshot"],
          ["identityProof", "Identity Proof"],
          ["sponsorLogo", "Optional Sponsor Logo"],
        ].map(([field, label]) => (
          <UploadField key={field} label={label} value={form.documents[field]} onChange={(value) => updateGroup("documents", field, value)} large />
        ))}
      </div>
    </StepFrame>
  );
}

function DeclarationStep({ form, updateGroup }) {
  return (
    <StepFrame title="Declaration" text="Confirm terms, rules and the accuracy of submitted information.">
      <div className="reg-declaration">
        <label><input type="checkbox" checked={form.declaration.terms} onChange={(event) => updateGroup("declaration", "terms", event.target.checked)} /> I accept the tournament terms.</label>
        <label><input type="checkbox" checked={form.declaration.rules} onChange={(event) => updateGroup("declaration", "rules", event.target.checked)} /> I have read the rules and eligibility criteria.</label>
        <label><input type="checkbox" checked={form.declaration.accuracy} onChange={(event) => updateGroup("declaration", "accuracy", event.target.checked)} /> I confirm the submitted details are accurate.</label>
        <Field label="Digital Signature" value={form.declaration.signature} onChange={(value) => updateGroup("declaration", "signature", value)} required />
      </div>
    </StepFrame>
  );
}

function ReviewStep({ form }) {
  const namedPlayers = form.players.filter((player) => player.name);
  return (
    <StepFrame title="Review" text="Review everything before submitting. Use the sidebar to edit any section.">
      <div className="reg-review-grid">
        <ReviewCard title="Team" rows={[["Name", form.team.name], ["City", form.team.city], ["Home Ground", form.team.homeGround], ["Jersey", form.team.jerseyColors]]} />
        <ReviewCard title="Captain" rows={[["Name", form.captain.fullName], ["Phone", form.captain.phone], ["Email", form.captain.email]]} />
        <ReviewCard title="Tournament" rows={[["Category", form.tournament.category], ["Payment", form.tournament.paymentMode], ["Fee Status", form.tournament.paymentStatus]]} />
        <ReviewCard title="Documents" rows={Object.entries(form.documents).map(([key, value]) => [key, value || "Pending"])} />
      </div>
      <div className="reg-review-roster">
        <h3>Players ({namedPlayers.length})</h3>
        {namedPlayers.map((player, index) => <span key={`${player.name}-${index}`}>{index + 1}. {player.name} - {player.role}</span>)}
      </div>
    </StepFrame>
  );
}

function SuccessStep({ submitted }) {
  return (
    <StepFrame title="Submission" text="Your registration has been captured and routed for verification.">
      <div className="reg-success">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16 }}>
          <Check />
        </motion.div>
        <h3>{submitted?.id || "VS-2026-00042"}</h3>
        <p>Status: <strong>Pending Verification</strong></p>
        <span>Next steps: confirmation email, WhatsApp acknowledgement, PDF receipt and admin review.</span>
      </div>
    </StepFrame>
  );
}

function StepFrame({ title, text, children }) {
  return (
    <section>
      <p className="reg-kicker">Multi-Step Registration Wizard</p>
      <h2 className="reg-step-title">{title}</h2>
      <p className="reg-step-text">{text}</p>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, type = "text", textarea = false, wide = false, required = false }) {
  return (
    <label className={`reg-field ${wide ? "wide" : ""}`}>
      <span>{label}{required ? " *" : ""}</span>
      {textarea ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} type={type} />
      )}
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="reg-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function UploadField({ label, value, onChange, large = false }) {
  return (
    <label className={`reg-upload ${large ? "large" : ""}`}>
      <UploadCloud />
      <span>{label}</span>
      <small>{value || "Drag and drop upload, preview and validation"}</small>
      <input type="file" onChange={(event) => onChange(getFileName(event.target.files))} />
    </label>
  );
}

function ReviewCard({ title, rows }) {
  return (
    <article className="reg-review-card">
      <h3>{title}</h3>
      {rows.map(([label, value]) => (
        <p key={label}><span>{label}</span><strong>{value || "Not added"}</strong></p>
      ))}
    </article>
  );
}
