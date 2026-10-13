export type SkillFilter = "ai" | "pm" | "all";
export type SkillPill = { label: string; tag: "ai" | "pm" };
export type SkillColumn = { title: string; pills: SkillPill[] };

export const SKILL_FILTERS: { id: SkillFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "Building" },
  { id: "pm", label: "Product & strategy" },
];

export const SKILL_COLUMNS: SkillColumn[] = [
  {
    title: "Industries",
    pills: [
      { label: "AI landscape / infra", tag: "ai" },
      { label: "Facilities / FM", tag: "pm" },
      { label: "PropTech / CRE", tag: "pm" },
      { label: "Sales enablement", tag: "ai" },
      { label: "Career tech", tag: "ai" },
    ],
  },
  {
    title: "Functional expertise",
    pills: [
      { label: "User journey workshops", tag: "pm" },
      { label: "LLM evaluation harnesses", tag: "ai" },
      { label: "Discovery → roadmap", tag: "pm" },
      { label: "LangGraph AI agents", tag: "ai" },
      { label: "Cost-to-serve", tag: "pm" },
      { label: "Human-in-the-loop", tag: "ai" },
      { label: "0-to-1 product", tag: "pm" },
      { label: "Compounding memory", tag: "ai" },
      { label: "Corporate strategy", tag: "pm" },
      { label: "Context & harness engineering", tag: "ai" },
      { label: "Build / buy / invest", tag: "pm" },
      { label: "OTel / Axiom", tag: "ai" },
      { label: "LangSmith", tag: "ai" },
      { label: "Postgres / SQL", tag: "ai" },
      { label: "Hot / warm / cold storage", tag: "ai" },
    ],
  },
  {
    title: "How I ship",
    pills: [
      { label: "Internal enablement", tag: "pm" },
      { label: "Obsidian Second Brain", tag: "ai" },
      { label: "Cross-functional", tag: "pm" },
      { label: "Cursor + Claude Code", tag: "ai" },
      { label: "Design-partner discovery", tag: "pm" },
      { label: "Preview + prod CI/CD", tag: "ai" },
      { label: "Pre-customer GTM", tag: "pm" },
    ],
  },
  {
    title: "Tech & tools",
    pills: [
      { label: "Next.js", tag: "ai" },
      { label: "Power Automate", tag: "pm" },
      { label: "Postgres", tag: "ai" },
      { label: "Pendo", tag: "pm" },
      { label: "Supabase", tag: "ai" },
      { label: "Copilot Studio", tag: "pm" },
      { label: "RLS", tag: "ai" },
      { label: "Monday.com", tag: "pm" },
      { label: "LangGraph + FastAPI", tag: "ai" },
      { label: "Inngest", tag: "ai" },
      { label: "n8n", tag: "ai" },
      { label: "Python", tag: "ai" },
      { label: "Render", tag: "ai" },
      { label: "Vercel", tag: "ai" },
      { label: "GitHub Actions", tag: "ai" },
      { label: "LangSmith", tag: "ai" },
      { label: "Axiom", tag: "ai" },
      { label: "OpenTelemetry", tag: "ai" },
      { label: "Karpathy LLM Wiki", tag: "ai" },
      { label: "Cloudflare R2", tag: "ai" },
    ],
  },
];
