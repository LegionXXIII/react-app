// import Raven from "raven-js";
import * as Sentry from "@sentry/browser";

// function init() {
//   Raven.config("https://3edfdb68f8f946249679b3067ab785dd@sentry.io/1422385", {
//     release: "1-0-0",
//     environment: "development-test"
//   }).install();
// }

function init() {
  Sentry.init({
    dsn: "https://89cb5c1c76134627a2848b9fb84cfeb8@sentry.io/1422653",
    release: "react-app@1.0.0"
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default {
  init,
  log
};
