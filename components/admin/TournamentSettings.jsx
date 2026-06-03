"use client";

import { useEffect, useState } from "react";

import Card from "../ui/Card";

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
    }

    loadSettings();
  }, []);

  async function handleSave() {
    await saveSettings({
      tournamentName,
      organizerName,
      logo,
      youtubeChannel,
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

        {logo && (
          <div className="pt-2">
            <p className="text-slate-400 mb-2">
              Logo Preview
            </p>

            <img
              src={logo}
              alt="Tournament Logo"
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

        <button
          onClick={handleSave}
          className="
            h-14
            px-6
            rounded-xl
            bg-cyan-500
            hover:bg-cyan-600
            text-white
            font-bold
          "
        >
          Save Settings
        </button>
      </div>
    </Card>
  );
}