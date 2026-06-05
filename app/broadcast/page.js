"use client";

import { useEffect, useMemo, useState } from "react";

import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import {
  getBroadcastSettings,
  saveBroadcastSettings,
  subscribeToBroadcastSettings,
} from "@/services/broadcastService";
import { subscribeToMatches } from "@/services/matchService";

const manualTypes = [
  "FOUR",
  "SIX",
  "WICKET",
  "FIFTY",
  "CENTURY",
  "PLAYER OF MATCH",
];

const matchGraphicTypes = [
  { value: "playing_xi", label: "Playing XI" },
  { value: "toss", label: "Toss Winner" },
  { value: "target", label: "Target" },
  { value: "innings_break", label: "Innings Break" },
  { value: "result", label: "Match Result" },
  { value: "player_of_match", label: "Player Of Match" },
];

const themeOptions = [
  { value: "classic", label: "Classic" },
  { value: "modern", label: "Modern" },
  { value: "premium_gold", label: "Premium Gold" },
];

const sponsorCategories = [
  { key: "gold", label: "Gold Sponsor" },
  { key: "silver", label: "Silver Sponsor" },
  { key: "partners", label: "Partner Sponsor" },
];

export default function BroadcastControlPage() {
  const [settings, setSettings] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [manualType, setManualType] = useState("FOUR");
  const [manualTitle, setManualTitle] = useState("FOUR");
  const [manualSubtitle, setManualSubtitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      setSettings(await getBroadcastSettings());
    }

    Promise.resolve().then(loadSettings);

    const unsubscribeSettings = subscribeToBroadcastSettings(setSettings);
    const unsubscribeMatches = subscribeToMatches((data) => {
      setMatches(data);
      setSelectedMatchId((current) => current || data[0]?.id || "");
    });

    return () => {
      unsubscribeSettings();
      unsubscribeMatches();
    };
  }, []);

  const overlayUrl = useMemo(
    () => (selectedMatchId ? `/overlay/live/${selectedMatchId}` : ""),
    [selectedMatchId]
  );

  async function savePatch(patch) {
    setSaving(true);
    await saveBroadcastSettings(patch);
    setSettings((current) => ({
      ...(current || {}),
      ...patch,
    }));
    setSaving(false);
  }

  function setDraft(patch) {
    setSettings((current) => ({
      ...(current || {}),
      ...patch,
    }));
  }

  function updateSponsor(category, index, field, value) {
    setSettings((current) => {
      const sponsorTiers = {
        gold: [...(current?.sponsorTiers?.gold || [])],
        silver: [...(current?.sponsorTiers?.silver || [])],
        partners: [...(current?.sponsorTiers?.partners || [])],
      };

      sponsorTiers[category][index] = {
        ...sponsorTiers[category][index],
        [field]: value,
      };

      return {
        ...current,
        sponsorTiers,
      };
    });
  }

  async function addSponsor(category) {
    const sponsorTiers = {
      gold: [...(settings?.sponsorTiers?.gold || [])],
      silver: [...(settings?.sponsorTiers?.silver || [])],
      partners: [...(settings?.sponsorTiers?.partners || [])],
    };

    sponsorTiers[category].push({
      name: "New Sponsor",
      logo: "",
      link: "",
    });

    await savePatch({ sponsorTiers });
  }

  async function removeSponsor(category, index) {
    const sponsorTiers = {
      gold: [...(settings?.sponsorTiers?.gold || [])],
      silver: [...(settings?.sponsorTiers?.silver || [])],
      partners: [...(settings?.sponsorTiers?.partners || [])],
    };

    sponsorTiers[category] = sponsorTiers[category].filter(
      (_, sponsorIndex) => sponsorIndex !== index
    );

    await savePatch({ sponsorTiers });
  }

  async function triggerManualGraphic() {
    await savePatch({
      graphicsVisible: true,
      manualGraphic: {
        type: manualType,
        title: manualTitle || manualType,
        subtitle: manualSubtitle,
      },
    });
  }

  async function showMatchGraphic(type) {
    await savePatch({
      graphicsVisible: true,
      liveGraphic: {
        visible: true,
        type,
      },
      matchGraphic: {
        visible: true,
        type,
      },
    });
  }

  if (!settings) {
    return (
      <main className="vs-page">
        <Navbar />
        <section className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-slate-400">Loading broadcast controls...</p>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="vs-page">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <p className="vs-eyebrow">Broadcast Control</p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">
          Stream Layer
        </h1>
        <p className="mt-3 max-w-3xl text-slate-400">
          OBS-ready overlays, sponsor rotation, event graphics, match graphics
          and ticker controls. This panel writes only broadcast settings.
        </p>

        <div className="vs-card mt-8 p-5">
          <label className="text-sm font-semibold text-slate-400">
            Overlay Match
          </label>
          <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto]">
            <select
              value={selectedMatchId}
              onChange={(event) => setSelectedMatchId(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#050B18] px-4 py-3 text-white"
            >
              {matches.map((match) => (
                <option key={match.id} value={match.id}>
                  {match.teamA} vs {match.teamB} - {match.status}
                </option>
              ))}
            </select>
            <a
              href={overlayUrl || "#"}
              target="_blank"
              className="rounded-lg bg-[var(--vs-gold)] px-5 py-3 text-center text-sm font-black uppercase text-[#050B18]"
            >
              Open Overlay
            </a>
          </div>
          <p className="mt-3 break-all rounded-xl bg-black/30 p-3 text-sm text-[var(--vs-gold-soft)]">
            {overlayUrl || "Create a match to generate an overlay URL."}
          </p>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <ControlCard title="Overlay Themes">
            <label className="text-sm font-semibold text-slate-400">
              Theme
            </label>
            <select
              value={settings.overlayTheme || "premium_gold"}
              onChange={(event) => savePatch({ overlayTheme: event.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#050B18] px-4 py-3 text-white"
            >
              {themeOptions.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => savePatch({ overlayVisible: true })}
                className="rounded-lg bg-[var(--vs-gold)] px-5 py-3 text-sm font-black uppercase text-[#050B18]"
              >
                Show Overlay
              </button>
              <button
                onClick={() => savePatch({ overlayVisible: false })}
                className="rounded-lg border border-red-300/30 px-5 py-3 text-sm font-black uppercase text-red-100"
              >
                Hide Overlay
              </button>
              <button
                onClick={() => savePatch({ graphicsVisible: true })}
                className="rounded-lg border border-[var(--vs-gold)]/40 px-5 py-3 text-sm font-black uppercase text-[var(--vs-gold-soft)]"
              >
                Show Graphics
              </button>
              <button
                onClick={() =>
                  savePatch({
                    graphicsVisible: false,
                    liveGraphic: { ...(settings.liveGraphic || {}), visible: false },
                    matchGraphic: { ...(settings.matchGraphic || {}), visible: false },
                  })
                }
                className="rounded-lg border border-white/15 px-5 py-3 text-sm font-black uppercase text-white"
              >
                Hide Graphics
              </button>
            </div>
          </ControlCard>

          <ControlCard title="Sponsor Rotation">
            <ToggleRow
              label="Enable sponsor rotation"
              checked={settings.sponsorRotation}
              onChange={(checked) => savePatch({ sponsorRotation: checked })}
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-slate-400">
                  Category on overlay
                </span>
                <select
                  value={settings.activeSponsorCategory || "all"}
                  onChange={(event) =>
                    savePatch({ activeSponsorCategory: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#050B18] px-4 py-3 text-white"
                >
                  <option value="all">All Sponsors</option>
                  <option value="gold">Gold Sponsor</option>
                  <option value="silver">Silver Sponsor</option>
                  <option value="partners">Partner Sponsor</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-slate-400">
                  Rotation interval seconds
                </span>
                <input
                  type="number"
                  min="2"
                  value={settings.sponsorInterval || 8}
                  onChange={(event) =>
                    setDraft({ sponsorInterval: Number(event.target.value) })
                  }
                  onBlur={() =>
                    savePatch({
                      sponsorInterval: Math.max(settings.sponsorInterval || 8, 2),
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#050B18] px-4 py-3 text-white"
                />
              </label>
            </div>
          </ControlCard>

          <ControlCard title="Manual Event Graphics">
            <div className="grid gap-3 sm:grid-cols-3">
              <select
                value={manualType}
                onChange={(event) => {
                  setManualType(event.target.value);
                  setManualTitle(event.target.value);
                }}
                className="rounded-xl border border-white/10 bg-[#050B18] px-4 py-3 text-white"
              >
                {manualTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                value={manualTitle}
                onChange={(event) => setManualTitle(event.target.value)}
                placeholder="Title"
                className="rounded-xl border border-white/10 bg-[#050B18] px-4 py-3 text-white"
              />
              <input
                value={manualSubtitle}
                onChange={(event) => setManualSubtitle(event.target.value)}
                placeholder="Subtitle"
                className="rounded-xl border border-white/10 bg-[#050B18] px-4 py-3 text-white"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={triggerManualGraphic}
                className="rounded-lg bg-[var(--vs-gold)] px-5 py-3 text-sm font-black uppercase text-[#050B18]"
              >
                Manual Trigger
              </button>
              <button
                onClick={() => savePatch({ manualGraphic: null })}
                className="rounded-lg border border-white/15 px-5 py-3 text-sm font-black uppercase text-white"
              >
                Clear Manual
              </button>
            </div>
          </ControlCard>

          <ControlCard title="Match Graphics">
            <div className="grid gap-3 sm:grid-cols-2">
              {matchGraphicTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => showMatchGraphic(type.value)}
                  className="rounded-lg border border-[var(--vs-gold)]/30 px-4 py-3 text-left text-sm font-black uppercase text-[var(--vs-gold-soft)] transition hover:bg-[var(--vs-gold)]/10"
                >
                  {type.label}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                savePatch({
                  liveGraphic: { ...(settings.liveGraphic || {}), visible: false },
                  matchGraphic: { ...(settings.matchGraphic || {}), visible: false },
                })
              }
              className="mt-4 rounded-lg border border-white/15 px-5 py-3 text-sm font-black uppercase text-white"
            >
              Hide Match Graphic
            </button>
          </ControlCard>
        </div>

        <ControlCard title="Stream Ticker" className="mt-6">
          <ToggleRow
            label="Show stream ticker"
            checked={settings.tickerVisible}
            onChange={(checked) => savePatch({ tickerVisible: checked })}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <TickerToggle
              label="Upcoming Matches"
              field="upcoming"
              settings={settings}
              savePatch={savePatch}
            />
            <TickerToggle
              label="Top Batters"
              field="topBatters"
              settings={settings}
              savePatch={savePatch}
            />
            <TickerToggle
              label="Top Bowlers"
              field="topBowlers"
              settings={settings}
              savePatch={savePatch}
            />
            <TickerToggle
              label="Sponsors"
              field="sponsors"
              settings={settings}
              savePatch={savePatch}
            />
          </div>
        </ControlCard>

        <ControlCard title="Sponsor System" className="mt-6">
          <div className="grid gap-6">
            {sponsorCategories.map((category) => (
              <SponsorCategory
                key={category.key}
                category={category}
                sponsors={settings.sponsorTiers?.[category.key] || []}
                updateSponsor={updateSponsor}
                addSponsor={addSponsor}
                removeSponsor={removeSponsor}
              />
            ))}
          </div>
          <button
            onClick={() => savePatch({ sponsorTiers: settings.sponsorTiers })}
            className="mt-5 rounded-lg bg-[var(--vs-gold)] px-5 py-3 text-sm font-black uppercase text-[#050B18]"
          >
            Save Sponsors
          </button>
        </ControlCard>

        {saving && (
          <p className="mt-5 text-sm font-semibold text-[var(--vs-gold-soft)]">
            Saving broadcast settings...
          </p>
        )}
      </section>

      <Footer />
    </main>
  );
}

function ControlCard({ title, children, className = "" }) {
  return (
    <section className={`vs-card p-5 md:p-6 ${className}`}>
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#050B18] px-4 py-3">
      <span className="font-semibold">{label}</span>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-[var(--vs-gold)]"
      />
    </label>
  );
}

function TickerToggle({ label, field, settings, savePatch }) {
  const tickerSections = settings.tickerSections || {};

  return (
    <ToggleRow
      label={label}
      checked={tickerSections[field] !== false}
      onChange={(checked) =>
        savePatch({
          tickerSections: {
            ...tickerSections,
            [field]: checked,
          },
        })
      }
    />
  );
}

function SponsorCategory({
  category,
  sponsors,
  updateSponsor,
  addSponsor,
  removeSponsor,
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#050B18] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-black">{category.label}</h3>
        <button
          onClick={() => addSponsor(category.key)}
          className="rounded-lg border border-[var(--vs-gold)]/40 px-4 py-2 text-sm font-black uppercase text-[var(--vs-gold-soft)]"
        >
          Add
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {sponsors.map((sponsor, index) => (
          <div
            key={`${category.key}-${index}`}
            className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <input
              value={sponsor.name || ""}
              onChange={(event) =>
                updateSponsor(category.key, index, "name", event.target.value)
              }
              placeholder="Sponsor name"
              className="rounded-xl border border-white/10 bg-[#050B18] px-4 py-3 text-white"
            />
            <input
              value={sponsor.logo || ""}
              onChange={(event) =>
                updateSponsor(category.key, index, "logo", event.target.value)
              }
              placeholder="Logo URL"
              className="rounded-xl border border-white/10 bg-[#050B18] px-4 py-3 text-white"
            />
            <input
              value={sponsor.link || ""}
              onChange={(event) =>
                updateSponsor(category.key, index, "link", event.target.value)
              }
              placeholder="Link"
              className="rounded-xl border border-white/10 bg-[#050B18] px-4 py-3 text-white"
            />
            <button
              onClick={() => removeSponsor(category.key, index)}
              className="rounded-lg border border-red-300/35 px-4 py-3 text-sm font-black uppercase text-red-100"
            >
              Remove
            </button>
          </div>
        ))}

        {!sponsors.length && (
          <p className="text-sm text-slate-400">No sponsors in this category.</p>
        )}
      </div>
    </section>
  );
}
