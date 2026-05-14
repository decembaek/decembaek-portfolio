import { useState } from "react";
import { SITE } from "@/data/site";

const CURL = `curl -X POST https://decembaek.com/hi \\
  -H "Content-Type: text/human" \\
  -d '{ "from": "you", "topic": "anything, really" }'`;

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(CURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="contact-grid">
      <div className="contact-left">
        <h3 className="contact-h">
          open a PR <span className="contact-h-sub">on my calendar</span>
        </h3>
        <p className="contact-p">
          I read every cold email. I reply to most of them. The fastest way to my inbox is
          something specific — a project, a question, a strong opinion about kerning.
        </p>
        <ul className="contact-links">
          <li>
            <span className="contact-k">email</span>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </li>
          <li>
            <span className="contact-k">github</span>
            <a href={SITE.github}>github.com/decembaek</a>
          </li>
          <li>
            <span className="contact-k">rss</span>
            <a href="/rss.xml">decembaek.com/rss.xml</a>
          </li>
        </ul>
      </div>
      <div className="contact-right">
        <div className="curl">
          <div className="curl__bar">
            <span>POST · /hi</span>
            <button onClick={copy}>{copied ? "copied ✓" : "copy"}</button>
          </div>
          <pre className="curl__body">{CURL}</pre>
          <div className="curl__resp">
            <span className="curl__resp-status">← 200 OK</span> ·{" "}
            <em>"thanks for the ping. coffee?"</em>
          </div>
        </div>
      </div>
    </div>
  );
}
