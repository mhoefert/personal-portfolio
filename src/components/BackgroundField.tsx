"use client";

import { useEffect, useRef } from "react";

/* The default page background: a quiet network of notes and links laid across the
 * whole viewport. At rest only a soft, slowly drifting haze of it is visible. A click
 * sends a ripple outward from that point: small pulses of orange race along the links
 * as the front reaches them, sparking the notes they arrive at. Each ripple has its
 * own uneven front and its own shade of orange, but always travels away from the click.
 * With "follow my cursor" on, the network also lights up gently around the pointer. */

const SPACING = 26;
const RIPPLE_LIFE = 4.2; // seconds
const RIPPLE_SPEED = 300; // px per second, on average over the ripple's life
const MAX_RIPPLES = 6;
const LEVELS = 10; // alpha buckets, so each frame is a few dozen draw calls
const BOLT = 28; // length of a travelling pulse, px

const GREY = "120,110,100";
/** Each ripple takes one of these: [head, body, tail], deep to pale. */
const PALETTES: [string, string, string][] = [
  ["239,104,24", "248,148,72", "252,196,140"], // orange to apricot
  ["232,96,70", "244,138,110", "250,190,170"], // coral to blush
  ["226,128,30", "240,170,80", "248,212,150"], // amber to sand
];

type Node = { x: number; y: number; r: number; seed: number };
type Edge = [number, number];
type Ripple = { x: number; y: number; t0: number; harm: [number, number, number][]; seed: number; palette: number };
type Live = { r: Ripple; front: number; fade: number };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth 2D value noise in [0, 1]. */
function makeNoise(seed: number) {
  const rand = mulberry32(seed);
  const perm = new Uint8Array(512);
  const vals = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    perm[i] = i;
    vals[i] = rand();
  }
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];
  const v = (x: number, y: number) => vals[perm[(x & 255) + perm[y & 255]]];
  const fade = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = fade(x - xi);
    const w = fade(y - yi);
    const a = v(xi, yi) + (v(xi + 1, yi) - v(xi, yi)) * u;
    const b = v(xi, yi + 1) + (v(xi + 1, yi + 1) - v(xi, yi + 1)) * u;
    return a + (b - a) * w;
  };
}

function buildNetwork(w: number, h: number) {
  const rand = mulberry32(7);
  const cols = Math.ceil(w / SPACING) + 2;
  const rows = Math.ceil(h / SPACING) + 2;
  const nodes: Node[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const hub = rand() < 0.05;
      nodes.push({
        x: (i - 0.5) * SPACING + (rand() - 0.5) * SPACING * 0.7,
        y: (j - 0.5) * SPACING + (rand() - 0.5) * SPACING * 0.7,
        r: hub ? 1.7 + rand() * 0.8 : 0.7 + rand() * 0.6,
        seed: rand(),
      });
    }
  }
  const edges: Edge[] = [];
  const at = (i: number, j: number) => j * cols + i;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      if (i + 1 < cols && rand() < 0.42) edges.push([at(i, j), at(i + 1, j)]);
      if (j + 1 < rows && rand() < 0.42) edges.push([at(i, j), at(i, j + 1)]);
      if (i + 1 < cols && j + 1 < rows && rand() < 0.16) edges.push([at(i, j), at(i + 1, j + 1)]);
      if (i > 0 && j + 1 < rows && rand() < 0.1) edges.push([at(i, j), at(i - 1, j + 1)]);
    }
  }
  return { nodes, edges };
}

export function BackgroundField({ active, follow }: { active: boolean; follow: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const followRef = useRef(follow);

  useEffect(() => {
    activeRef.current = active;
    followRef.current = follow;
  }, [active, follow]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const noise = makeNoise(11);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let net = buildNetwork(window.innerWidth, window.innerHeight);
    let rest = new Float32Array(net.nodes.length);
    let energy = new Float32Array(net.nodes.length);
    let w = 0;
    let h = 0;
    const ripples: Ripple[] = [];
    let live: Live[] = [];
    let phase = new Float32Array(0);
    const pointer = { x: -9999, y: -9999, glow: 0 };
    let raf = 0;
    let lastDraw = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      net = buildNetwork(w, h);
      rest = new Float32Array(net.nodes.length);
      energy = new Float32Array(net.nodes.length);
    };

    const onDown = (e: PointerEvent) => {
      if (!activeRef.current || reduce || e.button !== 0) return;
      const rand = mulberry32((Math.random() * 2 ** 31) | 0);
      // A few low harmonics make the front bulge and lag in random directions.
      const harm: [number, number, number][] = [1, 2, 3, 5].map((k) => [k, rand() * Math.PI * 2, (0.22 * rand()) / Math.sqrt(k)]);
      ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now() / 1000, harm, seed: rand() * 100, palette: Math.floor(rand() * PALETTES.length) });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const compute = (sec: number) => {
      const { nodes } = net;
      const drift = sec * 0.035;
      for (let i = ripples.length - 1; i >= 0; i--) if (sec - ripples[i].t0 >= RIPPLE_LIFE) ripples.splice(i, 1);
      // Ripples that are still alive, with their front radius and fade for this frame.
      live = ripples
        .map((r) => {
          const age = Math.max(0, sec - r.t0);
          const k = age / RIPPLE_LIFE;
          // Eases out: quick off the mark, then a long, slowing glide outward.
          const front = RIPPLE_SPEED * RIPPLE_LIFE * 0.62 * (1 - (1 - k) ** 2.2);
          return { r, front, fade: Math.min(1, age * 6) * (1 - k) ** 1.5 };
        });
      const N = nodes.length;
      if (phase.length < live.length * N) phase = new Float32Array(MAX_RIPPLES * N);

      const glowR = 170;
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        // Rest: two layers of slow noise drifting in different directions; only the
        // brightest patches show, and even those barely.
        const a = noise(n.x * 0.0035 + drift, n.y * 0.0035 - drift * 0.6);
        const b = noise(n.x * 0.009 - drift * 0.7 + 40, n.y * 0.009 + drift * 0.4);
        const haze = Math.max(0, a * 0.7 + b * 0.3 - 0.45) / 0.55;
        rest[i] = 0.035 + 0.16 * haze * haze;

        // Each ripple's phase at this note: how far (px) the front has passed it.
        // Positive = already passed. The front bulges and lags in random directions.
        live.forEach((l, j) => {
          const dx = n.x - l.r.x;
          const dy = n.y - l.r.y;
          const th = Math.atan2(dy, dx);
          let wob = 1;
          for (const [k, ph, amp] of l.r.harm) wob += amp * Math.sin(k * th + ph);
          wob += 0.3 * (noise(n.x * 0.012 + l.r.seed, n.y * 0.012) - 0.5);
          phase[j * N + i] = l.front * wob - Math.hypot(dx, dy);
        });

        let e = 0;
        if (pointer.glow > 0.001) {
          const dist = Math.hypot(n.x - pointer.x, n.y - pointer.y);
          if (dist < glowR) {
            const f = 1 - dist / glowR;
            e += 0.4 * pointer.glow * f * f * (0.55 + 0.45 * noise(n.x * 0.05 + sec, n.y * 0.05));
          }
        }
        energy[i] = Math.min(1, e);
      }
    };

    const draw = (fade: number) => {
      const { nodes, edges } = net;
      const N = nodes.length;
      ctx.clearRect(0, 0, w, h);
      const q = (v: number) => Math.max(0, Math.min(LEVELS - 1, Math.floor(v * LEVELS)));
      const bucket = () => Array.from({ length: LEVELS }, () => new Path2D());
      // Paths bucketed by colour and alpha level, so a frame is a few dozen draw calls.
      const restEdges = bucket();
      const restNodes = bucket();
      const glowEdges = bucket();
      const glowNodes = bucket();
      // [palette][head | body | tail][alpha level]
      const bolts = PALETTES.map(() => [bucket(), bucket(), bucket()]);
      const wakes = PALETTES.map(() => bucket());
      const sparks = PALETTES.map(() => bucket());
      const seg = (p: Path2D, ax: number, ay: number, ux: number, uy: number, s0: number, s1: number) => {
        p.moveTo(ax + ux * s0, ay + uy * s0);
        p.lineTo(ax + ux * s1, ay + uy * s1);
      };

      for (let k = 0; k < edges.length; k++) {
        const [a, b] = edges[k];
        const na = nodes[a];
        const nb = nodes[b];
        const r = Math.min(rest[a], rest[b]);
        if (r > 0.06) {
          const p = restEdges[q(r / 0.2)];
          p.moveTo(na.x, na.y);
          p.lineTo(nb.x, nb.y);
        }
        const e = (energy[a] + energy[b]) * 0.5;
        if (e > 0.03) {
          const p = glowEdges[q(e)];
          p.moveTo(na.x, na.y);
          p.lineTo(nb.x, nb.y);
        }

        live.forEach((l, j) => {
          let pa = phase[j * N + a];
          let pb = phase[j * N + b];
          if (pa < -10 && pb < -10) return; // front hasn't reached this link yet
          // Orient the link so the pulse runs from the end the front reached first.
          let from = na;
          let to = nb;
          if (pb > pa) {
            [pa, pb] = [pb, pa];
            [from, to] = [nb, na];
          }
          const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
          const ux = (to.x - from.x) / len;
          const uy = (to.y - from.y) / len;
          const pal = l.r.palette;
          // A faint afterglow lingers on links the front has crossed.
          const after = l.fade * 0.3 * Math.exp(-Math.max(0, pb) / 160) * (pb > 0 ? 1 : 0.5);
          if (after > 0.01) seg(wakes[pal][q(after)], from.x, from.y, ux, uy, 0, len);
          // Only some links carry a pulse, so it crackles outward rather than fills.
          if (((k * 0.6180339 + l.r.seed) % 1) > 0.88) return;
          // The pulse head: where along the link the front is now (links nearly
          // side-on to the front still get a finite speed).
          const gap = Math.max(pa - pb, len * 0.35);
          const head = (len * pa) / gap;
          const tail = head - BOLT;
          if (head <= 0 || tail >= len) return;
          const alpha = l.fade;
          const cut = (s: number) => Math.max(0, Math.min(len, s));
          const parts: [number, number][] = [
            [tail, tail + BOLT * 0.55],
            [tail + BOLT * 0.55, head - BOLT * 0.18],
            [head - BOLT * 0.18, head],
          ];
          const weights = [0.28, 0.6, 1];
          parts.forEach(([s0, s1], m) => {
            const c0 = cut(s0);
            const c1 = cut(s1);
            if (c1 - c0 > 0.2) seg(bolts[pal][2 - m][q(alpha * weights[m])], from.x, from.y, ux, uy, c0, c1);
          });
          // A spark on the note as the pulse arrives at it.
          if (head > len - 3 && head < len + BOLT * 0.6) {
            const f = 1 - Math.abs(head - len) / (BOLT * 0.6);
            const sr = to.r * (1 + 1.2 * f);
            const sp = sparks[pal][q(alpha * f)];
            sp.moveTo(to.x + sr, to.y);
            sp.arc(to.x, to.y, sr, 0, Math.PI * 2);
          }
        });
      }
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const p = restNodes[q(rest[i] / 0.2)];
        p.moveTo(n.x + n.r, n.y);
        p.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        if (energy[i] > 0.03) {
          const gp = glowNodes[q(energy[i])];
          const r = n.r * (1 + 0.7 * energy[i]);
          gp.moveTo(n.x + r, n.y);
          gp.arc(n.x, n.y, r, 0, Math.PI * 2);
        }
      }

      const lvl = (l: number) => (l + 0.5) / LEVELS;
      ctx.lineCap = "round";
      ctx.lineWidth = 0.7;
      for (let l = 0; l < LEVELS; l++) {
        const a = lvl(l) * 0.2 * fade;
        ctx.strokeStyle = `rgba(${GREY},${a * 0.9})`;
        ctx.stroke(restEdges[l]);
        ctx.fillStyle = `rgba(${GREY},${a * 1.6})`;
        ctx.fill(restNodes[l]);
        // Cursor glow, in the softest of the oranges.
        ctx.strokeStyle = `rgba(${PALETTES[0][1]},${lvl(l) * 0.4 * fade})`;
        ctx.stroke(glowEdges[l]);
        ctx.fillStyle = `rgba(${PALETTES[0][1]},${lvl(l) * 0.6 * fade})`;
        ctx.fill(glowNodes[l]);
      }
      if (!live.length) return;
      PALETTES.forEach((pal, c) => {
        for (let l = 0; l < LEVELS; l++) {
          const a = lvl(l) * fade;
          ctx.lineWidth = 0.9;
          ctx.strokeStyle = `rgba(${pal[2]},${a})`;
          ctx.stroke(wakes[c][l]);
          // tail → body → head: paler and thinner behind, deeper and brighter in front
          ctx.lineWidth = 0.9;
          ctx.strokeStyle = `rgba(${pal[2]},${a * 0.7})`;
          ctx.stroke(bolts[c][0][l]);
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = `rgba(${pal[1]},${a * 0.85})`;
          ctx.stroke(bolts[c][1][l]);
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = `rgba(${pal[0]},${a})`;
          ctx.stroke(bolts[c][2][l]);
          ctx.fillStyle = `rgba(${pal[0]},${a * 0.85})`;
          ctx.fill(sparks[c][l]);
        }
      });
    };

    resize();
    if (reduce) {
      compute(10);
      draw(activeRef.current ? 1 : 0);
      const onResize = () => {
        resize();
        compute(10);
        draw(activeRef.current ? 1 : 0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let fade = activeRef.current ? 1 : 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const sec = now / 1000;
      const target = activeRef.current ? 1 : 0;
      fade += (target - fade) * 0.06;
      if (Math.abs(target - fade) < 0.002) fade = target;
      pointer.glow += ((followRef.current && activeRef.current ? 1 : 0) - pointer.glow) * 0.06;
      if (fade === 0) {
        if (lastDraw !== -1) {
          ctx.clearRect(0, 0, w, h);
          lastDraw = -1;
        }
        return;
      }
      // The resting haze moves so slowly that ~20fps is plenty; ripples and the
      // cursor glow get every frame.
      const busy = ripples.length > 0 || pointer.glow > 0.001 || fade < 1;
      if (!busy && now - lastDraw < 50) return;
      lastDraw = now;
      compute(sec);
      draw(fade);
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
}
