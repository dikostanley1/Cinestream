import Row from "@/components/Row";
import { Helmet } from "react-helmet-async";

export default function Movies() {
  return (
    <div>
      <Helmet>
        <title>Movies | CineStream</title>
        <meta name="description" content="Popular, trending, and top rated movies." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>
      <h1 className="mb-4 text-xl font-semibold">Movies</h1>
      <Row title="Trending Movies" type="movie" path="/trending/movie/week" />
      <Row title="Popular Movies" type="movie" path="/movie/popular" />
      <Row title="Top Rated Movies" type="movie" path="/movie/top_rated" />
      <Row title="Upcoming" type="movie" path="/movie/upcoming" />
      <Row title="Now Playing" type="movie" path="/movie/now_playing" />
    </div>
  );
}
