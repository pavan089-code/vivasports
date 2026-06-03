export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-[#0A1428]
        border border-white/10
        rounded-2xl
        p-4
        shadow-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}