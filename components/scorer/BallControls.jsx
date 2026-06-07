import { memo } from "react";

const wideOptions = [0, 1, 2, 3, 4];
const noBallOptions = [0, 1, 2, 3, 4, 6];
const byeOptions = [1, 2, 3, 4];

function BallControls({
  disabled,
  onScore,
  onWicket,
  onWide,
  onNoBall,
  onBye,
  onUndo,
  onRedo,
  onSwapStrike,
}) {
  const buttonClass = `
    h-[76px]
    min-h-[76px]
    active:scale-[0.98]
    rounded-2xl
    text-[clamp(1.15rem,5vw,1.5rem)]
    font-black
    text-white
    transition
    disabled:opacity-55
  `;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6">
      <button
        disabled={disabled}
        onClick={() => onScore(0)}
        className={`${buttonClass} bg-slate-700`}
      >
        DOT
      </button>

      <button
        disabled={disabled}
        onClick={() => onScore(1)}
        className={`${buttonClass} bg-blue-500`}
      >
        1
      </button>

      <button
        disabled={disabled}
        onClick={() => onScore(2)}
        className={`${buttonClass} bg-[#4A6FD6]`}
      >
        2
      </button>

      <button
        disabled={disabled}
        onClick={() => onScore(3)}
        className={`${buttonClass} bg-indigo-500`}
      >
        3
      </button>

      <button
        disabled={disabled}
        onClick={() => onScore(4)}
        className={`${buttonClass} bg-green-600`}
      >
        FOUR
      </button>

      <button
        disabled={disabled}
        onClick={() => onScore(6)}
        className={`${buttonClass} bg-purple-500`}
      >
        SIX
      </button>

      <button
        disabled={disabled}
        onClick={onWicket}
        className={`${buttonClass} bg-red-600`}
      >
        WICKET
      </button>

      <button
        disabled={disabled}
        onClick={onUndo}
        className={`${buttonClass} bg-red-700`}
      >
        UNDO
      </button>

      <button
        disabled={disabled}
        onClick={onRedo}
        className={`${buttonClass} bg-[var(--vs-gold)] text-[#06152F]`}
      >
        REDO
      </button>

      <button
        disabled={disabled}
        onClick={onSwapStrike}
        className={`${buttonClass} bg-pink-500`}
      >
        SWAP
      </button>
      </div>

      <ControlGroup title="Wides">
        {wideOptions.map((runs) => (
          <button
            key={`wide-${runs}`}
            disabled={disabled}
            onClick={() => onWide(runs)}
            className={`${buttonClass} bg-[#F5C542] text-[#06152F]`}
          >
            {runs ? `WD+${runs}` : "WD"}
          </button>
        ))}
      </ControlGroup>

      <ControlGroup title="No Balls">
        {noBallOptions.map((runs) => (
          <button
            key={`nb-${runs}`}
            disabled={disabled}
            onClick={() => onNoBall(runs)}
            className={`${buttonClass} bg-[#F28C28] text-[#06152F]`}
          >
            {runs ? `NB+${runs}` : "NB"}
          </button>
        ))}
      </ControlGroup>

      <ControlGroup title="Byes">
        {byeOptions.map((runs) => (
          <button
            key={`bye-${runs}`}
            disabled={disabled}
            onClick={() => onBye(runs, false)}
            className={`${buttonClass} bg-teal-600`}
          >
            B{runs}
          </button>
        ))}
      </ControlGroup>

      <ControlGroup title="Leg Byes">
        {byeOptions.map((runs) => (
          <button
            key={`leg-bye-${runs}`}
            disabled={disabled}
            onClick={() => onBye(runs, true)}
            className={`${buttonClass} bg-lime-600`}
          >
            LB{runs}
          </button>
        ))}
      </ControlGroup>
    </div>
  );
}

function ControlGroup({ title, children }) {
  return (
    <div>
      <p className="text-slate-400 text-sm uppercase tracking-widest mb-3">
        {title}
      </p>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6">{children}</div>
    </div>
  );
}

export default memo(BallControls);
