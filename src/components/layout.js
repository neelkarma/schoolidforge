import React from "react";
import { Link } from "gatsby";

export default function Layout({ children }) {
  return (
    <div>
      <section className="section">
        <div className="container" id="root">
          {children}
        </div>
      </section>
      <nav
        className="navbar is-fixed-bottom is-light"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a
            role="button"
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarId"
            onClick={() => {
              document
                .getElementsByClassName("navbar-burger")[0]
                .classList.toggle("is-active");
              document.getElementById("navbarId").classList.toggle("is-active");
            }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div className="navbar-menu" id="navbarId">
          <div className="navbar-start">
            <Link to="/" className="navbar-item">
              Home
            </Link>
            <a
              className="navbar-item"
              href="https://github.com/neelkarma/schoolidforge#usage"
            >
              Help
            </a>
            <a
              className="navbar-item"
              href="https://github.com/neelkarma/schoolidforge/blob/master/CONTRIBUTING.md"
            >
              Report a Bug
            </a>
            <Link className="navbar-item" to="/about">
              About
            </Link>
            <Link className="navbar-item" to="/changelog">
              Changelog
            </Link>
            <a
              className="navbar-item"
              href="https://github.com/neelkarma/schoolidforge"
            >
              Source
            </a>
          </div>
          <div className="navbar-end">
            <p className="navbar-item">Made by chickensalt</p>
          </div>
        </div>
      </nav>
    </div>
  );
}
