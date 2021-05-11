import React from "react";
import { Link as GatsbyLink } from "gatsby";
import { Link, Button } from "@chakra-ui/react";
import { IoArrowBackOutline } from "react-icons/io5";

const BackLink: React.FC<{}> = () => (
  <Link as={GatsbyLink} to="/" _hover={undefined}>
    <Button leftIcon={<IoArrowBackOutline />} variant="ghost">
      Back to Home
    </Button>
  </Link>
);

export default BackLink;
