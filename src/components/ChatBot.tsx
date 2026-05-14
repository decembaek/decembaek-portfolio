import { Fragment, useEffect, useRef, useState } from "react";

type Msg = { role: "you" | "bot"; text: string };

const SUGGESTIONS = [
  "요즘 어떤 프로젝트 만들고 있어요?",
  "AI 에이전트는 어떤 거 작업 중?",
  "스택이 어떻게 돼요?",
];

// Auto-link URLs inside bot replies. We match:
//   - external https? URLs
//   - same-origin paths like /projects/<slug>/ or /writing/...
// Trailing punctuation (. , ; : ! ? ) ]) is stripped from the matched URL
// and pushed back as text so sentences read naturally.
const URL_RE = /(https?:\/\/\S+|\/(?:projects|writing|now|hi)\/?[a-z0-9-]*\/?)/g;
const TRAILING_PUNCT = /[.,;:!?)\]"']+$/;

type Part = { kind: "text" | "link"; value: string; href?: string };

function splitWithLinks(text: string): Part[] {
  const parts: Part[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  URL_RE.lastIndex = 0;
  while ((m = URL_RE.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push({ kind: "text", value: text.slice(lastIdx, m.index) });
    }
    let url = m[0];
    const trail = url.match(TRAILING_PUNCT);
    let tail = "";
    if (trail) {
      tail = trail[0];
      url = url.slice(0, -tail.length);
    }
    if (url) parts.push({ kind: "link", value: url, href: url });
    if (tail) parts.push({ kind: "text", value: tail });
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) parts.push({ kind: "text", value: text.slice(lastIdx) });
  return parts;
}

function MessageBody({ text, role }: { text: string; role: "you" | "bot" }) {
  // Don't auto-link the user's own messages — only the bot's.
  if (role === "you") return <>{text}</>;
  const parts = splitWithLinks(text);
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === "text") return <Fragment key={i}>{p.value}</Fragment>;
        const external = p.href!.startsWith("http");
        return (
          <a
            key={i}
            className="chat-msg__link"
            href={p.href}
            target={external ? "_blank" : "_self"}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {p.value}
          </a>
        );
      })}
    </>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "안녕하세요. decembaek 대신 답하도록 세팅된 LLM이에요. 프로젝트, 스택, 채용, 아무거나 물어보세요.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, open, busy]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  const send = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || busy) return;
    setMsgs((m) => [...m, { role: "you", text }]);
    setInput("");
    setBusy(true);

    // Append empty bot message that we will stream into.
    setMsgs((m) => [...m, { role: "bot", text: "" }]);
    const botIdx = msgs.length + 1; // +user we just pushed

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [...msgs, { role: "you", text }].slice(-8),
        }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const localAcc = acc;
        setMsgs((m) => {
          const next = m.slice();
          next[botIdx] = { role: "bot", text: localAcc };
          return next;
        });
      }
      if (!acc.trim()) {
        setMsgs((m) => {
          const next = m.slice();
          next[botIdx] = { role: "bot", text: "// empty response. try again?" };
          return next;
        });
      }
    } catch (e) {
      setMsgs((m) => {
        const next = m.slice();
        next[botIdx] = {
          role: "bot",
          text: "// 500 — something went wrong reaching the model. try again?",
        };
        return next;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        className={`chat-fab ${open ? "chat-fab--hide" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="open chat"
      >
        <span className="chat-fab__dot" />
        <span className="chat-fab__label">
          ask <em>decembaek-bot</em>
        </span>
      </button>
      {open && (
        <div className="chat-modal" role="dialog">
          <header className="chat-modal__bar">
            <span className="chat-modal__title">
              <span className="chat-modal__dot" />
              decembaek-bot · <span className="chat-modal__model">gpt-oss-120b</span>
            </span>
            <button className="chat-modal__close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </header>
          <div className="chat-modal__body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg--${m.role}`}>
                <span className="chat-msg__who">{m.role === "you" ? "~ ❯" : "➜"}</span>
                <span className="chat-msg__text">
                  {m.text ? (
                    <MessageBody text={m.text} role={m.role} />
                  ) : busy && i === msgs.length - 1 ? (
                    <span className="chat-msg__typing">
                      <i /><i /><i />
                    </span>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
          {msgs.length <= 1 && (
            <div className="chat-modal__suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} disabled={busy}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            className="chat-modal__form"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <span className="chat-modal__prompt">~ ❯</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={busy ? "thinking…" : "type a question…"}
              disabled={busy}
              spellCheck={false}
            />
            <button type="submit" disabled={busy || !input.trim()}>
              send
            </button>
          </form>
          <div className="chat-modal__foot">
            // responses are LLM-generated, not the real decembaek. cite accordingly.
          </div>
        </div>
      )}
    </>
  );
}
