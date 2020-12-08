import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { Link } from "gatsby";
import "../styles/style.scss";

export default function FourOhFour() {
  return (
    <Layout>
      <SEO title="404 | School IDForge" />
      <h3 className="subtitle">Error 404</h3>
      <h1 className="title">I'm afraid that page doesn't exist.</h1>
      <Link className="button is-primary" to="/">
        Go Home
      </Link>
    </Layout>
  );
}
