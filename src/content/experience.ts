import type { Role } from "./types";

/* Public-site versions of the career history (career-engine/wiki/history). Kept off
 * on purpose: the acquired product's name, the ARR growth figure, and internal
 * screenshots. */
export const EXPERIENCE: Role[] = [
  {
    company: "Mitie",
    title: "Product Manager",
    place: "London",
    dates: "Jan 2024 to present",
    context:
      "The UK's largest facilities management provider (£5.6bn FY26 revenue) and a leader in tech-enabled service delivery. I joined a brand-new product team as its second hire, building internal products for Mitie's two largest service lines, Cleaning and Security.",
    bullets: [
      { text: "Shadowed cleaning teams and risk analysts on site and ran journey workshops across our top 20 accounts, then turned what I learned into PRDs and the roadmap for two 0-to-1 products." },
      { lead: "Intelligent Cleaning:", text: "replaced static cleaning schedules with data-driven ones, so teams cut reactive tasks, travel and redundant cleans." },
      { lead: "Intelligent Security:", text: "combined data from 8+ operational systems in a transparent risk view built on a Medallion architecture. The data covered 8,000+ sites across the top 10 retailers Mitie served for security." },
      { text: "Scaled from ~10 to 690+ sites, using Pendo to spot where operators stalled and fixing it with onboarding guides, help content and video demos." },
    ],
    impact: [
      { v: "4.5%", l: "lower cost to serve", sub: "Intelligent Cleaning, across 690+ sites within two months" },
      { v: "30 hrs", l: "saved per account, every month", sub: "Risk analyst time, Intelligent Security" },
      { v: "~80%", l: "fewer 1:1 walkthroughs", sub: "Pendo onboarding plus help content and demos" },
    ],
  },
  {
    company: "JLL Technologies",
    title: "Corporate Strategy Analyst",
    place: "Vancouver",
    dates: "May 2021 to Nov 2023",
    context:
      "JLL's global technology division, building software, data and services for commercial real estate across JLL's end-to-end real estate value chain. In Corporate Strategy I worked on PropTech expansion (sustainability tech, HaaS, underwriting tech) alongside JLL experts in Australia, the US, Germany and Japan.",
    bullets: [
      { text: "Ran PropTech market sizing, competitor and pricing analysis, and presented recommendations directly to the JLLT CEO." },
      { text: "On a three-person team, led the adjacent-markets workstream for an acquired property-management software product and recommended a vendor marketplace built on its verified vendor network." },
      { text: "Worked with JLL Spark, JLL's venture arm, on build / buy / invest calls, and with Spark portfolio companies on product fit." },
      { text: "Wrote Python scripts that took PropTech market scans from quarterly to monthly." },
    ],
    impact: [
      { v: "20+", l: "capabilities evaluated", sub: "For an acquired property-management product, leading to the vendor marketplace call" },
      { v: "6 of 10", l: "markets prioritized", sub: "Core and adjacent markets carried into the leadership growth plan" },
      { v: "20+ hrs", l: "of manual work saved each month", sub: "Python automation of the PropTech market scans" },
    ],
  },
];
