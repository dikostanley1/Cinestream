import { Link } from "react-router-dom";
import { posterUrl } from "@/lib/tmdb";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/hooks/use-watchlist";

export default function MovieCard({ item, contentType }: { item: any; contentType?: "movie" | "tv" }) {
  const type = (item.media_type as "movie" | "tv") || contentType || "movie";
  const title = item.title || item.name;
  const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : "-";
  const to = type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inList = isInWatchlist(item.id, type);

  return (
    <article className="relative w-[148px] md:w-[180px] shrink-0">
      <Link to={to} className="block overflow-hidden rounded-md border border-border bg-card">
        <img
          loading="lazy"
          src={posterUrl(item.poster_path)}
          alt={`${title} poster`}
          className="h-[222px] w-full object-cover md:h-[270px]"
        />
      </Link>
      <div className="mt-2 flex items-center justify-between gap-2">
        <h3 className="line-clamp-1 text-sm font-medium" title={title}>{title}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          {rating}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Link to={to} className="flex-1">
          <Button size="sm" className="w-full">Watch</Button>
        </Link>
        <Button
          size="sm"
          variant={inList ? "secondary" : "outline"}
          onClick={() => toggleWatchlist({ id: item.id, type, title, poster_path: item.poster_path, vote_average: item.vote_average })}
          aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
        >
          {inList ? "Saved" : "+"}
        </Button>
      </div>
    </article>
  );
}
