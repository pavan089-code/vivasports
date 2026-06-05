export default function LoadingSkeleton({ title = "Loading" }) {
  return (
    <main className="vs-page px-4 py-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <p className="vs-eyebrow">
          {title}
        </p>
        <div className="h-12 w-3/4 max-w-xl animate-pulse rounded-xl bg-white/10" />
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl border border-white/10 bg-[var(--vs-slate)]"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl border border-white/10 bg-[var(--vs-slate)]" />
      </section>
    </main>
  );
}
