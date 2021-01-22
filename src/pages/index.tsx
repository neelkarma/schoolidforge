import React, { Component } from "react";
import { PageProps } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import bwipjs from "bwip-js";

export default class Home extends Component {
  optionsDiv: React.RefObject<HTMLDivElement>;
  outputDiv: React.RefObject<HTMLDivElement>;
  idInput: React.RefObject<HTMLInputElement>;
  barcCanvas: React.RefObject<HTMLCanvasElement>;
  barcWidthInput: React.RefObject<HTMLInputElement>;
  barcHeightInput: React.RefObject<HTMLInputElement>;
  includeTextCheckbox: React.RefObject<HTMLInputElement>;
  saveBtn: React.RefObject<HTMLButtonElement>;
  constructor(props: PageProps) {
    super(props);

    this.optionsDiv = React.createRef();
    this.outputDiv = React.createRef();
    this.idInput = React.createRef();
    this.barcCanvas = React.createRef();
    this.barcWidthInput = React.createRef();
    this.barcHeightInput = React.createRef();
    this.includeTextCheckbox = React.createRef();
    this.saveBtn = React.createRef();

    this.saveBarc = this.saveBarc.bind(this);
    this.handleBarcWidthChange = this.handleBarcWidthChange.bind(this);
    this.toggleOptionsDiv = this.toggleOptionsDiv.bind(this);
    this.forge = this.forge.bind(this);
  }

  componentDidMount() {
    this.saveBtn.current!.disabled = true;
    this.barcCanvas.current!.style.width = "150px";
    this.barcWidthInput.current!.value = "150";
    this.barcHeightInput.current!.value = "20";
    this.includeTextCheckbox.current!.checked = true;
  }

  saveBarc() {
    this.barcCanvas.current!.toBlob((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const blobAnchor = document.createElement("a");
      blobAnchor.href = blobUrl;
      blobAnchor.download = `${this.idInput.current!.value.trim()}-barcode`;
      blobAnchor.click();
      setTimeout(() => {
        blobAnchor.remove();
        window.URL.revokeObjectURL(blobUrl);
      }, 0);
    });
  }

  handleBarcWidthChange() {
    this.barcCanvas.current!.style.width =
      this.barcWidthInput.current!.value + "px";
  }

  toggleOptionsDiv() {
    if (this.optionsDiv.current!.classList.contains("block")) {
      this.optionsDiv.current!.classList.remove("block");
      this.optionsDiv.current!.classList.add("hidden");
    } else {
      this.optionsDiv.current!.classList.remove("hidden");
      this.optionsDiv.current!.classList.add("block");
    }
  }

  forge() {
    this.saveBtn.current!.classList.remove("hover:bg-green-500");
    this.saveBtn.current!.disabled = true;
    this.barcCanvas.current!.classList.add("hidden");
    this.outputDiv.current!.innerHTML = "";
    this.outputDiv.current!.classList.remove("block");
    this.outputDiv.current!.classList.add("hidden");
    if (isNaN(Number(this.idInput.current!.value.trim()))) {
      this.outputDiv.current!.innerHTML = `"${this.idInput.current!.value.trim()}" is not a valid Student ID!`;
      this.outputDiv.current!.classList.add("block");
      this.outputDiv.current!.classList.remove("hidden");
      return;
    }
    if (this.idInput.current!.value.trim().length < 9) {
      return;
    }
    if (this.idInput.current!.value.trim().length > 9) {
      this.outputDiv.current!.innerHTML = `"${this.idInput.current!.value.trim()}" is not a valid Student ID!`;
      this.outputDiv.current!.classList.add("block");
      this.outputDiv.current!.classList.remove("hidden");
      return;
    }
    try {
      bwipjs.toCanvas(this.barcCanvas.current!, {
        bcid: "code128",
        text: this.idInput.current!.value.trim(),
        scale: 10,
        height: parseInt(this.barcHeightInput.current!.value),
        includetext: this.includeTextCheckbox.current!.checked,
        textxalign: "center",
      });
      this.barcCanvas.current!.classList.remove("hidden");
      this.saveBtn.current!.disabled = false;
      this.saveBtn.current!.classList.add("hover:bg-green-500");
    } catch (error) {
      this.outputDiv.current!.innerHTML = "Error: " + error;
      this.outputDiv.current!.classList.add("block");
      this.outputDiv.current!.classList.remove("hidden");
    }
  }

  render() {
    return (
      <Layout>
        <SEO title="School IDForge" />
        <h1 className="text-4xl lg:text-5xl mb-5 font-mono font-bold">
          School IDForge
        </h1>
        <div className="flex">
          <input
            className="font-mono border border-gray-300 shadow-inner flex-grow rounded-l-md py-3 px-1 lg:px-3 lg:rounded-l-lg lg:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            ref={this.idInput}
            placeholder="Student ID"
            onChange={this.forge}
          />
          <button
            className="tracking-wide font-semibold flex-shrink py-3 px-1 lg:px-3 rounded-none lg:text-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={this.toggleOptionsDiv}
          >
            Options
          </button>
          <button
            className="tracking-wide font-semibold flex-shrink py-3 px-1 lg:px-3 rounded-r-md lg:rounded-r-lg lg:text-md bg-green-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            ref={this.saveBtn}
            onClick={this.saveBarc}
          >
            Save
          </button>
        </div>
        <div
          className="hidden mt-2 bg-white border rounded-md border-gray-300 shadow-lg lg:rounded-lg"
          ref={this.optionsDiv}
        >
          <div className="px-3 py-3 space-y-2 lg:px-5 lg:space-y-3">
            <label className="flex font-semibold items-center">
              Barcode Width (px)
              <input
                className="flex-grow ml-2 p-1 shadow-inner border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 rounded"
                ref={this.barcWidthInput}
                type="number"
                step="20"
                onChange={this.handleBarcWidthChange}
              />
            </label>
            <label className="flex font-semibold items-center">
              Barcode Height (mm)
              <input
                className="flex-grow ml-2 p-1 shadow-inner border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 rounded"
                ref={this.barcHeightInput}
                type="number"
                min="1"
                onChange={this.forge}
              />
            </label>
            <label className="flex font-semibold items-center">
              <input
                className="mr-2 w-4 h-4"
                type="checkbox"
                ref={this.includeTextCheckbox}
                onClick={this.forge}
              />
              Include Text
            </label>
          </div>
        </div>
        <div
          className="hidden mt-3 bg-red-100 border border-red-200 text-red-800 p-3 rounded lg:rounded-lg lg:p-5"
          ref={this.outputDiv}
        ></div>
        <div className="mt-3 flex flex-col items-center">
          <canvas ref={this.barcCanvas} className="hidden"></canvas>
        </div>
      </Layout>
    );
  }
}
