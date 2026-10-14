"use client";

import { ORANGE, PEACH, drawFlow, drawGlyph, drawLabel, drawNode, paintBackdrop, useArtCanvas, type Frame, type Glyph } from "./canvas";

/* Data flowing from the three sources into a turning wheel of harnesses (the wheel
 * doubles as a bike wheel), then out to the coach. */
const SOURCES: { label: string; glyph: Glyph; y: number }[] = [
  { label: "Strava", glyph: "chevrons", y: 0.22 },
  { label: "Gemini research", glyph: "sparkle", y: 0.5 },
  { label: "Airtable", glyph: "table", y: 0.78 },
];
const HARNESSES: Glyph[] = ["spark", "hex", "pointer"];

function render(f: Frame) {
  const { ctx, w, h, sec, glow } = f;
  paintBackdrop(f, { x: 0.56, y: 0.47, r: 0.5 });

  const nodeR = Math.max(10, h * 0.062);
  const srcX = w * 0.12;
  const hub = { x: w * 0.56, y: h * 0.47 };
  const wheelR = h * 0.28;
  const out = { x: w * 0.88, y: h * 0.47 };

  SOURCES.forEach((s, i) => {
    drawFlow(f, { x: srcX + nodeR, y: h * s.y }, { x: hub.x - wheelR * 0.98, y: hub.y + (s.y - 0.5) * wheelR * 0.9 }, { count: 4, speed: 0.3, offset: i * 0.23 });
  });
  drawFlow(f, { x: hub.x + wheelR, y: hub.y }, { x: out.x - nodeR * 1.2, y: out.y }, { count: 6, speed: 0.42, color: ORANGE });

  // Wheel: spokes and rim, turning.
  const rot = sec * 0.32 * (1 + glow * 0.8);
  ctx.save();
  ctx.translate(hub.x, hub.y);
  ctx.strokeStyle = `rgba(${PEACH},${0.16 + glow * 0.12})`;
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 18; i++) {
    const a = rot + (i / 18) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * wheelR * 0.16, Math.sin(a) * wheelR * 0.16);
    ctx.lineTo(Math.cos(a + 0.35) * wheelR * 0.9, Math.sin(a + 0.35) * wheelR * 0.9);
    ctx.stroke();
  }
  ctx.strokeStyle = `rgba(${ORANGE},${0.5 + glow * 0.3})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, wheelR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = `rgba(${PEACH},0.22)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, wheelR * 0.9, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  drawNode(f, hub.x, hub.y, wheelR * 0.15);

  // Harness chips ride the rim but stay upright.
  HARNESSES.forEach((g, k) => {
    const a = rot + (k / HARNESSES.length) * Math.PI * 2 - Math.PI / 2;
    const x = hub.x + Math.cos(a) * wheelR;
    const y = hub.y + Math.sin(a) * wheelR;
    drawNode(f, x, y, nodeR * 0.95);
    drawGlyph(ctx, g, x, y, nodeR * 1.05);
  });
  drawLabel(f, "any harness", hub.x, hub.y + wheelR + nodeR + 8);

  SOURCES.forEach((s) => {
    const y = h * s.y;
    drawNode(f, srcX, y, nodeR);
    drawGlyph(ctx, s.glyph, srcX, y, nodeR * 1.05);
    drawLabel(f, s.label, Math.max(6, srcX - nodeR), y + nodeR + 10, "left");
  });

  drawNode(f, out.x, out.y, nodeR * 1.2, 1.2);
  drawGlyph(ctx, "pulse", out.x, out.y, nodeR * 1.25);
  drawLabel(f, "Coach", out.x, out.y + nodeR * 1.2 + 11);
}

export function CyclingCoachFlow({ active }: { active: boolean }) {
  const ref = useArtCanvas(render, active);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Data from Strava, Gemini research and Airtable flowing through a turning wheel of AI harnesses to the coach"
    />
  );
}
