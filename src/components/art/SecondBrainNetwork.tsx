"use client";

import { useEffect, useRef } from "react";

/* Airy, roughly circular cloud of nodes: a few labelled hubs (the real areas of the
 * vault), many small notes, and thin links between neighbours. Drifts gently;
 * links brighten and pulses travel along them while the card is hovered. */

/* Hub positions in cloud coordinates (-1..1 across the card's ellipse), placed so
 * the labels never collide at card widths from ~260px up. Labels on the left half
 * read rightwards, on the right half leftwards. */
const LABELS: { text: string; x: number; y: number }[] = [
  { text: "AI landscape", x: -0.65, y: -0.64 },
  { text: "Career history", x: 0.65, y: -0.55 },
  { text: "Product specs", x: -0.09, y: 0 },
  { text: "Books & notes", x: -0.74, y: 0.45 },
  { text: "Implementation plans", x: 0.78, y: 0.82 },
];

const NODE_COUNT = 150;
const HUB_COLOR = [247, 107, 21];
const PALETTE = [
  [255, 138, 91],
  [253, 191, 116],
  [255, 239, 214],
  [190, 180, 168],
];

type Node = { x: number; y: number; r: number; c: number[]; a: number; phase: number; amp: number; hub: boolean; label?: string };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGraph() {
  const rand = mulberry32(7);
  const nodes: Node[] = LABELS.map((l) => ({
    x: l.x,
    y: l.y,
    r: 4.2,
    c: HUB_COLOR,
    a: 1,
    phase: rand() * Math.PI * 2,
    amp: 1.5,
    hub: true,
    label: l.text,
  }));
  while (nodes.length < NODE_COUNT) {
    // Denser toward the centre, fading at the rim (roughly gaussian radius).
    const angle = rand() * Math.PI * 2;
    const radius = Math.min(1, Math.abs((rand() + rand() + rand()) / 1.5 - 1) * 1.15 + rand() * 0.25);
    const big = rand() < 0.12;
    nodes.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      r: big ? 2.2 + rand() * 1.2 : 0.8 + rand() * 1.1,
      c: big ? PALETTE[Math.floor(rand() * 2)] : PALETTE[Math.floor(rand() * PALETTE.length)],
      a: Math.max(0.15, 1 - radius * 0.85),
      phase: rand() * Math.PI * 2,
      amp: 2 + rand() * 3,
      hub: false,
    });
  }
  // Link each node to its nearest neighbours; hubs get more links.
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  nodes.forEach((n, i) => {
    const k = n.hub ? 7 : rand() < 0.5 ? 2 : 1;
    nodes
      .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, k)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([i, j]);
        }
      });
  });
  return { nodes, edges };
}

export function SecondBrainNetwork({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { nodes, edges } = buildGraph();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(document.body).fontFamily;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let glow = 0; // eased hover amount, 0..1
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (sec: number) => {
      const cx = w / 2;
      const cy = h / 2;
      const rx = w * 0.46;
      const ry = h * 0.44;
      const rot = 0.03 * Math.sin(sec * 0.12);
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.75);
      bg.addColorStop(0, "#2b211a");
      bg.addColorStop(1, "#14110e");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx * 1.1);
      halo.addColorStop(0, `rgba(247,107,21,${0.16 + glow * 0.08})`);
      halo.addColorStop(1, "rgba(247,107,21,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      const pts = nodes.map((n) => {
        const x = n.x * cos - n.y * sin;
        const y = n.x * sin + n.y * cos;
        return {
          x: cx + x * rx + Math.sin(sec * 0.5 + n.phase) * n.amp,
          y: cy + y * ry + Math.cos(sec * 0.43 + n.phase) * n.amp,
        };
      });

      ctx.lineWidth = 0.6;
      edges.forEach(([i, j]) => {
        const hubEdge = nodes[i].hub || nodes[j].hub;
        const base = hubEdge ? 0.16 : 0.08;
        ctx.strokeStyle = `rgba(253,191,116,${base + glow * (hubEdge ? 0.22 : 0.1)})`;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      });

      // Pulses travel along hub links while hovered.
      if (glow > 0.02) {
        edges.forEach(([i, j], k) => {
          if (!nodes[i].hub && !nodes[j].hub) return;
          const t = (sec * 0.35 + k * 0.137) % 1;
          ctx.fillStyle = `rgba(255,239,214,${0.85 * glow * Math.sin(t * Math.PI)})`;
          ctx.beginPath();
          ctx.arc(pts[i].x + (pts[j].x - pts[i].x) * t, pts[i].y + (pts[j].y - pts[i].y) * t, 1.4, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      nodes.forEach((n, i) => {
        const [r, g, b] = n.c;
        if (n.hub) {
          ctx.fillStyle = `rgba(247,107,21,${0.18 + glow * 0.12})`;
          ctx.beginPath();
          ctx.arc(pts[i].x, pts[i].y, n.r * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${r},${g},${b},${n.a})`;
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.font = `500 ${w > 320 ? 11 : 10}px ${font}`;
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(20,17,14,0.95)";
      ctx.shadowBlur = 6;
      nodes.forEach((n, i) => {
        if (!n.label) return;
        const right = n.x <= 0;
        const tx = right ? pts[i].x + 9 : pts[i].x - 9;
        ctx.textAlign = right ? "left" : "right";
        ctx.fillStyle = `rgba(255,239,214,${0.8 + glow * 0.2})`;
        ctx.fillText(n.label, tx, pts[i].y - 1);
      });
      ctx.shadowBlur = 0;
    };

    const tick = (now: number) => {
      const target = activeRef.current ? 1 : 0;
      glow += (target - glow) * 0.08;
      draw(reduce ? 0 : (now - start) / 1000);
      raf = visible && !reduce ? requestAnimationFrame(tick) : 0;
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw(reduce ? 0 : (performance.now() - start) / 1000);
    });
    ro.observe(canvas);

    // Only animate while on screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduce) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);

    document.fonts?.ready.then(() => draw(reduce ? 0 : (performance.now() - start) / 1000));

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Animated network of notes in the second brain" role="img" />;
}
