import { WebSurveyHandler } from "./WebSurveyHandler";
import { WebSurveyTriggers } from "./WebSurveyTriggers";
import { triggerEvent, dispatchEvent } from "./utils";
import { Constants } from "./Constants";

export class WebSurvey {
  surveyToken: string;
  config;
  handler: WebSurveyHandler;

  triggers: WebSurveyTriggers;
  tracking = {
    trackEvent: this.trackEvent
  };
  util: any;

  constructor(token, config) {
    this.surveyToken = token;
    this.config = config;
    this.handler = new WebSurveyHandler(this.surveyToken, config);

    this.init();
  }

  setupSurvey() {
    if (
      !this.handler.getCoolDown(this.surveyToken) &&
      !this.handler.getTokenAnswered(this.surveyToken) &&
      !this.handler.container.browserNotSuitable
    ) {
      this.show();
      this.handler.setCoolDownPeriod(this.config, this.surveyToken);
    }
  }

  init() {
    setTimeout(() => {
      triggerEvent(document, this.surveyToken + "-ready", { survey: this });
    }, 100);
  }

  setTriggers() {}

  public trigger(...args) {}

  public on(type, callback) {
    document.addEventListener(type + "-" + this.surveyToken, function (e: any) {
      callback(e.detail);
    });
  }

  public prefill(object, type) {
    this.handler.prefill(object, type);
  }

  show() {
    this.handler.show();
    dispatchEvent(
      `${Constants.SURVEY_IMPRESSION_EVENT}-${this.surveyToken}`,
      this.surveyToken
    );
  }

  trackEvent(...args) {}

  hide(cb) {
    this.handler.hide();
    if (cb) {
      cb();
    }
  }
}
