import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";

export default function PublicPage({ children, className = "" }) {
  return (
    <main className={`vs-page ${className}`}>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}

export function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="vs-eyebrow">{eyebrow}</p>}
      <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="vs-muted mt-3 max-w-3xl leading-7">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </header>
  );
}

export function StatTile({ label, value, tone = "default" }) {
  const toneClass =
    tone === "success"
      ? "text-[var(--vs-success)]"
      : tone === "danger"
        ? "text-[var(--vs-danger)]"
        : tone === "accent"
          ? "text-[var(--vs-gold-soft)]"
          : "text-white";

  return (
    <div className="vs-card-muted p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-black ${toneClass}`}>{value}</p>
    </div>
  );
}
