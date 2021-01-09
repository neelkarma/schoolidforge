import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import changelogData from "../../content/changelog.json";

export default function Changelog() {
  return (
    <Layout>
      <SEO title="Changelog | School IDForge" />
      <h1 className="text-4xl lg:text-5xl mb-5 font-mono font-bold">
        School IDForge Changelog
      </h1>
      <hr className="my-3" />
      {changelogData.map((block) => {
        return (
          <div>
            <h2 className="mb-3 text-2xl lg:text-3xl">{block.title}</h2>
            <ul className="list-disc list-inside text-lg lg:list-outside">
              {block.changes.map((change, index) => {
                if (/^\+/.exec(change)) {
                  return (
                    <li key={index} className="text-green-600">
                      {change.slice(2)}
                    </li>
                  );
                }
                if (/^-/.exec(change)) {
                  return (
                    <li key={index} className="text-red-600">
                      {change.slice(2)}
                    </li>
                  );
                } else {
                  return <li key={index}>{change.slice(2)}</li>;
                }
              })}
            </ul>
            <hr className="my-3" />
          </div>
        );
      })}
    </Layout>
  );
}
