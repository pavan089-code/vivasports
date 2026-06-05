export default function CurrentOver({ balls }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {balls.map((ball, index) => (
        <div
          key={index}
          className="
            w-14
            h-14
            rounded-full
            bg-[#101D35]
            flex
            items-center
            justify-center
            font-black
            text-xl
            text-white
          "
        >
          <span>{String(ball)}</span>
        </div>
      ))}
    </div>
  );
}
