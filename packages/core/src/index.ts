import Shake from "shake.js";
import html2canvas from "html2canvas";
import { ReportModal } from "./report-modal";
import type { WSRConfig } from "types/types";

class WebShakeReport {
  private shake = new Shake({
    threshhold: 0.1,
  });
  private modal = new ReportModal({
    reporter: () => this.config.reporter,
  });
  private initialized = false;

  constructor(private config: WSRConfig) {
    this.handleShake = this.handleShake.bind(this);
  }

  async init() {
    if (!this.initialized) {
      console.log("web shake report initialized");
      this.shake.start();
      window.addEventListener("shake", this.handleShake, false);

      this.modal.mount();
      this.initialized = true;

      const screenshot = await this.takeScreenshot();
      this.modal.addScreenshot(screenshot);
    }
  }

  dispose() {
    if (this.initialized) {
      window.removeEventListener("shake", this.handleShake, false);
      this.modal.dispose();
    }
  }

  async takeScreenshot() {
    const canvas = await html2canvas(document.body);
    return canvas;
  }

  private async handleShake() {
    if (!this.modal.isVisible) {
      const screenshot = await this.takeScreenshot();
      this.modal.addScreenshot(screenshot);
      this.modal.show();
    }
  }
}

export { WebShakeReport };
export * from "./types/types";
export * from "./reporters";
