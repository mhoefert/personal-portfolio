"use client";

import { useState } from "react";
import { HIGHLIGHTS } from "@/content/highlights";
import { PROFILE } from "@/content/profile";
import type { Highlight } from "@/content/types";
import { CardArt } from "./art/CardArt";
import { ArrowRight, ArrowUpRight } from "./icons";
import { SectionHeader } from "./SectionHeader";

const label = "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--gray-9)]";
const pill =
  "inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-[13.5px] text-[var(--gray-12)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] cursor-pointer";

function HighlightCard({ h }: { h: Highlight }) {
  const [active, setActive] = useState(false);
  const isOpenSlot = !h.target;

  return (
    <article
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="flex flex-col rounded-[var(--card-radius)] border bg-white p-3.5 sm:p-4"
      style={{ borderColor: "var(--gray-4)", boxShadow: "var(--float-shadow)" }}
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

      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-5 sm:px-2">
        <p className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--gray-10)]">{h.category}</p>
        <h3 className="mt-2 font-[var(--font-serif)] text-[1.55rem] leading-[1.1] text-[var(--gray-12)] [text-wrap:balance]">{h.title}</h3>
        {h.tagline && <p className="mt-1 font-[var(--font-serif)] text-[1.02rem] italic leading-snug text-[var(--gray-10)]">{h.tagline}</p>}

        <dl className="mt-4 flex flex-col gap-3">
          <div>
            <dt className={label}>What</dt>
            <dd className="mt-1 text-[14px] leading-snug text-[var(--gray-11)] [text-wrap:pretty]">{h.what}</dd>
          </div>
          <div>
            <dt className={label}>Problem</dt>
            <dd className="mt-1 text-[14px] leading-snug text-[var(--gray-11)] [text-wrap:pretty]">{h.problem}</dd>
          </div>
        </dl>

        {h.stat && (
          <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--gray-4)" }}>
            <p className="font-[var(--font-serif)] text-[1.2rem] leading-snug text-[var(--accent-strong)] [text-wrap:balance]">{h.stat}</p>
            {h.statSub && <p className="mt-1 text-[13px] leading-snug text-[var(--gray-10)]">{h.statSub}</p>}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="inline-flex min-w-0 items-center gap-2 text-[13px] text-[var(--gray-10)]">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isOpenSlot ? "pulse-dot" : ""}`} style={{ background: isOpenSlot ? "var(--accent)" : "#2f9e5b" }} />
            <span className="truncate">{h.status}</span>
          </span>
          {isOpenSlot ? (
            <a href={`mailto:${PROFILE.email}`} className={pill} style={{ borderColor: "var(--gray-4)", boxShadow: "var(--card-shadow)" }}>
              Email me <ArrowRight />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => document.getElementById(h.target!)?.scrollIntoView({ behavior: "smooth" })}
              className={pill}
              style={{ borderColor: "var(--gray-4)", boxShadow: "var(--card-shadow)" }}
            >
              Full story <ArrowRight />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function Highlights() {
  return (
    <section id="highlights" className="scroll-mt-28">
      <SectionHeader eyebrow="Highlights" title="What I'm working on" subtitle="What each thing is, and the problem it solves" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {HIGHLIGHTS.map((h) => (
          <HighlightCard key={h.badge} h={h} />
        ))}
      </div>
    </section>
  );
}
