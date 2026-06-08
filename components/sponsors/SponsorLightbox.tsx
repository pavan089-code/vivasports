"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { Sponsor } from "@/Lib/sponsors";

interface SponsorLightboxProps {
  sponsor: Sponsor | null;
  onClose: () => void;
}

export default function SponsorLightbox({
  sponsor,
  onClose,
}: SponsorLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 160);
  }, [onClose]);

  useEffect(() => {
    if (!sponsor) return undefined;

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        requestClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [requestClose, sponsor]);

  if (!sponsor || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm ${
        closing
          ? "animate-[sponsor-backdrop-out_160ms_ease-in_forwards]"
          : "animate-[sponsor-backdrop-in_180ms_ease-out_forwards]"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`${sponsor.name} sponsor image`}
      onMouseDown={requestClose}
    >
      <div
        className={`relative w-full max-w-6xl rounded-2xl border border-white/10 bg-[#050914]/95 p-3 shadow-2xl shadow-black/60 sm:p-5 ${
          closing
            ? "animate-[sponsor-panel-out_160ms_ease-in_forwards]"
            : "animate-[sponsor-panel-in_180ms_ease-out_forwards]"
        }`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={requestClose}
          className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition hover:border-yellow-400/70 hover:text-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          aria-label="Close sponsor viewer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex max-h-[82vh] min-h-60 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:p-5">
          <Image
            src={sponsor.image}
            alt={`${sponsor.name} sponsor image`}
            width={1800}
            height={1200}
            sizes="100vw"
            className="h-auto max-h-[78vh] w-full object-contain"
            priority
          />
        </div>

        <div className="mt-4 pr-14">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
            {sponsor.category}
          </p>
          <h2 className="mt-2 text-lg font-black uppercase tracking-wide text-white sm:text-2xl">
            {sponsor.name}
          </h2>
        </div>
      </div>
    </div>,
    document.body
  );
}
