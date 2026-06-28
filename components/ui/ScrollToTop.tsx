"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY >= 400);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <button aria-label="Scroll to top" className={`fixed right-4 bottom-5 z-40 grid size-12 place-items-center rounded-full border border-[#f4c95d]/45 bg-[#d4af37] text-[#07152e] shadow-[0_12px_35px_rgba(0,0,0,.4)] transition duration-300 hover:-translate-y-1 hover:bg-[#e5c158] sm:right-6 sm:bottom-6 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} type="button"><ArrowUp className="size-5" /></button>;
}
