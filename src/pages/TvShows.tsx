import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import poster4 from "@/assets/poster-4.jpg";
import poster5 from "@/assets/poster-5.jpg";
import poster6 from "@/assets/poster-6.jpg";
import poster1 from "@/assets/poster-1.jpg";
import poster3 from "@/assets/poster-3.jpg";

const posters = [
  { src: poster4, title: "Town of Whispers" },
  { src: poster5, title: "Starbound" },
  { src: poster6, title: "Laugh Track" },
  { src: poster1, title: "Neon Horizon" },
  { src: poster3, title: "Crimson Rain" },
];

const canonical = () => `${window.location.origin}/tv`;

const TvShows = () => {
  return (
    <Layout>
      <Helmet>
        <title>TV Shows — Reel Roam Revue</title>
        <meta
          name="description"
          content="Explore binge-worthy TV shows across genres. Discover your next series."
        />
        <link rel="canonical" href={canonical()} />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Explore TV Shows</h1>
        <p className="text-muted-foreground mt-1">From dramas to comedies and sci-fi epics.</p>
      </header>

      <section>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {posters.map((p) => (
            <article key={p.title} className="card-hover">
              <div className="aspect-[2/3] overflow-hidden rounded-lg border">
                <img
                  src={p.src}
                  alt={`${p.title} TV show poster`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h2 className="mt-2 text-sm font-medium truncate" title={p.title}>
                {p.title}
              </h2>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default TvShows;
