"use client";

import { useEffect, useRef, useState } from "react";
import { BackgroundField } from "./BackgroundField";
import { BrainControls, type BackgroundMode } from "./BrainControls";

/* The page background: the dot grid, a grey wash, and one of two animations. The
 * default is a quiet network that ripples outward from clicks (BackgroundField). The
 * alternative, picked from the top-left controls, is a "second brain" sphere (in
 * the spirit of incident.io's Nexus globe, built from scratch). A slowly rotating
 * globe with a fuzzy rim of dust, a soft peach glow, grey notes inside, and clusters
 * of orange notes on its surface, each labelled with an area of this site. The near
 * side is crisp; the far side fades as it turns. The globe wanders the page and
 * gets a push from scrolling; the top-left controls can lock it to the pointer or
 * turn it off. */

const SIZE = 440;
const GREY_SIZE = 1000;
const TURN_SECONDS = 80; // one full rotation
const TILT = 0.32; // radians, so we see a little of the top
const DUST = 1100;
const INNER = 70;

const CLUSTERS: { label: [string, string]; count: number; hue: string }[] = [
  { label: ["Joey resume", "engine"], count: 18, hue: "247,107,21" },
  { label: ["Playi adaptive", "playbooks"], count: 15, hue: "240,92,62" },
  { label: ["AI landscape", "research"], count: 16, hue: "255,138,91" },
  { label: ["Career history", "& resumes"], count: 13, hue: "247,107,21" },
  { label: ["ITB rehab", "research"], count: 10, hue: "232,118,96" },
  { label: ["Strava ride", "data"], count: 14, hue: "247,107,21" },
  { label: ["Books &", "reading notes"], count: 9, hue: "255,138,91" },
  { label: ["Product specs", "& plans"], count: 15, hue: "240,92,62" },
  { label: ["Model watch", "& LLM costs"], count: 11, hue: "232,118,96" },
  { label: ["Mitie operator", "workshops"], count: 12, hue: "247,107,21" },
  { label: ["JLL market", "strategy"], count: 10, hue: "255,138,91" },
  { label: ["Hard rides", "& challenges"], count: 13, hue: "240,92,62" },
];

type P3 = { x: number; y: number; z: number };
type Dot = P3 & { r: number; hue: string };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalize(p: P3): P3 {
  const l = Math.hypot(p.x, p.y, p.z) || 1;
  return { x: p.x / l, y: p.y / l, z: p.z / l };
}

/** Everything lives on or inside a unit sphere; the renderer scales it. */
function buildGlobe() {
  const rand = mulberry32(19);
  const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
  const dir = () => normalize({ x: gauss(), y: gauss(), z: gauss() });

  const dust: P3[] = Array.from({ length: DUST }, () => {
    const d = dir();
    const r = 0.965 + rand() * 0.07;
    return { x: d.x * r, y: d.y * r, z: d.z * r };
  });
  const inner: Dot[] = Array.from({ length: INNER }, () => {
    const d = dir();
    const r = Math.sqrt(rand()) * 0.5;
    return { x: d.x * r, y: d.y * r, z: d.z * r, r: 0.9 + rand() * 0.8, hue: "99,99,94" };
  });

  // Cluster anchors spread evenly over the sphere (Fibonacci lattice), with a jitter.
  const golden = Math.PI * (3 - Math.sqrt(5));
  const anchors: P3[] = CLUSTERS.map((_, i) => {
    const y = 1 - ((i + 0.5) * 2) / CLUSTERS.length;
    const rr = Math.sqrt(1 - y * y);
    const th = i * golden + rand() * 0.3;
    return normalize({ x: Math.cos(th) * rr, y: y * 0.9, z: Math.sin(th) * rr });
  });
  const clusterDots: Dot[] = [];
  anchors.forEach((a, i) => {
    for (let k = 0; k < CLUSTERS[i].count; k++) {
      const spread = 0.2;
      const d = normalize({ x: a.x + gauss() * spread, y: a.y + gauss() * spread, z: a.z + gauss() * spread });
      const r = 0.86 + rand() * 0.13;
      clusterDots.push({ x: d.x * r, y: d.y * r, z: d.z * r, r: 1.5 + rand() * 1.4, hue: CLUSTERS[i].hue });
    }
  });
  return { dust, inner, anchors, clusterDots };
}

export function BackgroundBrain() {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const greyRef = useRef<HTMLDivElement>(null);
  const [follow, setFollow] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mode, setMode] = useState<BackgroundMode>("field");
  const followRef = useRef(false);
  const visibleRef = useRef(true);
  const globeOn = visible && mode === "globe";

  // Remember the viewer's pick between visits; the field is the default.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bg-mode");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read once after hydration
      if (saved === "globe" || saved === "field") setMode(saved);
    } catch {}
  }, []);

  useEffect(() => {
    followRef.current = follow;
    visibleRef.current = globeOn;
  }, [follow, globeOn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { dust, inner, anchors, clusterDots } = buildGlobe();
    const font = getComputedStyle(document.body).fontFamily;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.4 };
    let pos: { x: number; y: number } | null = null;
    let progress = 0;
    let raf = 0;

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress = total > 0 ? window.scrollY / total : 0;
    };
    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const c = SIZE / 2;
    const R = SIZE * 0.42;
    const F = 3.2; // perspective distance, in sphere radii

    const draw = (sec: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const rot = (sec / TURN_SECONDS) * Math.PI * 2;
      const cr = Math.cos(rot);
      const sr = Math.sin(rot);
      const ct = Math.cos(TILT);
      const st = Math.sin(TILT);
      /** Rotate about the vertical axis, tilt toward the viewer, project with perspective. */
      const project = (p: P3) => {
        const x1 = p.x * cr + p.z * sr;
        const z1 = -p.x * sr + p.z * cr;
        const y2 = p.y * ct - z1 * st;
        const z2 = p.y * st + z1 * ct;
        const s = F / (F - z2);
        // depth: 1 at the nearest point, 0 at the farthest
        return { x: c + x1 * R * s, y: c + y2 * R * s, s, d: (z2 + 1) / 2 };
      };

      // Soft peach glow, breathing gently.
      const breath = 0.5 + 0.5 * Math.sin(sec * 0.9);
      const glow = ctx.createRadialGradient(c, c, 0, c, c, R * 1.12);
      glow.addColorStop(0, `rgba(253,191,116,${0.16 + 0.05 * breath})`);
      glow.addColorStop(0.6, "rgba(247,107,21,0.07)");
      glow.addColorStop(1, "rgba(247,107,21,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Fuzzy rim: fine dust on the shell (projection piles it up at the edge).
      for (const p of dust) {
        const q = project(p);
        ctx.fillStyle = `rgba(140,128,116,${0.07 + 0.2 * q.d})`;
        const sz = 0.7 + 0.5 * q.s;
        ctx.fillRect(q.x, q.y, sz, sz);
      }

      // Grey notes inside, then orange clusters, far side first.
      const dots = [...inner, ...clusterDots].map((p) => ({ p, q: project(p) })).sort((a, b) => a.q.d - b.q.d);
      for (const { p, q } of dots) {
        const isCluster = p.hue !== "99,99,94";
        const a = isCluster ? 0.18 + 0.8 * q.d ** 1.4 : 0.2 + 0.5 * q.d;
        ctx.fillStyle = `rgba(${p.hue},${a})`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, p.r * q.s * (isCluster ? 1 : 0.85), 0, Math.PI * 2);
        ctx.fill();
      }

      // Labels: crisp on the near side, fading out as they turn away.
      ctx.font = `500 10.5px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      anchors.forEach((a, i) => {
        const q = project(a);
        const alpha = Math.min(1, Math.max(0, (q.d - 0.3) / 0.45));
        if (alpha <= 0.02) return;
        ctx.fillStyle = `rgba(33,32,28,${0.12 + 0.78 * alpha})`;
        const [l1, l2] = CLUSTERS[i].label;
        ctx.fillText(l1, q.x, q.y - 6.5);
        ctx.fillText(l2, q.x, q.y + 6.5);
      });
    };

    const place = (sec: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const p = progress;
      const wander = {
        x: ((52 + 24 * Math.sin(sec * 0.16 + 0.5) + 9 * Math.sin(sec * 0.06 + 2.1) + 12 * Math.sin(p * Math.PI * 4 + 0.5)) / 100) * w,
        y: ((44 + 20 * Math.cos(sec * 0.14 - 0.3) + 8 * Math.sin(sec * 0.08 + 1.3) + 14 * Math.cos(p * Math.PI * 3.2 - 0.3)) / 100) * h,
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
      draw(8);
      return;
    }

    const start = performance.now();
    let fade = 1; // keeps drawing while the globe fades out, then stops
    const tick = (now: number) => {
      const sec = (now - start) / 1000 + 8;
      fade = visibleRef.current ? 1 : Math.max(0, fade - 1 / 45);
      if (fade > 0) {
        place(sec);
        draw(sec);
      }
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
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: mode === "field" && visible ? 0.45 : 0.8,
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
        <BackgroundField active={visible && mode === "field"} follow={follow} />
        <div
          ref={boxRef}
          className="absolute left-0 top-0 transition-opacity duration-700 will-change-transform"
          style={{ width: SIZE, height: SIZE, opacity: globeOn ? 1 : 0 }}
        >
          <canvas ref={canvasRef} style={{ width: SIZE, height: SIZE }} />
        </div>
      </div>

      <BrainControls
        follow={follow}
        visible={visible}
        mode={mode}
        onToggleMode={() => {
          const next = mode === "field" ? "globe" : "field";
          setMode(next);
          setVisible(true);
          try {
            localStorage.setItem("bg-mode", next);
          } catch {}
        }}
        onToggleFollow={() => setFollow((f) => !f)}
        onToggleVisible={() => {
          setVisible((v) => !v);
          setFollow(false);
        }}
      />
    </>
  );
}
