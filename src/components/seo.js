import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import logo from "../assets/logo-512.png";

function SEO({ title }) {
  const { site } = useStaticQuery(
    graphql`
      query SEO {
        site {
          siteMetadata {
            description
            keywords
          }
        }
      }
    `
  );
  const { description, keywords } = site.siteMetadata;
  return (
    <Helmet title={title} htmlAttributes={{ lang: "en" }}>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:type" content="website" />
      <meta name="og:image" content={logo} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
};

SEO.defaultProps = {
  title: null,
};

export default SEO;
