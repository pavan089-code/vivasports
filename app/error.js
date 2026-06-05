"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, unstable_retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="vs-page px-4 py-10">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-2xl border border-red-400/20 bg-[#101D35] p-6 text-center shadow-2xl sm:p-10">
          <p className="vs-eyebrow">Viva Sports</p>
          <h1 className="mt-3 text-2xl font-black text-white sm:text-4xl">
            Something went wrong
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            The page could not finish loading. Try again, or return to the
            homepage while the issue is checked.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="min-h-11 rounded-lg bg-[var(--vs-gold)] px-5 py-3 text-sm font-black uppercase text-[#050B18]"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-black uppercase text-white"
            >
              Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
