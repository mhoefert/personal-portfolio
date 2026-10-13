import type { Role } from "./types";

/* Public-site versions of the career history. Kept off on purpose: the acquired
 * product's name, the ARR growth figure, and internal screenshots. */
export const EXPERIENCE: Role[] = [
  {
    company: "Mitie",
    title: "Product Manager",
    place: "London",
    dates: "Jan 2024 to present",
    context: "The UK's largest facilities management company. I was the second hire on a brand-new product team.",
    bullets: [
      { text: "Shadowed cleaning teams and risk analysts on site and ran journey workshops across our top 20 accounts, then turned what I learned into PRDs and the roadmap for two 0-to-1 products." },
      { lead: "Intelligent Cleaning:", text: "swapped static cleaning schedules for data-driven ones. Cost to serve fell 4.5% across 690+ sites within two months." },
      { lead: "Intelligent Security:", text: "pulled 8+ operational systems into one risk view, saving 30 analyst-hours per account per month." },
      { text: "Pendo tracking plus help guides and video demos cut 1:1 walkthroughs by ~80% as we scaled from ~10 to 690+ sites." },
    ],
    stat: { v: "4.5%", l: "lower cost to serve across 690+ sites" },
  },
  {
    company: "JLL Technologies",
    title: "Corporate Strategy Analyst",
    place: "Vancouver",
    dates: "May 2021 to Nov 2023",
    context: "JLL's technology division: software, data and services for commercial real estate.",
    bullets: [
      { text: "Market sizing, competitor and pricing analysis for PropTech, presented directly to the JLLT CEO." },
      { text: "On a three-person team, led the adjacent-markets workstream for an acquired property-management software product: evaluated 20+ capabilities and recommended a vendor marketplace." },
      { text: "Worked with JLL Spark, JLL's venture arm, on build / buy / invest calls." },
      { text: "Wrote Python scripts that took market scans from quarterly to monthly, saving 20+ hours of manual work." },
    ],
    stat: { v: "20+", l: "capabilities evaluated" },
  },
];
