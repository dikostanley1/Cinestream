import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { searchMulti } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

export default function SearchPage() {
  const [sp] = useSearchParams();
  const query = sp.get("query") || "";
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    if (!query.trim()) { setResults([]); return; }
    (async () => {
      const res = await searchMulti(query);
      if (!active) return;
      setResults((res.results || []).filter((r: any) => r.media_type === "movie" || r.media_type === "tv"));
    })();
    return () => { active = false; };
  }, [query]);

  return (
    <div>
      <Helmet>
        <title>{`Search: ${query} | CineStream`}</title>
        <meta name="description" content={`Search results for ${query}`} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>
      <h1 className="mb-4 text-xl font-semibold">Search results for "{query}"</h1>
      {results.length === 0 ? (
        <p className="text-muted-foreground">No results.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {results.map((item) => (
            <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
