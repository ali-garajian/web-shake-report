import type { WSRConfig } from "types/types";
import styles from "./styles.module.css";

class ReportModal {
  private root: HTMLDivElement | null = null;
  private _isVisible = false;
  private reporter: () => WSRConfig["reporter"];

  constructor({ reporter }: { reporter: () => WSRConfig["reporter"] }) {
    this.reporter = reporter;
  }

  get isVisible() {
    return this._isVisible;
  }

  // this is for mobile. handle desktop
  mount() {
    this.root = document.createElement("div");
    this.root.classList.add(styles.root, styles.show);

    // header
    const header = document.createElement("header");
    header.classList.add(styles.header);
    this.root.appendChild(header);

    // main
    const main = document.createElement("main");
    main.classList.add(styles.main);
    this.root.appendChild(main);

    // footer
    const footer = document.createElement("footer");
    footer.classList.add(styles.footer);
    this.root.appendChild(footer);

    this.renderMainView();

    document.body.append(this.root);
  }

  private renderMainView() {
    const header = this.root!.querySelector("header")!;
    const main = this.root!.querySelector("main")!;
    const footer = this.root!.querySelector("footer")!;

    header.innerHTML = "";
    main.innerHTML = "";
    footer.innerHTML = "";

    // settings button
    const settingsButton = document.createElement("span");
    settingsButton.innerHTML = "&#9881;";
    settingsButton.onclick = () => this.renderSettingsView();
    settingsButton.classList.add(styles["settings-btn"]);
    header.appendChild(settingsButton);

    // close button
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&#10006;";
    closeButton.onclick = () => this.hide();
    closeButton.classList.add(styles["close-btn"]);
    header.appendChild(closeButton);

    // canvas container
    const screenshotContainer = document.createElement("div");
    screenshotContainer.classList.add("screenshot-container");
    main.appendChild(screenshotContainer);

    // divider
    const divider = document.createElement("hr");
    divider.style.width = "100%";
    main.appendChild(divider);

    // title
    const title = document.createElement("input");
    title.placeholder = "Title";
    title.classList.add(styles.input, styles["title-input"], "title-input");
    main.appendChild(title);

    // description
    const description = document.createElement("textarea");
    description.placeholder = "Description";
    description.classList.add(
      styles.input,
      styles["description-input"],
      "description-input"
    );
    main.appendChild(description);

    // submit button
    const button = document.createElement("button");
    button.classList.add(styles["submit-btn"], "submit-btn");
    button.innerText = "SUBMIT";
    button.onclick = () => this.submitReport();
    footer.appendChild(button);
  }

  private renderSettingsView() {
    const main = this.root!.querySelector("main")!;
    main.innerHTML = "";
  }

  private setLoading(loading: boolean) {
    const footer = this.root!.querySelector("footer")!;
    const submitBtn = footer.querySelector(".submit-btn")! as HTMLElement;
    submitBtn.innerText = loading ? "LOADING..." : "SUBMIT";
  }

  dispose() {
    this.root?.remove();
  }

  show() {
    this._isVisible = true;
    document.body.classList.add(styles.body);
    this.root?.classList.add(styles.show);
  }

  hide() {
    this._isVisible = false;
    document.body.classList.remove(styles.body);
    this.root?.classList.remove(styles.show);
  }

  addScreenshot(canvas: HTMLCanvasElement) {
    const container = this.root!.querySelector(".screenshot-container")!;
    container.innerHTML = "";
    const ratio = canvas.width / canvas.height;
    let width = 300;
    let height = 300 / ratio;
    if (height > 400) {
      height = 400;
      width = 400 * ratio;
    }
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.classList.add(styles.screenshot);
    container.appendChild(canvas);
  }

  private async getScreenshot() {
    return new Promise<File>((resolve, reject) => {
      (
        this.root!.querySelector(
          ".screenshot-container canvas"
        ) as HTMLCanvasElement
      ).toBlob((blob) => {
        if (!blob) reject("something went wrong when creating the screenshot!");

        const file = new File([blob!], `screenshot-${Date.now()}.png`, {
          type: "image/png",
        });
        resolve(file);
      }, "image/png");
    });
  }

  private async getFormData() {
    const root = this.root!;
    const screenshot = await this.getScreenshot();
    const title = (
      root.querySelector(".title-input") as HTMLInputElement
    ).value.trim();
    const description = (
      root.querySelector(".description-input") as HTMLInputElement
    ).value.trim();

    return {
      screenshot,
      title,
      description,
    };
  }

  private validate(
    data: Awaited<ReturnType<typeof this.getFormData>>
  ): boolean {
    const title = this.root!.querySelector(".title-input")!;
    const description = this.root!.querySelector(".description-input")!;

    [title, description].forEach((i) =>
      i.classList.remove(styles["input-error"])
    );
    this.root!.querySelectorAll(".error-msg").forEach((i) => i.remove());

    if (!data.title) {
      title.classList.add(styles["input-error"]);
      const error = document.createElement("span");
      error.classList.add(styles["error-msg"], "error-msg");
      error.innerText = "Required Field!";
      title.after(error);
      return false;
    }

    if (!data.description) {
      description.classList.add(styles["input-error"]);
      const error = document.createElement("span");
      error.classList.add(styles["error-msg"], "error-msg");
      error.innerText = "Required Field!";
      description.after(error);
      return false;
    }

    return true;
  }

  async submitReport() {
    try {
      const data = await this.getFormData();
      if (!this.validate(data)) return;
      this.setLoading(true);
      await this.reporter().report(data);
    } catch (e: any) {
      console.error(e);
      // toast
      alert("something went wrong" + e.message || "");
    } finally {
      this.setLoading(false);
    }
  }
}

export { ReportModal };
