import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import logo from "../assets/logo-512.png";
import changelogData from "../../content/changelog.json";

const About: React.FC = () => {
  return (
    <Layout>
      <SEO title="About | School IDForge" />
      <img src={logo} className="h-48" />
      <h1 className="text-4xl mb-3 font-mono font-bold lg:text-5xl">
        School IDForge
      </h1>
      <h3 className="text-2xl text-gray-600 mb-3 lg:text-3xl">
        Made with ❤️ by <span className="font-mono">chickensalt</span>
      </h3>
      <p className="text-gray-500">
        Version {changelogData[0].version} | Licensed under DBAD
      </p>
    </Layout>
  );
};

export default About;
