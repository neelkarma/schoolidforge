import React from "react";
import { Heading, Button, Container, Link } from "@chakra-ui/react";
import SEO from "../components/seo";
import { Link as GatsbyLink } from "gatsby";

const FourOhFour: React.FC = () => {
  return (
    <Container>
      <SEO title="404 | School IDForge" />
      <Link as={GatsbyLink} to="/">Back to Home</Link>
      <Heading fontSize={["xl", "2xl"]} mb={3}>
        Error 404
      </Heading>
      <Heading fontSize={["2xl", "3xl"]}>
        I'm afraid that page doesn't exist.
      </Heading>
      <Button as={GatsbyLink}
        d="inline-block"
        p={3}
        to="/"
      >
        Go Home
      </Button>
    </Container>
  );
};

export default FourOhFour;
