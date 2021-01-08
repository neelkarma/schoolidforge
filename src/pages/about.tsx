import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import logo from "../assets/logo-512.png";

export default function About() {
  const { site } = useStaticQuery(
    graphql`
      query About {
        site {
          siteMetadata {
            version
          }
        }
      }
    `
  );
  return (
    <Layout>
      <SEO title="About | School IDForge" />
      <img src={logo} className="h-48" />
      <h1 className="text-5xl mb-3">School IDForge</h1>
      <h3 className="text-3xl text-gray-500 mb-3">
        Made with ❤️ by <span className="font-mono">chickensalt</span>
      </h3>
      <p>Last Updated {site.siteMetadata.version} | Licensed under DBAD</p>
    </Layout>
  );
}
