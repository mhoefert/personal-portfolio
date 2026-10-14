"use client";

import { useState } from "react";
import { HIGHLIGHTS } from "@/content/highlights";
import { PROFILE } from "@/content/profile";
import type { Highlight } from "@/content/types";
import { CardArt } from "./art/CardArt";
import { ArrowRight, ArrowUpRight } from "./icons";
import { SectionHeader } from "./SectionHeader";

const label = "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--gray-9)]";
export const cardPill =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border bg-white px-4 py-2 text-[13.5px] text-[var(--gray-12)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] cursor-pointer";

/* Each card is a 7-row subgrid of the section grid, so image, category, title,
 * what, problem, stat and footer start at the same height across a row of cards
 * even when one card's text wraps to more lines. */
function HighlightCard({ h, i }: { h: Highlight; i: number }) {
  const [active, setActive] = useState(false);
  const isOpenSlot = !h.target;

  return (
    <article
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="card-lift row-span-7 grid grid-rows-subgrid gap-0 rounded-[var(--card-radius)] border bg-white p-3.5 sm:p-4"
      style={{ borderColor: "var(--gray-4)", "--reveal-delay": `${(i % 2) * 90}ms` } as React.CSSProperties}
      data-reveal
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[calc(var(--card-radius)-12px)] bg-[var(--gray-3)]">
        <CardArt art={h.art} active={active} />
        <span className="absolute left-3 top-3 rounded-lg border border-white/50 bg-white/80 px-2 py-0.5 font-[var(--font-mono)] text-[12px] font-semibold tracking-[0.06em] text-[var(--accent-strong)] backdrop-blur-sm">
          {h.badge}
        </span>
        {h.live && (
          <a
            href={h.live.href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/70 px-3.5 py-1.5 text-[13px] text-[var(--gray-12)] shadow-sm backdrop-blur-md transition-colors hover:bg-white"
          >
            {h.live.label}
            <ArrowUpRight />
          </a>
        )}
      </div>

      <p className="px-1.5 pt-5 font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--gray-10)] sm:px-2">{h.category}</p>

      <div className="px-1.5 pt-2 sm:px-2">
        <h3 className="font-[var(--font-serif)] text-[1.6rem] leading-[1.1] text-[var(--gray-12)] [text-wrap:balance]">{h.title}</h3>
        {h.tagline && <p className="mt-1 font-[var(--font-serif)] text-[1.02rem] italic leading-snug text-[var(--gray-10)]">{h.tagline}</p>}
      </div>

      <div className="px-1.5 pt-4 sm:px-2">
        <p className={label}>What</p>
        <p className="mt-1 text-[14.5px] leading-snug text-[var(--gray-11)] [text-wrap:pretty]">{h.what}</p>
      </div>

      <div className="px-1.5 pt-3 sm:px-2">
        <p className={label}>Problem</p>
        <p className="mt-1 text-[14.5px] leading-snug text-[var(--gray-11)] [text-wrap:pretty]">{h.problem}</p>
      </div>

      <div className="px-1.5 pt-3 sm:px-2">
        {h.stat && (
          <>
            <p className={label}>Outcome</p>
            <p className="mt-1 text-[14.5px] leading-snug text-[var(--gray-11)] [text-wrap:pretty]">{h.stat}</p>
            {h.statSub && <p className="text-[14.5px] leading-snug text-[var(--gray-11)] [text-wrap:pretty]">{h.statSub}</p>}
          </>
        )}
      </div>

      <div className="flex items-end justify-between gap-3 px-1.5 pb-1.5 pt-6 sm:px-2">
        <span className="inline-flex min-w-0 items-center gap-2 pb-2 text-[13px] text-[var(--gray-10)]">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${h.tone === "open" ? "pulse-dot" : ""}`}
            style={{ background: h.tone === "open" ? "var(--accent)" : h.tone === "partners" ? "#3b82f6" : "#2f9e5b" }}
          />
          <span className="truncate">{h.status}</span>
        </span>
        {isOpenSlot ? (
          <a href={`mailto:${PROFILE.email}`} className={cardPill} style={{ borderColor: "var(--gray-4)", boxShadow: "var(--card-shadow)" }}>
            Email me <ArrowRight />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => document.getElementById(h.target!)?.scrollIntoView({ behavior: "smooth" })}
            className={cardPill}
            style={{ borderColor: "var(--gray-4)", boxShadow: "var(--card-shadow)" }}
          >
            Full story <ArrowRight />
          </button>
        )}
      </div>
    </article>
  );
}

export function Highlights() {
  return (
    <section id="highlights" className="scroll-mt-28">
      <SectionHeader eyebrow="Highlights" title="What I'm working on" subtitle="What each thing is, and the problem it solves" />
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10">
        {HIGHLIGHTS.map((h, i) => (
          <HighlightCard key={h.badge} h={h} i={i} />
        ))}
      </div>
    </section>
  );
}
