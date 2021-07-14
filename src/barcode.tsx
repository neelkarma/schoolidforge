import React, { useState, useRef, useEffect } from "react";
import {
  useBreakpointValue,
  Collapse,
  Box,
  VStack,
  Icon,
  Center,
  Text,
} from "@chakra-ui/react";
import bwipjs from "bwip-js";
import { IoChevronUpOutline } from "react-icons/io5";

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

export default BarcCanvas;
