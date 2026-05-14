// Project data has moved to MDX files in src/content/projects/. Use
// getCollection("projects") in Astro pages. This module now only owns the
// shared types (so other code keeps the same import shape) and the homepage
// filter list.

export type ProjectStatus =
  | "shipped"
  | "running"
  | "maintained"
  | "internal"
  | "experiment"
  | "ongoing";

export type ProjectFilter = { id: string; label: string };

// Filter ids must match tags used in src/content/projects/*.mdx frontmatter.
// Keep this list aligned with the actual stack — empty filters are dimmed but
// still visible, which clutters the UI.
export const PROJECT_FILTERS: ProjectFilter[] = [
  { id: "all", label: "all" },
  { id: "typescript", label: "typescript" },
  { id: "python", label: "python" },
  { id: "react", label: "react" },
  { id: "nextjs", label: "nextjs" },
  { id: "django", label: "django" },
  { id: "llm", label: "llm" },
  { id: "ai-agent", label: "ai-agent" },
  { id: "automation", label: "automation" },
  { id: "freelance", label: "freelance" },
  { id: "side-project", label: "side-projects" },
];
