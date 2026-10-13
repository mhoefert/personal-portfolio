"use client";

import { useState } from "react";
import type { Project } from "@/content/types";
import { Carousel } from "./Carousel";
import { ExternalLink } from "./icons";

const toggle =
  "font-[var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors inline-flex items-center gap-1.5 focus:outline-none cursor-pointer";
const columnHeading = "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold";
const itemTitle = "font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug";
const itemSub = "font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none";

function ProjectDescription({ p }: { p: Project }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [first, ...rest] = p.summary.split("\n\n");

  return (
    <div className="flex flex-col">
      <div className="flex w-full min-w-0 items-center gap-3">
        <span className="shrink-0 font-[var(--font-mono)] text-[13px] text-[var(--accent-strong)]">{p.index}</span>
        <span className="h-px w-6 shrink-0" style={{ background: "var(--gray-6)" }} />
        <span className="min-w-0 flex-1 break-words font-[var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--gray-10)] sm:text-[11px] sm:tracking-[0.16em]">
          {p.tag}
        </span>
      </div>
      <h3 className="mt-5 font-[var(--font-serif)] text-4xl leading-[1.04] tracking-[-0.01em] text-[var(--gray-12)] md:text-[2.7rem]">{p.title}</h3>
      {p.link && (
        <div className="mt-1">
          <a
            href={p.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-[var(--font-mono)] text-[12px] lowercase text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
          >
            {p.link.label}
            <ExternalLink />
          </a>
        </div>
      )}
      <p className="mt-2 font-[var(--font-serif)] text-xl italic text-[var(--gray-10)]">{p.subtitle}</p>

      <div className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">
        {first.split("\n").map((line, idx) => (
          <p key={idx} className={idx > 0 ? "mt-3" : ""}>
            {line}
          </p>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-4 flex w-full max-w-md flex-col items-start">
          <button onClick={() => setIsExpanded(!isExpanded)} className={toggle} aria-expanded={isExpanded}>
            <span>{isExpanded ? "Collapse details" : "Expand for more details..."}</span>
            <svg
              className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div
            className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "mt-3 max-h-[260px] opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}
          >
            <div
              className="custom-scrollbar flex max-h-[230px] flex-col gap-4 overflow-y-auto border-l-2 pl-3 pr-2 text-[14px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]"
              style={{ borderColor: "var(--accent-soft)" }}
            >
              {rest.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className="mt-8 grid grid-cols-1 gap-y-6 border-t pt-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 md:gap-x-10"
        style={{ borderColor: "var(--gray-4)" }}
      >
        {p.specs.map((col) => (
          <div key={col.heading} className="flex flex-col">
            <h4 className={columnHeading}>{col.heading}</h4>
            {col.text && (
              <p className="mt-3.5 font-[var(--font-sans)] text-[13.5px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">{col.text}</p>
            )}
            {col.items?.map((item) => (
              <div key={item.title} className="mt-4 flex flex-col gap-0.5">
                <span className={itemTitle}>{item.title}</span>
                <span className={itemSub}>{item.sub}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {p.metrics && (
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t pt-6" style={{ borderColor: "var(--gray-4)" }}>
          {p.metrics.map((m) => (
            <div key={m.l} className="flex flex-col gap-1">
              <span className="font-[var(--font-serif)] text-2xl text-[var(--gray-12)]">{m.v}</span>
              <span className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.12em] text-[var(--gray-10)]">{m.l}</span>
            </div>
          ))}
        </div>
      )}

      {p.stats && (
        <div className="mt-8 border-t pt-6" style={{ borderColor: "var(--gray-4)" }}>
          <button onClick={() => setIsStatsExpanded(!isStatsExpanded)} className={toggle} aria-expanded={isStatsExpanded}>
            {isStatsExpanded ? "Collapse performance stats ^" : "Expand performance stats... v"}
          </button>
          <div
            className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${isStatsExpanded ? "mt-6 max-h-[450px] opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}
          >
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 md:gap-x-8 lg:grid-cols-4">
              {p.stats.map((s) => (
                <div key={s.heading} className="flex flex-col">
                  <h4 className={columnHeading}>{s.heading}</h4>
                  <div className="mt-4 flex flex-col gap-1">
                    <span className={itemTitle}>{s.value}</span>
                    <span className={`${itemSub} leading-snug`}>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectTile({ p, reversed }: { p: Project; reversed: boolean }) {
  return (
    <section id={p.slug} className="scroll-mt-28">
      <article
        className="rounded-[var(--card-radius)] border bg-white p-6 sm:p-8 lg:p-12"
        style={{ borderColor: "var(--gray-4)", boxShadow: "var(--float-shadow)" }}
      >
        <div className="grid w-full min-w-0 items-center gap-9 lg:grid-cols-2 lg:gap-16">
          <div className={`${reversed ? "lg:order-2" : "lg:order-1"} w-full min-w-0`}>
            <Carousel slides={p.slides} />
          </div>
          <div className={`${reversed ? "lg:order-1" : "lg:order-2"} w-full min-w-0`}>
            <ProjectDescription p={p} />
          </div>
        </div>
      </article>
    </section>
  );
}
