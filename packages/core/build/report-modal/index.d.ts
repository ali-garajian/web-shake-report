import type { WSRConfig } from "types/types";
declare class ReportModal {
    private root;
    private _isVisible;
    private reporter;
    constructor({ reporter }: {
        reporter: () => WSRConfig["reporter"];
    });
    get isVisible(): boolean;
    mount(): void;
    private renderMainView;
    private renderSettingsView;
    private setLoading;
    dispose(): void;
    show(): void;
    hide(): void;
    addScreenshot(canvas: HTMLCanvasElement): void;
    private getScreenshot;
    private getFormData;
    private validate;
    submitReport(): Promise<void>;
}
export { ReportModal };
//# sourceMappingURL=index.d.ts.map