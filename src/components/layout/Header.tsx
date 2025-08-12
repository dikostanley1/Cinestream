import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navLink = (
  to: string,
  label: string,
  pathname: string
) => (
  <Link
    to={to}
    className={cn(
      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
      pathname === to
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
    )}
  >
    {label}
  </Link>
);

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [q, setQ] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?query=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center gap-4 px-4 py-3">
        <Link to="/" className="mr-2 text-lg font-bold">
          CineStream
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {navLink("/", "Home", pathname)}
          {navLink("/movies", "Movies", pathname)}
          {navLink("/tv", "TV Shows", pathname)}
        </div>
        <div className="ml-auto w-full max-w-[420px]">
          <form onSubmit={onSubmit} className="relative">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies, TV..."
              className="pl-3 pr-10"
              aria-label="Search movies and TV shows"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Search
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}
