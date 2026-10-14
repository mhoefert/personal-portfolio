"use client";

import { CREAM, ORANGE, PEACH, drawFlow, drawGlyph, drawLabel, drawNode, paintBackdrop, useArtCanvas, type Frame, type Glyph } from "./canvas";

/* GitHub Actions call whichever LLM provider is best that week (the active one
 * rotates), the answers land in the second brain, and a dashed lane underneath
 * carries the deterministic script work that never touches a model. */
const PROVIDERS: { glyph: Glyph; y: number }[] = [
  { glyph: "spark", y: 0.13 },
  { glyph: "hex", y: 0.31 },
  { glyph: "sparkle", y: 0.49 },
  { glyph: "ring", y: 0.67 },
];
const BRAIN_NODES = 11;

function render(f: Frame) {
  const { ctx, w, h, sec, glow } = f;
  paintBackdrop(f, { x: 0.5, y: 0.42, r: 0.55 });

  const nodeR = Math.max(10, h * 0.062);
  const gh = { x: w * 0.14, y: h * 0.4 };
  const brain = { x: w * 0.85, y: h * 0.4 };
  const brainR = h * 0.14;
  const pX = w * 0.52;
  const activeIdx = Math.floor(sec / 2.6) % PROVIDERS.length;

  // Deterministic lane: scripts straight from GitHub into the second brain.
  drawFlow(f, { x: gh.x, y: gh.y + nodeR * 1.3 }, { x: brain.x, y: brain.y + brainR }, { bend: h * 0.5, count: 8, speed: 0.2, color: CREAM, strength: 0.7, dashed: true });
  drawLabel(f, "scripts", w * 0.5, h * 0.9);

  // LLM API calls: GitHub → providers → second brain. The active provider carries the traffic.
  PROVIDERS.forEach((p, i) => {
    const on = i === activeIdx;
    const at = { x: pX, y: h * p.y };
    drawFlow(f, { x: gh.x + nodeR * 1.3, y: gh.y }, { x: at.x - nodeR * 0.8, y: at.y }, { count: on ? 4 : 1, speed: 0.34, offset: i * 0.17, color: ORANGE, strength: on ? 1 : 0.25 });
    drawFlow(f, { x: at.x + nodeR * 0.8, y: at.y }, { x: brain.x - brainR, y: brain.y }, { count: on ? 4 : 1, speed: 0.34, offset: i * 0.17 + 0.5, color: PEACH, strength: on ? 1 : 0.25 });
  });

  PROVIDERS.forEach((p, i) => {
    const on = i === activeIdx;
    drawNode(f, pX, h * p.y, nodeR * 0.8, on ? 1.3 : 0.35);
    drawGlyph(ctx, p.glyph, pX, h * p.y, nodeR * 0.85, `rgba(${CREAM},${on ? 0.95 : 0.45})`);
  });
  drawLabel(f, "LLM APIs", pX + nodeR * 0.8 + 8, h * PROVIDERS[0].y, "left");

  // Second brain: a small turning cluster of linked notes.
  const rot = sec * 0.18;
  const pts = Array.from({ length: BRAIN_NODES }, (_, k) => {
    const a = rot + (k / BRAIN_NODES) * Math.PI * 2;
    const r = brainR * (k % 3 === 0 ? 0.55 : 1);
    return { x: brain.x + Math.cos(a) * r, y: brain.y + Math.sin(a) * r };
  });
  ctx.strokeStyle = `rgba(${PEACH},${0.18 + glow * 0.15})`;
  ctx.lineWidth = 0.7;
  pts.forEach((p, k) => {
    const q = pts[(k + 1) % BRAIN_NODES];
    ctx.beginPath();
    ctx.moveTo(brain.x, brain.y);
    ctx.lineTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
  });
  pts.forEach((p, k) => {
    ctx.fillStyle = k % 3 === 0 ? `rgba(${ORANGE},0.95)` : `rgba(${PEACH},0.8)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, k % 3 === 0 ? 2.6 : 1.7, 0, Math.PI * 2);
    ctx.fill();
  });
  drawNode(f, brain.x, brain.y, nodeR * 0.55, 1.2);
  drawLabel(f, "Second brain", brain.x, brain.y + brainR + 14);

  drawNode(f, gh.x, gh.y, nodeR * 1.3, 1.2);
  drawGlyph(ctx, "github", gh.x, gh.y, nodeR * 1.35);
  drawLabel(f, "GitHub Actions", gh.x, gh.y + nodeR * 1.3 + 12);
}

export function AutomationEngineFlow({ active }: { active: boolean }) {
  const ref = useArtCanvas(render, active);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="GitHub Actions calling a rotating choice of LLM providers and writing to the second brain, with scripts running alongside"
    />
  );
}
