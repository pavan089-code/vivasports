export default function NewBatterModal({
  open,
  title = "Select New Batter",
  players,
  currentStriker,
  currentNonStriker,
  outPlayers,
  onSelect,
}) {

  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/70
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-xl
          bg-[#101D35]
          rounded-3xl
          p-6
          sm:p-8
          max-h-[88vh]
          overflow-y-auto
        "
      >

        <h2 className="text-3xl font-black text-white mb-8">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {(players || []).map((player) => {

  const isDisabled =
    player === currentStriker ||
    player === currentNonStriker ||
    outPlayers.includes(player);

  return (

    <button
      key={player}

      disabled={isDisabled}

      onClick={() => onSelect(player)}

      className={`
        h-16
        rounded-2xl
        font-bold
        transition

        ${
          isDisabled
            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
            : "bg-[#1B2A49] text-white hover:bg-[#D4AF37] hover:text-[#06152F]"
        }
      `}
    >
      {player}
    </button>

  );
})}
        </div>

      </div>

    </div>
  );
}

