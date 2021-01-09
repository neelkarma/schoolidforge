import React from "react";
import { Link } from "gatsby";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <main className="container px-5 lg:px-36 mt-5 m-auto lg:mt-10">
        {children}
      </main>
      <footer className="sticky flex-shrink-0 bottom-0 flex h-12 bg-gray-200 text-gray-700 items-center lg:justify-start">
        <NavbarItem
          title="Home"
          variant="internal"
          to="/"
          icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
        <NavbarItem
          title="Help"
          variant="external"
          to="https://github.com/neelkarma/schoolidforge#usage"
          icon="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <NavbarItem
          title="Report a Bug"
          variant="external"
          to="https://github.com/neelkarma/schoolidforge/blob/master/CONTRIBUTING.md"
          icon="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
        />
        <NavbarItem
          title="About"
          variant="internal"
          to="/about"
          icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <NavbarItem
          title="Changelog"
          variant="internal"
          to="/changelog"
          icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
        <NavbarItem
          title="Source"
          variant="external"
          to="https://github.com/neelkarma/schoolidforge"
          icon="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
        <p className="text-right flex-grow hidden px-3 lg:inline">
          Made by <span className="font-mono">chickensalt</span>
        </p>
      </footer>
    </div>
  );
}

function NavbarItem({
  title,
  icon,
  variant,
  to,
}: {
  title: string;
  icon: string;
  variant: "internal" | "external";
  to: string;
}) {
  const linkClasses =
    "inline-flex space-x-1.5 h-full items-center px-3 hover:bg-gray-300";
  const titleClasses = "hidden lg:inline";
  const iconElement = (
    <svg
      className="w-7 h-7 lg:w-6 lg:h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d={icon}
      />
    </svg>
  );
  switch (variant) {
    case "internal":
      return (
        <Link to={to} className={linkClasses}>
          {iconElement} <span className={titleClasses}>{title}</span>
        </Link>
      );
    case "external":
      return (
        <a href={to} className={linkClasses}>
          {iconElement} <span className={titleClasses}>{title}</span>
        </a>
      );
  }
}
