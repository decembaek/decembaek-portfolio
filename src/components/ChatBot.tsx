import { useEffect, useRef, useState } from "react";

type Msg = { role: "you" | "bot"; text: string };

const SUGGESTIONS = [
  "what's your favorite project?",
  "are you open to new roles?",
  "why a candle for the CI dashboard?",
  "what's on your reading list?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "hi — i'm a thin wrapper around an LLM, briefed to answer as decembaek. ask me about the projects, the stack, hiring, or whatever's on your mind.",
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
              decembaek-bot · <span className="chat-modal__model">haiku-4.5</span>
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
                  {m.text || (busy && i === msgs.length - 1 ? (
                    <span className="chat-msg__typing">
                      <i /><i /><i />
                    </span>
                  ) : null)}
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
