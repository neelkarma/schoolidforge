import React from "react";
import { Helmet } from "react-helmet";
import logo from "./assets/logo-512.png";

const SEO: React.FC<{ title: string }> = ({ title }) => {
  const siteMetadata = {
    description:
      "A simple tool that generates an ID Card Barcode from a Student ID.",
    keywords: "forge,id,student,school,idforge",
  };
  return (
    <Helmet title={title} htmlAttributes={{ lang: "en" }}>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="description" content={siteMetadata.description} />
      <meta name="keywords" content={siteMetadata.keywords} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={siteMetadata.description} />
      <meta name="og:type" content="website" />
      <meta name="og:image" content={logo} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={siteMetadata.description} />
    </Helmet>
  );
};

export default SEO;
