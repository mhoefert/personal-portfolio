"use client";

import { useEffect, useRef } from "react";

/* Shared plumbing and drawing helpers for the animated highlight-card art
 * (second brain network, cycling coach flow, automation engine flow, open slot). */

export type Frame = {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  /** Seconds since mount (frozen at 0 for reduced motion). */
  sec: number;
  /** Eased hover amount, 0..1. */
  glow: number;
  font: string;
};

/**
 * Sizes a canvas to its box (capped at 2x DPR), runs `render` every frame while it
 * is on screen, eases a hover `glow` toward `active`, and draws a single still
 * frame for visitors who ask for reduced motion.
 */
export function useArtCanvas(render: (f: Frame) => void, active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderRef = useRef(render);
  const activeRef = useRef(active);

  useEffect(() => {
    renderRef.current = render;
    activeRef.current = active;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(document.body).fontFamily;
    const start = performance.now();
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let glow = 0;

    const draw = (now: number) => {
      if (!w || !h) return;
      renderRef.current({ ctx, w, h, sec: reduce ? 0 : (now - start) / 1000, glow, font });
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };
    const tick = (now: number) => {
      glow += ((activeRef.current ? 1 : 0) - glow) * 0.08;
      draw(now);
      raf = visible && !reduce ? requestAnimationFrame(tick) : 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduce) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);
    document.fonts?.ready.then(() => draw(performance.now()));

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return canvasRef;
}

export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ORANGE = "247,107,21";
export const PEACH = "253,191,116";
export const CREAM = "255,239,214";

/** Dark warm backdrop with a soft orange halo and faint drifting dust, shared by all card art. */
export function paintBackdrop(f: Frame, halo: { x: number; y: number; r: number } = { x: 0.5, y: 0.5, r: 0.6 }) {
  const { ctx, w, h, sec, glow } = f;
  const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
  bg.addColorStop(0, "#2b211a");
  bg.addColorStop(1, "#14110e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  const hx = halo.x * w;
  const hy = halo.y * h;
  const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, halo.r * Math.min(w, h) * 1.2);
  g.addColorStop(0, `rgba(${ORANGE},${0.15 + glow * 0.08})`);
  g.addColorStop(1, `rgba(${ORANGE},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const rand = mulberry32(11);
  for (let i = 0; i < 70; i++) {
    const x = rand() * w;
    const y = (rand() * h + sec * (2 + rand() * 4)) % h;
    ctx.fillStyle = `rgba(${PEACH},${0.08 + rand() * 0.18})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.5 + rand() * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawLabel(f: Frame, text: string, x: number, y: number, align: CanvasTextAlign = "center") {
  const { ctx, w, glow, font } = f;
  ctx.save();
  ctx.font = `500 ${w > 320 ? 11 : 10}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(20,17,14,0.95)";
  ctx.shadowBlur = 6;
  ctx.fillStyle = `rgba(${CREAM},${0.8 + glow * 0.2})`;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/** A glowing node: soft orange halo, dark disc, thin orange ring. */
export function drawNode(f: Frame, x: number, y: number, r: number, strength = 1) {
  const { ctx, glow } = f;
  const halo = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 2.6);
  halo.addColorStop(0, `rgba(${ORANGE},${(0.28 + glow * 0.14) * strength})`);
  halo.addColorStop(1, `rgba(${ORANGE},0)`);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1d1712";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(${ORANGE},${0.55 + 0.45 * strength})`;
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

export type Pt = { x: number; y: number };

export function bezier(a: Pt, c1: Pt, c2: Pt, b: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
    y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
  };
}

/** A faint curved path from a to b with particles streaming along it. */
export function drawFlow(
  f: Frame,
  a: Pt,
  b: Pt,
  opts: { bend?: number; count?: number; speed?: number; offset?: number; color?: string; strength?: number; dashed?: boolean } = {},
) {
  const { ctx, sec, glow } = f;
  const { bend = 0, count = 5, speed = 0.28, offset = 0, color = PEACH, strength = 1, dashed = false } = opts;
  const dx = b.x - a.x;
  const c1 = { x: a.x + dx * 0.45, y: a.y + bend };
  const c2 = { x: b.x - dx * 0.45, y: b.y + bend };
  ctx.save();
  ctx.strokeStyle = `rgba(${color},${(0.14 + glow * 0.1) * strength})`;
  ctx.lineWidth = 1;
  if (dashed) ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, b.x, b.y);
  ctx.stroke();
  ctx.restore();
  const s = speed * (1 + glow * 0.6);
  for (let k = 0; k < count; k++) {
    const t = (sec * s + offset + k / count) % 1;
    const p = bezier(a, c1, c2, b, t);
    const alpha = Math.sin(t * Math.PI) * (0.55 + glow * 0.4) * strength;
    ctx.fillStyle = `rgba(${color},${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
    ctx.fill();
    const tail = bezier(a, c1, c2, b, Math.max(0, t - 0.03));
    ctx.strokeStyle = `rgba(${color},${alpha * 0.45})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tail.x, tail.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
}

/* Simple, evocative glyphs drawn in cream (not exact brand marks). Each fits a box of size s centred on (x, y). */
const GITHUB_D =
  "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z";
let githubPath: Path2D | null = null;
/** Created on first draw: Path2D only exists in the browser. */
function github() {
  githubPath ??= new Path2D(GITHUB_D);
  return githubPath;
}

export type Glyph = "github" | "spark" | "hex" | "sparkle" | "pointer" | "chevrons" | "table" | "pulse" | "ring";

export function drawGlyph(ctx: CanvasRenderingContext2D, glyph: Glyph, x: number, y: number, s: number, color = `rgba(${CREAM},0.95)`) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1.2, s * 0.11);
  const r = s / 2;
  switch (glyph) {
    case "github":
      ctx.scale(s / 16, s / 16);
      ctx.translate(-8, -8);
      ctx.fill(github());
      break;
    case "spark": // radiating starburst
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.22, Math.sin(a) * r * 0.22);
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.stroke();
      }
      break;
    case "hex": // hexagonal knot-ish ring
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const px = Math.cos(a) * r * 0.9;
        const py = Math.sin(a) * r * 0.9;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "sparkle": // four-point star
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(r * 0.12, -r * 0.12, r, 0);
      ctx.quadraticCurveTo(r * 0.12, r * 0.12, 0, r);
      ctx.quadraticCurveTo(-r * 0.12, r * 0.12, -r, 0);
      ctx.quadraticCurveTo(-r * 0.12, -r * 0.12, 0, -r);
      ctx.fill();
      break;
    case "pointer": // cursor arrow
      ctx.beginPath();
      ctx.moveTo(-r * 0.55, -r * 0.85);
      ctx.lineTo(r * 0.7, r * 0.05);
      ctx.lineTo(r * 0.05, r * 0.2);
      ctx.lineTo(-r * 0.25, r * 0.85);
      ctx.closePath();
      ctx.fill();
      break;
    case "chevrons": // stacked peaks
      for (const [dy, sc] of [
        [-r * 0.25, 1],
        [r * 0.35, 0.62],
      ] as const) {
        ctx.beginPath();
        ctx.moveTo(-r * 0.8 * sc + (sc < 1 ? r * 0.35 : 0), dy + r * 0.45 * sc);
        ctx.lineTo((sc < 1 ? r * 0.35 : 0), dy - r * 0.45 * sc);
        ctx.lineTo(r * 0.8 * sc + (sc < 1 ? r * 0.35 : 0), dy + r * 0.45 * sc);
        ctx.stroke();
      }
      break;
    case "table": // rows of notes
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-r * 0.75, i * r * 0.5);
        ctx.lineTo(r * 0.75, i * r * 0.5);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(-r * 0.25, -r * 0.75);
      ctx.lineTo(-r * 0.25, r * 0.75);
      ctx.stroke();
      break;
    case "pulse": // heartbeat line
      ctx.beginPath();
      ctx.moveTo(-r, 0);
      ctx.lineTo(-r * 0.4, 0);
      ctx.lineTo(-r * 0.15, -r * 0.7);
      ctx.lineTo(r * 0.15, r * 0.7);
      ctx.lineTo(r * 0.4, 0);
      ctx.lineTo(r, 0);
      ctx.stroke();
      break;
    case "ring":
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  ctx.restore();
}
