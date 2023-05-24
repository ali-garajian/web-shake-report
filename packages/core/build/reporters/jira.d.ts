import type { IReporter, ReportBody } from "types/types";
export type JiraIssueBody = {
    fields: {
        summary: string;
        description: {
            content: Array<{
                content: Array<{
                    text: string;
                    type: "text";
                }>;
                type: "paragraph";
            }>;
            type: "doc";
            version: 1;
        };
        project: {
            id: string;
        };
        assignee?: {
            id: string;
        };
        components?: Array<{
            id: string;
        }>;
        issuetype: {
            id: string;
        };
        labels?: Array<string>;
    };
};
export declare class JiraReporter implements IReporter {
    private config;
    Authorization: string;
    constructor(config: {
        url: string;
        credentials: {
            user_email: string;
            api_token: string;
        };
        meta: Omit<JiraIssueBody["fields"], "summary" | "description">;
    });
    report(body: ReportBody): Promise<void>;
    fetch(input: URL, init: RequestInit): Promise<Response>;
    createIssue(body: JiraIssueBody): Promise<{
        id: string;
    }>;
    attachScreenshot(issueId: string, screenshot: File): Promise<any>;
}
//# sourceMappingURL=jira.d.ts.map