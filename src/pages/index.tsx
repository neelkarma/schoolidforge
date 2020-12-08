import React, { Component } from "react";
import "../styles/style.scss";
import Layout from "../components/layout";
import SEO from "../components/seo";
import bwipjs from "bwip-js";

let outputDiv: HTMLDivElement;
let outputDivBody: HTMLDivElement;

let idInput: HTMLInputElement;
let barcCanvas: HTMLCanvasElement;
let barcWidthInput: HTMLInputElement;
let barcHeightInput: HTMLInputElement;
let barcQualityInput: HTMLInputElement;
let includeTextCheckbox: HTMLInputElement;
let saveBtn: HTMLButtonElement;

export default class Home extends Component {
  componentDidMount() {
    outputDiv = document.getElementById("outputDiv") as HTMLDivElement;
    outputDivBody = document.getElementById("outputDivBody") as HTMLDivElement;
    idInput = document.getElementById("idInput") as HTMLInputElement;
    barcCanvas = document.getElementById("barcCanvas") as HTMLCanvasElement;
    barcWidthInput = document.getElementById(
      "barcWidthInput"
    ) as HTMLInputElement;
    barcHeightInput = document.getElementById(
      "barcHeightInput"
    ) as HTMLInputElement;
    barcQualityInput = document.getElementById(
      "barcQualityInput"
    ) as HTMLInputElement;
    includeTextCheckbox = document.getElementById(
      "includeTextCheckbox"
    ) as HTMLInputElement;
    saveBtn = document.getElementById("saveBtn") as HTMLButtonElement;

    barcCanvas.style.width = "150px";
    barcWidthInput.value = "150";
    barcHeightInput.value = "20";
    barcQualityInput.value = "10";
    includeTextCheckbox.checked = true;
    saveBtn.disabled = true;
  }

  saveBarc() {
    barcCanvas.toBlob((blob) => {
      let blobUrl = URL.createObjectURL(blob);
      let blobAnchor = document.createElement("a");
      blobAnchor.href = blobUrl;
      blobAnchor.download = `${idInput.value.trim()}-barcode`;
      blobAnchor.click();
      setTimeout(() => {
        blobAnchor.remove();
        window.URL.revokeObjectURL(blobUrl);
      }, 0);
    });
  }

  handleBarcWidthChange() {
    barcCanvas.style.width = barcWidthInput.value + "px";
  }

  toggleOptionsDiv() {
    document.getElementById("optionsDiv").classList.toggle("is-hidden");
  }

  forge() {
    saveBtn.disabled = true;
    barcCanvas.classList.add("is-hidden");
    idInput.classList.remove("is-danger");
    outputDivBody.innerHTML = null;
    outputDiv.classList.add("is-hidden");
    if (isNaN(idInput.value.trim() as any)) {
      outputDivBody.innerHTML = `"${idInput.value.trim()}" is not a valid Student ID!`;
      outputDiv.classList.remove("is-hidden");
      idInput.classList.add("is-danger");
      return;
    }
    if (idInput.value.trim().length < 9) {
      return;
    }
    if (idInput.value.trim().length > 9) {
      outputDivBody.innerHTML = `"${idInput.value.trim()}" is not a valid Student ID!`;
      outputDiv.classList.remove("is-hidden");
      idInput.classList.add("is-danger");
      return;
    }
    try {
      bwipjs.toCanvas("barcCanvas", {
        bcid: "code128",
        text: idInput.value.trim(),
        scale: parseInt(barcQualityInput.value),
        height: parseInt(barcHeightInput.value),
        includetext: includeTextCheckbox.checked,
        textxalign: "center",
      });
      barcCanvas.classList.remove("is-hidden");
      saveBtn.disabled = false;
    } catch (error) {
      idInput.classList.add("is-danger");
      outputDivBody.innerHTML = "Error: " + error;
      outputDiv.classList.remove("is-hidden");
    }
  }

  render() {
    return (
      <Layout>
        <SEO title="School IDForge" />
        <h1 className="title is-1">School IDForge</h1>
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              className="input"
              id="idInput"
              placeholder="Student ID"
              onChange={() => this.forge()}
            />
          </div>
          <div className="control">
            <button
              className="button is-info"
              onClick={() => this.toggleOptionsDiv()}
            >
              Options
            </button>
          </div>
          <div className="control">
            <button
              className="button is-primary"
              id="saveBtn"
              onClick={() => this.saveBarc()}
            >
              Save
            </button>
          </div>
        </div>
        <div className="message is-info is-hidden" id="optionsDiv">
          <div className="message-header">
            <p>Options</p>
          </div>
          <div className="message-body">
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">Barcode Width (px)</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control is-expanded">
                    <input
                      className="input"
                      id="barcWidthInput"
                      type="number"
                      step="20"
                      onChange={() => this.handleBarcWidthChange()}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">Barcode Height (mm)</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control is-expanded">
                    <input
                      className="input"
                      id="barcHeightInput"
                      type="number"
                      min="1"
                      onChange={() => this.forge()}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">Barcode Quality</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control is-expanded">
                    <input
                      className="input"
                      id="barcQualityInput"
                      type="number"
                      min="1"
                      max="50"
                      onChange={() => this.forge()}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className="field-label">
                <label className="label">Include Text</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <input
                    type="checkbox"
                    id="includeTextCheckbox"
                    onClick={() => this.forge()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="message is-danger is-hidden" id="outputDiv">
          <div className="message-body" id="outputDivBody"></div>
        </div>
        <div className="has-text-centered">
          <canvas id="barcCanvas" className="is-hidden"></canvas>
        </div>
      </Layout>
    );
  }
}
