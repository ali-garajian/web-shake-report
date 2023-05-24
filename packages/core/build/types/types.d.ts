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
};
//# sourceMappingURL=types.d.ts.map