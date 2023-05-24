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
    components?: Array<{ id: string }>;
    issuetype: {
      id: string;
    };
    labels?: Array<string>;
  };
};

export class JiraReporter implements IReporter {
  Authorization = "";

  constructor(
    private config: {
      url: string;
      credentials: {
        user_email: string;
        api_token: string;
      };
      meta: Omit<JiraIssueBody["fields"], "summary" | "description">;
    }
  ) {
    this.Authorization = `Basic ${window.btoa(
      `${this.config.credentials.user_email}:${this.config.credentials.api_token}`
    )}`;
  }

  async report(body: ReportBody) {
    // API_TOKEN
    // ATATT3xFfGF0H-NLfIat08EMlMRH3BlluweKEU6fmzIDRjE4eg_4f01hODZdhreZjN0InP3mJceVYbVT5LxPQmo6QrCSAMgJsr2CnlHRbWs237rp2tQPCNQ0PWwV9MR9SGsV5_cA8a0d5yXIyuDF2Xa6fKivxYwZO7C8oe82laZy_0-D7D5Gxcg=76094D96
    const issue = await this.createIssue({
      fields: {
        summary: body.title,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: body.description,
                },
              ],
            },
          ],
        },
        ...this.config.meta,
      },
    });
    await this.attachScreenshot(issue.id, body.screenshot);
  }

  async createIssue(body: JiraIssueBody): Promise<{ id: string }> {
    const url = new URL("/rest/api/3/issue", this.config.url);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: this.Authorization,
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Atlassian-Token": "no-check",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  }

  async attachScreenshot(issueId: string, screenshot: File) {
    const form = new FormData();
    form.append("file", screenshot);
    const url = new URL(
      `/rest/api/3/issue/${issueId}/attachments`,
      this.config.url
    );
    const res = await fetch(url, {
      method: "POST",
      body: form,
      headers: {
        Authorization: this.Authorization,
        Accept: "application/json",
        "X-Atlassian-Token": "no-check",
      },
    });
    return await res.json();
  }
}
