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

        <div className="rounded-2xl border border-white/10 bg-[#101D35] p-5">
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
          className="h-14"
        >
          Save Settings
        </Button>
      </div>
    </Card>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl bg-[#0A1428] px-4 py-3 text-white">
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
