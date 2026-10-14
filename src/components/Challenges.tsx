"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CHALLENGES } from "@/content/challenges";
import type { Challenge } from "@/content/types";
import { Carousel } from "./Carousel";
import { cardPill } from "./Highlights";
import { ArrowRight, ArrowUpRight, Chevron, CloseIcon } from "./icons";
import { SectionHeader } from "./SectionHeader";

function Stats({ c }: { c: Challenge }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {c.stats.map((s) => (
        <div key={s.l} className="flex flex-col">
          <span className="whitespace-nowrap font-[var(--font-serif)] text-[1.3rem] leading-none tabular-nums text-[var(--accent-strong)]">{s.v}</span>
          <span className="mt-1.5 font-[var(--font-mono)] text-[9.5px] uppercase leading-snug tracking-[0.1em] text-[var(--gray-10)]">{s.l}</span>
        </div>
      ))}
    </div>
  );
}

function StravaMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden className="shrink-0">
      <rect width="16" height="16" rx="3.5" fill="#fc4c02" />
      <g fill="#fff" fillRule="evenodd">
        <path d="M6.9 8.8l2.5 4.5 2.4-4.5h-1.5l-.9 1.7-1-1.7z" opacity=".6" />
        <path d="M7.2 2.5l3.1 6.3H4zm0 3.8l1.2 2.5H5.9z" />
      </g>
    </svg>
  );
}

/** Strava logo plus one link per ride ("See the ride", or "Day 1" / "Day 2"). */
function RideLinks({ c }: { c: Challenge }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[13px] text-[var(--gray-11)]">
      <StravaMark />
      {c.rides.map((r, i) => (
        <span key={r.href} className="inline-flex items-center gap-2">
          {i > 0 && <span className="text-[var(--gray-7)]">·</span>}
          <a
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${c.rides.length > 1 ? `${r.label} of ${c.title}` : c.title} on Strava`}
            className="inline-flex items-center gap-1 underline decoration-[var(--gray-6)] underline-offset-[3px] transition-colors hover:text-[#fc4c02] hover:decoration-[#fc4c02]"
            onClick={(e) => e.stopPropagation()}
          >
            {r.label}
            <ArrowUpRight size={10} />
          </a>
        </span>
      ))}
    </span>
  );
}

const overlayButton =
  "absolute top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/40 bg-white/75 text-[var(--gray-12)] shadow-sm backdrop-blur-md transition-opacity duration-300 hover:bg-white opacity-100 md:opacity-0 md:group-hover/photos:opacity-100 focus-visible:opacity-100";

/**
 * Photo carousel inside a challenge card. The cover is cropped to fill; other
 * photos (portraits, route maps) are shown whole over a blurred copy of themselves.
 * Clicking the photo itself opens the full story. Swipe works on touch.
 */
function CardCarousel({ c, onOpen }: { c: Challenge; onOpen: () => void }) {
  const slides = [{ caption: c.coverAlt, image: c.cover, cover: true }, ...c.photos.slice(1).map((p) => ({ ...p, cover: false }))];
  const n = slides.length;
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0, 1]));
  const touchX = useRef<number | null>(null);

  const go = (d: number) => {
    const next = (i + d + n) % n;
    setI(next);
    setSeen((s) => new Set([...s, next, (next + 1) % n]));
  };
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div
      className="group/photos relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[calc(var(--card-radius)-12px)] bg-[var(--gray-12)]"
      onClick={onOpen}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${c.title} photos`}
    >
      {slides.map((s, idx) =>
        seen.has(idx) ? (
          <div key={s.image} className={`absolute inset-0 transition-opacity duration-500 ${idx === i ? "opacity-100" : "opacity-0"}`} aria-hidden={idx !== i}>
            {s.cover ? (
              <img src={s.image} alt={s.caption} decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/photos:scale-[1.03]" />
            ) : (
              <>
                <img src={s.image} alt="" decoding="async" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl" />
                <img src={s.image} alt={s.caption} decoding="async" className="absolute inset-0 h-full w-full object-contain" />
              </>
            )}
          </div>
        ) : null,
      )}

      <span className="absolute left-3 top-3 z-10 rounded-lg border border-white/50 bg-white/80 px-2 py-0.5 font-[var(--font-mono)] text-[11px] font-semibold tracking-[0.06em] text-[var(--accent-strong)] backdrop-blur-sm">
        {c.date}
      </span>
      <button type="button" aria-label="Previous photo" onClick={stop(() => go(-1))} className={`${overlayButton} left-3`}>
        <Chevron dir="left" size={15} />
      </button>
      <button type="button" aria-label="Next photo" onClick={stop(() => go(1))} className={`${overlayButton} right-3`}>
        <Chevron dir="right" size={15} />
      </button>
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/30 px-2 py-1 backdrop-blur-sm">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Photo ${idx + 1} of ${n}`}
            onClick={stop(() => go(idx - i))}
            className="h-1.5 cursor-pointer rounded-full transition-all duration-300"
            style={{ width: idx === i ? 16 : 6, background: idx === i ? "var(--accent)" : "rgba(255,255,255,0.75)" }}
          />
        ))}
      </div>
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

  /* Fixed header (date + title); the body scrolls inside the dialog. Ride stats sit under the photos. On wide
   * screens photos sit on the left and the story scrolls on the right. */
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(33,32,28,0.55)] p-3 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${c.slug}-title`}
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[var(--card-radius)] border bg-white"
        style={{ borderColor: "var(--gray-4)", boxShadow: "var(--float-shadow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="shrink-0 border-b px-5 pb-5 pt-5 sm:px-8 sm:pt-7" style={{ borderColor: "var(--gray-4)" }}>
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
          <h3 id={`${c.slug}-title`} className="mt-2 font-[var(--font-serif)] text-[2rem] leading-[1.05] text-[var(--gray-12)] sm:text-[2.2rem]">
            {c.title}
          </h3>
        </header>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6 lg:grid lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] lg:gap-8 lg:overflow-hidden">
          <div className="lg:min-h-0">
            <Carousel slides={c.photos} aspect="4 / 3" />
            <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--gray-4)" }}>
              <Stats c={c} />
              <div className="mt-5">
                <RideLinks c={c} />
              </div>
            </div>
          </div>
          <div className="custom-scrollbar mt-6 flex flex-col gap-4 text-[15px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty] lg:mt-0 lg:min-h-0 lg:overflow-y-auto lg:pr-4">
            {c.story.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
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
      <SectionHeader eyebrow="Challenges" title="Hard things on a bike" subtitle="The challenges I mentioned up top" />
      {/* Cards are 6-row subgrids so where, title, stats, line and footer line up across cards. */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3">
        {CHALLENGES.map((c) => (
          <article
            key={c.slug}
            className="card-lift row-span-6 grid grid-rows-subgrid gap-0 rounded-[var(--card-radius)] border bg-white p-3.5 sm:p-4"
            style={{ borderColor: "var(--gray-4)" }}
          >
            <CardCarousel c={c} onOpen={() => setOpen(c)} />
            <p className="px-1.5 pt-5 font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--gray-10)] sm:px-2">{c.where}</p>
            <h3 className="px-1.5 pt-2 font-[var(--font-serif)] text-[1.55rem] leading-[1.1] text-[var(--gray-12)] [text-wrap:balance] sm:px-2">{c.title}</h3>
            <div className="px-1.5 pt-4 sm:px-2">
              <Stats c={c} />
            </div>
            <p className="px-1.5 pt-4 text-[14px] leading-snug text-[var(--gray-11)] [text-wrap:pretty] sm:px-2">{c.line}</p>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3 self-end px-1.5 pb-1.5 pt-6 sm:px-2">
              <RideLinks c={c} />
              <button type="button" onClick={() => setOpen(c)} className={cardPill} style={{ borderColor: "var(--gray-4)", boxShadow: "var(--card-shadow)" }}>
                Read the story <ArrowRight />
              </button>
            </div>
          </article>
        ))}
      </div>
      {open && <StoryModal c={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
