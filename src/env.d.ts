/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

interface Env {
  AI: Ai;
  ASSETS: Fetcher;
}

declare namespace App {
  interface Locals extends Runtime {}
}
