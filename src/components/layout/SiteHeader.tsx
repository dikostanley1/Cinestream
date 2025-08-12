import { NavLink } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `${isActive ? "nav-link-active" : "nav-link"}`;

const SiteHeader = () => {
  return (
    <header className="header-blur">
      <div className="container flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">Reel Roam Revue</span>
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navClass} aria-label="Home">
            Home
          </NavLink>
          <NavLink to="/movies" className={navClass} aria-label="Movies">
            Movies
          </NavLink>
          <NavLink to="/tv" className={navClass} aria-label="TV Shows">
            TV Shows
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
