export default function BallControls({ onScore, onWicket, onWide, onNoBall,onUndo,  onSwapStrike }) {
  const buttonClass = `
    h-20
    rounded-2xl
    text-2xl
    font-black
    text-white
  `;

  return (
    <div className="grid grid-cols-4 gap-4">
      <button
        onClick={() => onScore(0)}
        className={`${buttonClass} bg-slate-700`}
      >
        DOT
      </button>

      <button
        onClick={() => onScore(1)}
        className={`${buttonClass} bg-blue-500`}
      >
        1
      </button>

      <button
        onClick={() => onScore(2)}
        className={`${buttonClass} bg-cyan-500`}
      >
        2
      </button>

      <button
        onClick={() => onScore(3)}
        className={`${buttonClass} bg-indigo-500`}
      >
        3
      </button>

      <button
        onClick={() => onScore(4)}
        className={`${buttonClass} bg-green-500`}
      >
        FOUR
      </button>

      <button
        onClick={() => onScore(6)}
        className={`${buttonClass} bg-purple-500`}
      >
        SIX
      </button>

      <button onClick={onWicket} className={`${buttonClass} bg-red-500`}>
        WICKET
      </button>

      <button
        onClick={() => onWide()}
        className={`${buttonClass} bg-yellow-500`}
      >
        WIDE
      </button>

      <button
        onClick={() => onNoBall()}
        className={`${buttonClass} bg-orange-500`}
      >
        NO BALL
      </button>
      <button onClick={onUndo} className={`${buttonClass} bg-red-700`}>
        UNDO
      </button>
      <button
  onClick={onSwapStrike}
  className={`${buttonClass} bg-pink-500`}
>
  SWAP
</button>
    </div>
  );
}
