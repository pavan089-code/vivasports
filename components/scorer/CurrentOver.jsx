export default function CurrentOver({ balls }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {balls.map((ball, index) => (
        <div
          key={index}
          className="
            min-w-14
            h-14
            px-2
            rounded-full
            bg-[#101D35]
            border
            border-white/10
            flex
            items-center
            justify-center
            font-black
            text-[clamp(0.78rem,2.6vw,1.25rem)]
            leading-none
            text-white
            whitespace-nowrap
          "
        >
          <span className="block max-w-full whitespace-nowrap">{String(ball)}</span>
        </div>
      ))}
    </div>
  );
}
