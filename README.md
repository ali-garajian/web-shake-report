## Web Shake to Report

![alt text](./assets/wsr.png)

Combines [shake.js](https://github.com/alexgibson/shake.js/) and [html2canvas](https://github.com/niklasvh/html2canvas) to provide shake to report functionality for web.

- The module uses `Reporters` to integrate with 3rd party project management platforms. It Provides a `JiraReporter` out of the box, but you could write a reporter for your platform of choosing by implementing the `IReporter` interface.
- The `WebShakeReport` class accepts a `html2canvasOptions` property and passes it directly to `html2canvas`

### Installation

```
$ yarn add web-shake-report
$ npm install web-shake-report
```

### Reporters

#### Jira Reporter

- visit [atlassian developer console](https://developer.atlassian.com/console) and create a new app
- create a new `JiraReporter` instance and pass `client_id`, `client_secret` and `redirect_url` of your app to it
- you could provide meta data for the issue that is to be reported. `project.id` and `issue.id` are mandatory.
- under the hood, the reporter uses atlassian's oauth2 authorization mechanism

Check out `examples/jira` to see an implementation using this reporter.

### Limitations

As of now, there's really no perfect way for capturing a screenshot on a mobile device, since mobile browsers currently do not support the [getDisplayMedia](https://caniuse.com/?search=getdisplaymedia) api.
This module uses the `html2canvas` module for capturing screenshots, which has its limitations in terms of accuracy and supported html features and css properties. Consult its [documentation](<(https://github.com/niklasvh/html2canvas)>) to learn more.
