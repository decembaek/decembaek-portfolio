import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE } from "@/data/site";

export const prerender = true;

export async function GET(context: APIContext) {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return rss({
    title: `${SITE.name} · writing`,
    description: SITE.description,
    site: context.site?.toString() ?? SITE.url,
    items: posts
      .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.publishedAt,
        description: post.data.excerpt,
        link: `/writing/${post.slug}/`,
        categories: post.data.tags,
      })),
    customData: `<language>en-us</language>`,
  });
}
