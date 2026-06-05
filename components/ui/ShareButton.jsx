"use client";

import { useEffect, useRef, useState } from "react";

export default function ShareButton({ title = "Viva Sports", text = "", path = "" }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  async function handleShare() {
    const url = path
      ? `${window.location.origin}${path}`
      : window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);

      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }

      resetTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this Viva Sports page"
      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--vs-gold)]/40 px-4 py-2 text-sm font-black uppercase text-[var(--vs-gold-soft)] transition hover:bg-[var(--vs-gold)]/10"
    >
      {copied ? "Link Copied" : "Share"}
    </button>
  );
}
