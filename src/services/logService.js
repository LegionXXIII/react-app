import Raven from "raven-js";

function init() {
  Raven.config("https://3edfdb68f8f946249679b3067ab785dd@sentry.io/1422385", {
    release: "1-0-0",
    environment: "development-test"
  }).install();
}

function log(error) {
  Raven.captureException(error);
  console.log(error);
}

export default {
  init,
  log
};
