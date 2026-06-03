"use client";

import { useState } from "react";

import  Link from "next/link";
import { Menu, X } from "lucide-react"; 
import Container from "./Container";
import Button from "../ui/Button";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#050B18]/80 backdrop-blur-xl border-b border-white/10">

      <Container>

        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          <div>
            <h1 className="text-3xl font-black text-white">
              VIVA
            </h1>

            <p className="text-xs text-cyan-400 tracking-widest">
              CRICKET TOURNAMENT
            </p>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">

            <Link href="/">Home</Link>
            <Link href="/live">Live</Link>
            <Link href="/matches">Matches</Link>
            <Link href="/teams">Teams</Link>
            <Link href="/pointstable">Points Table</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/fixtures">Fixtures</Link>

          </nav>

          {/* Desktop Button */}
          <div className="hidden md:block">
            <Button>
              LIVE NOW
            </Button>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            {open ? <X size={30} /> : <Menu size={30} />}
          </button>

        </div>

      </Container>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#050B18]">

          <div className="flex flex-col p-6 gap-6 text-white">

            <Link href="/">Home</Link>
            <Link href="/live">Live</Link>
            <Link href="/matches">Matches</Link>
            <Link href="/teams">Teams</Link>
            <Link href="/pointstable">Points Table</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/fixtures">Fixtures</Link>

            <Button>
              LIVE NOW
            </Button>

          </div>

        </div>
      )}
    </header>
  );
}