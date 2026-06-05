import Link from "next/link";

export default function EmptyState({
  title,
  message,
  actionHref = "",
  actionLabel = "",
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101D35] p-8 text-center">
      <p className="text-xl font-black text-white">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-slate-400">{message}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex rounded-lg bg-[var(--vs-gold)] px-4 py-2 text-sm font-black uppercase text-[#050B18]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
