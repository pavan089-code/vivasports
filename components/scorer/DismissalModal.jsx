"use client";

import { useState } from "react";

export default function DismissalModal({ fielders, onClose, onSelect }) {
  const [dismissalType, setDismissalType] = useState("bowled");
  const [fielder, setFielder] = useState("");
  const needsFielder = ["caught", "run_out", "stumped"].includes(dismissalType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-[#101D35] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-white sm:text-3xl">Dismissal Type</h2>
          <button onClick={onClose} className="min-h-11 px-3 text-slate-300 hover:text-white">
            Close
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            ["bowled", "Bowled"],
            ["caught", "Caught"],
            ["lbw", "LBW"],
            ["run_out", "Run Out"],
            ["stumped", "Stumped"],
            ["hit_wicket", "Hit Wicket"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setDismissalType(value)}
              className={`min-h-14 rounded-xl px-3 font-bold ${
                dismissalType === value
                  ? "bg-[#D4AF37] text-[#06152F]"
                  : "bg-[#0A1428] text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {needsFielder && (
          <select
            value={fielder}
            onChange={(event) => setFielder(event.target.value)}
            className="mt-5 h-14 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 text-white"
          >
            <option value="">Select Fielder</option>
            {fielders.map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        )}

        <button
          disabled={needsFielder && !fielder}
          onClick={() => onSelect({ dismissalType, fielder })}
          className="mt-6 h-14 w-full rounded-xl bg-red-600 font-black text-white disabled:opacity-50"
        >
          Confirm Wicket
        </button>
      </div>
    </div>
  );
}
