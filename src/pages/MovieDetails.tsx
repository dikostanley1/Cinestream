import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Helmet } from "react-helmet-async";
import { backdropUrl, getMovieCredits, getMovieDetails, getMovieVideos, posterUrl } from "@/lib/tmdb";
import { useWatchlist } from "@/hooks/use-watchlist";

export default function MovieDetails() {
  const { id = "" } = useParams();
  const [details, setDetails] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [provider, setProvider] = useState<"vidsrc" | "2embed" | "superembed">("vidsrc");
  const [showTrailer, setShowTrailer] = useState(false);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inList = isInWatchlist(Number(id), "movie");

  useEffect(() => {
    let active = true;
    (async () => {
      const [d, c, v] = await Promise.all([
        getMovieDetails(id),
        getMovieCredits(id),
        getMovieVideos(id),
      ]);
      if (!active) return;
      setDetails(d);
      setCredits(c);
      setVideos(v.results || []);
    })();
    return () => { active = false; };
  }, [id]);

  const trailerKey = useMemo(() => {
    const t = videos.find((x) => x.site === "YouTube" && x.type === "Trailer");
    return t?.key;
  }, [videos]);

  const embedUrl = useMemo(() => {
    switch (provider) {
      case "vidsrc":
        return `https://vidsrc.icu/embed/movie/${id}`;
      case "2embed":
        return `https://www.2embed.cc/embed/${id}`;
      case "superembed":
        return `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`;
    }
  }, [provider, id]);

  if (!details) return null;

  const title = details.title;
  const genres = (details.genres || []).map((g: any) => g.name).join(", ");

  return (
    <div>
      <Helmet>
        <title>{`${title} | CineStream`}</title>
        <meta name="description" content={details.overview?.slice(0, 150) || "Movie details"} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>

      <section
        className="mb-6 overflow-hidden rounded-md border border-border"
        aria-label="Watch Now"
      >
        <div className="aspect-video w-full bg-black">
          <iframe
            key={embedUrl}
            src={embedUrl}
            allowFullScreen
            className="h-full w-full"
            title={`${title} player`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 p-3">
          <Button variant={provider === "vidsrc" ? "default" : "outline"} onClick={() => setProvider("vidsrc")}>Vidsrc</Button>
          <Button variant={provider === "2embed" ? "default" : "outline"} onClick={() => setProvider("2embed")}>2Embed</Button>
          <Button variant={provider === "superembed" ? "default" : "outline"} onClick={() => setProvider("superembed")}>Superembed</Button>
          {trailerKey && (
            <Button variant="secondary" onClick={() => setShowTrailer(true)}>Trailer</Button>
          )}
          <Button
            variant={inList ? "secondary" : "outline"}
            onClick={() => toggleWatchlist({ id: Number(id), type: "movie", title, poster_path: details.poster_path, vote_average: details.vote_average })}
          >
            {inList ? "Saved" : "Add to Watchlist"}
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[200px,1fr]">
        <img
          src={posterUrl(details.poster_path)}
          alt={`${title} poster`}
          className="mx-auto w-[200px] rounded-md border border-border"
        />
        <div>
          <h1 className="mb-2 text-2xl font-bold">{title}</h1>
          <p className="mb-3 text-muted-foreground">{details.overview}</p>
          <div className="text-sm text-muted-foreground">
            <p><span className="text-foreground">Genres:</span> {genres || "-"}</p>
            <p><span className="text-foreground">Rating:</span> {details.vote_average?.toFixed(1) || "-"}</p>
            <p><span className="text-foreground">Runtime:</span> {details.runtime ? `${details.runtime} min` : "-"}</p>
            <p><span className="text-foreground">Release:</span> {details.release_date || "-"}</p>
          </div>
          {credits?.cast?.length ? (
            <div className="mt-4">
              <h2 className="mb-2 text-lg font-semibold">Top Cast</h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-3">
                {credits.cast.slice(0, 9).map((c: any) => (
                  <li key={c.cast_id}>{c.name} <span className="text-muted-foreground">as</span> {c.character}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <Dialog open={showTrailer} onOpenChange={setShowTrailer}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>Trailer</DialogTitle>
          {trailerKey ? (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="YouTube trailer"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
