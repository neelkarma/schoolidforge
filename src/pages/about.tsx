import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import "../styles/style.scss";
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
      <figure className="image">
        <img src={logo} style={{ height: "12rem" }} />
      </figure>
      <h1 className="title">School IDForge</h1>
      <h3 className="subtitle" style={{ marginBottom: "0.35rem" }}>
        Made with ❤️ by chickensalt
      </h3>
      <p>Last Updated {site.siteMetadata.version} | Licensed under MIT</p>
    </Layout>
  );
}
