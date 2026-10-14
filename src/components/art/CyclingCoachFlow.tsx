"use client";

import { useRef } from "react";
import { ORANGE, PEACH, drawFlow, drawGlyph, drawLabel, drawNode, drawTileNode, paintBackdrop, useArtCanvas, type Frame, type Logo } from "./canvas";

/* Data flowing from the three sources into a turning wheel of harnesses (the wheel
 * doubles as a bike wheel), then out to the coach. */
const SOURCES: { label: string; logo: Logo; y: number }[] = [
  { label: "Strava", logo: "strava", y: 0.22 },
  { label: "Gemini research", logo: "gemini", y: 0.5 },
  { label: "Airtable", logo: "airtable", y: 0.78 },
];
const HARNESSES: Logo[] = ["claude", "codex", "cursor"];
const SPIN = 0.1; // rad/s at rest
const SPIN_HOVER = 0.22; // rad/s while hovered

export function CyclingCoachFlow({ active }: { active: boolean }) {
  // The wheel angle is integrated frame to frame, so hovering eases the speed up
  // instead of jumping the wheel to a new position.
  const spin = useRef({ angle: 0, last: 0 });

  const render = (f: Frame) => {
    const { ctx, w, h, sec, glow } = f;
    const dt = Math.min(0.1, Math.max(0, sec - spin.current.last));
    spin.current.last = sec;
    spin.current.angle += dt * (SPIN + (SPIN_HOVER - SPIN) * glow);
    const rot = spin.current.angle;

    paintBackdrop(f, { x: 0.56, y: 0.47, r: 0.5 });
    const tile = Math.max(20, h * 0.11);
    const srcX = w * 0.12;
    const hub = { x: w * 0.56, y: h * 0.47 };
    const wheelR = h * 0.28;
    const out = { x: w * 0.88, y: h * 0.47 };

    SOURCES.forEach((s, i) => {
      drawFlow(f, { x: srcX + tile * 0.7, y: h * s.y }, { x: hub.x - wheelR * 0.98, y: hub.y + (s.y - 0.5) * wheelR * 0.9 }, { count: 4, speed: 0.3, offset: i * 0.23 });
    });
    drawFlow(f, { x: hub.x + wheelR, y: hub.y }, { x: out.x - tile * 0.75, y: out.y }, { count: 6, speed: 0.42, color: ORANGE });

    // Wheel: spokes and rim, turning.
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

    // Harness logos ride the rim but stay upright.
    HARNESSES.forEach((logo, k) => {
      const a = rot + (k / HARNESSES.length) * Math.PI * 2 - Math.PI / 2;
      drawTileNode(f, logo, hub.x + Math.cos(a) * wheelR, hub.y + Math.sin(a) * wheelR, tile);
    });
    drawLabel(f, "any harness", hub.x, hub.y + wheelR + tile * 0.75 + 8);

    SOURCES.forEach((s) => {
      const y = h * s.y;
      drawTileNode(f, s.logo, srcX, y, tile);
      drawLabel(f, s.label, Math.max(6, srcX - tile / 2), y + tile * 0.75 + 9, "left");
    });

    drawNode(f, out.x, out.y, tile * 0.62, 1.2);
    drawGlyph(ctx, "pulse", out.x, out.y, tile * 0.65);
    drawLabel(f, "Coach", out.x, out.y + tile * 0.62 + 11);
  };

  const ref = useArtCanvas(render, active);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Data from Strava, Gemini research and Airtable flowing through a turning wheel of Claude Code, Codex and Cursor to the coach"
    />
  );
}
