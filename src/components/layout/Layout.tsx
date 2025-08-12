import { Helmet } from "react-helmet-async";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Stream Movies & TV | CineStream</title>
        <meta name="description" content="Watch trending movies and TV shows. Browse popular, top rated, and more." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
