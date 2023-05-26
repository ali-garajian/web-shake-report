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
  static storage = {
    token: "wsr-jira-reporter-token",
    cloud_id: "wsr-jira-reporter-cloud-id",
  };
  user_bound_state: string = "";

  constructor(
    private config: {
      client_id: string;
      client_secret: string;
      redirect_url: string;
      meta: Omit<JiraIssueBody["fields"], "summary" | "description">;
    }
  ) {}

  private get token(): {
    access_token: string;
    expires_in: number;
    isValid: boolean;
  } {
    const value = JSON.parse(
      localStorage.getItem(JiraReporter.storage.token) || "{}"
    );
    const isValid = !!value.access_token || Date.now() > value.expiration_time;

    if (!isValid) {
      localStorage.clear();
    }

    return {
      ...value,
      isValid,
    };
  }
  private set token(value: { access_token: string; expires_in: number }) {
    localStorage.setItem(
      JiraReporter.storage.token,
      JSON.stringify({
        ...value,
        expiration_time: Date.now() + value.expires_in * 1000,
      })
    );
  }

  private get cloudId() {
    const value = localStorage.getItem(JiraReporter.storage.cloud_id);
    return value ?? "";
  }
  private set cloudId(value: string) {
    localStorage.setItem(JiraReporter.storage.cloud_id, value);
  }

  private get apiUrl() {
    return `https://api.atlassian.com/ex/jira/${this.cloudId}`;
  }

  private get authorization() {
    return `Bearer ${this.token.access_token}`;
  }

  async requestAtlassianCode() {
    return new Promise<string>((resolve, reject) => {
      this.user_bound_state = Date.now().toString();
      const popup = window.open(
        `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${this.config.client_id}&scope=write:jira-work&redirect_uri=${this.config.redirect_url}&state=${this.user_bound_state}&response_type=code&prompt=consent`,
        "atlassian_authorization",
        `popup=true,scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=500,height=700,left=50%,top=50%`
      );

      if (!popup) {
        reject(new Error("failed to open popup window!"));
      }

      const intervalId = setInterval(() => {
        const url = new URL(popup!.location.href);
        if (url.href.includes(this.config.redirect_url)) {
          clearInterval(intervalId);
          const code = url.searchParams.get("code");
          popup?.close();
          if (!code) {
            reject(new Error("authentication failed! token not found!"));
            return;
          }
          resolve(code);
        }
      }, 100);
    });
  }

  async requestAtlassianAccessToken(code: string) {
    const res = await fetch("https://auth.atlassian.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: this.config.client_id,
        client_secret: this.config.client_secret,
        code,
        redirect_uri: this.config.redirect_url,
      }),
    });
    const body = await res.json();
    return body;
  }

  async getAccessibleResources() {
    const res = await fetch(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token.access_token}`,
          Accept: "application/json",
        },
      }
    );
    return await res.json();
  }

  async authorizeUser() {
    const code = await this.requestAtlassianCode();
    const credentials = await this.requestAtlassianAccessToken(code);
    this.token = credentials;
    // TODO: support multiple resources. for now we default to the first resource
    const resources = await this.getAccessibleResources();
    if (resources?.[0]) {
      this.cloudId = resources[0].id;
    } else {
      throw new Error("No accesible resource found!");
    }
  }

  async report(body: ReportBody) {
    if (!this.token.isValid) {
      await this.authorizeUser();
    }

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

    return issue.id;
  }

  async createIssue(body: JiraIssueBody): Promise<{ id: string }> {
    const url = new URL(`${this.apiUrl}/rest/api/3/issue`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: this.authorization,
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
      `${this.apiUrl}/rest/api/3/issue/${issueId}/attachments`
    );
    const res = await fetch(url, {
      method: "POST",
      body: form,
      headers: {
        Authorization: this.authorization,
        Accept: "application/json",
        "X-Atlassian-Token": "no-check",
      },
    });
    return await res.json();
  }
}
