import type { WSRConfig } from "types/types";
declare class WebShakeReport {
    private config;
    private shake;
    private modal;
    private initialized;
    constructor(config: WSRConfig);
    init(): Promise<void>;
    dispose(): void;
    takeScreenshot(): Promise<HTMLCanvasElement>;
    private handleShake;
}
export { WebShakeReport };
export * from "./types/types";
export * from "./reporters";
//# sourceMappingURL=index.d.ts.map