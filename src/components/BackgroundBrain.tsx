"use client";

import { useEffect, useRef, useState } from "react";

/* The page background: the dot grid, a grey wash, and a small "second brain" (a
 * two-lobed network of notes with signals firing between them, an orange core that
 * breathes and rings pulsing outward). It wanders on its own and gets a push from
 * scrolling; the top-left button locks it to the visitor's pointer instead. */

const SIZE = 440;
const GREY_SIZE = 1000;
const NODE_COUNT = 58;
const SIGNALS = 4;
const PULSE = 6.5; // seconds per breath / ring

type BrainNode = { x: number; y: number; hub: boolean; phase: number; fire: number };
type Signal = { from: number; to: number; t: number; hops: number; speed: number };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Two overlapping lobes with a fissure down the middle, linked to near neighbours. */
function buildBrain() {
  const rand = mulberry32(42);
  const nodes: BrainNode[] = [];
  const inLobe = (x: number, y: number, cx: number) => ((x - cx) / 0.52) ** 2 + (y / 0.66) ** 2 <= 1;
  while (nodes.length < NODE_COUNT) {
    const x = rand() * 2 - 1;
    const y = rand() * 2 - 1;
    if (Math.abs(x) < 0.06 || y > 0.58) continue;
    if (!inLobe(x, y, -0.46) && !inLobe(x, y, 0.46)) continue;
    nodes.push({ x, y, hub: rand() < 0.16, phase: rand() * Math.PI * 2, fire: 0 });
  }
  const adj: number[][] = nodes.map(() => []);
  const link = (i: number, j: number) => {
    if (i === j || adj[i].includes(j)) return;
    adj[i].push(j);
    adj[j].push(i);
  };
  nodes.forEach((n, i) => {
    nodes
      .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2, same: Math.sign(m.x) === Math.sign(n.x) }))
      .filter((o) => o.j !== i && o.same)
      .sort((a, b) => a.d - b.d)
      .slice(0, n.hub ? 4 : 2)
      .forEach(({ j }) => link(i, j));
  });
  // A few bridges across the fissure.
  const left = nodes.map((n, i) => ({ n, i })).filter(({ n }) => n.x < 0 && n.x > -0.3);
  const right = nodes.map((n, i) => ({ n, i })).filter(({ n }) => n.x > 0 && n.x < 0.3);
  left.slice(0, 4).forEach(({ n, i }) => {
    const best = right.reduce((a, b) => ((b.n.x - n.x) ** 2 + (b.n.y - n.y) ** 2 < (a.n.x - n.x) ** 2 + (a.n.y - n.y) ** 2 ? b : a));
    link(i, best.i);
  });
  const edges: [number, number][] = [];
  adj.forEach((ns, i) => ns.forEach((j) => i < j && edges.push([i, j])));
  return { nodes, adj, edges };
}

export function BackgroundBrain() {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const greyRef = useRef<HTMLDivElement>(null);
  const [follow, setFollow] = useState(false);
  const followRef = useRef(false);

  useEffect(() => {
    followRef.current = follow;
  }, [follow]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { nodes, adj, edges } = buildBrain();
    const rand = mulberry32(7);
    const spawn = (): Signal => {
      const from = Math.floor(rand() * nodes.length);
      const to = adj[from][Math.floor(rand() * adj[from].length)] ?? from;
      return { from, to, t: 0, hops: 0, speed: 1.1 + rand() * 0.8 };
    };
    const signals = Array.from({ length: SIGNALS }, spawn);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.4 };
    let pos: { x: number; y: number } | null = null;
    let progress = 0;
    let last = 0;
    let raf = 0;

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress = total > 0 ? window.scrollY / total : 0;
    };
    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const draw = (sec: number, dt: number) => {
      const c = SIZE / 2;
      ctx.clearRect(0, 0, SIZE, SIZE);
      const breath = 0.5 + 0.5 * Math.sin((sec * 2 * Math.PI) / PULSE);

      const core = ctx.createRadialGradient(c, c, 0, c, c, SIZE * 0.5);
      core.addColorStop(0, `rgba(247,107,21,${0.2 + 0.07 * breath})`);
      core.addColorStop(0.35, "rgba(247,107,21,0.07)");
      core.addColorStop(1, "rgba(247,107,21,0)");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, SIZE, SIZE);

      for (let k = 0; k < 2; k++) {
        const phase = (sec / PULSE + k / 2) % 1;
        ctx.strokeStyle = `rgba(247,107,21,${0.22 * (1 - phase) * Math.min(1, phase / 0.1)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(c, c, SIZE * (0.14 + phase * 0.34), 0, Math.PI * 2);
        ctx.stroke();
      }

      const scale = SIZE * 0.4 * (1 + 0.025 * Math.sin(sec * 0.9));
      const pts = nodes.map((n) => ({
        x: c + n.x * scale + Math.sin(sec * 0.6 + n.phase) * 2.2,
        y: c + n.y * scale * 0.8 + Math.cos(sec * 0.5 + n.phase) * 2.2,
      }));

      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "rgba(150,108,78,0.22)";
      ctx.beginPath();
      edges.forEach(([i, j]) => {
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
      });
      ctx.stroke();

      signals.forEach((s, k) => {
        s.t += dt * s.speed;
        if (s.t >= 1) {
          nodes[s.to].fire = 1;
          const options = adj[s.to].filter((j) => j !== s.from);
          if (s.hops > 7 || options.length === 0) {
            signals[k] = spawn();
            return;
          }
          s.from = s.to;
          s.to = options[Math.floor(rand() * options.length)];
          s.t = 0;
          s.hops += 1;
        }
        const a = pts[s.from];
        const b = pts[s.to];
        const x = a.x + (b.x - a.x) * s.t;
        const y = a.y + (b.y - a.y) * s.t;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 9);
        glow.addColorStop(0, "rgba(247,107,21,0.55)");
        glow.addColorStop(1, "rgba(247,107,21,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(247,107,21,0.95)";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      nodes.forEach((n, i) => {
        n.fire = Math.max(0, n.fire - dt * 1.4);
        const f = n.fire;
        const r = (n.hub ? 3 : 1.8) + f * 1.8;
        ctx.fillStyle = n.hub || f > 0.05 ? `rgba(247,107,21,${0.5 + 0.5 * Math.max(f, n.hub ? 0.3 : 0)})` : "rgba(99,99,94,0.45)";
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const place = (sec: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const p = progress;
      const wander = {
        x: ((52 + 24 * Math.sin(sec * 0.22 + 0.5) + 9 * Math.sin(sec * 0.08 + 2.1) + 12 * Math.sin(p * Math.PI * 4 + 0.5)) / 100) * w,
        y: ((42 + 22 * Math.cos(sec * 0.19 - 0.3) + 8 * Math.sin(sec * 0.1 + 1.3) + 14 * Math.cos(p * Math.PI * 3.2 - 0.3)) / 100) * h,
      };
      const target = followRef.current ? pointer : wander;
      pos ??= { ...target };
      // Ease toward the target, so switching modes glides rather than jumps.
      const k = followRef.current ? 0.12 : 0.05;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      if (boxRef.current) boxRef.current.style.transform = `translate3d(${pos.x - SIZE / 2}px, ${pos.y - SIZE / 2}px, 0)`;
      const gx = ((40 + 26 * Math.sin(sec * 0.14 + 1.8) + 10 * Math.cos(sec * 0.06) + 12 * Math.sin(p * Math.PI * 2.8 + 1.8)) / 100) * w;
      const gy = ((58 + 22 * Math.cos(sec * 0.12 + 0.8) + 8 * Math.sin(sec * 0.05 + 0.4) + 14 * Math.cos(p * Math.PI * 4.4 + 0.8)) / 100) * h;
      if (greyRef.current) greyRef.current.style.transform = `translate3d(${gx - GREY_SIZE / 2}px, ${gy - GREY_SIZE / 2}px, 0)`;
    };

    onScroll();
    if (reduce) {
      place(8);
      draw(8, 0);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const sec = (now - start) / 1000 + 8;
      const dt = last ? Math.min(0.05, sec - last) : 0;
      last = sec;
      place(sec);
      draw(sec, dt);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <>
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
        <div
          ref={greyRef}
          className="absolute left-0 top-0 will-change-transform"
          style={{
            width: GREY_SIZE,
            height: GREY_SIZE,
            background: "radial-gradient(circle, rgba(130,130,124,0.12) 0%, rgba(130,130,124,0.03) 45%, transparent 70%)",
          }}
        />
        <div ref={boxRef} className="absolute left-0 top-0 will-change-transform" style={{ width: SIZE, height: SIZE }}>
          <canvas ref={canvasRef} style={{ width: SIZE, height: SIZE }} />
        </div>
      </div>

      {/* Follow-the-pointer toggle. Hidden on touch screens and for reduced motion. */}
      <button
        type="button"
        onClick={() => setFollow((f) => !f)}
        aria-pressed={follow}
        aria-label={follow ? "Let the second brain wander" : "Make the second brain follow your cursor"}
        className="group fixed left-6 top-6 z-40 grid h-10 w-10 cursor-pointer place-items-center rounded-full border shadow-sm transition-all duration-300 hover:border-[var(--accent)] pointer-coarse:hidden motion-reduce:hidden"
        style={{
          borderColor: follow ? "var(--accent)" : "var(--gray-4)",
          background: follow ? "var(--accent-soft)" : "rgba(255,255,255,0.9)",
          color: follow ? "var(--accent-strong)" : "var(--gray-11)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="6" cy="7" r="2" />
          <circle cx="15" cy="5" r="1.6" />
          <circle cx="9" cy="15" r="1.6" />
          <path d="M7.7 6.4 13.4 5.3M6.7 8.8 8.4 13.5M14.3 6.5 10 13.6" />
          <path d="M14 13l7 2.6-3 1.1-1.1 3z" fill="currentColor" />
        </svg>
        <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-full bg-[var(--gray-12)] px-3 py-1.5 font-[var(--font-mono)] text-[11px] tracking-[0.04em] text-white opacity-0 shadow-sm transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
          {follow ? "Following your cursor · click to let it wander" : "Make the second brain follow your cursor"}
        </span>
      </button>
    </>
  );
}
