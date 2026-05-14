import { useMemo, useState } from "react";

export type BlogItem = {
  slug: string;
  title: string;
  date: string;
  read: string;
  excerpt: string;
  tags: string[];
  pinned: boolean;
};

interface Props {
  posts: BlogItem[];
}

export default function BlogList({ posts }: Props) {
  const [filter, setFilter] = useState("all");
  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return ["all", ...Array.from(s).sort()];
  }, [posts]);

  const visible = filter === "all" ? posts : posts.filter((p) => p.tags.includes(filter));

  return (
    <>
      <div className="blog-head">
        <div className="blog-tabs">
          {allTags.map((t) => (
            <button
              key={t}
              className={`blog-tab ${filter === t ? "blog-tab--on" : ""}`}
              onClick={() => setFilter(t)}
            >
              {t === "all" ? "all posts" : `#${t}`}
            </button>
          ))}
        </div>
        <a className="blog-rss" href="/rss.xml">
          rss · atom · json-feed
        </a>
      </div>
      <ul className="blog-list">
        {visible.map((p) => (
          <li key={p.slug} className={`blog-item ${p.pinned ? "blog-item--pin" : ""}`}>
            <a href={`/writing/${p.slug}/`} className="blog-item__link">
              <div className="blog-item__col-date">
                <time className="blog-item__date">{p.date}</time>
                <span className="blog-item__read">{p.read}</span>
              </div>
              <div className="blog-item__col-body">
                <h3 className="blog-item__title">
                  {p.pinned && <span className="blog-item__pin">✪ pinned</span>}
                  {p.title}
                </h3>
                <p className="blog-item__excerpt">{p.excerpt}</p>
                <div className="blog-item__tags">
                  {p.tags.map((t) => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
              </div>
              <span className="blog-item__arrow">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="blog-foot">
        <span>
          // {visible.length} posts · last updated {posts[0]?.date} ·{" "}
        </span>
        <a href="/rss.xml">archive →</a>
      </div>
    </>
  );
}
