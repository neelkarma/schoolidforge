import React from "react";
import {
  Heading,
  Divider,
  UnorderedList,
  ListItem,
  Container,
} from "@chakra-ui/react";
import BackLink from "../components/backlink";
import SEO from "../components/seo";
import changelogData from "../../content/changelog.json";

const Changelog: React.FC = () => {
  return (
    <Container maxW={{ base: "90%", lg: "80%" }} py="5px">
      <SEO title="Changelog | School IDForge" />
      <BackLink />
      <Heading size="3xl" my={6}>
        School IDForge Changelog
      </Heading>
      <Divider />
      {changelogData.map((block: { version: string; changes: string[] }) => (
        <>
          <Heading size="xl" mt={3} mb={2}>
            Version {block.version}
          </Heading>
          <UnorderedList mb={3}>
            {block.changes.map((change, index) => {
              if (change.startsWith("+")) {
                return (
                  <ListItem key={index} color="green.600">
                    {change.slice(2)}
                  </ListItem>
                );
              }
              if (change.startsWith("-")) {
                return (
                  <ListItem key={index} color="red.600">
                    {change.slice(2)}
                  </ListItem>
                );
              } else {
                return <ListItem key={index}>{change.slice(2)}</ListItem>;
              }
            })}
          </UnorderedList>
          <Divider />
        </>
      ))}
    </Container>
  );
};

export default Changelog;
