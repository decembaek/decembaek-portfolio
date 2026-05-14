export type ChangelogBullet = {
  type: "added" | "fixed" | "changed" | "removed";
  text: string;
};

export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  status?: "current";
  bullets: ChangelogBullet[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v2026.05",
    date: "May 2026",
    status: "current",
    title: "now shipping",
    bullets: [
      { type: "added", text: "Joined a small team building infra tools that don't make people cry." },
      { type: "fixed", text: "Long-standing bug where I confused 'busy' with 'productive'." },
      { type: "changed", text: "Sleep schedule: stable on main." },
    ],
  },
  {
    version: "v2025.10",
    date: "Oct 2025",
    title: "shipped Daybreak, a calendar that refuses to be evil",
    bullets: [
      { type: "added", text: "Built keyboard-first scheduling UI from scratch in 4 months." },
      { type: "added", text: "Drove perf budget to <50ms paint on a 3-year-old MacBook." },
      { type: "removed", text: "Ads, popups, 'have you considered upgrading' modals." },
    ],
  },
  {
    version: "v2024.07",
    date: "Jul 2024",
    title: "took a sabbatical, came back marginally wiser",
    bullets: [
      { type: "added", text: "Hiked Jeju Olle trail, learned Rust on the train." },
      { type: "fixed", text: "Burnout (partial — see open issues)." },
    ],
  },
  {
    version: "v2022.03",
    date: "Mar 2022",
    title: "promoted to senior; mostly the same person",
    bullets: [
      { type: "added", text: "Owned the design-systems migration across 6 product teams." },
      { type: "changed", text: "Now write more docs than code. This is fine." },
    ],
  },
  {
    version: "v2020.01",
    date: "Jan 2020",
    title: "first commit to the industry",
    bullets: [
      { type: "added", text: "First job. First on-call. First 3am page. Still recovering." },
    ],
  },
];
