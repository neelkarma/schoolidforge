import React from "react";
import { Image, Heading, Text, Container, Center, VStack, Grid } from "@chakra-ui/react";
import SEO from "../components/seo";
import BackLink from "../components/backlink";
import logo from "../assets/logo-cropped.png";
import changelogData from "../../content/changelog.json";

const About: React.FC = () => {
  return (
    <Container maxW={{ base: "90%", lg: "80%" }} >
      <Grid minH="100vh">
        <Center my="25px">
          <VStack spacing={3}>
            <SEO title="About | School IDForge" />
            <BackLink />
            <Image src={logo} />
            <Heading fontSize={["2xl", "3xl"]} >
              School IDForge
            </Heading>
            <Heading fontSize={["xl", "2xl"]} color="gray.600" d="flex">
              Made with &#10084; by <Text fontFamily="Roboto Mono" ml={2}>chickensalt</Text>
            </Heading>
            <Text color="gray.500">
              Version {changelogData[0].version} | Licensed under DBAD
            </Text>
          </VStack>
        </Center>
      </Grid>
    </Container>
  );
};

export default About;
