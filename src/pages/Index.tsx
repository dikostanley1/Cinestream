import { Helmet } from "react-helmet-async";
import CategoryRow from "@/components/CategoryRow";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Home | CineStream</title>
        <meta name="description" content="Watch popular and top rated movies and TV shows. Stream instantly with 2embed." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>

      {/* Movies */}
      <CategoryRow title="Popular Movies" type="movie" path="/movie/popular" />
      <CategoryRow title="Top Rated Movies" type="movie" path="/movie/top_rated" />
      <CategoryRow title="Upcoming Movies" type="movie" path="/movie/upcoming" />

      {/* TV Shows */}
      <CategoryRow title="Popular TV Shows" type="tv" path="/tv/popular" />
      <CategoryRow title="Top Rated TV Shows" type="tv" path="/tv/top_rated" />
      <CategoryRow title="Airing Today" type="tv" path="/tv/airing_today" />
    </div>
  );
};

export default Index;
