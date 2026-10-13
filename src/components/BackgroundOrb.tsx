"use client";

import { useEffect, useRef } from "react";

/* The orb always has an orange core; its outer glow drifts between orange, peach
 * and soft coral. Alphas are tuned to be clearly visible on the off-white page
 * without fighting the text. */
const CORE = "radial-gradient(circle, rgba(247,107,21,0.26) 0%, rgba(247,107,21,0.13) 22%, rgba(247,107,21,0.04) 42%, transparent 60%)";
const HUES = [
  "radial-gradient(circle, rgba(247,107,21,0.10) 20%, rgba(247,107,21,0.07) 42%, transparent 70%)",
  "radial-gradient(circle, rgba(253,170,90,0.14) 20%, rgba(253,191,116,0.09) 42%, transparent 70%)",
  "radial-gradient(circle, rgba(255,122,92,0.11) 20%, rgba(255,140,110,0.07) 42%, transparent 70%)",
];
/* A soft ring that expands from the core and fades: the outward pulse. */
const RING = "radial-gradient(circle, transparent 38%, rgba(247,107,21,0.13) 50%, rgba(253,170,90,0.06) 58%, transparent 68%)";
const RINGS = 2;
const PULSE_PERIOD = 6.5; // seconds per ring
const WARM_SIZE = 1150;
const GREY_SIZE = 1000;

/**
 * Fixed page background: the dot grid plus a warm orb and a grey wash that drift
 * on their own (layered sine paths) and get an extra push from scrolling. The orb's
 * core breathes and rings pulse outwards from it. Moved with transforms and opacity
 * only, so it stays on the compositor. Holds still for reduced-motion visitors.
 */
export function BackgroundOrb() {
  const warmRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const greyRef = useRef<HTMLDivElement>(null);
  const hueRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let progress = 0;
    let raf = 0;

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress = total > 0 ? window.scrollY / total : 0;
    };

    const place = (sec: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const p = progress;
      // Two time waves + a scroll term, as % of the viewport.
      const wx = 52 + 24 * Math.sin(sec * 0.22 + 0.5) + 9 * Math.sin(sec * 0.08 + 2.1) + 12 * Math.sin(p * Math.PI * 4 + 0.5);
      const wy = 42 + 22 * Math.cos(sec * 0.19 - 0.3) + 8 * Math.sin(sec * 0.1 + 1.3) + 14 * Math.cos(p * Math.PI * 3.2 - 0.3);
      const gx = 40 + 26 * Math.sin(sec * 0.14 + 1.8) + 10 * Math.cos(sec * 0.06) + 12 * Math.sin(p * Math.PI * 2.8 + 1.8);
      const gy = 58 + 22 * Math.cos(sec * 0.12 + 0.8) + 8 * Math.sin(sec * 0.05 + 0.4) + 14 * Math.cos(p * Math.PI * 4.4 + 0.8);
      if (warmRef.current) {
        warmRef.current.style.transform = `translate3d(${(wx / 100) * w - WARM_SIZE / 2}px, ${(wy / 100) * h - WARM_SIZE / 2}px, 0)`;
      }
      if (greyRef.current) {
        greyRef.current.style.transform = `translate3d(${(gx / 100) * w - GREY_SIZE / 2}px, ${(gy / 100) * h - GREY_SIZE / 2}px, 0)`;
      }
      if (coreRef.current) {
        coreRef.current.style.transform = `scale(${1 + 0.07 * Math.sin((sec * 2 * Math.PI) / PULSE_PERIOD)})`;
      }
      // Rings: grow from the core and fade out, staggered.
      ringRefs.current.forEach((el, k) => {
        if (!el) return;
        const phase = (sec / PULSE_PERIOD + k / RINGS) % 1;
        const fadeIn = Math.min(1, phase / 0.12);
        el.style.transform = `scale(${0.32 + phase * 0.9})`;
        el.style.opacity = String(fadeIn * (1 - phase) ** 1.4);
      });
      // Cross-fade the outer hue on a ~40s cycle.
      const weights = HUES.map((_, k) => Math.max(0, Math.sin(sec * 0.16 + (k * 2 * Math.PI) / HUES.length)) ** 1.5);
      const sum = weights.reduce((a, b) => a + b, 0) || 1;
      hueRefs.current.forEach((el, k) => {
        if (el) el.style.opacity = String(weights[k] / sum);
      });
    };

    onScroll();
    if (reduce) {
      place(0);
      ringRefs.current.forEach((el) => el && (el.style.opacity = "0"));
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      place((now - start) / 1000 + 8);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.8]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0px 0px, rgba(99,99,94,.22) 1.2px, transparent 1.2px),
            radial-gradient(circle at 22px 22px, rgba(99,99,94,.22) 1.2px, transparent 1.2px),
            radial-gradient(circle at 22px 0px, rgba(247,107,21,.38) 1.2px, transparent 1.2px),
            radial-gradient(circle at 0px 22px, rgba(247,107,21,.38) 1.2px, transparent 1.2px)
          `,
          backgroundSize: "44px 44px",
        }}
      />
      {/* Warm orb: drifting outer hue, breathing orange core, rings pulsing outwards */}
      <div ref={warmRef} className="absolute left-0 top-0 will-change-transform" style={{ width: WARM_SIZE, height: WARM_SIZE }}>
        {HUES.map((bg, k) => (
          <div
            key={k}
            ref={(el) => {
              hueRefs.current[k] = el;
            }}
            className="absolute inset-0"
            style={{ background: bg, opacity: k === 0 ? 1 : 0 }}
          />
        ))}
        {Array.from({ length: RINGS }, (_, k) => (
          <div
            key={`ring-${k}`}
            ref={(el) => {
              ringRefs.current[k] = el;
            }}
            className="absolute inset-0 will-change-transform"
            style={{ background: RING, opacity: 0 }}
          />
        ))}
        <div ref={coreRef} className="absolute inset-0 will-change-transform" style={{ background: CORE }} />
      </div>
      {/* Grey wash */}
      <div
        ref={greyRef}
        className="absolute left-0 top-0 will-change-transform"
        style={{
          width: GREY_SIZE,
          height: GREY_SIZE,
          background: "radial-gradient(circle, rgba(130,130,124,0.12) 0%, rgba(130,130,124,0.03) 45%, transparent 70%)",
        }}
      />
    </div>
  );
}
