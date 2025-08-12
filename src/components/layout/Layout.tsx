import React from "react";
import SiteHeader from "./SiteHeader";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex w-full flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8">{children}</main>
      <footer className="border-t mt-8">
        <div className="container py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Reel Roam Revue
        </div>
      </footer>
    </div>
  );
};

export default Layout;
