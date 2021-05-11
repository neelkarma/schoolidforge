import React, { useEffect, useRef, useState } from "react";
import SEO from "../components/seo";
import { Link as GatsbyLink } from "gatsby";
import bwipjs from "bwip-js";
import {
  useColorMode,
  useBreakpointValue,
  Box,
  Icon,
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
  Collapse,
  Grid,
  Center,
  VStack,
  HStack,
  Text,
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
  IoChevronUpOutline,
} from "react-icons/io5";

const NavItem: React.FC<{
  icon: JSX.Element;
  label: string;
  variant: "internal" | "external";
  to: string;
}> = ({ icon, label, variant, to }) => (
  <Tooltip placement="top" label={label} aria-label="navigation item tooltip">
    {variant == "internal" ? (
      <Link as={GatsbyLink} to={to} _hover={undefined}>
        <IconButton
          icon={icon}
          variant="ghost"
          aria-label={label}
          size="lg"
          fontSize="25px"
        />
      </Link>
    ) : (
      <Link href={to} _hover={undefined}>
        <IconButton
          icon={icon}
          variant="ghost"
          aria-label={label}
          size="lg"
          fontSize="25px"
        />
      </Link>
    )}
  </Tooltip>
);

const Nav: React.FC<{}> = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack spacing={5}>
      <NavItem
        icon={<IoHelpCircleOutline />}
        label="Help"
        variant="external"
        to="https://github.com/neelkarma/schoolidforge#usage"
      />
      <NavItem
        icon={<IoBugOutline />}
        label="Report a Bug"
        variant="external"
        to="https://github.com/neelkarma/schoolidforge/blob/master/CONTRIBUTING.md"
      />
      <NavItem
        icon={<IoInformationCircleOutline />}
        label="About"
        variant="internal"
        to="/about"
      />
      <NavItem
        icon={<IoTimeOutline />}
        label="Changelog"
        variant="internal"
        to="/changelog"
      />
      <NavItem
        icon={<IoLogoGithub />}
        label="Source"
        variant="external"
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
  useEffect(() => setWindowInnerWidth(window.innerWidth), []);

  return (
    <Slider
      defaultValue={windowInnerWidth / 2}
      min={100}
      max={windowInnerWidth}
      onChange={onChange}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb boxSize={6} />
    </Slider>
  );
};

const BarcCanvas: React.FC<{
  studentID: string;
  includeText: boolean;
  barcSize: number;
  setError: (message?: string) => any;
}> = ({ studentID, includeText, barcSize, setError }) => {
  const [visible, setVisible] = useState(false);
  const barcCanvas = useRef<HTMLCanvasElement>(null);
  const saveHint = useBreakpointValue({
    base: "Tap to Save!",
    md: "Click to Save!",
  });

  const handleError = (message?: string) => {
    setVisible(false);
    setError(message);
  };

  const validateID = (): { valid: boolean; message?: string } => {
    if (studentID.trim().length < 9) return { valid: false };
    if (isNaN(Number(studentID.trim())) || studentID.trim().length > 9)
      return {
        valid: false,
        message: `${studentID.trim()} is not a valid student ID!`,
      };
    return { valid: true };
  };

  const forge = () => {
    const { valid, message } = validateID();
    if (!valid) return handleError(message);
    try {
      bwipjs.toCanvas(barcCanvas.current!, {
        bcid: "code128",
        text: studentID,
        scale: 10,
        height: 20,
        includetext: includeText,
        textxalign: "center",
        backgroundcolor: "ffffff",
        paddingwidth: 5,
        paddingheight: 5,
      });
      setError();
      setVisible(true);
    } catch (e) {
      handleError(e);
    }
  };

  const handleCanvasClick: React.MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    if (!visible) return;
    // Not using type casting creates a type error, not sure why
    (event.target as HTMLCanvasElement).toBlob((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const blobAnchor = document.createElement("a");
      blobAnchor.href = blobUrl;
      blobAnchor.download = `${studentID!.trim()}-barcode`;
      blobAnchor.click();
      setTimeout(() => {
        blobAnchor.remove();
        window.URL.revokeObjectURL(blobUrl);
      }, 0);
    });
  };

  useEffect(forge, [studentID, includeText]);

  return (
    <Collapse in={visible} animateOpacity>
      <Box m={2} _hover={{ cursor: "pointer" }}>
        <canvas
          ref={barcCanvas}
          style={{ width: `${barcSize}px` }}
          onClick={handleCanvasClick}
        ></canvas>
      </Box>
      <Center>
        <VStack spacing={0}>
          <Icon as={IoChevronUpOutline} w={8} h={8} color="gray.500" />
          <Text color="gray.500">{saveHint}</Text>
        </VStack>
      </Center>
    </Collapse>
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

const Index: React.FC<{}> = () => {
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
          <BarcCanvas
            barcSize={barcSize}
            setError={setError}
            studentID={studentID}
            includeText={includeText}
          />
        </VStack>
      </Center>
    </Grid>
  );
};

export default Index;
