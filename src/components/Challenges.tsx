"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CHALLENGES } from "@/content/challenges";
import type { Challenge } from "@/content/types";
import { Carousel } from "./Carousel";
import { ArrowRight, CloseIcon } from "./icons";
import { SectionHeader } from "./SectionHeader";

function Stats({ c }: { c: Challenge }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {c.stats.map((s) => (
        <div key={s.l} className="flex flex-col">
          <span className="font-[var(--font-serif)] text-[1.3rem] leading-none tabular-nums text-[var(--accent-strong)]">{s.v}</span>
          <span className="mt-1.5 font-[var(--font-mono)] text-[9.5px] uppercase leading-snug tracking-[0.1em] text-[var(--gray-10)]">{s.l}</span>
        </div>
      ))}
    </div>
  );
}

function StoryModal({ c, onClose }: { c: Challenge; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(33,32,28,0.55)] p-4 backdrop-blur-sm sm:items-center sm:p-8" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${c.slug}-title`}
        className="relative my-auto w-full max-w-3xl rounded-[var(--card-radius)] border bg-white p-5 sm:p-8"
        style={{ borderColor: "var(--gray-4)", boxShadow: "var(--float-shadow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close story"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full border bg-white text-[var(--gray-11)] transition-colors hover:text-[var(--accent-strong)]"
          style={{ borderColor: "var(--gray-4)" }}
        >
          <CloseIcon size={16} />
        </button>
        <p className="pr-12 font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--gray-10)]">
          {c.date} · {c.where}
        </p>
        <h3 id={`${c.slug}-title`} className="mt-2 font-[var(--font-serif)] text-[2.2rem] leading-[1.05] text-[var(--gray-12)]">
          {c.title}
        </h3>
        <div className="mt-5">
          <Stats c={c} />
        </div>
        <div className="mt-6">
          <Carousel slides={c.photos} aspect="4 / 3" />
        </div>
        <div className="mt-6 flex flex-col gap-4 text-[15px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">
          {c.story.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Challenges() {
  const [open, setOpen] = useState<Challenge | null>(null);

  return (
    <section id="challenges" className="scroll-mt-28">
      <SectionHeader eyebrow="Challenges" title="Hard things on a bike" subtitle="The dumb challenges I mentioned up top" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {CHALLENGES.map((c) => (
          <article
            key={c.slug}
            className="flex flex-col rounded-[var(--card-radius)] border bg-white p-3.5 sm:p-4"
            style={{ borderColor: "var(--gray-4)", boxShadow: "var(--float-shadow)" }}
          >
            <button
              type="button"
              onClick={() => setOpen(c)}
              className="group relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[calc(var(--card-radius)-12px)] bg-[var(--gray-3)]"
              aria-label={`Read the story: ${c.title}`}
            >
              <img
                src={c.cover}
                alt={c.coverAlt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute left-3 top-3 rounded-lg border border-white/50 bg-white/80 px-2 py-0.5 font-[var(--font-mono)] text-[11px] font-semibold tracking-[0.06em] text-[var(--accent-strong)] backdrop-blur-sm">
                {c.date}
              </span>
            </button>
            <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-5 sm:px-2">
              <p className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--gray-10)]">{c.where}</p>
              <h3 className="mt-2 font-[var(--font-serif)] text-[1.55rem] leading-[1.1] text-[var(--gray-12)] [text-wrap:balance]">{c.title}</h3>
              <div className="mt-4">
                <Stats c={c} />
              </div>
              <p className="mt-4 text-[14px] leading-snug text-[var(--gray-11)] [text-wrap:pretty]">{c.line}</p>
              <div className="mt-auto flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => setOpen(c)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-[13.5px] text-[var(--gray-12)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                  style={{ borderColor: "var(--gray-4)", boxShadow: "var(--card-shadow)" }}
                >
                  Read the story <ArrowRight />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {open && <StoryModal c={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
