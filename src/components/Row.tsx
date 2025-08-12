import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { listMovies, listTv } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

interface RowProps {
  title: string;
  type: "movie" | "tv";
  path: string; // e.g. "/movie/popular" or "/trending/tv/week"
}

export default function Row({ title, type, path }: RowProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = type === "movie" ? await listMovies(path) : await listTv(path);
        if (!active) return;
        setItems(res.results || []);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [type, path]);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (loading && items.length === 0) return null;

  return (
    <section className="relative mb-8" aria-label={title}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
        <div className="hidden md:flex gap-2">
          <button
            aria-label="Scroll left"
            className="rounded-md border border-border p-1 hover:bg-muted"
            onClick={() => scrollBy(-Math.round((scrollerRef.current?.clientWidth || 800) * 0.9))}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Scroll right"
            className="rounded-md border border-border p-1 hover:bg-muted"
            onClick={() => scrollBy(Math.round((scrollerRef.current?.clientWidth || 800) * 0.9))}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="group relative flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollSnapType: "x proximity" }}
      >
        {items.map((item) => (
          <div key={`${type}-${item.id}`} style={{ scrollSnapAlign: "start" }}>
            <MovieCard item={item} contentType={type} />
          </div>
        ))}
      </div>
    </section>
  );
}
