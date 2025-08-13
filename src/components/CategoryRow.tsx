import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { listMovies, listTv } from "@/lib/tmdb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategoryRowProps {
  title: string;
  type: "movie" | "tv";
  path: string; // TMDB API path e.g. /movie/popular
}

export default function CategoryRow({ title, type, path }: CategoryRowProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const embedUrl = () => {
    if (!selectedId) return "";
    if (type === "movie") {
      return `https://www.2embed.to/embed/tmdb/movie?id=${selectedId}`;
    }
    // Default to S1E1 for TV as requested
    return `https://www.2embed.to/embed/tmdb/tv?id=${selectedId}&season=1&episode=1`;
  };

  const onPosterClick = (id: number) => {
    setSelectedId(id);
    setOpen(true);
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
          <button
            key={`${type}-${item.id}`}
            onClick={() => onPosterClick(item.id)}
            className="relative block w-[148px] md:w-[180px] shrink-0 overflow-hidden rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ scrollSnapAlign: "start" }}
            aria-label={`Play ${item.title || item.name}`}
          >
            <img
              loading="lazy"
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={`${item.title || item.name} poster`}
              className="h-[222px] w-full object-cover md:h-[270px]"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2 text-left">
              <div className="line-clamp-1 text-xs md:text-sm font-medium">
                {item.title || item.name}
              </div>
              <div className="mt-1 inline-flex items-center gap-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <Play className="h-3 w-3" />
                Watch now
              </div>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full overflow-hidden rounded-md border border-border">
            {selectedId && (
              <iframe
                key={embedUrl()}
                src={embedUrl()}
                className="h-full w-full"
                allowFullScreen
                referrerPolicy="no-referrer"
                title="2embed player"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
