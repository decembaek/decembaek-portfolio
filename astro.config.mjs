import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://decembaek.com",
  output: "hybrid",
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: "compile",
  }),
  image: {
    service: { entrypoint: "astro/assets/services/noop" },
  },
  integrations: [react(), mdx()],
  vite: {
    build: {
      rollupOptions: {
        // Pagefind generates this at `dist/pagefind/pagefind.js` after the
        // Astro build, so Rollup must not try to resolve it.
        external: [/^\/pagefind\/pagefind\.js$/],
      },
    },
    ssr: {
      external: ["node:buffer", "node:path", "node:fs", "node:url"],
    },
  },
});
