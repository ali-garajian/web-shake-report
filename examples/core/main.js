import {
  WebShakeReport,
  JiraReporter,
} from "../../packages/core/build/core.min.js";

new WebShakeReport({
  reporter: new JiraReporter({
    url: "https://aligarajian.atlassian.net/",
    credentials: {
      user_email: "aligarajian1@gmail.com",
      api_token:
        "ATATT3xFfGF0H-NLfIat08EMlMRH3BlluweKEU6fmzIDRjE4eg_4f01hODZdhreZjN0InP3mJceVYbVT5LxPQmo6QrCSAMgJsr2CnlHRbWs237rp2tQPCNQ0PWwV9MR9SGsV5_cA8a0d5yXIyuDF2Xa6fKivxYwZO7C8oe82laZy_0-D7D5Gxcg=76094D96",
    },
    meta: {
      project: {
        id: "10000",
      },
      issuetype: {
        id: "10003",
      },
    },
  }),
}).init();
