import { Options as HTML2CanvasOptions } from "html2canvas";

export type ReportBody = {
  title: string;
  description: string;
  screenshot: File;
};
export interface IReporter {
  report(body: ReportBody): Promise<any>;
}
export type WSRConfig = {
  reporter: IReporter;
  html2canvasOptions: HTML2CanvasOptions;
};
