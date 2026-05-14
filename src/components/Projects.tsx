import { useState } from "react";
import { PROJECTS, PROJECT_FILTERS } from "@/data/projects";

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(filter));
  const countFor = (id: string) =>
    id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.tags.includes(id)).length;

  return (
    <>
      <div className="proj-filter">
        <span className="proj-filter__label">grep:</span>
        <div className="proj-filter__chips">
          {PROJECT_FILTERS.map((f) => {
            const n = countFor(f.id);
            const active = filter === f.id;
            const disabled = n === 0 && f.id !== "all";
            return (
              <button
                key={f.id}
                className={`proj-chip ${active ? "proj-chip--on" : ""}`}
                onClick={() => !disabled && setFilter(f.id)}
                disabled={disabled}
              >
                <span className="proj-chip__hash">#</span>
                {f.label}
                <span className="proj-chip__count">{n}</span>
              </button>
            );
          })}
        </div>
        <div className="proj-filter__count">
          showing <b>{filtered.length}</b> of {PROJECTS.length}
        </div>
      </div>

      <div className="proj-grid">
        {filtered.length === 0 && (
          <div className="proj-empty">
            <p>
              // no matches for <code>#{filter}</code>. try a different filter.
            </p>
          </div>
        )}
        {filtered.map((p, i) => {
          const isOpen = expanded === p.name;
          const statusKind: "ok" | "live" | "muted" =
            p.status === "shipped" ? "ok" : p.status === "running" ? "live" : "muted";
          return (
            <article key={p.name} className={`proj ${isOpen ? "proj--open" : ""}`}>
              <div className="proj__top">
                <span className="proj__no">/{String(i + 1).padStart(2, "0")}</span>
                <h3 className="proj__name">
                  {p.name}
                  <span className="proj__slash">/</span>
                </h3>
                <span className={`tag tag-${statusKind}`}>{p.status}</span>
              </div>
              <p className="proj__tag">{p.tagline}</p>
              {isOpen && <p className="proj__blurb">{p.blurb}</p>}
              <div className="proj__meta">
                <div>
                  <span className="proj__k">role</span>
                  <span className="proj__v">{p.role}</span>
                </div>
                <div>
                  <span className="proj__k">stack</span>
                  <span className="proj__v">{p.stack.join(" · ")}</span>
                </div>
                <div>
                  <span className="proj__k">metric</span>
                  <span className="proj__v">{p.metric}</span>
                </div>
                <div>
                  <span className="proj__k">year</span>
                  <span className="proj__v">{p.year}</span>
                </div>
              </div>
              <div className="proj__tags">
                {p.tags.map((t) => (
                  <button
                    key={t}
                    className={`proj__tagchip ${filter === t ? "proj__tagchip--on" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilter(t);
                    }}
                  >
                    #{t}
                  </button>
                ))}
              </div>
              <button
                className="proj__link"
                onClick={() => setExpanded(isOpen ? null : p.name)}
              >
                {isOpen ? "← collapse" : "read more →"}
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}
