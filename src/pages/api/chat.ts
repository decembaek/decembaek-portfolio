import type { APIContext } from "astro";
import { buildSystemPrompt } from "@/lib/system-prompt";

export const prerender = false;

// Workers AI model. gpt-oss-120b — top-tier quality, OpenAI's open model.
// Heavier on neurons than the 8B Llama, but the free tier still covers a
// personal portfolio comfortably. Drop to `@cf/meta/llama-3.1-8b-instruct-fast`
// or `@cf/meta/llama-3.3-70b-instruct-fp8-fast` if cost or latency matter more.
const MODEL = "@cf/openai/gpt-oss-120b";

type IncomingMsg = { role: "you" | "bot"; text: string };

export async function POST(context: APIContext) {
  const env = context.locals.runtime?.env as Env | undefined;
  const ai = env?.AI;
  if (!ai) {
    return new Response("AI binding not available (run via `wrangler dev` or deploy).", {
      status: 500,
    });
  }

  let body: { messages?: IncomingMsg[] };
  try {
    body = await context.request.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter((m): m is IncomingMsg => !!m && typeof m.text === "string" && m.text.length > 0)
    .map((m) => ({
      role: m.role === "you" ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));

  if (history.length === 0) {
    return new Response("no messages", { status: 400 });
  }

  const system = await buildSystemPrompt();

  // Workers AI returns a ReadableStream of SSE-formatted bytes when stream:true.
  // Each event is `data: {"response":"<token>","p":"..."}` or `data: [DONE]`.
  // The binding's TS signature is loose ('Record<string, unknown>'); we cast
  // through unknown because the runtime contract is documented and stable.
  const upstream = (await ai.run(MODEL, {
    messages: [{ role: "system", content: system }, ...history],
    stream: true,
    // gpt-oss-120b counts reasoning tokens against this budget too, so a
    // tight cap (256) was clipping answers mid-sentence. 768 leaves comfortable
    // room for short visible replies plus the model's silent reasoning.
    max_tokens: 768,
  })) as unknown as ReadableStream<Uint8Array>;

  // Workers AI streams SSE. Different model families use different event
  // shapes:
  //   - CF native    : { "response": "<token>", "p": "..." }
  //   - OpenAI-compat: { "choices": [{ "delta": { "content": "<token>" } }] }
  //                    (e.g. @cf/openai/gpt-oss-120b)
  // We handle both — gpt-oss emits reasoning into a separate field which we
  // intentionally skip so the user only sees the final answer.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader();
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
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const evt = JSON.parse(payload) as {
                response?: string;
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const token =
                (typeof evt.response === "string" && evt.response) ||
                evt.choices?.[0]?.delta?.content ||
                "";
              if (token) controller.enqueue(encoder.encode(token));
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
