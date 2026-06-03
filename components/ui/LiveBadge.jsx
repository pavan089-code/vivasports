export default function LiveBadge() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />

      <span className="text-red-400 font-semibold text-sm tracking-wide">
        LIVE
      </span>
    </div>
  );
}