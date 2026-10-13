"use client";

import { useEffect, useState } from "react";
import { PROFILE } from "@/content/profile";
import { ContactLinks } from "./ContactLinks";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1240px] px-6 pb-16 pt-4 md:px-10">
      <div className="flex flex-col items-center gap-3 border-t pt-10 text-center" style={{ borderColor: "var(--gray-4)" }}>
        <p className="font-[var(--font-serif)] text-xl text-[var(--gray-12)]">{PROFILE.name}</p>
        <div className="mt-3">
          <ContactLinks />
        </div>
        <p className="mt-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--gray-9)]">my portfolio</p>
      </div>
    </footer>
  );
}

export function ScrollTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`group fixed right-6 top-6 z-40 grid h-10 w-10 cursor-pointer place-items-center rounded-full border bg-white/90 text-[var(--gray-11)] shadow-sm transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] ${show ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-4 scale-90 opacity-0"}`}
      style={{ borderColor: "var(--gray-4)", boxShadow: "var(--card-shadow)" }}
      aria-label="Scroll to top"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-0.5">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
}
