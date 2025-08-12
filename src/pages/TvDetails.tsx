import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Helmet } from "react-helmet-async";
import { getSeasonDetails, getTvCredits, getTvDetails, getTvVideos, posterUrl } from "@/lib/tmdb";
import { useWatchlist } from "@/hooks/use-watchlist";

export default function TvDetails() {
  const { id = "" } = useParams();
  const [details, setDetails] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [provider, setProvider] = useState<"vidsrc" | "2embed" | "superembed">("vidsrc");
  const [showTrailer, setShowTrailer] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodesCount, setEpisodesCount] = useState(1);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inList = isInWatchlist(Number(id), "tv");

  useEffect(() => {
    let active = true;
    (async () => {
      const [d, c, v] = await Promise.all([
        getTvDetails(id),
        getTvCredits(id),
        getTvVideos(id),
      ]);
      if (!active) return;
      setDetails(d);
      setCredits(c);
      setVideos(v.results || []);
      const initialSeason = d?.seasons?.find((s: any) => s.season_number > 0)?.season_number || 1;
      setSeason(initialSeason);
    })();
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    let active = true;
    (async () => {
      const s = await getSeasonDetails(id, season);
      if (!active) return;
      setEpisodesCount((s?.episodes?.length as number) || 1);
      setEpisode(1);
    })();
    return () => { active = false; };
  }, [id, season]);

  const trailerKey = useMemo(() => {
    const t = videos.find((x) => x.site === "YouTube" && x.type === "Trailer");
    return t?.key;
  }, [videos]);

  const embedUrl = useMemo(() => {
    switch (provider) {
      case "vidsrc":
        return `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`;
      case "2embed":
        return `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`;
      case "superembed":
        return `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
    }
  }, [provider, id, season, episode]);

  if (!details) return null;

  const title = details.name;
  const genres = (details.genres || []).map((g: any) => g.name).join(", ");

  return (
    <div>
      <Helmet>
        <title>{`${title} | CineStream`}</title>
        <meta name="description" content={details.overview?.slice(0, 150) || "TV details"} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>

      <section className="mb-6 overflow-hidden rounded-md border border-border" aria-label="Watch Now">
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
          <div className="ml-auto flex items-center gap-2 text-sm">
            <label>
              Season
              <select className="ml-2 rounded-md border border-border bg-background px-2 py-1" value={season} onChange={(e) => setSeason(Number(e.target.value))}>
                {details.seasons?.filter((s: any) => s.season_number > 0).map((s: any) => (
                  <option key={s.id} value={s.season_number}>{s.season_number}</option>
                ))}
              </select>
            </label>
            <label>
              Episode
              <select className="ml-2 rounded-md border border-border bg-background px-2 py-1" value={episode} onChange={(e) => setEpisode(Number(e.target.value))}>
                {Array.from({ length: episodesCount }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="w-full px-3 text-xs text-muted-foreground">
            <a className="underline" href={`https://www.2embed.cc/embedtvfull/${id}`} target="_blank" rel="noreferrer">Open full season (2Embed)</a>
          </div>
          <Button
            variant={inList ? "secondary" : "outline"}
            onClick={() => toggleWatchlist({ id: Number(id), type: "tv", title, poster_path: details.poster_path, vote_average: details.vote_average })}
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
            <p><span className="text-foreground">First Air Date:</span> {details.first_air_date || "-"}</p>
            <p><span className="text-foreground">Seasons:</span> {details.number_of_seasons || "-"}</p>
          </div>
          {credits?.cast?.length ? (
            <div className="mt-4">
              <h2 className="mb-2 text-lg font-semibold">Top Cast</h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-3">
                {credits.cast.slice(0, 9).map((c: any) => (
                  <li key={c.cast_id || c.credit_id}>{c.name} <span className="text-muted-foreground">as</span> {c.character}</li>
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
