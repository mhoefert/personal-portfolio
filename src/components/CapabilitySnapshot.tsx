"use client";

import { useState } from "react";
import { SKILL_COLUMNS, SKILL_FILTERS, type SkillFilter } from "@/content/capabilities";
import { SectionHeader } from "./SectionHeader";

const PILL_BUILD: React.CSSProperties = {
  background: "#ffefd6",
  color: "var(--gray-12)",
  border: "1px solid color-mix(in oklab, #ffefd6, var(--gray-8) 28%)",
};
const PILL_PM: React.CSSProperties = {
  background: "#fdbf74",
  color: "var(--gray-12)",
  border: "1px solid color-mix(in oklab, #fdbf74, var(--gray-8) 22%)",
};
const PILL_ALL: React.CSSProperties = {
  background: "var(--gray-2)",
  color: "var(--gray-12)",
  border: "1px solid var(--gray-4)",
};

export function CapabilitySnapshot() {
  const [filter, setFilter] = useState<SkillFilter>("all");
  const [filterHover, setFilterHover] = useState<SkillFilter | null>(null);

  return (
    <section id="capabilities" className="scroll-mt-28">
      <SectionHeader eyebrow="Capability snapshot" title="Skills & tools" subtitle="Industries, expertise and the stack behind the work" />
      <article
        data-reveal
        className="rounded-[var(--card-radius)] border bg-white p-6 sm:p-8 lg:p-10"
        style={{ borderColor: "var(--gray-4)", boxShadow: "var(--float-shadow)" }}
      >
        <div className="flex flex-wrap gap-3">
          {SKILL_FILTERS.map((f) => {
            const active = filter === f.id;
            const hovered = filterHover === f.id;
            const tone = f.id === "ai" ? PILL_BUILD : f.id === "pm" ? PILL_PM : PILL_ALL;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                onMouseEnter={() => setFilterHover(f.id)}
                onMouseLeave={() => setFilterHover(null)}
                aria-pressed={active}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-center font-[var(--font-mono)] text-[11px] uppercase tracking-[0.12em] transition-[opacity,box-shadow,background-color] duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3112] focus-visible:ring-offset-2"
                style={{
                  ...tone,
                  opacity: active || hovered ? 1 : 0.78,
                  boxShadow: active ? "0 0 0 1.5px #ffefd6, var(--card-shadow)" : hovered ? "var(--card-shadow)" : "none",
                }}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full transition-[opacity,background-color,transform] duration-200"
                  style={{
                    background: active ? "var(--accent)" : "#8d8d86",
                    opacity: active || hovered ? 1 : 0,
                    transform: active ? "scale(1.15)" : "scale(1)",
                  }}
                />
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SKILL_COLUMNS.map((col) => (
            <div key={col.title} className="rounded-[calc(var(--card-radius)-10px)] p-4" style={{ background: "var(--gray-2)" }}>
              <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--gray-10)]">{col.title}</p>
              {/* The full, invisible list and the filtered list share one grid cell, so each
               * column keeps its "All" height and filtering never moves the page below. */}
              <div className="mt-3 grid">
                <div className="invisible flex flex-wrap justify-start gap-1.5 [grid-area:1/1]" aria-hidden>
                  {col.pills.map((pill) => (
                    <span key={pill.label} className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 font-[var(--font-sans)] text-[11.5px] leading-none" style={PILL_ALL}>
                      {pill.label}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap content-start justify-start gap-1.5 [grid-area:1/1]">
                  {col.pills
                    .filter((p) => filter === "all" || p.tag === filter)
                    .map((pill) => (
                      <span
                        key={pill.label}
                        className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 font-[var(--font-sans)] text-[11.5px] leading-none"
                        style={pill.tag === "ai" ? PILL_BUILD : PILL_PM}
                      >
                        {pill.label}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
