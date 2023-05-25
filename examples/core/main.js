import {
  WebShakeReport,
  JiraReporter,
} from "../../packages/core/build/core.min.js";

new WebShakeReport({
  reporter: new JiraReporter({
    client_id: "KAzh1YDVjcpV8Z9orw2857tcpqhyDeCm",
    client_secret:
      "ATOAb2-wuRaX-wll-OzYP2Pl3z2CB4ibTkGhpqIF9--g--0DqKOMDCIxuc0eVE-iTY1LF4E0CFC6",
    redirect_url: "http://127.0.0.1:8001/",
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
