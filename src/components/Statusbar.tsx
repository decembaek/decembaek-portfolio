import { useEffect, useState } from "react";
import { SITE } from "@/data/site";

function format(diffMs: number) {
  const s = Math.floor(diffMs / 1000);
  const days = Math.floor(s / 86400);
  const y = Math.floor(days / 365);
  const d = days - y * 365;
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `uptime ${y}y ${String(d).padStart(3, "0")}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export default function Statusbar() {
  const [uptime, setUptime] = useState(() => format(Date.now() - new Date(SITE.buildStart).getTime()));

  useEffect(() => {
    const id = setInterval(() => {
      setUptime(format(Date.now() - new Date(SITE.buildStart).getTime()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="statusbar">
      <span>main</span>
      <span className="statusbar__sep">·</span>
      <span>
        <span className="statusbar__dot" /> deployed
      </span>
      <span className="statusbar__sep">·</span>
      <span>{uptime}</span>
      <span className="statusbar__sep">·</span>
      <span>build #{SITE.buildId}</span>
      <span className="statusbar__push">
        ⌘K · press <kbd>?</kbd> for shell
      </span>
    </div>
  );
}
