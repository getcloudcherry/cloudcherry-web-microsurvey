import { CCSDKConfig } from "./interfaces/CCSDKConfig";
import { Cookie } from "./helpers/Cookie";
import { Constants } from "./Constants";
import { TriggerUtils } from "./helpers/TriggerUtils";

export const SUPPORTED_TRIGGERS = [
  "click",
  "waitSeconds",
  "scrollPercent",
  "grepURL",
  "grepInvertURL"
];

export class WebSurveyTriggers {
  config: CCSDKConfig;
  evaluateCallBack: Function;
  scrollTriggerPoint = 0;
  constructor(config: CCSDKConfig) {
    this.config = config;
    if (this.config["scrollPercent"]) {
      this.scrollTriggerPoint =
        (this.config["scrollPercent"] *
          (document.documentElement.scrollHeight ||
            document.body.scrollHeight)) /
        100;
    }
  }

  evaluateTriggers() {
    let showSurvey = true;

    SUPPORTED_TRIGGERS.forEach((key) => {
      if (this.config[key]) {
        switch (key) {
          case "click":
            showSurvey =
              showSurvey && (window as any).click >= this.config.click;
            break;
          case "waitSeconds":
            // time spent on page
            let pageStartTime = new Date(
              Cookie.get(Constants.CCTriggerPageStartTime)
            ).getTime();
            let pathname = window.location.pathname;
            if (pathname.match(/\./)) {
              pathname = pathname.substring(0, pathname.lastIndexOf("/"));
            }
            let pageTime = new Date(
              Cookie.get(Constants.CCTriggerPageElapsedTime + pathname)
            ).getTime();
            showSurvey =
              showSurvey &&
              TriggerUtils.checkTimeCondition(
                pageTime,
                pageStartTime,
                this.config[key]
              );
            (window as any).ccsdkDebug
              ? console.log("waitSeconds enabled", showSurvey)
              : "";
            break;
          case "scrollPercent":
            //fill it with current scroll position
            showSurvey =
              showSurvey &&
              TriggerUtils.checkScroll(
                (window as any).ccsdkTopOffset,
                this.scrollTriggerPoint
              );
            (window as any).ccsdkDebug
              ? console.log("scrollPercent enabled", showSurvey)
              : "";

            break;
          case "grepURL":
            showSurvey =
              showSurvey && TriggerUtils.checkInUrl(this.config[key]);
            (window as any).ccsdkDebug
              ? console.log("grepURL enabled", showSurvey)
              : "";
            break;
          case "grepInvertURL":
            showSurvey =
              showSurvey && !TriggerUtils.checkInUrl(this.config[key]);
            (window as any).ccsdkDebug
              ? console.log("grepInvertURL enabled", showSurvey)
              : "";
            break;
        }
      }
    });

    if (showSurvey) {
      this.evaluateCallBack && this.evaluateCallBack();
    }
  }
}
