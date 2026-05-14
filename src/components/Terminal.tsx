import { useEffect, useRef, useState } from "react";

type Line = { kind: "in" | "out"; text: string };

export type TerminalProject = { name: string; tagline: string };

interface Props {
  projects?: TerminalProject[];
}

export default function Terminal({ projects = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Line[]>([
    { kind: "out", text: "decembaek-portfolio · v2026.05" },
    { kind: "out", text: "type 'help' to see what's wired up. esc to close." },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "?" && !open) {
        const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase() ?? "";
        if (tag === "input" || tag === "textarea") return;
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const run = (cmd: string) => {
    const c = cmd.trim();
    const push = (lines: string[]) =>
      setHistory((h) => [
        ...h,
        { kind: "in", text: c },
        ...lines.map<Line>((t) => ({ kind: "out", text: t })),
      ]);
    if (!c) {
      setHistory((h) => [...h, { kind: "in", text: "" }]);
      return;
    }
    const [head, ...rest] = c.split(/\s+/);
    switch (head) {
      case "help":
        push([
          "available commands:",
          "  whoami        — who is this",
          "  ls            — list sections",
          "  cat <section> — print a section",
          "  projects      — list projects",
          "  writing       — open the blog",
          "  contact       — how to reach me",
          "  sudo hire-me  — try it",
          "  clear         — clear screen",
          "  exit          — close terminal",
        ]);
        break;
      case "whoami":
        push(["decembaek — engineer who used to be a designer, or vice versa."]);
        break;
      case "ls":
        push(["readme/  changelog/  projects/  package.json  writing/  now/  contact/"]);
        break;
      case "cat":
        if (rest[0] === "readme") push(["see § 01 above. tl;dr: ships things, writes about it."]);
        else if (rest[0] === "now") push(["learning rust. running 4x/wk. reading Han Kang. see § 06."]);
        else if (rest[0] === "contact") push(["hi@decembaek.dev — i actually read these."]);
        else push([`cat: ${rest[0] || ""}: no such section`]);
        break;
      case "projects":
        push(
          projects.length === 0
            ? ["// no projects loaded."]
            : projects.map((p) => `  ${p.name.padEnd(20)} ${p.tagline}`),
        );
        break;
      case "writing":
        push(["opening /writing/ …"]);
        setTimeout(() => {
          window.location.href = "/writing/";
        }, 400);
        break;
      case "contact":
        push(["hi@decembaek.dev · github.com/decembaek · @decembaek"]);
        break;
      case "sudo":
        if (rest.join(" ") === "hire-me")
          push(["[sudo] password for hr: ", "👀  see § 07.  e: hi@decembaek.dev"]);
        else push([`sudo: ${rest.join(" ")}: command not found`]);
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "exit":
        setOpen(false);
        return;
      case "rm":
        if (rest.includes("-rf") && rest.includes("/")) push(["nice try."]);
        else push(["rm: missing operand"]);
        break;
      default:
        push([`command not found: ${head}. try 'help'.`]);
    }
    setInput("");
  };

  if (!open) return null;
  return (
    <div className="term-overlay" onClick={() => setOpen(false)}>
      <div className="term-window" onClick={(e) => e.stopPropagation()}>
        <div className="term-bar">
          <span className="term-dot term-dot--r" />
          <span className="term-dot term-dot--y" />
          <span className="term-dot term-dot--g" />
          <span className="term-title">~/decembaek — zsh — 80×24</span>
          <button className="term-close" onClick={() => setOpen(false)}>
            esc
          </button>
        </div>
        <div className="term-body" ref={scrollRef}>
          {history.map((h, i) => (
            <div key={i} className={`term-line term-line--${h.kind}`}>
              {h.kind === "in" ? (
                <>
                  <span className="term-prompt">~ ❯</span> {h.text}
                </>
              ) : (
                h.text
              )}
            </div>
          ))}
          <div className="term-input-line">
            <span className="term-prompt">~ ❯</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") run(input);
                if (e.key === "Escape") setOpen(false);
              }}
              spellCheck={false}
              autoComplete="off"
            />
            <span className="cursor">█</span>
          </div>
        </div>
      </div>
    </div>
  );
}
