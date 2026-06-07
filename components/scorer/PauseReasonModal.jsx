"use client";

import { useState } from "react";

const pauseReasons = [
  "Rain",
  "Bad Light",
  "Ground Issue",
  "Medical Emergency",
  "Technical Issue",
  "Other",
];

export default function PauseReasonModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("Rain");
  const [customReason, setCustomReason] = useState("");
  const [note, setNote] = useState("");
  const finalReason = reason === "Other" ? customReason.trim() : reason;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-[#101D35] p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-white">Pause Reason</h2>
          <button onClick={onClose} className="min-h-11 px-3 text-slate-300 hover:text-white">
            Close
          </button>
        </div>

        <select
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="mt-5 h-14 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 text-white"
        >
          {pauseReasons.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {reason === "Other" && (
          <input
            value={customReason}
            onChange={(event) => setCustomReason(event.target.value)}
            placeholder="Custom reason"
            className="mt-4 h-14 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 text-white"
          />
        )}

        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Public note"
          className="mt-4 h-14 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 text-white"
        />

        <button
          disabled={!finalReason}
          onClick={() => onSubmit({ reason: finalReason, note })}
          className="mt-6 h-14 w-full rounded-xl bg-[#D4AF37] font-black text-[#06152F] disabled:opacity-50"
        >
          Confirm Pause
        </button>
      </div>
    </div>
  );
}
