"use client";

import { updateMatch } from "../../../Lib/updateMatch";

export default function MatchControls() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <button
        onClick={() => updateMatch("WICKET")}
        className="h-16 rounded-2xl bg-red-600 text-white font-bold"
      >
        Wicket
      </button>

      <button
        onClick={() => updateMatch("UNDO")}
        className="h-16 rounded-2xl bg-gray-700 text-white font-bold"
      >
        Undo
      </button>

      <button
        onClick={() => updateMatch("CHANGE_STRIKE")}
        className="h-16 rounded-2xl bg-cyan-500 text-white font-bold"
      >
        Change Strike
      </button>

      <button
        onClick={() => updateMatch("NEXT_OVER")}
        className="h-16 rounded-2xl bg-pink-500 text-white font-bold"
      >
        Next Over
      </button>

    </div>
  );
}