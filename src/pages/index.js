import React, { Component } from "react";
import "../styles/style.scss";
import Layout from "../components/layout";
import SEO from "../components/seo";
import bwipjs from "bwip-js";

class Home extends Component {
  componentDidMount() {
    document.getElementById("barcCanvas").style.width = "150px";
    document.getElementById("barcWidthInput").value = 150;
    document.getElementById("barcHeightInput").value = 20;
    document.getElementById("barcQualityInput").value = 10;
    document.getElementById("includeTextCheckbox").checked = true;
    document.getElementById("saveBtn").disabled = true;
  }

  saveBarc() {
    document.getElementById("barcCanvas").toBlob(blob => {
      let blobUrl = URL.createObjectURL(blob);
      let blobAnchor = document.createElement("a");
      blobAnchor.href = blobUrl;
      blobAnchor.download = `${document
        .getElementById("idInput")
        .value.trim()}-barcode`;
      blobAnchor.click();
      setTimeout(() => {
        blobAnchor.remove();
        window.URL.revokeObjectURL(blobUrl);
      }, 0);
    });
  }

  handleBarcWidthChange() {
    document.getElementById("barcCanvas").style.width =
      document.getElementById("barcWidthInput").value + "px";
  }

  toggleOptionsDiv() {
    document.getElementById("optionsDiv").classList.toggle("is-hidden");
  }

  forge() {
    const idInput = document.getElementById("idInput");
    document.getElementById("saveBtn").disabled = true;
    document.getElementById("barcCanvas").classList.add("is-hidden");
    idInput.classList.remove("is-danger");
    document.getElementById("outputDivBody").innerHTML = null;
    document.getElementById("outputDiv").classList.add("is-hidden");
    if (isNaN(idInput.value.trim())) {
      document.getElementById(
        "outputDivBody"
      ).innerHTML = `"${idInput.value.trim()}" is not a valid Student ID!`;
      document.getElementById("outputDiv").classList.remove("is-hidden");
      idInput.classList.add("is-danger");
      return;
    }
    if (idInput.value.trim().length < 9) {
      return;
    }
    if (idInput.value.trim().length > 9) {
      document.getElementById(
        "outputDivBody"
      ).innerHTML = `"${idInput.value.trim()}" is not a valid Student ID!`;
      document.getElementById("outputDiv").classList.remove("is-hidden");
      idInput.classList.add("is-danger");
      return;
    }
    try {
      bwipjs.toCanvas("barcCanvas", {
        bcid: "code128",
        text: document.getElementById("idInput").value.trim(),
        scale: document.getElementById("barcQualityInput").value,
        height: document.getElementById("barcHeightInput").value,
        includetext: document.getElementById("includeTextCheckbox").checked,
        textxalign: "center",
      });
      document.getElementById("barcCanvas").classList.remove("is-hidden");
      document.getElementById("saveBtn").disabled = false;
    } catch (error) {
      idInput.classList.add("is-danger");
      document.getElementById("outputDivBody").innerHTML = "Error: " + error;
      document.getElementById("outputDiv").classList.remove("is-hidden");
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

export default Home;
