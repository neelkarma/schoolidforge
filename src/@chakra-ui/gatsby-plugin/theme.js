import { extendTheme } from "@chakra-ui/react";

//TODO: Why tf isn't this working send help pls
const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
  fonts: {
    heading: "Roboto Mono",
    body: "Roboto",
  },
});

export default theme;
