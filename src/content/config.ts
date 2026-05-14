import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    readingTime: z.string(),
    tags: z.array(z.string()),
    pinned: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// Projects collection — listing fields drive the homepage filter cards;
// detail fields drive /projects/<slug>/. All detail sections are optional, so
// a project can ship as a listing stub and grow into a full case study later.
const projects = defineCollection({
  type: "content",
  schema: z.object({
    // identity
    name: z.string(),
    tagline: z.string(),
    version: z.string().default("v0.1"),
    status: z.enum([
      "shipped",
      "running",
      "maintained",
      "internal",
      "experiment",
      "ongoing",
    ]),
    year: z.string(),
    publishedAt: z.coerce.date(),

    // listing fields (used by the homepage Projects filter)
    blurb: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    tags: z.array(z.string()),
    metric: z.string(),
    repo: z.string(),

    // detail hero
    heroImage: z.string().optional(),
    heroCaption: z.string().optional(),
    // Primary "open the live thing" URL. Rendered as a prominent CTA in the
    // hero. Use this for the canonical deployed product / demo URL; use
    // `links` for secondary stuff (press, blog, related).
    live: z
      .object({
        url: z.string().url(),
        label: z.string().optional(),
      })
      .optional(),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    // public source repositories — rendered as a dedicated pill row below
    // the hero meta. `label` is a short tag like "frontend" / "backend";
    // if omitted, the URL's repo name is used. Use `links` for live URLs.
    repos: z
      .array(
        z.object({
          url: z.string().url(),
          label: z.string().optional(),
        }),
      )
      .default([]),
    // Embedded demo videos. YouTube URLs (youtu.be or youtube.com/watch?v=…)
    // are auto-converted to /embed/<id>. Rendered before shots so video-led
    // demos (automations etc.) read in the right order.
    videos: z
      .array(
        z.object({
          url: z.string().url(),
          caption: z.string().optional(),
        }),
      )
      .default([]),

    // detail sections — all optional
    facts: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
    tldr: z.array(z.string()).default([]),
    problem: z
      .object({
        paragraphs: z.array(z.string()),
        quote: z
          .object({ text: z.string(), cite: z.string() })
          .optional(),
      })
      .optional(),
    shots: z
      .array(
        z.object({
          image: z.string().optional(),
          caption: z.string(),
          aspect: z.string().default("4 / 3"),
        }),
      )
      .default([]),
    decisions: z
      .array(
        z.object({
          type: z.enum(["added", "removed", "changed", "fixed"]),
          title: z.string(),
          body: z.string(),
        }),
      )
      .default([]),
    metrics: z
      .array(
        z.object({
          v: z.string(),
          k: z.string(),
          sub: z.string().optional(),
        }),
      )
      .default([]),
    retro: z
      .object({
        good: z.array(z.string()).default([]),
        improvements: z.array(z.string()).default([]),
        openIssues: z
          .array(z.object({ id: z.string(), text: z.string() }))
          .default([]),
      })
      .optional(),

    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, projects };
