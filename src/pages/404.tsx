import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { Link } from "gatsby";

export default function FourOhFour() {
  return (
    <Layout>
      <SEO title="404 | School IDForge" />
      <h3 className="font-mono font-semibold text-3xl text-gray-500 mb-3 lg:text-4xl">
        Error 404
      </h3>
      <h1 className="font-mono font-semibold text-4xl mb-5 lg:text-5xl">
        I'm afraid that page doesn't exist.
      </h1>
      <Link
        className="inline-block p-3 bg-blue-400 hover:bg-blue-500 text-white outline-none focus:ring-2 focus:ring-blue-500 font-semibold rounded-lg"
        to="/"
      >
        Go Home
      </Link>
    </Layout>
  );
}
