export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
}) {
  const variants = {
    primary:
      "bg-[var(--vs-gold)] text-[#050B18] hover:bg-[var(--vs-gold-soft)] shadow-lg shadow-black/20",

    secondary:
      "bg-[var(--vs-slate-soft)] border border-white/10 hover:border-[var(--vs-gold)] text-white",

    outline:
      "border border-[var(--vs-gold)]/40 bg-transparent text-[var(--vs-gold-soft)] hover:bg-[var(--vs-gold)]/10",

    danger:
      "bg-red-500/15 border border-red-300/25 text-red-100 hover:bg-red-500/25",

    gold:
      "bg-[var(--vs-gold)] hover:bg-[var(--vs-gold-soft)] text-[#050B18]",
  };

  return (
    <button
      type={type}
      className={`
        px-6 py-3
        rounded-lg
        font-black
        uppercase
        text-sm
        transition-all duration-200
        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
