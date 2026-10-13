"use client";

import { Fragment, useState } from "react";
import { PROFILE } from "@/content/profile";
import { AUTOMATIONS, PRODUCTS } from "@/content/projects";
import type { Project } from "@/content/types";
import { ContactLinks } from "./ContactLinks";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function ProfilePhoto() {
  const photos = [
    { src: "/headshot.png", alt: "Michael Hoefert headshot" },
    { src: "/biking.jpg", alt: "Michael Hoefert biking" },
  ];
  const [idx, setIdx] = useState(0);
  const step = (d: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((p) => (p + d + photos.length) % photos.length);
  };
  const arrow =
    "absolute bottom-2.5 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/25 text-white/90 shadow-sm transition-all duration-300 hover:bg-black/45 opacity-100 md:opacity-0 md:group-hover/photo:opacity-100";

  return (
    <div
      className="group/photo relative h-[190px] w-[155px] shrink-0 select-none overflow-hidden rounded-[22px] border bg-[var(--gray-2)]"
      style={{ borderColor: "var(--gray-4)", boxShadow: "var(--card-shadow)" }}
    >
      {photos.map((p, i) => (
        <img
          key={p.src}
          src={p.src}
          alt={p.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-in-out ${i === idx ? "scale-100 opacity-100" : "pointer-events-none scale-105 opacity-0"}`}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/25 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover/photo:opacity-100" />
      <button onClick={step(-1)} aria-label="Previous photo" className={`${arrow} left-2.5`}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button onClick={step(1)} aria-label="Next photo" className={`${arrow} right-2.5`}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <div className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 select-none gap-1 rounded-full bg-black/30 px-1.5 py-0.5 opacity-100 backdrop-blur-xs transition-opacity duration-300 md:opacity-0 md:group-hover/photo:opacity-100">
        {photos.map((_, i) => (
          <span key={i} className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-3 bg-[var(--accent)]" : "w-1 bg-white/70"}`} />
        ))}
      </div>
    </div>
  );
}

type Row = { id: string; marker: string; title: string; sub: string };

function TocRow({ row, active, onHover }: { row: Row; active: boolean; onHover: (id: string | null) => void }) {
  return (
    <li className="border-t" style={{ borderColor: "var(--gray-4)" }}>
      <button
        type="button"
        onMouseEnter={() => onHover(row.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(row.id)}
        onBlur={() => onHover(null)}
        onClick={() => scrollTo(row.id)}
        className="w-full cursor-pointer py-3.5 text-left focus-visible:outline-none"
      >
        <div className="flex items-baseline gap-4 transition-transform duration-300" style={{ transform: active ? "translateX(8px)" : "translateX(0)" }}>
          <span className="w-[2ch] shrink-0 font-[var(--font-mono)] text-[12px]" style={{ color: active ? "var(--accent-strong)" : "var(--gray-9)" }}>
            {row.marker}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-[var(--font-serif)] text-[1.3rem] leading-tight text-[var(--gray-12)]">{row.title}</p>
            <p
              className="mt-0.5 truncate font-[var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--gray-10)] transition-all duration-300"
              style={{ maxHeight: active ? 20 : 0, opacity: active ? 1 : 0 }}
            >
              {row.sub}
            </p>
          </div>
          <span
            className="mt-1 h-2 w-2 shrink-0 rounded-full transition-all duration-300"
            style={{ background: active ? "var(--accent)" : "var(--gray-5)", transform: active ? "scale(1.15)" : "scale(1)" }}
          />
        </div>
      </button>
    </li>
  );
}

const projectRow = (p: Project): Row => ({ id: p.slug, marker: p.index, title: p.shortTitle, sub: p.subtitle });

const TOC: { label?: string; rows: Row[] }[] = [
  { rows: [{ id: "highlights", marker: "*", title: "Highlights", sub: "What each thing is, at a glance" }] },
  { label: "Products", rows: PRODUCTS.map(projectRow) },
  { label: "Automations & AI workflows", rows: AUTOMATIONS.map(projectRow) },
  {
    rows: [
      { id: "experience", marker: "*", title: "Career Work Experience", sub: "Mitie · JLL Technologies" },
      { id: "challenges", marker: "*", title: "Challenges", sub: "The Hague · Dragon · Mallorca" },
    ],
  },
];

function TableOfContents() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <aside
      className="w-full min-w-0 rounded-[var(--card-radius)] border bg-white p-7 sm:p-9"
      style={{ borderColor: "var(--gray-4)", boxShadow: "var(--float-shadow)" }}
    >
      <nav aria-label="Page sections">
        {TOC.map((group, gi) => (
          <Fragment key={gi}>
            {group.label && (
              <div className="mt-6 mb-2 flex items-baseline justify-between">
                <h2 className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--gray-11)]">{group.label}</h2>
                <span className="font-[var(--font-mono)] text-[11px] text-[var(--gray-9)]">({String(group.rows.length).padStart(2, "0")})</span>
              </div>
            )}
            <ul className={gi === 0 ? "[&>li:first-child]:border-t-0" : group.label ? "" : "mt-6"}>
              {group.rows.map((row) => (
                <TocRow key={row.id} row={row} active={hover === row.id} onHover={setHover} />
              ))}
            </ul>
          </Fragment>
        ))}
      </nav>
    </aside>
  );
}

export function Hero() {
  return (
    <header className="mx-auto flex min-h-screen w-full max-w-[1240px] items-center px-6 py-20 md:px-10">
      <div className="grid w-full min-w-0 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex w-full min-w-0 flex-col">
          <div className="inline-flex items-center gap-2 self-start rounded-full border bg-white px-3 py-1.5 shadow-sm" style={{ borderColor: "var(--gray-4)" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            <span className="whitespace-nowrap font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--gray-11)]">{PROFILE.availability}</span>
          </div>

          <div className="mt-8 flex flex-row items-center gap-4 sm:items-stretch sm:gap-6 md:gap-8">
            <ProfilePhoto />
            <div className="flex min-w-0 flex-col">
              <p className="w-full whitespace-normal break-words font-[var(--font-mono)] text-[8px] uppercase leading-relaxed tracking-[0.05em] text-[var(--gray-10)] sm:text-[11px] sm:tracking-[0.2em]">
                {PROFILE.eyebrow[0]} · {PROFILE.eyebrow[1]} ·<br className="sm:hidden" /> {PROFILE.eyebrow[2]}
              </p>
              <h1 className="mt-1.5 font-[var(--font-serif)] text-[2.4rem] font-medium leading-[0.95] tracking-[-0.02em] text-[var(--gray-12)] [text-wrap:balance] min-[380px]:text-[2.8rem] sm:text-[4.2rem] sm:leading-[0.98] lg:text-[4.4rem]">
                {PROFILE.name}
              </h1>
            </div>
          </div>

          <div className="mt-8 flex max-w-md flex-col gap-4 text-[16px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">
            {PROFILE.bio.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>

          <div className="mt-7">
            <ContactLinks />
          </div>

          <div className="mt-10 flex select-none items-center gap-3 font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.05em] text-[var(--gray-10)] sm:text-[11px] sm:tracking-[0.16em]">
            <span className="whitespace-nowrap">Scroll for selected work</span>
            <span className="h-px flex-1 bg-[var(--gray-5)] sm:w-36 sm:flex-none" />
            <span className="shrink-0 translate-y-[-1px] text-[13px] font-bold text-[var(--accent)]">↓</span>
          </div>
        </div>

        <TableOfContents />
      </div>
    </header>
  );
}
