"use client";

import { updateMatch } from "../../../Lib/updateMatch";

export default function RunControls() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      <button
        onClick={() => updateMatch("RUN_1")}
        className="
  h-16
  rounded-2xl
  bg-blue-500
  text-white
  font-bold
  text-xl
  transition-all
  duration-150
  active:scale-95
  hover:scale-105
  shadow-lg
  hover:shadow-cyan-500/30
"
      >
        1
      </button>

      <button
        onClick={() => updateMatch("RUN_2")}
        className="
  h-16
  rounded-2xl
  bg-blue-500
  text-white
  font-bold
  text-xl
  transition-all
  duration-150
  active:scale-95
  hover:scale-105
  shadow-lg
  hover:shadow-cyan-500/30
"
      >
        2
      </button>

      <button
        onClick={() => updateMatch("RUN_4")}
        className="
  h-16
  rounded-2xl
  bg-green-500
  text-white
  font-bold
  text-xl
  transition-all
  duration-150
  active:scale-95
  hover:scale-105
  shadow-lg
  hover:shadow-cyan-500/30
"
      >
        4
      </button>

      <button
        onClick={() => updateMatch("RUN_6")}
        className="
  h-16
  rounded-2xl
  bg-purple-500
  text-white
  font-bold
  text-xl
  transition-all
  duration-150
  active:scale-95
  hover:scale-105
  shadow-lg
  hover:shadow-cyan-500/30
"
      >
        6
      </button>

      <button
        onClick={() => updateMatch("WIDE")}
        className="
  h-16
  rounded-2xl
  bg-yellow-500
  text-black
  font-bold
  text-xl
  transition-all
  duration-150
  active:scale-95
  hover:scale-105
  shadow-lg
  hover:shadow-cyan-500/30
"
      >
        Wd
      </button>

      <button
        onClick={() => updateMatch("NO_BALL")}
        className="
  h-16
  rounded-2xl
  bg-orange-500
  text-white
  font-bold
  text-xl
  transition-all
  duration-150
  active:scale-95
  hover:scale-105
  shadow-lg
  hover:shadow-cyan-500/30
"
      >
        Nb
      </button>
    </div>
  );
}
