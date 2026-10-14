/* Shared content types. Copy lives in the sibling files; components only render it. */

export type Metric = { v: string; l: string };

export type Slide = { caption: string; image: string };

/** One column of the spec grid under a project tile. Either a list of items or a short paragraph. */
export type SpecColumn = {
  heading: string;
  items?: { title: string; sub: string }[];
  text?: string;
};

export type ProjectGroup = "product" | "automation";

export type Project = {
  index: string;
  slug: string;
  group: ProjectGroup;
  title: string;
  /** Shorter name for the table of contents and highlight cards. */
  shortTitle: string;
  subtitle: string;
  tag: string;
  link?: { label: string; href: string };
  /** Paragraphs separated by a blank line. The first shows; the rest sit behind "Expand". */
  summary: string;
  specs: SpecColumn[];
  /** Headline numbers shown in a row under the specs. */
  metrics?: Metric[];
  /** Detailed stats behind a toggle. */
  stats?: { heading: string; value: string; label: string }[];
  slides: Slide[];
};

export type HighlightArt =
  | { kind: "logo"; brand: "joey" | "playi"; backdrop: string }
  | { kind: "scene"; scene: "network" | "cycling" | "engine" | "open" };

export type Highlight = {
  badge: string;
  /** Project slug the "Full story" button scrolls to. Omitted on the open-slot card. */
  target?: string;
  category: string;
  title: string;
  tagline?: string;
  what: string;
  problem: string;
  stat?: string;
  statSub?: string;
  status: string;
  live?: { label: string; href: string };
  art: HighlightArt;
};

export type Role = {
  company: string;
  title: string;
  place: string;
  dates: string;
  context: string;
  bullets: { lead?: string; text: string }[];
  /** Headline results, each with what it measures and where it came from. */
  impact: { v: string; l: string; sub: string }[];
};

export type Challenge = {
  slug: string;
  title: string;
  date: string;
  where: string;
  stats: Metric[];
  line: string;
  cover: string;
  coverAlt: string;
  photos: Slide[];
  story: string[];
};
