"use client";

import { ORANGE, PEACH, paintBackdrop, useArtCanvas, type Frame } from "./canvas";

/* A pulsing question mark with rings radiating out and a few orbiting notes. */
function render(f: Frame) {
  const { ctx, w, h, sec, glow, font } = f;
  paintBackdrop(f, { x: 0.5, y: 0.5, r: 0.5 });
  const cx = w / 2;
  const cy = h / 2;

  for (let k = 0; k < 2; k++) {
    const phase = (sec / 3.2 + k / 2) % 1;
    ctx.strokeStyle = `rgba(${ORANGE},${(1 - phase) * (0.35 + glow * 0.2)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, h * (0.16 + phase * 0.32), 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let k = 0; k < 7; k++) {
    const a = sec * (0.25 + k * 0.04) + k * 0.9;
    const r = h * (0.27 + (k % 3) * 0.05);
    ctx.fillStyle = `rgba(${PEACH},${0.45 + (k % 2) * 0.3})`;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * r * 1.25, cy + Math.sin(a) * r, k % 3 === 0 ? 2.4 : 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const pulse = 1 + 0.05 * Math.sin(sec * 2.2) + glow * 0.04;
  const size = h * 0.42 * pulse;
  ctx.save();
  ctx.font = `600 ${size}px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const grad = ctx.createLinearGradient(cx, cy - size / 2, cx, cy + size / 2);
  grad.addColorStop(0, "#fdbf74");
  grad.addColorStop(1, "#f76b15");
  ctx.fillStyle = grad;
  ctx.shadowColor = `rgba(${ORANGE},0.9)`;
  ctx.shadowBlur = 18 + 14 * (0.5 + 0.5 * Math.sin(sec * 2.2)) + glow * 10;
  ctx.fillText("?", cx, cy + size * 0.04);
  ctx.restore();
}

export function OpenSlotArt({ active }: { active: boolean }) {
  const ref = useArtCanvas(render, active);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" role="img" aria-label="A glowing, pulsing question mark" />;
}
