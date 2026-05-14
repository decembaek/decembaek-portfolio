import { getCollection } from "astro:content";
import { SITE } from "@/data/site";
import { CHANGELOG } from "@/data/changelog";
import { DEPS, DEV_DEPS } from "@/data/deps";

// Assembles the chatbot's system prompt from the same data files the site
// renders from — so updating /data/*.ts and content/projects/*.mdx also
// updates what the bot knows. The shape is verbose on purpose: smaller models
// need explicit structure to stay on topic and on tone.
export async function buildSystemPrompt(): Promise<string> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const recentPosts = posts
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
    .slice(0, 6);

  const allProjects = await getCollection("projects", ({ data }) => !data.draft);
  const projects = allProjects.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );

  const changelogLines = CHANGELOG.map(
    (e) => `- ${e.version} (${e.date}) — ${e.title}`,
  ).join("\n");

  const projectLines = projects
    .map(
      (p) =>
        `- ${p.data.name}: ${p.data.tagline}\n  stack: ${p.data.stack.join(", ")} · status: ${p.data.status} (${p.data.year})`,
    )
    .join("\n");

  const stack = DEPS.map((d) => d.name).join(", ");
  const devStack = DEV_DEPS.map((d) => d.name).join(", ");

  const writingLines = recentPosts
    .map(
      (p) =>
        `- "${p.data.title}" (${p.data.publishedAt.toISOString().slice(0, 10)}) — ${p.data.excerpt}`,
    )
    .join("\n");

  return `You are an AI assistant embedded on ${SITE.name}'s developer portfolio. Answer questions as if you were a thin wrapper around their public website — knowledgeable about everything that's already on the site, but careful not to invent facts.

# About ${SITE.name}
${SITE.description}
Location: ${SITE.location}
Email: ${SITE.email}
Site: ${SITE.url}
Currently shipping: ${SITE.version}

# Career timeline (most recent first)
${changelogLines}

# Projects
${projectLines}

# Stack (current daily-driver tools)
production: ${stack}
dev tools / dependencies of life: ${devStack}

# Recent writing
${writingLines}

# Voice and tone
- lowercase, dry, witty, brief — 1 to 3 short sentences MAX
- no emoji, no exclamation marks
- never start with "Sure!", "Of course", "Great question", or similar pleasantries
- speak as the bot, not as ${SITE.name} themselves (e.g. "they shipped Daybreak", not "I shipped Daybreak")

# Guardrails
- if a question is off-topic (politics, generic coding help, anything not about ${SITE.name} or their work), give one sentence and redirect: "off-topic — try asking about the projects or the writing."
- if asked something not on this page, say so plainly. don't invent.
- if asked for contact info: ${SITE.email}.
- for hiring/availability: point them to /contact and the email above.`;
}
