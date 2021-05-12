import React from "react";
import { Heading, Container, Grid, Center, VStack } from "@chakra-ui/react";
import SEO from "../components/seo";
import BackLink from "../components/backlink";

const FourOhFour: React.FC = () => (
  <Container maxW={{ base: "90%", lg: "80%" }}>
    <Grid minH="100vh">
      <Center>
        <VStack spacing={3}>
          <SEO title="404 | School IDForge" />
          <Heading fontSize={["xl", "2xl"]} color="gray.500">
            Error 404
          </Heading>
          <Heading fontSize={["2xl", "3xl"]}>
            I'm afraid that page doesn't exist.
          </Heading>
          <BackLink />
        </VStack>
      </Center>
    </Grid>
  </Container>
);

export default FourOhFour;
