"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import Card from "../ui/Card";
import Button from "../ui/Button";

import {
  getSettings,
  saveSettings,
} from "@/services/SettingServices";

export default function TournamentSettings() {
  const [
    tournamentName,
    setTournamentName,
  ] = useState("");

  const [
    organizerName,
    setOrganizerName,
  ] = useState("");

  const [logo, setLogo] =
    useState("");

  const [
    youtubeChannel,
    setYoutubeChannel,
  ] = useState("");
  const [tournamentStage, setTournamentStage] = useState("League Stage");
  const [automaticStandings, setAutomaticStandings] = useState(true);
  const [allowManualOverride, setAllowManualOverride] = useState(true);
  const [abandonedMatchPoints, setAbandonedMatchPoints] = useState(1);
  const [enableRevisedTargets, setEnableRevisedTargets] = useState(true);
  const [enableWalkovers, setEnableWalkovers] = useState(true);
  const [homepage, setHomepage] = useState({
    yearsOfOperation: "",
    tournamentsConducted: "",
    teamsParticipated: "",
    playersRegistered: "",
    establishedYear: "",
    teamRegistrationUrl: "",
    pastTournamentName: "",
    pastChampion: "",
    pastRunnerUp: "",
    pastBestBatter: "",
    pastBestBowler: "",
    pastPlayerOfTournament: "",
    playerOfTournament: "",
    galleryImages: "",
    contactPhone: "",
    whatsapp: "",
    whatsappUrl: "",
    contactEmail: "",
    contactLocation: "",
    googleMapsUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    testimonialEntries: "",
  });

  useEffect(() => {
    async function loadSettings() {
      const data =
        await getSettings();

      if (!data) return;

      setTournamentName(
        data.tournamentName || ""
      );

      setOrganizerName(
        data.organizerName || ""
      );

      setLogo(
        data.logo || ""
      );

      setYoutubeChannel(
        data.youtubeChannel || ""
      );

      setTournamentStage(data.tournamentStage || "League Stage");
      setAutomaticStandings(data.automaticStandings !== false);
      setAllowManualOverride(data.allowManualOverride !== false);
      setAbandonedMatchPoints(data.abandonedMatchPoints ?? 1);
      setEnableRevisedTargets(data.enableRevisedTargets !== false);
      setEnableWalkovers(data.enableWalkovers !== false);
      setHomepage((current) => Object.fromEntries(
        Object.keys(current).map((key) => [
          key,
          key === "testimonialEntries"
            ? (data.testimonials || []).map((item) => `${item.name || ""}|${item.role || ""}|${item.quote || ""}`).join("\n")
            : Array.isArray(data[key]) ? data[key].join("\n") : data[key] || "",
        ])
      ));
    }

    loadSettings();
  }, []);

  async function handleSave() {
    await saveSettings({
      tournamentName,
      organizerName,
      logo,
      youtubeChannel,
      tournamentStage,
      automaticStandings,
      allowManualOverride,
      abandonedMatchPoints: Number(abandonedMatchPoints),
      enableRevisedTargets,
      enableWalkovers,
      ...homepage,
      testimonials: homepage.testimonialEntries.split(/\r?\n/).map((line) => {
        const [name, role, ...quote] = line.split("|");
        return { name: name?.trim(), role: role?.trim(), quote: quote.join("|").trim() };
      }).filter((item) => item.name && item.quote),
      updatedAt: Date.now(),
    });

    alert(
      "Settings Saved Successfully"
    );
  }

  return (
    <Card>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">
          Tournament Settings
        </h2>

        <input
          value={tournamentName}
          onChange={(e) =>
            setTournamentName(
              e.target.value
            )
          }
          placeholder="Tournament Name"
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
          "
        />

        <input
          value={organizerName}
          onChange={(e) =>
            setOrganizerName(
              e.target.value
            )
          }
          placeholder="Organizer Name"
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
          "
        />

        <input
          value={logo}
          onChange={(e) =>
            setLogo(
              e.target.value
            )
          }
          placeholder="Tournament Logo URL"
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
          "
        />

        <input
          value={youtubeChannel}
          onChange={(e) =>
            setYoutubeChannel(
              e.target.value
            )
          }
          placeholder="YouTube Channel / Live Stream Link"
          className="
            w-full
            h-14
            px-4
            rounded-xl
            bg-[#101D35]
            border border-white/10
            text-white
          "
        />

        <label className="block">
          <span className="text-sm font-semibold text-slate-400">
            Tournament Stage
          </span>
          <select
            value={tournamentStage}
            onChange={(event) => setTournamentStage(event.target.value)}
            className="
              mt-2
              h-14
              w-full
              rounded-xl
              bg-[#101D35]
              border border-white/10
              text-white
              px-4
            "
          >
            <option value="League Stage">League Stage</option>
            <option value="Qualifier">Qualifier</option>
            <option value="Semi Final">Semi Final</option>
            <option value="Final">Final</option>
            <option value="Completed">Completed</option>
          </select>
        </label>

        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101D35] p-4 sm:p-5">
          <h3 className="text-xl font-black text-white">
            Operations Settings
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Toggle
              label="Automatic Standings"
              checked={automaticStandings}
              onChange={setAutomaticStandings}
            />
            <Toggle
              label="Allow Manual Override"
              checked={allowManualOverride}
              onChange={setAllowManualOverride}
            />
            <Toggle
              label="Enable Revised Targets"
              checked={enableRevisedTargets}
              onChange={setEnableRevisedTargets}
            />
            <Toggle
              label="Enable Walkovers"
              checked={enableWalkovers}
              onChange={setEnableWalkovers}
            />

            <label className="block">
              <span className="text-sm font-semibold text-slate-400">
                Abandoned Match Points
              </span>
              <select
                value={abandonedMatchPoints}
                onChange={(event) => setAbandonedMatchPoints(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 text-white"
              >
                <option value={1}>1 point each</option>
                <option value={0}>0 points each</option>
              </select>
            </label>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-[#D8B45A]/20 bg-[#101D35] p-4 sm:p-5">
          <h3 className="text-xl font-black text-white">Homepage Content</h3>
          <p className="mt-2 text-sm text-slate-400">
            Organization figures, honours, gallery and contact details shown on the public homepage.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <HomepageField label="Years of operation" name="yearsOfOperation" value={homepage.yearsOfOperation} setHomepage={setHomepage} placeholder="5+" />
            <HomepageField label="Tournaments conducted" name="tournamentsConducted" value={homepage.tournamentsConducted} setHomepage={setHomepage} placeholder="12+" />
            <HomepageField label="Teams participated" name="teamsParticipated" value={homepage.teamsParticipated} setHomepage={setHomepage} placeholder="40+" />
            <HomepageField label="Players registered" name="playersRegistered" value={homepage.playersRegistered} setHomepage={setHomepage} placeholder="500+" />
            <HomepageField label="Established year" name="establishedYear" value={homepage.establishedYear} setHomepage={setHomepage} placeholder="2021" />
            <HomepageField label="Team registration URL" name="teamRegistrationUrl" value={homepage.teamRegistrationUrl} setHomepage={setHomepage} placeholder="https://..." />
          </div>

          <h4 className="mt-7 font-bold text-[#E5C158]">Past Tournament Honours</h4>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <HomepageField label="Tournament name" name="pastTournamentName" value={homepage.pastTournamentName} setHomepage={setHomepage} />
            <HomepageField label="Champion" name="pastChampion" value={homepage.pastChampion} setHomepage={setHomepage} />
            <HomepageField label="Runner-up" name="pastRunnerUp" value={homepage.pastRunnerUp} setHomepage={setHomepage} />
            <HomepageField label="Best batter" name="pastBestBatter" value={homepage.pastBestBatter} setHomepage={setHomepage} />
            <HomepageField label="Best bowler" name="pastBestBowler" value={homepage.pastBestBowler} setHomepage={setHomepage} />
            <HomepageField label="Player of tournament" name="pastPlayerOfTournament" value={homepage.pastPlayerOfTournament} setHomepage={setHomepage} />
            <HomepageField label="Current player of tournament" name="playerOfTournament" value={homepage.playerOfTournament} setHomepage={setHomepage} />
          </div>

          <label className="mt-7 block">
            <span className="text-sm font-semibold text-slate-400">Gallery image URLs (one per line)</span>
            <textarea value={homepage.galleryImages} onChange={(event) => setHomepage((current) => ({ ...current, galleryImages: event.target.value }))} rows={5} placeholder="https://..." className="mt-2 w-full rounded-xl border border-white/10 bg-[#0A1428] p-4 text-white" />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-400">Testimonials (Name | Role | Quote, one per line)</span>
            <textarea value={homepage.testimonialEntries} onChange={(event) => setHomepage((current) => ({ ...current, testimonialEntries: event.target.value }))} rows={5} placeholder="Captain Name | Team Captain | Viva Sports gave our players..." className="mt-2 w-full rounded-xl border border-white/10 bg-[#0A1428] p-4 text-white" />
          </label>

          <h4 className="mt-7 font-bold text-[#E5C158]">Contact & Social</h4>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <HomepageField label="Phone" name="contactPhone" value={homepage.contactPhone} setHomepage={setHomepage} />
            <HomepageField label="WhatsApp number" name="whatsapp" value={homepage.whatsapp} setHomepage={setHomepage} />
            <HomepageField label="WhatsApp URL" name="whatsappUrl" value={homepage.whatsappUrl} setHomepage={setHomepage} />
            <HomepageField label="Email" name="contactEmail" value={homepage.contactEmail} setHomepage={setHomepage} />
            <HomepageField label="Location" name="contactLocation" value={homepage.contactLocation} setHomepage={setHomepage} />
            <HomepageField label="Google Maps URL" name="googleMapsUrl" value={homepage.googleMapsUrl} setHomepage={setHomepage} />
            <HomepageField label="Instagram URL" name="instagramUrl" value={homepage.instagramUrl} setHomepage={setHomepage} />
            <HomepageField label="Facebook URL" name="facebookUrl" value={homepage.facebookUrl} setHomepage={setHomepage} />
          </div>
        </div>

        {logo && (
          <div className="pt-2">
            <p className="text-slate-400 mb-2">
              Logo Preview
            </p>

            <Image
              src={logo}
              alt="Tournament Logo"
              width={96}
              height={96}
              unoptimized
              className="
                w-24
                h-24
                rounded-xl
                object-cover
                border border-white/10
              "
            />
          </div>
        )}

        <Button
          onClick={handleSave}
          className="h-14 w-full sm:w-fit"
        >
          Save Settings
        </Button>
      </div>
    </Card>
  );
}

function HomepageField({ label, name, value, setHomepage, placeholder = "" }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(event) => setHomepage((current) => ({ ...current, [name]: event.target.value }))}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 text-white"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex min-h-14 items-center justify-between gap-4 rounded-xl bg-[#0A1428] px-4 py-3 text-white">
      <span className="min-w-0 break-words font-semibold">{label}</span>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-[var(--vs-gold)]"
      />
    </label>
  );
}
