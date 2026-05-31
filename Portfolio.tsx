"use client";

/* ────────────────────────────────────────────────────────────────────────
 * Portfolio.tsx — drop-in Next.js (App Router) client component.
 *
 * SETUP (one time):
 * 1) Fonts — in app/layout.tsx:
 *      import { Newsreader, Instrument_Sans, JetBrains_Mono } from "next/font/google";
 *      const serif = Newsreader({ subsets:["latin"], variable:"--font-serif" });
 *      const sans  = Instrument_Sans({ subsets:["latin"], variable:"--font-sans" });
 *      const mono  = JetBrains_Mono({ subsets:["latin"], variable:"--font-mono" });
 *      <body className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
 *
 * 2) Tokens — paste into globals.css (Radix Sand as the warm gray, Radix Orange):
 *      :root{
 *        --gray-1:#fdfdfc; --gray-2:#f9f9f8; --gray-3:#f1f0ef; --gray-4:#e9e8e6;
 *        --gray-5:#e2e1de; --gray-6:#dad9d6; --gray-7:#cfceca; --gray-8:#bcbbb5;
 *        --gray-9:#8d8d86; --gray-10:#82827c; --gray-11:#63635e; --gray-12:#21201c;
 *        --orange-3:#ffefd6; --orange-9:#f76b15; --orange-10:#ef5f00;
 *        --accent:var(--orange-9);
 *        --accent-strong:color-mix(in oklab, var(--accent), black 16%);
 *        --accent-soft:color-mix(in oklab, var(--accent), white 87%);
 *        --card-radius:26px;
 *        --card-shadow:0 1px 2px rgba(40,33,28,.04), 0 16px 36px -14px rgba(40,33,28,.12);
 *        --float-shadow:0 2px 4px rgba(40,33,28,.04), 0 42px 90px -30px rgba(40,33,28,.18);
 *      }
 *      body{ background:var(--gray-1); color:var(--gray-12); font-family:var(--font-sans); }
 *      body::before{ content:""; position:fixed; inset:0; z-index:0; pointer-events:none;
 *        background-image:radial-gradient(rgba(99,99,94,.13) 1.1px, transparent 1.1px);
 *        background-size:22px 22px;
 *        -webkit-mask-image:radial-gradient(125% 115% at 50% 38%, transparent 30%, #000 100%); }
 * ──────────────────────────────────────────────────────────────────────── */

import { useState, useEffect } from "react";
// import Image from "next/image"; // ← swap PlaceholderFrame's <div> for <Image> when ready

/* ── Types ──────────────────────────────────────────────────────────────── */
type Metric = { v: string; l: string };
type Slide = string | { caption: string; image: string };
type Project = {
  index: string;
  title: string;
  subtitle: string;
  tag: string;
  summary: string;
  metrics: Metric[];
  slides: Slide[];
};
type AboutRow = { label: string; value: string };

/* ── Content (map your own data here) ─────────────────────────────────────── */
const PROFILE = {
  eyebrow: (
    <span>
      PRODUCT MANAGER · MEDIOCRE CYCLIST ·<br className="sm:hidden" /> BUILDING WITH AI
    </span>
  ),
  name: "Michael Hoefert",
  role: "My Personal Portfolio!",
  intro: (
    <div className="flex flex-col gap-4">
      <p>
        I'm a product manager that loves to spend time understanding my customers (<i>note: the best book I've read on product is User Story Mapping by Jeff Patton</i>) and building products that customers actually like to use.
      </p>
      <p>
        Outside of my day job I get obsessed playing around with new technologies and building things. My current obsession is building out my Second Brain in Obsidian using Andrej Karpathy's model.
      </p>
    </div>
  ),
  availability: "Open to new problems",
};

const ABOUT: AboutRow[] = [
  { label: "FOCUS", value: "Agentic AI · B2B SaaS · 0→1 product" },
  { label: "APPROACH", value: "Systems thinking, sharp data, close design partnership" },
  { label: "LATELY", value: "Cycling analytics & second-brain tooling" },
  { label: "SAY HI", value: "hello@michaelhoefert.com" },
];

const PROJECTS: Project[] = [
  {
    index: "01",
    title: "Playi",
    subtitle: "B2B Adaptive Sales Playbook",
    tag: "SALES ENABLEMENT · 0 to 1",
    summary:
      "A self-evolving sales coaching platform built with Next.js and Supabase that grades transcripts against custom rubrics using a multi-agent Gemini pipeline, flags rule-breaking wins, and programmatically generates schema-validated playbook evolutions.\n\nBuilt over 7+ months as a solo founder project, the real complexity lives in the closed feedback loop the platform creates. Every graded call feeds a \"maverick\" detection layer that surfaces wins where reps broke the playbook and still closed deals. Each maverick is analyzed by complex context-seeking LLM APIs to distinguish replicable techniques from deal-specific context, then verified by the manager. The manager verification stage is crucial; it provides a human-in-the-loop verification gate but also allows managers to add commentary on why or why they are not verifying a call. The manager commentary is then stored and used to power the self-learning maverick detection engine so that over time, the detections are more aligned with what the manager wants. Once enough verified mavericks accumulate, a correlation engine cross-references bypass frequency against historical coaching session records, and when a criterion has been coached repeatedly but top performers keep skipping it in winning calls, the system classifies it as terminally flawed and flags it for removal in the next evolution proposal. That proposal renders as a side-by-side rubric comparison with per-change rationale and evidence strength, with the pre-computed frequency analysis injected as structured context. The result is a methodology that updates itself from the team's own winning patterns, and a system that can tell a manager not just that their reps aren't following the script, but that the script is wrong.",
    metrics: [
      { v: "+31%", l: "mid-market win rate" },
      { v: "90→38d", l: "new-rep ramp" },
      { v: "5", l: "design partners" },
    ],
    slides: [
      { caption: "winning sales techniques", image: "/playi-1.png" },
      { caption: "coaching module", image: "/playi-2.png" },
      { caption: "maverick detection analysis", image: "/playi-3.png" },
      { caption: "playbook evolution engine", image: "/playi-4.png" },
      { caption: "team performance", image: "/playi-5.png" },
      { caption: "detailed call report", image: "/playi-6.png" },
      { caption: "user management portal", image: "/playi-7.png" },
      { caption: "transcript grading interface", image: "/playi-8.png" },
      { caption: "playbook analysis details", image: "/playi-9.png" },
    ],
  },
  {
    index: "02",
    title: "AI Intelligence Second Brain",
    subtitle: "Compounding LLM Wiki",
    tag: "KNOWLEDGE GRAPHS — MARKDOWN & AGENTS",
    summary:
      "An automated, agent-assisted, compounding knowledge engine built on Obsidian and LLMs that ingests raw market signals, filters them through a multi-stage classification pipeline, and maintains a clean, queryable database of the rapidly shifting artificial intelligence landscape.",
    metrics: [
      { v: "4.2k+", l: "warm intros surfaced" },
      { v: "+22%", l: "network-sourced pipeline" },
      { v: "<200ms", l: "graph query" },
    ],
    slides: [
      { caption: "relationship graph overview", image: "/market-intelligence-1.png" },
      { caption: "automated signal ingestion", image: "/market-intelligence-2.png" },
      { caption: "entity extraction pipeline", image: "/market-intelligence-3.png" },
      { caption: "compounding intelligence wiki", image: "/market-intelligence-4.png" },
      { caption: "frontier technology mapping", image: "/market-intelligence-5.png" },
      { caption: "queryable graph database", image: "/market-intelligence-6.png" },
    ],
  },
  {
    index: "03",
    title: "Career Expansion Second Brain",
    subtitle: "Self-Learning Application Compiler & Vault",
    tag: "AGENTIC SYSTEMS · MULTI-AGENT SYNTHESIS",
    summary:
      "A compounding, self-learning application engine that orchestrates a 6-agent resume pipeline and a 5-agent Q&A essay compiler. The system ingests target job descriptions to map core competencies, runs a dynamic advocate-critic positioning loop that pre-vets all resume and Q&A drafts against a corporate jargon veto list, and runs a cold factual audit before exporting perfectly styled, single-page print assets.",
    metrics: [
      { v: "60%", l: "recurring work automated" },
      { v: "~11h", l: "reclaimed / week" },
      { v: "3", l: "agents in concert" },
    ],
    slides: [
      { caption: "agentic workspace console", image: "/career-engine-1.png" },
      { caption: "advocate-critic debate loop", image: "/career-engine-2.png" },
      { caption: "factual audit report", image: "/career-engine-3.png" },
      { caption: "design-spec artifact export", image: "/career-engine-4.png" },
    ],
  },
  {
    index: "04",
    title: "Claude the Cycling Coach",
    subtitle: "Live Dashboards & Professional Coaching",
    tag: "CONSUMER AI · DATA",
    summary:
      "A self-updating training intelligence system wired directly to Strava reading every session I log and turns it into actual coaching. It includes per-second power streams, zone compliance, and aerobic decoupling to generate structured coaching, progressive periodization blocks, and PPL-integrated fatigue management. Refreshed nightly via a scheduled Claude digest.",
    metrics: [
      { v: "93 rides + 50 lifts", l: "actual YTD count (70 real outdoor rides + 23 Zwift sessions)" },
      { v: "240+ hours", l: "calculated volume (Farewell Ride to The Hague: 15.5h)" },
      { v: "350 watts", l: "One target. 8 protocols. Zero guesswork." },
    ],
    slides: [
      { caption: "live ride dashboard", image: "/strava-1.png" },
      { caption: "power & HR zones", image: "/strava-2.png" },
      { caption: "coaching chat", image: "/strava-3.png" },
    ],
  },
];

/* ── Primitives ───────────────────────────────────────────────────────────── */
function Chevron({ dir = "right" }: { dir?: "left" | "right" }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "left" ? "M14.5 6l-6 6 6 6" : "M9.5 6l6 6-6 6"} />
    </svg>
  );
}

function PlaceholderFrame({
  caption,
  image,
  active,
  isAbsolute = true,
}: {
  caption: string;
  image?: string;
  active: boolean;
  isAbsolute?: boolean;
}) {
  return (
    <div
      className={`${isAbsolute ? "absolute inset-0 w-full h-full" : "relative w-full h-auto"} transition-opacity duration-500 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
      style={{
        backgroundColor: "var(--gray-2)",
        backgroundImage: !image ? "repeating-linear-gradient(135deg, var(--gray-2) 0 13px, var(--gray-3) 13px 26px)" : "none",
      }}
    >
      {image && (
        <img src={image} alt={caption} className="w-full h-auto block bg-white" />
      )}
      {!image && (
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 100% 0%, var(--accent-soft) 0%, transparent 55%)" }} />
      )}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="flex items-center gap-2 rounded-full border bg-white/85 px-4 py-2 shadow-sm backdrop-blur-sm" style={{ borderColor: "var(--gray-4)" }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
          <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--gray-10)]">{caption}</span>
        </div>
      </div>
    </div>
  );
}

function Carousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const n = slides.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);
  const hasImages = slides.some((s) => typeof s !== "string" && s.image);

  const activeSlide = slides[i];
  const activeCaption = typeof activeSlide === "string" ? activeSlide : activeSlide.caption;
  const activeImage = typeof activeSlide === "string" ? undefined : activeSlide.image;

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-[calc(var(--card-radius)-8px)] border"
        style={{
          aspectRatio: hasImages ? undefined : "4 / 3",
          borderColor: "var(--gray-4)",
        }}
      >
        {slides.map((s, idx) => {
          const caption = typeof s === "string" ? s : s.caption;
          const image = typeof s === "string" ? undefined : s.image;
          const active = idx === i;
          return (
            <PlaceholderFrame
              key={idx}
              caption={caption}
              image={image}
              active={active}
              isAbsolute={!active || !hasImages}
            />
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-[var(--font-mono)] text-[11px] tracking-[0.12em] text-[var(--gray-10)]">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <div className="hidden sm:flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button key={idx} aria-label={`View frame ${idx + 1}`} onClick={() => setI(idx)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: idx === i ? 20 : 6, background: idx === i ? "var(--accent)" : "var(--gray-6)" }} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeImage && (
            <button aria-label="Expand image" onClick={() => setIsExpanded(true)}
              className="grid h-9 w-9 place-items-center rounded-full border bg-white text-[var(--gray-11)] transition-colors hover:text-[var(--accent-strong)]"
              style={{ borderColor: "var(--gray-4)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          )}
          {(["left", "right"] as const).map((dir) => (
            <button key={dir} aria-label={dir === "left" ? "Previous" : "Next"} onClick={() => go(dir === "left" ? -1 : 1)}
              className="grid h-9 w-9 place-items-center rounded-full border bg-white text-[var(--gray-11)] transition-colors hover:text-[var(--accent-strong)]"
              style={{ borderColor: "var(--gray-4)" }}>
              <Chevron dir={dir} />
            </button>
          ))}
        </div>
      </div>

      {isExpanded && activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-all duration-300"
          onClick={() => setIsExpanded(false)}>
          <button onClick={() => setIsExpanded(false)} aria-label="Close view"
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="relative max-h-[92vh] max-w-[96vw] overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <img src={activeImage} alt={activeCaption} className="max-h-[92vh] max-w-[96vw] object-contain rounded-2xl" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-4 py-2 backdrop-blur-md">
              <span className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-white/90">{activeCaption}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Components ───────────────────────────────────────────────────────────── */
function ProjectDescription({ p }: { p: Project }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const paragraphs = p.summary.split("\n\n");
  const firstParagraph = paragraphs[0];
  const remainingParagraphs = paragraphs.slice(1);
  const hasMore = remainingParagraphs.length > 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 w-full min-w-0">
        <span className="font-[var(--font-mono)] text-[13px] text-[var(--accent-strong)] shrink-0">{p.index}</span>
        <span className="h-px w-6 shrink-0" style={{ background: "var(--gray-6)" }} />
        <span className="font-[var(--font-mono)] text-[10px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.16em] text-[var(--gray-10)] break-words whitespace-normal flex-1 min-w-0">{p.tag}</span>
      </div>
      <h3 className="mt-5 font-[var(--font-serif)] text-4xl leading-[1.04] tracking-[-0.01em] text-[var(--gray-12)] md:text-[2.7rem]">{p.title}</h3>
      {p.index === "01" && (
        <div className="mt-1">
          <a
            href="https://playihq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[var(--font-mono)] text-[12px] lowercase tracking-normal text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors inline-flex items-center gap-1.5"
          >
            playihq.com
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      )}
      <p className="mt-2 font-[var(--font-serif)] text-xl italic text-[var(--gray-10)]">{p.subtitle}</p>
      
      {/* First Paragraph */}
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">
        {firstParagraph}
      </p>

      {/* Expandable Section */}
      {hasMore && (
        <div className="mt-4 flex flex-col items-start w-full max-w-md">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors inline-flex items-center gap-1.5 focus:outline-none"
          >
            <span>{isExpanded ? "Collapse details" : "Expand for more details..."}</span>
            <svg
              className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          <div
            className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? "max-h-[220px] mt-3 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <div 
              className="max-h-[190px] overflow-y-auto pr-2 custom-scrollbar text-[14px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty] flex flex-col gap-4 border-l-2 pl-3"
              style={{ 
                borderColor: "var(--accent-soft)",
              }}
            >
              {remainingParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}
      {p.index === "01" ? (
        <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 md:gap-x-10 border-t pt-6" style={{ borderColor: "var(--gray-4)" }}>
          {/* Core Platform */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">Core Platform</h4>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">Next.js 14</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">App Router & Vercel</span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">Upstash Redis</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">3-Tier Rate Limiting</span>
            </div>
          </div>
          {/* Data & Security */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">Data & Security</h4>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">Supabase</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">Postgres / RLS / Auth</span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">Zod</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">Type-Safe Schema Val</span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">Mammoth</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">DOCX Text Extraction</span>
            </div>
          </div>
          {/* Agentic AI & Utils */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">Agentic AI & Utils</h4>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">n8n Workflows</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">AI Grading Pipelines</span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">Resend</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">Transactional Emails</span>
            </div>
          </div>
        </div>
      ) : p.index === "02" ? (
        <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 md:gap-x-10 border-t pt-6" style={{ borderColor: "var(--gray-4)" }}>
          {/* Phase 1: Ingest */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">01 / Ingest</h4>
            <p className="mt-3.5 font-[var(--font-sans)] text-[13.5px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">
              Automated markdown compiling of raw clips, podcasts, & RSS
            </p>
          </div>
          {/* Phase 2: Synthesis */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">02 / Synthesis</h4>
            <p className="mt-3.5 font-[var(--font-sans)] text-[13.5px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">
              Agentic semantic indexing that classifies frontier companies, tech stacks, & startup trackers
            </p>
          </div>
          {/* Phase 3: Presentation */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">03 / Presentation</h4>
            <p className="mt-3.5 font-[var(--font-sans)] text-[13.5px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">
              Self-contained HTML dashboard rendering live Dataview queries
            </p>
          </div>
        </div>
      ) : p.index === "03" ? (
        <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 md:gap-x-10 border-t pt-6" style={{ borderColor: "var(--gray-4)" }}>
          {/* Core Compilers */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">Core Compilers</h4>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">6-Agent Resume Compiler</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">Adversarial Debate Engine</span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">5-Agent Essay Writer</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">Tailored Narrative Compiler</span>
            </div>
          </div>
          {/* Memory & Truth */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">Memory & Truth</h4>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">Compounding Memory</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">Always-Improving Run-Logs</span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">Factual Auditor</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">0% Fabrication Risk Audit</span>
            </div>
          </div>
          {/* Platform & Format */}
          <div className="flex flex-col">
            <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">Platform & Format</h4>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">Obsidian Workspace</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">Indexed Relational Vault</span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">Visual CSS Engine</span>
              <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">Design-Spec Artifact Export</span>
            </div>
          </div>
        </div>
      ) : p.index === "04" ? (
        <div className="mt-8 flex flex-col">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 md:gap-x-10 border-t pt-6" style={{ borderColor: "var(--gray-4)" }}>
            {/* YTD Count */}
            <div className="flex flex-col">
              <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">YTD Count</h4>
              <div className="mt-4 flex flex-col gap-0.5">
                <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">93 rides + 50 lifts</span>
                <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">70 real outdoor rides + 23 Zwift sessions</span>
              </div>
            </div>
            {/* Total Volume */}
            <div className="flex flex-col">
              <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">Total Volume</h4>
              <div className="mt-4 flex flex-col gap-0.5">
                <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">240+ hours</span>
                <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">Calculated from full activity list (incl. 15.5h Farewell to The Hague)</span>
              </div>
            </div>
            {/* Training Target */}
            <div className="flex flex-col">
              <h4 className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent-strong)] font-semibold">Training Target</h4>
              <div className="mt-4 flex flex-col gap-0.5">
                <span className="font-[var(--font-serif)] text-[17px] font-medium text-[var(--gray-12)] leading-snug">350 watts</span>
                <span className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.06em] text-[var(--gray-10)] leading-none">One target. 8 protocols. Zero guesswork.</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1.5 font-[var(--font-serif)] text-[12.5px] italic text-[var(--accent)] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] pulse-dot" />
            Updated with Live Strava Data: May 30
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t pt-6" style={{ borderColor: "var(--gray-4)" }}>
          {p.metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="font-[var(--font-serif)] text-2xl text-[var(--gray-12)]">{m.v}</span>
              <span className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.12em] text-[var(--gray-10)]">{m.l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectTile({ p, reversed }: { p: Project; reversed: boolean }) {
  return (
    <section id={`project-${p.index}`} className="scroll-mt-28">
      <article className="rounded-[var(--card-radius)] border bg-white p-6 sm:p-8 lg:p-12"
        style={{ borderColor: "var(--gray-4)", boxShadow: "var(--float-shadow)" }}>
        <div className="grid items-center gap-9 lg:grid-cols-2 lg:gap-16 w-full min-w-0">
          <div className={`${reversed ? "lg:order-2" : "lg:order-1"} w-full min-w-0`}><Carousel slides={p.slides} /></div>
          <div className={`${reversed ? "lg:order-1" : "lg:order-2"} w-full min-w-0`}><ProjectDescription p={p} /></div>
        </div>
      </article>
    </section>
  );
}

function ProfilePhoto() {
  const photos = [
    { src: "/headshot.png", alt: "Michael Hoefert Headshot" },
    { src: "/biking.jpg", alt: "Michael Hoefert Biking" }
  ];
  const [idx, setIdx] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((p) => (p + 1) % photos.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((p) => (p - 1 + photos.length) % photos.length);
  };

  return (
    <div 
      className="w-[155px] h-[190px] shrink-0 rounded-[22px] overflow-hidden border bg-[var(--gray-2)] relative group/photo select-none"
      style={{ 
        borderColor: "var(--gray-4)",
        boxShadow: "var(--card-shadow)"
      }}
    >
      {/* Images container */}
      <div className="absolute inset-0 w-full h-full">
        {photos.map((p, i) => (
          <img
            key={p.src}
            src={p.src}
            alt={p.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${
              i === idx ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-105 pointer-events-none"
            }`}
          />
        ))}
      </div>

      {/* Subtle overlay gradient to make arrows highly legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/25 opacity-100 md:opacity-0 md:group-hover/photo:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* In-frame Left Arrow */}
      <button 
        onClick={prev}
        aria-label="Previous photo"
        className="absolute left-2.5 bottom-2.5 w-6 h-6 rounded-full bg-black/25 hover:bg-black/45 text-white/90 flex items-center justify-center shadow-sm transition-all duration-300 opacity-100 md:opacity-0 md:group-hover/photo:opacity-100 cursor-pointer border border-white/10 z-10"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      {/* In-frame Right Arrow */}
      <button 
        onClick={next}
        aria-label="Next photo"
        className="absolute right-2.5 bottom-2.5 w-6 h-6 rounded-full bg-black/25 hover:bg-black/45 text-white/90 flex items-center justify-center shadow-sm transition-all duration-300 opacity-100 md:opacity-0 md:group-hover/photo:opacity-100 cursor-pointer border border-white/10 z-10"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Indicator dots at the bottom */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 px-1.5 py-0.5 rounded-full bg-black/30 backdrop-blur-xs opacity-100 md:opacity-0 md:group-hover/photo:opacity-100 transition-opacity duration-300 select-none z-10">
        {photos.map((_, i) => (
          <span 
            key={i} 
            className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-3 bg-[var(--accent)]" : "w-1 bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function Portfolio() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="relative z-[1] min-h-screen w-full overflow-x-hidden">
      {/* Top section — 50/50 hero */}
      <header className="mx-auto flex min-h-screen max-w-[1240px] items-center px-6 py-20 md:px-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16 min-w-0">
          {/* Left: intro */}
          <div className="flex flex-col w-full min-w-0">
            <div className="inline-flex items-center gap-2 self-start rounded-full border bg-white px-3 py-1.5 shadow-sm" style={{ borderColor: "var(--gray-4)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
              <span className="whitespace-nowrap font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--gray-11)]">{PROFILE.availability}</span>
            </div>
            
            <div className="mt-8 flex flex-row items-center sm:items-stretch gap-4 sm:gap-6 md:gap-8">
              {/* Photo Card */}
              <ProfilePhoto />

              {/* Text Group */}
              <div className="flex flex-col min-w-0">
                <p className="font-[var(--font-mono)] text-[8px] sm:text-[11px] uppercase tracking-[0.05em] sm:tracking-[0.2em] text-[var(--gray-10)] break-words whitespace-normal w-full leading-relaxed">{PROFILE.eyebrow}</p>
                <h1 className="mt-1.5 font-[var(--font-serif)] text-[2.4rem] min-[380px]:text-[2.8rem] sm:text-[4.2rem] lg:text-[4.4rem] font-medium leading-[0.95] sm:leading-[0.98] tracking-[-0.02em] text-[var(--gray-12)] [text-wrap:balance]">{PROFILE.name}</h1>
                <p className="mt-1.5 font-[var(--font-serif)] text-xl sm:text-2xl italic text-[var(--gray-10)] leading-none">{PROFILE.role}</p>
              </div>
            </div>

            <div className="mt-8 max-w-md text-[16px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">{PROFILE.intro}</div>

            {/* Scroll Indicator */}
            <div className="mt-12 flex items-center gap-3 text-[9.5px] sm:text-[11px] font-[var(--font-mono)] uppercase tracking-[0.05em] sm:tracking-[0.16em] text-[var(--gray-10)] select-none">
              <span className="whitespace-nowrap">Scroll for selected work</span>
              <span className="h-px flex-1 sm:flex-none sm:w-36 bg-[var(--gray-5)]" />
              <span className="text-[var(--accent)] font-bold text-[13px] translate-y-[-1px] shrink-0">↓</span>
            </div>
          </div>

          {/* Right: floating contents card + more about me */}
          <aside className="rounded-[var(--card-radius)] border bg-white p-7 sm:p-9 w-full min-w-0" style={{ borderColor: "var(--gray-4)", boxShadow: "var(--float-shadow)" }}>
            <div className="flex items-baseline justify-between">
              <h2 className="whitespace-nowrap font-[var(--font-mono)] text-[12px] uppercase tracking-[0.18em] text-[var(--gray-11)]">Selected Work</h2>
              <span className="font-[var(--font-mono)] text-[12px] text-[var(--gray-9)]">({String(PROJECTS.length).padStart(2, "0")})</span>
            </div>
            <ul className="mt-5">
              {PROJECTS.map((p, idx) => {
                const active = hover === idx;
                return (
                  <li key={p.index} onMouseEnter={() => setHover(idx)} onMouseLeave={() => setHover(null)}
                    onClick={() => {
                      document.getElementById(`project-${p.index}`)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group relative border-t py-4 cursor-pointer" style={{ borderColor: "var(--gray-4)" }}>
                    <div className="flex items-baseline gap-4 transition-transform duration-300" style={{ transform: active ? "translateX(8px)" : "translateX(0)" }}>
                      <span className="font-[var(--font-mono)] text-[12px]" style={{ color: active ? "var(--accent-strong)" : "var(--gray-9)" }}>{p.index}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-[var(--font-serif)] text-[1.35rem] leading-tight text-[var(--gray-12)]">{p.title}</p>
                        <p className="mt-0.5 overflow-hidden font-[var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--gray-10)] transition-all duration-300"
                          style={{ maxHeight: active ? 20 : 0, opacity: active ? 1 : 0 }}>{p.subtitle}</p>
                      </div>
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full transition-all duration-300"
                        style={{ background: active ? "var(--accent)" : "var(--gray-5)", transform: active ? "scale(1.15)" : "scale(1)" }} />
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-7 rounded-[calc(var(--card-radius)-8px)] border p-6" style={{ borderColor: "var(--gray-4)", background: "var(--gray-2)" }}>
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--gray-10)]">More About Me</p>
              <dl className="mt-4 flex flex-col gap-3">
                {ABOUT.map((row, idx) => (
                  <div key={idx} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <dt className="w-[58px] shrink-0 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--gray-9)]">{row.label}</dt>
                    <dd className="text-[14px] leading-snug text-[var(--gray-11)]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </header>

      {/* Projects — alternating floating tiles */}
      <main className="mx-auto flex max-w-[1240px] flex-col gap-20 px-6 pb-24 md:gap-28 md:px-10">
        {PROJECTS.map((p, idx) => <ProjectTile key={p.index} p={p} reversed={idx % 2 === 1} />)}
      </main>

      <footer className="mx-auto max-w-[1240px] px-6 pb-16 pt-4 md:px-10">
        <div className="flex flex-col items-center gap-3 border-t pt-10 text-center" style={{ borderColor: "var(--gray-4)" }}>
          <p className="font-[var(--font-serif)] text-xl text-[var(--gray-12)]">{PROFILE.name}</p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://www.linkedin.com/in/michael-hoefert/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--gray-9)] hover:text-[var(--accent)] transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="mailto:mhoefert1@gmail.com"
              className="text-[var(--gray-9)] hover:text-[var(--accent)] transition-colors duration-300"
              aria-label="Email"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
          <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--gray-9)] mt-1">One page · contact · by design</p>
        </div>
      </footer>
    </div>
  );
}
