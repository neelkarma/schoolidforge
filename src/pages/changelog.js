import React from "react";
import "../styles/style.scss";
import Layout from "../components/layout";
import SEO from "../components/seo";
import changelogData from "../../content/changelog.json";

export default function Changelog() {
  return (
    <Layout>
      <SEO title="Changelog | School IDForge" />
      <h1 className="title is-2">
        <small className="subtitle is-2">School IDForge </small>Changelog
      </h1>
      <div className="content">
        <hr />
        {changelogData.map((block) => {
          return (
            <div>
              <h2>{block.title}</h2>
              <ul>
                {block.changes.map((change, index) => {
                  if (/^\+/.exec(change)) {
                    return (
                      <li key={index} className="has-text-success">
                        {change.slice(2)}
                      </li>
                    );
                  }
                  if (/^-/.exec(change)) {
                    return (
                      <li key={index} className="has-text-danger">
                        {change.slice(2)}
                      </li>
                    );
                  } else {
                    return <li key={index}>{change.slice(2)}</li>;
                  }
                })}
              </ul>
              <hr />
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
