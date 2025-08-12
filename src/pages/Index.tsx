import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import heroImage from "@/assets/hero-cinema.jpg";
import poster1 from "@/assets/poster-1.jpg";
import poster2 from "@/assets/poster-2.jpg";
import poster3 from "@/assets/poster-3.jpg";
import poster4 from "@/assets/poster-4.jpg";
import poster5 from "@/assets/poster-5.jpg";
import poster6 from "@/assets/poster-6.jpg";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

const posters = [
  { src: poster1, title: "Neon Horizon" },
  { src: poster2, title: "Dragon's Dawn" },
  { src: poster3, title: "Crimson Rain" },
  { src: poster4, title: "Town of Whispers" },
  { src: poster5, title: "Starbound" },
  { src: poster6, title: "Laugh Track" },
];

const canonical = (path = "/") =>
  `${window.location.origin}${path}`;

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>Reel Roam Revue — Discover Movies and TV Shows</title>
        <meta
          name="description"
          content="Explore trending movies and TV shows. Browse, discover, and dive into cinematic worlds."
        />
        <link rel="canonical" href={canonical("/")} />
      </Helmet>

      <section className="rounded-2xl overflow-hidden shadow-[var(--shadow-elegant)]">
        <div className="relative aspect-[16/6] w-full">
          <img
            src={heroImage}
            alt="Cinematic neon glow with film reel motifs"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your gateway to great stories
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-6">
                Discover trending titles, hidden gems, and timeless classics across
                movies and TV.
              </p>
              <div className="flex gap-3">
                <NavLink to="/movies">
                  <Button variant="hero" size="lg">Browse Movies</Button>
                </NavLink>
                <NavLink to="/tv">
                  <Button variant="outline" size="lg">Explore TV Shows</Button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Trending Now</h2>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {posters.map((p) => (
            <article key={p.title} className="card-hover">
              <div className="aspect-[2/3] overflow-hidden rounded-lg border">
                <img
                  src={p.src}
                  alt={`${p.title} poster`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-2 text-sm font-medium truncate" title={p.title}>
                {p.title}
              </h3>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
