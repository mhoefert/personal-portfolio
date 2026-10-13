"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Slide } from "@/content/types";
import { Chevron, CloseIcon, ExpandIcon } from "./icons";

const roundButton =
  "grid h-9 w-9 place-items-center rounded-full border bg-white text-[var(--gray-11)] transition-colors hover:text-[var(--accent-strong)] cursor-pointer";

/**
 * Image carousel with a fullscreen view.
 * Without `aspect`, the frame takes the active image's natural height (project tiles).
 * With `aspect`, the frame is fixed and images are letterboxed (mixed portrait/landscape photos).
 */
export function Carousel({ slides, aspect }: { slides: Slide[]; aspect?: string }) {
  const [i, setI] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const n = slides.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);
  const active = slides[i];

  useEffect(() => {
    document.body.style.overflow = isExpanded ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-[calc(var(--card-radius)-8px)] border"
        style={{ borderColor: "var(--gray-4)", aspectRatio: aspect, background: aspect ? "var(--gray-2)" : undefined }}
      >
        {slides.map((s, idx) => {
          const isActive = idx === i;
          const positioned = aspect || !isActive ? "absolute inset-0 h-full w-full" : "relative w-full h-auto";
          return (
            <div
              key={idx}
              className={`${positioned} transition-opacity duration-500 ${isActive ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <img
                src={s.image}
                alt={s.caption}
                loading="lazy"
                decoding="async"
                className={aspect ? "h-full w-full object-contain" : "block h-auto w-full bg-white"}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-[var(--font-mono)] text-[11px] tracking-[0.12em] text-[var(--gray-10)]">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <div className="hidden sm:flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                aria-label={`View frame ${idx + 1}`}
                onClick={() => setI(idx)}
                className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                style={{ width: idx === i ? 20 : 6, background: idx === i ? "var(--accent)" : "var(--gray-6)" }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Expand image" onClick={() => setIsExpanded(true)} className={roundButton} style={{ borderColor: "var(--gray-4)" }}>
            <ExpandIcon />
          </button>
          {(["left", "right"] as const).map((dir) => (
            <button
              key={dir}
              aria-label={dir === "left" ? "Previous" : "Next"}
              onClick={() => go(dir === "left" ? -1 : 1)}
              className={roundButton}
              style={{ borderColor: "var(--gray-4)" }}
            >
              <Chevron dir={dir} />
            </button>
          ))}
        </div>
      </div>

      {isExpanded &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
            onClick={() => setIsExpanded(false)}
          >
            <button
              onClick={() => setIsExpanded(false)}
              aria-label="Close view"
              className="absolute right-6 top-6 z-50 cursor-pointer rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <CloseIcon />
            </button>
            <div
              className="relative max-h-[92vh] max-w-[96vw] overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={active.image} alt={active.caption} className="max-h-[92vh] max-w-[96vw] rounded-2xl object-contain" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-4 py-2 backdrop-blur-md">
                <span className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-white/90">{active.caption}</span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
