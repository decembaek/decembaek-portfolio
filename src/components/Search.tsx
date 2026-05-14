import { useEffect, useRef, useState } from "react";

type Pagefind = {
  search: (query: string) => Promise<{
    results: Array<{ id: string; data: () => Promise<PagefindResult> }>;
  }>;
};

type PagefindResult = {
  url: string;
  meta: { title: string };
  excerpt: string;
};

declare global {
  interface Window {
    pagefind?: Pagefind;
  }
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<PagefindResult[]>([]);
  const [loading, setLoading] = useState(false);
  const pagefindRef = useRef<Pagefind | null>(null);

  // Lazy-load pagefind UI runtime on first focus. The path resolves at
  // runtime from the static index that `pagefind --site dist` writes; TS
  // can't see the module so we route the path through a variable.
  const ensureLoaded = async () => {
    if (pagefindRef.current) return pagefindRef.current;
    const path = "/pagefind/pagefind.js";
    const mod = await import(/* @vite-ignore */ path).catch(() => null);
    if (!mod) return null;
    pagefindRef.current = mod as unknown as Pagefind;
    return pagefindRef.current;
  };

  useEffect(() => {
    if (!query.trim()) {
      setHits([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const pf = await ensureLoaded();
      if (!pf || cancelled) return;
      const r = await pf.search(query);
      const data = await Promise.all(r.results.slice(0, 8).map((h) => h.data()));
      if (!cancelled) {
        setHits(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="search-wrap">
      <input
        className="search-input"
        type="search"
        placeholder="search the writing… (e.g. 'design systems', 'postgres')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          void ensureLoaded();
        }}
      />
      {query.trim() && (
        <div className="search-results">
          {loading && <p>// searching…</p>}
          {!loading && hits.length === 0 && <p>// no matches for "{query}"</p>}
          {hits.map((h) => (
            <div key={h.url} className="search-hit">
              <a href={h.url}>
                <h4
                  className="search-hit__title"
                  dangerouslySetInnerHTML={{ __html: h.meta.title }}
                />
                <p
                  className="search-hit__excerpt"
                  dangerouslySetInnerHTML={{ __html: h.excerpt }}
                />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
