import React, { useRef, useCallback, useEffect } from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
// @types/bwip-js hasn't been updated to support v3.0.0 yet
//@ts-ignore
import { code128 } from "bwip-js";

const Home: React.FC = () => {
  const optionsDiv = useRef<HTMLDivElement>(null);
  const outputDiv = useRef<HTMLDivElement>(null);
  const idInput = useRef<HTMLInputElement>(null);
  const barcCanvas = useRef<HTMLCanvasElement>(null);
  const barcWidthInput = useRef<HTMLInputElement>(null);
  const barcHeightInput = useRef<HTMLInputElement>(null);
  const includeTextCheckbox = useRef<HTMLInputElement>(null);
  const saveBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    saveBtn.current!.disabled = true;
    barcCanvas.current!.style.width = "150px";
    barcWidthInput.current!.value = "150";
    barcHeightInput.current!.value = "20";
    includeTextCheckbox.current!.checked = true;
  }, []);

  const saveBarc = useCallback(() => {
    barcCanvas.current!.toBlob((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const blobAnchor = document.createElement("a");
      blobAnchor.href = blobUrl;
      blobAnchor.download = `${idInput.current!.value.trim()}-barcode`;
      blobAnchor.click();
      setTimeout(() => {
        blobAnchor.remove();
        window.URL.revokeObjectURL(blobUrl);
      }, 0);
    });
  }, []);

  const handleBarcWidthChange = useCallback(() => {
    barcCanvas.current!.style.width = barcWidthInput.current!.value + "px";
  }, []);

  const toggleOptionsDiv = useCallback(() => {
    if (optionsDiv.current!.classList.contains("block")) {
      optionsDiv.current!.classList.remove("block");
      optionsDiv.current!.classList.add("hidden");
    } else {
      optionsDiv.current!.classList.remove("hidden");
      optionsDiv.current!.classList.add("block");
    }
  }, []);

  const forge = useCallback(() => {
    saveBtn.current!.classList.remove("hover:bg-green-500");
    saveBtn.current!.disabled = true;
    barcCanvas.current!.classList.add("hidden");
    outputDiv.current!.innerHTML = "";
    outputDiv.current!.classList.remove("block");
    outputDiv.current!.classList.add("hidden");
    if (isNaN(Number(idInput.current!.value.trim()))) {
      outputDiv.current!.innerHTML = `"${idInput.current!.value.trim()}" is not a valid Student ID!`;
      outputDiv.current!.classList.add("block");
      outputDiv.current!.classList.remove("hidden");
      return;
    }
    if (idInput.current!.value.trim().length < 9) {
      return;
    }
    if (idInput.current!.value.trim().length > 9) {
      outputDiv.current!.innerHTML = `"${idInput.current!.value.trim()}" is not a valid Student ID!`;
      outputDiv.current!.classList.add("block");
      outputDiv.current!.classList.remove("hidden");
      return;
    }
    try {
      code128(barcCanvas.current!, {
        text: idInput.current!.value.trim(),
        scale: 10,
        height: parseInt(barcHeightInput.current!.value),
        includetext: includeTextCheckbox.current!.checked,
        textxalign: "center",
      });
      barcCanvas.current!.classList.remove("hidden");
      saveBtn.current!.disabled = false;
      saveBtn.current!.classList.add("hover:bg-green-500");
    } catch (error) {
      outputDiv.current!.innerHTML = "Error: " + error;
      outputDiv.current!.classList.add("block");
      outputDiv.current!.classList.remove("hidden");
    }
  }, []);

  return (
    <Layout>
      <SEO title="School IDForge" />
      <h1 className="text-4xl lg:text-5xl mb-5 font-mono font-bold">
        School IDForge
      </h1>
      <div className="flex">
        <input
          className="font-mono border border-gray-300 shadow-inner flex-grow rounded-l-md py-3 px-1 lg:px-3 lg:rounded-l-lg lg:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          ref={idInput}
          placeholder="Student ID"
          onChange={forge}
        />
        <button
          className="tracking-wide font-semibold flex-shrink py-3 px-1 lg:px-3 rounded-none lg:text-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={toggleOptionsDiv}
        >
          Options
        </button>
        <button
          className="tracking-wide font-semibold flex-shrink py-3 px-1 lg:px-3 rounded-r-md lg:rounded-r-lg lg:text-md bg-green-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          ref={saveBtn}
          onClick={saveBarc}
        >
          Save
        </button>
      </div>
      <div
        className="hidden mt-2 bg-white border rounded-md border-gray-300 shadow-lg lg:rounded-lg"
        ref={optionsDiv}
      >
        <div className="px-3 py-3 space-y-2 lg:px-5 lg:space-y-3">
          <label className="flex font-semibold items-center">
            Barcode Width (px)
            <input
              className="flex-grow ml-2 p-1 shadow-inner border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 rounded"
              ref={barcWidthInput}
              type="number"
              step="20"
              onChange={handleBarcWidthChange}
            />
          </label>
          <label className="flex font-semibold items-center">
            Barcode Height (mm)
            <input
              className="flex-grow ml-2 p-1 shadow-inner border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 rounded"
              ref={barcHeightInput}
              type="number"
              min="1"
              onChange={forge}
            />
          </label>
          <label className="flex font-semibold items-center">
            <input
              className="mr-2 w-4 h-4"
              type="checkbox"
              ref={includeTextCheckbox}
              onClick={forge}
            />
            Include Text
          </label>
        </div>
      </div>
      <div
        className="hidden mt-3 bg-red-100 border border-red-200 text-red-800 p-3 rounded lg:rounded-lg lg:p-5"
        ref={outputDiv}
      ></div>
      <div className="mt-3 flex flex-col items-center">
        <canvas ref={barcCanvas} className="hidden"></canvas>
      </div>
    </Layout>
  );
};

export default Home;
