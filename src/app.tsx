import React, { useEffect, useState, Suspense } from "react";
import SEO from "./seo";
import {
  useColorMode,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Link,
  Tooltip,
  Alert,
  AlertIcon,
  Grid,
  Center,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import {
  IoTextOutline,
  IoHelpCircleOutline,
  IoBugOutline,
  IoTimeOutline,
  IoLogoGithub,
  IoInformationCircleOutline,
  IoSunnyOutline,
  IoMoonOutline,
} from "react-icons/io5";

const BarcCanvas = React.lazy(() => import("./barcode"));

const NavItem: React.FC<{
  icon: JSX.Element;
  label: string;
  to: string;
}> = ({ icon, label, to }) => (
  <Tooltip placement="top" label={label} aria-label="navigation item tooltip">
    <Link href={to} _hover={undefined}>
      <IconButton
        icon={icon}
        variant="ghost"
        aria-label={label}
        size="lg"
        fontSize="25px"
      />
    </Link>
  </Tooltip>
);

const Nav: React.FC<{}> = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack spacing={{ base: 2, md: 5 }}>
      <NavItem
        icon={<IoHelpCircleOutline />}
        label="Help"
        to="https://github.com/neelkarma/schoolidforge/blob/master/README.md#usage"
      />
      <NavItem
        icon={<IoBugOutline />}
        label="Report a Bug"
        to="https://github.com/neelkarma/schoolidforge/issues/new"
      />
      <NavItem
        icon={<IoInformationCircleOutline />}
        label="About"
        to="https://github.com/neelkarma/schoolidforge/blob/master/ABOUT.md"
      />
      <NavItem
        icon={<IoTimeOutline />}
        label="Changelog"
        to="https://github.com/neelkarma/schoolidforge/blob/master/CHANGELOG.md"
      />
      <NavItem
        icon={<IoLogoGithub />}
        label="Source"
        to="https://github.com/neelkarma/schoolidforge"
      />
      <Tooltip
        placement="top"
        label={colorMode == "light" ? "Dark Mode" : "Light Mode"}
        aria-label="color mode toggle"
      >
        <IconButton
          variant="ghost"
          aria-label="color mode toggle"
          icon={colorMode == "light" ? <IoMoonOutline /> : <IoSunnyOutline />}
          onClick={toggleColorMode}
          size="lg"
          fontSize="25px"
        />
      </Tooltip>
    </HStack>
  );
};

const IDInput: React.FC<{
  onIDChange: (id: string) => any;
  onTextClick: (text: boolean) => any;
}> = ({ onIDChange, onTextClick }) => {
  const [text, setText] = useState(false);
  const handleIDChange: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    onIDChange(event.target.value);
  const handleTextClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setText(!text);
    onTextClick(!text);
  };

  return (
    <InputGroup size="lg" variant="filled">
      <Input onChange={handleIDChange} placeholder="Student ID" />
      <InputRightElement>
        <Tooltip
          label="Include Student ID in Barcode"
          aria-label="enable text tooltip"
        >
          <IconButton
            aria-label="Enable Text"
            variant={text ? "solid" : "ghost"}
            colorScheme="blue"
            onClick={handleTextClick}
            icon={<IoTextOutline />}
            fontSize="20px"
          />
        </Tooltip>
      </InputRightElement>
    </InputGroup>
  );
};

const BarcSizeInput: React.FC<{
  onChange: (value: number) => any;
}> = ({ onChange }) => {
  const [windowInnerWidth, setWindowInnerWidth] = useState(200);
  useEffect(() => setWindowInnerWidth(window.innerWidth), [window.innerWidth]);

  return (
    <Slider
      defaultValue={(() => window.innerWidth / 2)()}
      min={100}
      max={(windowInnerWidth * 4) / 5}
      onChange={onChange}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb boxSize={5} />
    </Slider>
  );
};

const BarcErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
  return message ? (
    <Alert status="error">
      <AlertIcon />
      {message}
    </Alert>
  ) : null;
};

const App: React.FC<{}> = () => {
  const [studentID, setStudentID] = useState("");
  const [barcSize, setBarcSize] = useState(200);
  const [includeText, setIncludeText] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  useEffect(() => setBarcSize(window.innerWidth / 2), []);

  return (
    <Grid minH="100vh">
      <Center>
        <VStack spacing={5} w={{ base: "90%", lg: "80%" }}>
          <SEO title="School IDForge" />
          <Nav />
          <IDInput onIDChange={setStudentID} onTextClick={setIncludeText} />
          <BarcSizeInput onChange={setBarcSize} />
          <BarcErrorMessage message={error} />
          <Suspense fallback={<Spinner />}>
            <BarcCanvas
              barcSize={barcSize}
              setError={setError}
              studentID={studentID}
              includeText={includeText}
            />
          </Suspense>
        </VStack>
      </Center>
    </Grid>
  );
};

export default App;
