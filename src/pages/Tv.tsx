import Row from "@/components/Row";
import { Helmet } from "react-helmet-async";

export default function Tv() {
  return (
    <div>
      <Helmet>
        <title>TV Shows | CineStream</title>
        <meta name="description" content="Popular, trending, and top rated TV shows." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>
      <h1 className="mb-4 text-xl font-semibold">TV Shows</h1>
      <Row title="Trending TV" type="tv" path="/trending/tv/week" />
      <Row title="Popular TV" type="tv" path="/tv/popular" />
      <Row title="Top Rated TV" type="tv" path="/tv/top_rated" />
      <Row title="On The Air" type="tv" path="/tv/on_the_air" />
    </div>
  );
}
