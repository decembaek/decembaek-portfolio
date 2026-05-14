import type { APIContext } from "astro";
import { SITE } from "@/data/site";

export const prerender = false;

// Static "say hi" payload. Shown on the homepage curl example
// (Contact section) — POST or GET, either works.
const HI = {
  status: 200,
  message: "안녕하세요, 반가워요! 제 이메일과 깃 주소인데 연락주세요",
  github: "github.com/decembaek",
  email: SITE.email,
};

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "*",
  "access-control-max-age": "86400",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2) + "\n", {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...CORS,
    },
  });
}

export async function GET(_: APIContext) {
  return json(HI);
}

export async function POST(_: APIContext) {
  return json(HI);
}

export async function OPTIONS(_: APIContext) {
  return new Response(null, { status: 204, headers: CORS });
}
