export default function Button({
  children,
  className = "",
  variant = "primary",
}) {
  const variants = {
    primary:
      "bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20",

    secondary:
      "bg-[#101D35] border border-white/10 hover:border-cyan-400 text-white",

    gold:
      "bg-[#D4A017] hover:bg-[#e0ae1d] text-black",
  };

  return (
    <button
      className={`
        px-6 py-3
        rounded-xl
        font-semibold
        transition-all duration-300
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}