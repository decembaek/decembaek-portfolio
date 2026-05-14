import type { APIContext } from "astro";

export const prerender = false;

const SYSTEM = `You are an AI assistant on Decembaek's developer portfolio. Decembaek is an engineer-designer based in Seoul. Recent work: Daybreak (calendar app), diff-club (PR-review newsletter), korean-words.txt (open-source corpus), midnight-runner (CI dashboard), slow-search (Rust experiment). Stack: TypeScript, React, Go, Swift, Rust, Postgres. Writes essays about software craft. Tone: witty, dry, lowercase, brief — 1-3 short sentences max. No emoji. Never start with 'Sure!' or 'Of course'. If asked something off-topic, gently redirect.`;

type IncomingMsg = { role: "you" | "bot"; text: string };

export async function POST(context: APIContext) {
  const env = context.locals.runtime?.env as Env | undefined;
  const apiKey = env?.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("ANTHROPIC_API_KEY is not configured.", { status: 500 });
  }

  let body: { messages?: IncomingMsg[] };
  try {
    body = await context.request.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter((m): m is IncomingMsg => !!m && typeof m.text === "string")
    .map((m) => ({
      role: m.role === "you" ? "user" : "assistant",
      content: m.text,
    }));

  if (messages.length === 0) {
    return new Response("no messages", { status: 400 });
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      stream: true,
      system: SYSTEM,
      messages,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    return new Response(`upstream error ${upstream.status}: ${errText}`.slice(0, 500), {
      status: 502,
    });
  }

  // Re-frame Anthropic SSE -> plain text chunks the client can append.
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buf = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (!json || json === "[DONE]") continue;
            try {
              const evt = JSON.parse(json) as {
                type: string;
                delta?: { type?: string; text?: string };
              };
              if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta" && evt.delta.text) {
                controller.enqueue(encoder.encode(evt.delta.text));
              }
            } catch {
              // skip malformed event
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
