import { WebSurveyContainer } from "./WebSurveyContainer";
import { Cookie } from "./helpers/Cookie";
import { dispatchEvent } from "./utils";
import { Constants } from "./Constants";

export class WebSurveyHandler {
  // url = "https://cx.getcloudcherry.com/perf-s1/#/login?token=";
  url = "https://cx.cloudcherry.com/ns/#/login?token=";
  // url = "http://localhost:8100/#/login?token=";
  token = "mr-100550";
  container: WebSurveyContainer;
  _hideCloseButton: boolean | null = null;
  public set showCloseButton(value: boolean) {
    this._hideCloseButton = value;
    if (this.container) {
      this.container.hideCloseButton = value;
    }
  }

  config;

  constructor(token, config) {
    this.token = token;
    this.config = config;
    this.config.token = token;

    this.container = new WebSurveyContainer(this.config);
    if (this._hideCloseButton !== null) {
      this.container.hideCloseButton = this._hideCloseButton;
    }
  }

  show(token = this.token) {
    this.container.closeCallback = (event: Event) => {
      dispatchEvent(
        `${Constants.SURVEY_CLOSE_EVENT}-${this.token}`,
        this.token
      );
    };

    this.container.open();
    this.container.setSource(this.getUrl(token || this.token));
    // this.container.setConfig(this.config);
  }

  hide() {
    this.container.close();
  }

  getUrl(token: string): string {
    return `${this.url}${token}&mode=microsurvey`;
  }

  setCoolDownPeriod(campaign, surveyToken) {
    if (campaign && campaign.coolDownPeriod && campaign.coolDownPeriod != 0) {
      Cookie.set(
        surveyToken + "-coolDown",
        "true",
        campaign.coolDownPeriod / 86400,
        "/"
      );
    } else {
      Cookie.set(surveyToken + "-coolDown", "true", 1, "/");
    }
  }

  getCoolDown(surveyToken) {
    return Cookie.get(surveyToken + "-coolDown");
  }

  getTokenAnswered(surveyToken) {
    return Cookie.get(surveyToken);
  }

  public prefill(object, type) {
    this.container.prefill(object, type);
  }
}
