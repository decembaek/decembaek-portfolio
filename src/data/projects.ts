export type Project = {
  name: string;
  tagline: string;
  blurb: string;
  role: string;
  stack: string[];
  tags: string[];
  metric: string;
  repo: string;
  status: "shipped" | "running" | "maintained" | "internal" | "experiment" | "ongoing";
  year: string;
};

export const PROJECTS: Project[] = [
  {
    name: "daybreak",
    tagline: "a calendar app for people who hate calendar apps.",
    blurb: "Keyboard-first scheduling for solo operators. Designed the entire UI system, shipped iOS app in 4 months, drove first-paint under 50ms on 3-year-old hardware.",
    role: "founding designer-engineer",
    stack: ["TypeScript", "SwiftUI", "Postgres"],
    tags: ["typescript", "swift", "design", "product"],
    metric: "2.1k DAU · 4.8★ App Store",
    repo: "closed-source",
    status: "shipped",
    year: "2025",
  },
  {
    name: "diff-club",
    tagline: "a code-review book club. read other people's PRs for fun.",
    blurb: "Weekly newsletter + dashboard that pulls public PRs from notable repos and annotates the interesting commits. 412 members and counting.",
    role: "side project · solo",
    stack: ["Remix", "Tailwind", "Sqlite"],
    tags: ["typescript", "react", "side-project"],
    metric: "412 members · ~3 PRs/wk",
    repo: "public",
    status: "running",
    year: "2024",
  },
  {
    name: "korean-words.txt",
    tagline: "an open-source corpus of underused Korean verbs.",
    blurb: "A curated dataset of 3,400 underused Korean verbs with example sentences, English glosses, and frequency scores. Now used by 2 dictionary apps.",
    role: "maintainer",
    stack: ["Python", "JSON", "patience"],
    tags: ["python", "open-source", "writing"],
    metric: "1.3k★ on github",
    repo: "public",
    status: "maintained",
    year: "2023",
  },
  {
    name: "midnight-runner",
    tagline: "a CI dashboard that lights a candle when main is red.",
    blurb: "Internal status page that aggregates CI across 14 repos with one rule: if main is broken at 3am, a literal IoT candle in the office turns on.",
    role: "internal tool · hackweek winner",
    stack: ["Go", "WebSockets", "an actual candle"],
    tags: ["go", "infra", "internal-tool"],
    metric: "used by 4 teams · saved ~6hrs/wk",
    repo: "internal",
    status: "internal",
    year: "2023",
  },
  {
    name: "slow-search",
    tagline: "a search engine that returns 1 result, slowly, on purpose.",
    blurb: "Experimental tool: take a query, think for 30 seconds, return one carefully-chosen link. Built to argue that latency is a design choice.",
    role: "experiment · solo",
    stack: ["Rust", "Tantivy", "HTMX"],
    tags: ["rust", "experiment", "side-project"],
    metric: "2.4k uniques · 1 result each",
    repo: "public",
    status: "experiment",
    year: "2024",
  },
  {
    name: "yet-another-blog",
    tagline: "essays about software, mostly written on the subway.",
    blurb: "Personal blog where I publish slow takes on engineering, design, and the strange middle ground between them. ~1 post/month, no comments section by choice.",
    role: "writer / publisher",
    stack: ["MDX", "Astro"],
    tags: ["typescript", "writing", "side-project"],
    metric: "23 posts · 8 min avg read",
    repo: "public",
    status: "ongoing",
    year: "2022—",
  },
];

export type ProjectFilter = { id: string; label: string };

export const PROJECT_FILTERS: ProjectFilter[] = [
  { id: "all", label: "all" },
  { id: "typescript", label: "typescript" },
  { id: "swift", label: "swift" },
  { id: "go", label: "go" },
  { id: "rust", label: "rust" },
  { id: "python", label: "python" },
  { id: "react", label: "react" },
  { id: "design", label: "design" },
  { id: "open-source", label: "open-source" },
  { id: "side-project", label: "side-projects" },
  { id: "infra", label: "infra" },
];
