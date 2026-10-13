import type { Project } from "./types";

export const PROJECTS: Project[] = [
  {
    index: "01",
    slug: "joey",
    group: "product",
    title: "Joey",
    shortTitle: "Joey",
    subtitle: "Custom Resume Generator",
    tag: "AGENTIC SYSTEMS · CAREER VAULT",
    link: { label: "growwithjoey.com", href: "https://growwithjoey.com" },
    summary:
      "In today's job market, you need a custom-tailored resume just to even have a chance. I kept hearing the same pain from so many friends that relying on AI chatbots, or even something like Claude Cowork, just doesn't cut it. They don't learn your language, they don't get better over time, and they constantly hallucinate. Friends were spending more time babysitting the AI and editing its lies than if they had just written it themselves.\nTo fix this, I built Joey. A self-learning AI career engine that orchestrates a 7-agent adversarial LangGraph pipeline to generate hyper-tailored resumes without hallucinations, powered by a compounding memory system that adapts to your unique writing style over time.\n\nInstead of relying on a single AI prompt, I have challenger and defender agents literally debating each other to fact-check claims and kill hallucinations before you ever see the output. I also integrated LangSmith so we can actually understand and measure agent performance. To keep the AI from hallucinating logic, I built a Shared Tool Registry—the agents are bound to deterministic Python scripts they can call to scrape job descriptions with Firecrawl, execute exact KNN vector searches against a Postgres database, and securely decrypt PII during document export.\n\nBut the coolest part is the Compounding Memory System. In the background, Joey's memory agents analyze your edits and feedback to build specific writing 'skills' tailored to different job titles, company sizes, and industries (e.g., a Staff PM at a Growth-Stage FinTech). When you apply for a job that fits those criteria, the system's writing agents automatically retrieve and use those exact skills via a HyDE (Hypothetical Document Embeddings) RAG model. These skills are constantly refined every time you provide feedback or make an edit, meaning Joey learns your unique voice over time. The product uses some of the best agentic memory practices so that you aren't constantly context seeding. Coupled with a 'Labor Illusion' UI that shows you the agents' thought processes in real-time, it's an engine built from the ground up to actually learn your career narrative and never lie.",
    specs: [
      {
        heading: "Multi-Agent Orchestration",
        items: [
          { title: "7-Agent Adversarial Pipeline", sub: "LangGraph Debate Engine" },
          { title: "Agentic Observability", sub: "LangSmith Reasoning Measurement" },
        ],
      },
      {
        heading: "Compounding Memory System",
        items: [
          { title: "HyDE RAG Retrieval", sub: "Contextual Search via pgvector" },
          { title: "Dynamic Baseline Profiles", sub: "Background Learning & Refinement" },
        ],
      },
      {
        heading: "The User Experience",
        items: [
          { title: "Labor Illusion UI", sub: "Supabase Realtime Transparency" },
          { title: "Shared Tool Registry", sub: "Deterministic Script Calling" },
        ],
      },
    ],
    slides: [
      { caption: "invite-only landing page", image: "/joey-7.png" },
      { caption: "the whole pipeline; seven specialists", image: "/joey-8.png" },
      { caption: "dashboard & ready-to-review drafts", image: "/joey-9.png" },
      { caption: "tailoring studio block editor", image: "/joey-10.png" },
      { caption: "my experience career vault", image: "/joey-11.png" },
      { caption: "Compounding Memory Architecture", image: "/joey-3.png" },
      { caption: "Google Stitch Design Artifacts", image: "/joey-4.png" },
      { caption: "Joey Design Theme & Design.md Artifact", image: "/joey-5.png" },
      { caption: "Information Architecture Planning", image: "/joey-6.png" },
      { caption: "7-agent Adversarial Pipeline [Part 1]", image: "/joey-1.png" },
      { caption: "7-agent Adversarial Pipeline [Part 2]", image: "/joey-2.png" },
    ],
  },
  {
    index: "02",
    slug: "playi",
    group: "product",
    title: "Playi",
    shortTitle: "Playi",
    subtitle: "Adaptive Sales Playbook for Sales Teams",
    tag: "SALES ENABLEMENT · 0 to 1",
    link: { label: "playihq.com", href: "https://playihq.com" },
    summary:
      "A self-evolving sales coaching platform built with Next.js and Supabase that grades transcripts against custom rubrics using a multi-agent pipeline, flags rule-breaking wins, and programmatically generates schema-validated playbook evolutions.\n\nBuilt over 7+ months as a solo founder project, the real complexity lives in the closed feedback loop the platform creates. Every graded call feeds a \"maverick\" detection layer that surfaces wins where reps broke the playbook and still closed deals. Each maverick is analyzed by complex context-seeking LLM APIs to distinguish replicable techniques from deal-specific context, then verified by the manager. The manager verification stage is crucial; it provides a human-in-the-loop verification gate but also allows managers to add commentary on why they are or aren't verifying a call. The manager commentary is then stored and used to power the self-learning maverick detection engine so that over time, the detections are more aligned with what the manager wants. Once enough verified mavericks accumulate, a correlation engine cross-references bypass frequency against historical coaching session records, and when a criterion has been coached repeatedly but top performers keep skipping it in winning calls, the system classifies it as terminally flawed and flags it for removal in the next evolution proposal. That proposal renders as a side-by-side rubric comparison with per-change rationale and evidence strength, with the pre-computed frequency analysis injected as structured context. The result is a methodology that updates itself from the team's own winning patterns, and a system that can tell a manager not just that their reps aren't following the script, but that the script is wrong.",
    specs: [
      {
        heading: "Core Platform",
        items: [
          { title: "Next.js 14", sub: "App Router & Vercel" },
          { title: "Upstash Redis", sub: "3-Tier Rate Limiting" },
        ],
      },
      {
        heading: "Data & Security",
        items: [
          { title: "Supabase", sub: "Postgres / RLS / Auth" },
          { title: "Zod", sub: "Type-Safe Schema Val" },
          { title: "Mammoth", sub: "DOCX Text Extraction" },
        ],
      },
      {
        heading: "Agentic AI & Utils",
        items: [
          { title: "n8n Workflows", sub: "AI Grading Pipelines" },
          { title: "Resend", sub: "Transactional Emails" },
        ],
      },
    ],
    metrics: [
      { v: "15+", l: "design partners" },
      { v: "40%", l: "token usage cut" },
    ],
    slides: [
      { caption: "winning sales techniques", image: "/playi-1.png" },
      { caption: "coaching module", image: "/playi-2.png" },
      { caption: "maverick detection analysis", image: "/playi-3.png" },
      { caption: "playbook evolution engine", image: "/playi-4.png" },
      { caption: "team performance", image: "/playi-5.png" },
      { caption: "detailed call report", image: "/playi-6.png" },
      { caption: "user management portal", image: "/playi-7.png" },
      { caption: "transcript grading workflow", image: "/playi-8.png" },
      { caption: "playbook rubric generator workflow", image: "/playi-9.png" },
    ],
  },
  {
    index: "03",
    slug: "second-brain",
    group: "automation",
    title: "AI Second Brain",
    shortTitle: "AI Second Brain",
    subtitle: "Compounding LLM Wiki & Context Engine",
    tag: "KNOWLEDGE GRAPHS · MARKDOWN & AGENTS",
    summary:
      "My second brain is one context engine for everything I work on: the AI landscape, my full career history, the books I've read and the notes I've made, and the specs and implementation plans for everything I build. It follows Andrej Karpathy's LLM wiki approach in Obsidian, so it all lives as linked markdown any model can read, with indexes that let an agent pull only what it needs.\n\nThe point is that I never have to seed context again. Whichever harness has the leading model that week, I point it at the vault and it already knows my work, my writing and my products.\n\nIt started as two separate systems. The AI Intelligence wiki ingests raw market signals (web clips, podcasts, newsletters), classifies them, and keeps a queryable map of frontier models, technologies and startups. The Career Expansion vault ran a 6-agent resume pipeline and a 5-agent Q&A compiler with an advocate-critic loop and a cold factual audit, and it became the blueprint for Joey. Now they share one vault, and the links between them are where the value is: 66 links tie my AI research to Joey's build docs. That's how I learned how Sierra built its compounding memory system and brought the same idea into Joey.",
    specs: [
      { heading: "01 / Ingest", text: "Web clips, podcasts, newsletters and build transcripts compiled into markdown every night" },
      { heading: "02 / Connect", text: "Classified into one linked wiki: AI landscape, career history, books and notes, product specs and plans" },
      { heading: "03 / Serve", text: "Indexes built for progressive disclosure, so any harness pulls only the context it needs" },
    ],
    metrics: [
      { v: "66", l: "links between AI research and Joey build docs" },
      { v: "5,100+", l: "notes in one vault" },
    ],
    slides: [
      { caption: "relationship graph overview", image: "/market-intelligence-1.png" },
      { caption: "HTML Dashboard - Frontier Models", image: "/market-intelligence-2.png" },
      { caption: "HTML Dashboard - Frontier Model Product Stack", image: "/market-intelligence-3.png" },
      { caption: "HTML Dashboard - AI Technology Layers", image: "/market-intelligence-4.png" },
      { caption: "Obsidian Artifact Inventory", image: "/market-intelligence-5.png" },
      { caption: "Obsidian Second Brain Index", image: "/market-intelligence-6.png" },
      { caption: "career vault relationship graph", image: "/career-engine-1.png" },
      { caption: "multi-agent resume workflow", image: "/career-engine-2.png" },
      { caption: "multi-agent resume workflow", image: "/career-engine-3.png" },
      { caption: "compounding memory and self-improvement", image: "/career-engine-4.png" },
    ],
  },
  {
    index: "04",
    slug: "cycling-coach",
    group: "automation",
    title: "Antigravity Cycling Coach",
    shortTitle: "Cycling Coach",
    subtitle: "Live Dashboards & Professional AI Coaching",
    tag: "PERSONAL AI · ENDURANCE PERFORMANCE",
    summary:
      "An elite-level training intelligence engine built on Next.js that processes raw sensor streams (power, heart rate, cadence) directly from the Strava API. The system performs advanced mathematical modeling, including cardiac drift (aerobic decoupling), Normalized Power (NP), and a dynamic CTL/ATL fatigue decay model, to compute performance metrics far beyond Strava's out-of-the-box analytics.\nUsing daily scheduled workflows (GitHub Actions scripts and Antigravity agentic scheduled tasks), an autonomous Antigravity AI Agent processes these metrics along with my subjective training feedback in Airtable to self-correct, adapt training plans, and write morning coaching digests.\n\nBuilt as a fully custom, self-improving training engine, the real complexity lives in the automated closed feedback loop. Raw data is server-side rendered directly from Airtable, ensuring the dashboard is always hydrated with live metrics. Every activity logged on Strava triggers a scheduled GitHub Actions workflow that streams raw sensor data into our Python math engine. Here, we run decay calculations to track CTL (Fitness), ATL (Fatigue), and TSB (Form), along with cardiac drift (Pa:HR) metrics to flag aerobic decoupling. Every morning, an autonomous Antigravity AI Agent runs an analysis on the updated metrics, cross-references my subjective recovery notes and IT-band pain logs in Airtable, and writes back detailed coaching narratives. These narratives actively shape future workout intensities, closing the loop from raw biometrics to physical adaptations.",
    specs: [
      {
        heading: "Core Platform",
        items: [
          { title: "Next.js 16", sub: "SSR App Router & Vercel" },
          { title: "Airtable API", sub: "Live Data Revalidation" },
        ],
      },
      {
        heading: "Data & Biometrics",
        items: [
          { title: "Strava API", sub: "Raw Stream Ingestion" },
          { title: "Python Engine", sub: "NP, TSS, Cardiac Drift, & CTL/ATL/TSB" },
        ],
      },
      {
        heading: "Agentic AI & Crons",
        items: [
          { title: "Antigravity SDK", sub: "Morning Coaching Narratives" },
          { title: "GitHub Actions", sub: "Daily/Weekly Scheduled Workflows" },
        ],
      },
    ],
    stats: [
      { heading: "Rides", value: "140 rides", label: "Rides YTD, after a 4-month ITB injury" },
      { heading: "Lifts", value: "142 lifts", label: "Strength sessions YTD" },
      { heading: "Total training", value: "416 hours", label: "Total training YTD, live from Airtable" },
      { heading: "Training target", value: "350 watts", label: "FTP target. 8 Coggan power zones. Zero guesswork." },
    ],
    slides: [
      { caption: "Cycling Coach Dashboard", image: "/strava-1.png" },
      { caption: "Cycling Coach Dashboard", image: "/strava-2.png" },
      { caption: "Cycling Coach Dashboard", image: "/strava-3.png" },
      { caption: "Cycling Coach Dashboard", image: "/strava-4.png" },
      { caption: "individual ride analysis", image: "/strava-5.png" },
      { caption: "HR to Power decoupling analysis", image: "/strava-6.png" },
    ],
  },
  {
    index: "05",
    slug: "automation-engine",
    group: "automation",
    title: "Harness-Agnostic Automation Engine",
    shortTitle: "Automation Engine",
    subtitle: "Because I don't want to be locked in to one AI lab",
    tag: "CI/CD & AUTOMATION · HARNESS-AGNOSTIC",
    summary:
      "Nine scheduled GitHub Actions keep my second brain clean, current and well linked, and keep Joey's model choices from going stale. They live in GitHub and plain Python, not inside any one harness's automation feature, because I don't want to be locked in to one AI lab.\n\nThe rule is deterministic first. Python does the routine work: scanning inboxes, fixing frontmatter and broken links, rebuilding indexes, and checking that key docs haven't gone stale. A single call to a small, cheap model only happens where judgement is needed, like classifying the day's AI news or turning build transcripts into spec updates. Jobs exit early when there's nothing new, so most runs cost nothing and the whole system runs on about $0.50 a month in LLM costs.\n\nEvery change lands as a pull request. A rules-based merger with a branch allowlist, path fences and its own tests decides what merges, so PRs from different agents and harnesses all go through the same gate. The newest job, Model watch, scans seven AI labs every Monday for new models, price changes and retirements, and proposes updates to Joey's model registry in one standing PR that I review and merge by hand.",
    specs: [
      {
        heading: "Deterministic first",
        items: [
          { title: "Python scripts", sub: "Indexes, links, freshness checks" },
          { title: "Early exits", sub: "No new input, no model call" },
        ],
      },
      {
        heading: "Cheap judgement",
        items: [
          { title: "One small-model call", sub: "Classify, summarize, update specs" },
          { title: "Model watch", sub: "7 AI labs scanned weekly" },
        ],
      },
      {
        heading: "Every change is a PR",
        items: [
          { title: "Rules-based merger", sub: "Branch allowlist + path fences" },
          { title: "Human gate", sub: "Model changes merged by hand" },
        ],
      },
    ],
    metrics: [
      { v: "~$0.50", l: "a month in LLM costs" },
      { v: "9", l: "scheduled jobs" },
      { v: "7", l: "AI labs watched" },
    ],
    slides: [
      { caption: "my github commit metrics snapshot", image: "/github-1.png" },
      { caption: "my active repos", image: "/github-2.png" },
      { caption: "github actions automated crons", image: "/github-3.png" },
    ],
  },
];

export const PRODUCTS = PROJECTS.filter((p) => p.group === "product");
export const AUTOMATIONS = PROJECTS.filter((p) => p.group === "automation");
