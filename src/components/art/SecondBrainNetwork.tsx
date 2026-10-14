"use client";

import { ORANGE, PEACH, drawLabel, mulberry32, paintBackdrop, useArtCanvas, type Frame } from "./canvas";

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
const PALETTE = [
  [255, 138, 91],
  [253, 191, 116],
  [255, 239, 214],
  [190, 180, 168],
];

type Node = { x: number; y: number; r: number; c: number[]; a: number; phase: number; amp: number; hub: boolean; label?: string };

function buildGraph() {
  const rand = mulberry32(7);
  const nodes: Node[] = LABELS.map((l) => ({
    x: l.x,
    y: l.y,
    r: 4.2,
    c: [247, 107, 21],
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

const { nodes, edges } = buildGraph();

function render(f: Frame) {
  const { ctx, w, h, sec, glow } = f;
  paintBackdrop(f, { x: 0.5, y: 0.5, r: 0.55 });
  const cx = w / 2;
  const cy = h / 2;
  const rx = w * 0.46;
  const ry = h * 0.44;
  const rot = 0.03 * Math.sin(sec * 0.12);
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);

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
    ctx.strokeStyle = `rgba(${PEACH},${(hubEdge ? 0.16 : 0.08) + glow * (hubEdge ? 0.22 : 0.1)})`;
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
      ctx.fillStyle = `rgba(${ORANGE},${0.18 + glow * 0.12})`;
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, n.r * 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = `rgba(${r},${g},${b},${n.a})`;
    ctx.beginPath();
    ctx.arc(pts[i].x, pts[i].y, n.r, 0, Math.PI * 2);
    ctx.fill();
  });

  nodes.forEach((n, i) => {
    if (!n.label) return;
    const right = n.x <= 0;
    drawLabel(f, n.label, right ? pts[i].x + 9 : pts[i].x - 9, pts[i].y - 1, right ? "left" : "right");
  });
}

export function SecondBrainNetwork({ active }: { active: boolean }) {
  const ref = useArtCanvas(render, active);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" role="img" aria-label="Animated network of notes in the second brain" />;
}
