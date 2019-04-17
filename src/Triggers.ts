import { Cookie } from "./helpers/Cookie";
import { Constants } from "./Constants";
import { SurveyManager } from "./SurveyManager";
import { TriggerUtils } from "./helpers/TriggerUtils";
import { CCSDKConfig } from "./interfaces/CCSDKConfig";

class Triggers {

  ccsdk: any;
  pageCountTrigger: boolean;
  pageTimeTrigger: boolean;
  siteCountTrigger: boolean;
  siteTimeTrigger: boolean;
  urlParamTrigger: boolean;
  notUrlParamTrigger: boolean;
  utmParamTrigger: boolean;
  scrollPixelsTrigger: boolean;
  minPageCount: number;
  minSiteCount: number;
  minPageTime: number;
  minSiteTime: number;
  minScrollPixels: number;
  utm: string;
  inUrl: RegExp;
  notinUrl: RegExp;
  pageCountTriggerEnabled: boolean;
  siteCountTriggerEnabled: boolean;
  pageTimeTriggerEnabled: boolean;
  siteTimeTriggerEnabled: boolean;
  urlParamTriggerEnabled: boolean;
  notUrlParamTriggerEnabled: boolean;
  utmParamTriggerEnabled: boolean;
  scrollPixelsTriggerEnabled: boolean;

  conditionalTriggers: any;

  constructor(ccsdk) {
    this.ccsdk = ccsdk;
    this.pageCountTrigger = false;
    this.siteCountTrigger = false;
    this.pageTimeTrigger = false;
    this.siteTimeTrigger = false;
    this.urlParamTrigger = false;
    this.notUrlParamTrigger = false;
    this.utmParamTrigger = false;
    this.scrollPixelsTrigger = false;

    //disable all triggers.
    this.pageCountTriggerEnabled = false;
    this.siteCountTriggerEnabled = false;
    this.pageTimeTriggerEnabled = false;
    this.siteTimeTriggerEnabled = false;
    this.urlParamTriggerEnabled = false;
    this.notUrlParamTriggerEnabled = false;
    this.utmParamTriggerEnabled = false;
    this.scrollPixelsTriggerEnabled = false;
    this.conditionalTriggers = {};
  }


  enableClickTrigger(target: string, cb: any) {
    let item = document.querySelectorAll(target)[0];
    if (typeof item !== 'undefined') {
      item.addEventListener('click', cb);
    } else {
      console.log('selector does not match')
    }
  }

  enablePageCountTrigger(minPageCount: number) {
    this.minPageCount = minPageCount;
    this.pageCountTriggerEnabled = true;
    this.TriggerPopUpByPageCount();
  }

  enableSiteCountTrigger(minSiteCount: number) {
    this.minSiteCount = minSiteCount;
    this.pageCountTriggerEnabled = true;
    this.TriggerPopUpByPageCount();
  }

  enablePageTimeTrigger(minPageTime: number) {
    this.minPageTime = minPageTime;
    this.pageTimeTriggerEnabled = true;
    this.TriggerPopUpByTimeSpentOnPage();
  }

  enableSiteTimeTrigger(minSiteTime: number) {
    this.minSiteTime = minSiteTime;
    this.siteTimeTriggerEnabled = true;
    this.TriggerPopUpByTimeSpentOnSite();
  }

  enablePopUpByURLPatternTrigger(urlPattern: RegExp) {
    this.inUrl = urlPattern;
    this.urlParamTriggerEnabled = true;
    this.TriggerPopUpByURLPattern();
  }

  enablePopUpByNotURLPatternTrigger(urlPattern: RegExp) {
    this.notinUrl = urlPattern;
    this.notUrlParamTriggerEnabled = true;
    this.TriggerPopUpByNotURLPattern();
  }

  enablePopUpByUTMPatternTrigger(urlPattern: string) {
    this.utm = urlPattern;
    this.utmParamTriggerEnabled = true;
    this.TriggerPopUpByUTMParameter();
  }

  enableScrollPixelsTrigger(minScrollPixels: number) {
    this.minScrollPixels = minScrollPixels;
    this.scrollPixelsTriggerEnabled = true;

  }

  processIntervalTriggers() {
    //if survey already launched
    //skip processing.
    if (this.ccsdk.surveyRunning || this.ccsdk.surveyDone) {
      return;
    }
    this.TriggerPopUpByTimeSpentOnPage();
    this.TriggerPopUpByTimeSpentOnSite();
  }

  setConditionalTriggers(config: CCSDKConfig) {
    (window as any).ccsdkDebug ? console.log(config.grepURL) : '';
    //
    if ((typeof config.click !== 'undefined') && (config.click != 0)) {
      this.conditionalTriggers.click = config.click;
    }
    if ((typeof config.onExitDetect !== 'undefined')) {
      this.conditionalTriggers.onExitDetect = config.onExitDetect;
    }
    // if ((typeof config.cssSelector !== 'undefined')) {
    //   this.conditionalTriggers.cssSelector = config.cssSelector;
    // }
    if ((typeof config.waitSeconds !== 'undefined') && (config.waitSeconds !== 0)) {
      this.conditionalTriggers.waitSeconds = config.waitSeconds;
    }
    if ((typeof config.scrollPercent !== 'undefined') && (config.scrollPercent !== 0)) {
      this.conditionalTriggers.scrollPercent = config.scrollPercent;
    }
    if ((typeof config.grepInvertURL !== 'undefined') && (config.grepInvertURL)) {
      this.conditionalTriggers.grepInvertURL = config.grepInvertURL;
    }
    if ((typeof config.grepURL !== 'undefined') && (config.grepURL)) {
      this.conditionalTriggers.grepURL = config.grepURL;
    }

  }

  processConditionalTriggers() {
    //gather all conditional triggers and process them.
    let self = this;
    let isEnabled = true;
    if (this.ccsdk.surveyRunning || this.ccsdk.surveyDone) {
      (window as any).ccsdkDebug ? console.log('returning') : '';
      return;
    }
    if (typeof this.conditionalTriggers !== 'undefined') {
      if (Object.keys(this.conditionalTriggers).length == 0) {
        return false;
      }
      for (let conditionalTrigger in this.conditionalTriggers) {
        if (this.conditionalTriggers[conditionalTrigger] != null) {
          switch (conditionalTrigger) {
            case "onExitDetect":
              let onExitDetect = self.ccsdk.util.initListener("mouseout", "document", function () {
                (window as any).ccsdkDebug ? console.log("Mouse out") : '';

              });

              onExitDetect.internalHandler = self.ccsdk.util.listener(document, onExitDetect.type, onExitDetect.id, onExitDetect.cb);

              break;
            case "click":
              //find click count on screen
              //calculate click count
              // if((window as any).click > this.conditionalTriggers.click) {
              //   return SurveyManager.addSurvey(this.ccsdk.surveyToken);
              // }
              isEnabled = isEnabled && ((window as any).click >= this.conditionalTriggers.click);
              break;
            case "waitSeconds":
              let pageStartTime = new Date(Cookie.get(Constants.CCTriggerPageStartTime)).getTime();
              let pageTime = new Date(Cookie.get(Constants.CCTriggerPageElapsedTime)).getTime();
              isEnabled = isEnabled && TriggerUtils.checkTimeCondition(pageTime, pageStartTime, this.conditionalTriggers[conditionalTrigger]);
              (window as any).ccsdkDebug ? console.log('waitSeconds enabled', isEnabled) : '';
              break;
            case "scrollPercent":
              //fill it with current scroll position
              isEnabled = isEnabled && TriggerUtils.checkScroll((window as any).ccsdkTopOffset, this.conditionalTriggers[conditionalTrigger]);
              (window as any).ccsdkDebug ? console.log('scrollPercent enabled', isEnabled) : '';

              break;
            case "grepURL":
              isEnabled = isEnabled && TriggerUtils.checkInUrl(this.conditionalTriggers[conditionalTrigger]);
              (window as any).ccsdkDebug ? console.log('grepURL enabled', isEnabled) : '';
              break;
            case "grepInvertURL":
              isEnabled = isEnabled && !TriggerUtils.checkInUrl(this.conditionalTriggers[conditionalTrigger]);
              (window as any).ccsdkDebug ? console.log('grepInvertURL enabled', isEnabled) : '';
              break;
          }
        }
      }
      if (isEnabled) {
        if (this.ccsdk && this.ccsdk.tracking) {
          this.ccsdk.tracking.trackEvent('Popped Up', {
            token: this.ccsdk.tracking.token,
            data: {
              name: null,
              action: null
            }
          }, null, null)
        }
        SurveyManager.addSurvey(this.ccsdk.surveyToken);
      }
    } else {
      //do nothing.
    }
  }

  processNonConditionalTriggers() {
    //process all non conditional one shot triggers here?
  }

  processScrollTriggers(scrollNow: number) {
    this.TriggerPopUpByScrollPixels(scrollNow);
  }

  TriggerPopUpByPageCount() {
    let pageCount = parseInt(Cookie.get(Constants.CCTriggerSitePageViewCount));
    if (pageCount == NaN) {
      pageCount = 0;
    }
    //!(window as any).globalSurveyRunning && 
    if (!this.ccsdk.surveyRunning && !this.ccsdk.surveyDone && !this.pageCountTrigger && TriggerUtils.checkPageCount(pageCount, this.minPageCount)) {
      this.pageCountTrigger = true;
      //displayQuestion
      // this.ccsdk.initSurvey();
      SurveyManager.addSurvey(this.ccsdk.surveyToken);
    } else {
      //already executed.
      //or condition not satisified yet.
    }
  }


  //minPageTime in seconds
  TriggerPopUpByTimeSpentOnPage() {
    let pageStartTime = new Date(Cookie.get(Constants.CCTriggerPageStartTime)).getTime();
    let pageTime = new Date(Cookie.get(Constants.CCTriggerPageElapsedTime)).getTime();

    //!(window as any).globalSurveyRunning && 
    if (!this.ccsdk.surveyRunning && !this.ccsdk.surveyDone && !this.pageTimeTrigger && TriggerUtils.checkTimeCondition(pageTime, pageStartTime, this.minPageTime)) {
      this.pageTimeTrigger = true;
      //displayQuestion
      // this.ccsdk.initSurvey();
      SurveyManager.addSurvey(this.ccsdk.surveyToken);
    } else {
      //already executed.
      //or condition not satisified yet.
    }
  }

  TriggerPopUpByTimeSpentOnSite() {
    let siteStartTime = new Date(Cookie.get(Constants.CCTriggerSiteStartTime)).getTime();
    let siteTime = new Date(Cookie.get(Constants.CCTriggerSiteElapsedTime)).getTime();
    //!(window as any).globalSurveyRunning && 
    if (!this.ccsdk.surveyRunning && !this.ccsdk.surveyDone && !this.siteTimeTrigger && TriggerUtils.checkTimeCondition(siteTime, siteStartTime, this.minSiteTime)) {
      this.siteTimeTrigger = true;
      //displayQuestion
      // this.ccsdk.initSurvey();
      SurveyManager.addSurvey(this.ccsdk.surveyToken);
    } else {
      //already executed.
      //or condition not satisified yet.
    }
  }

  TriggerPopUpByInactivity() {

  }

  TriggerPopUpByScrollPixels(scrollNow: number) {
    //!(window as any).globalSurveyRunning && 
    if (!this.ccsdk.surveyRunning && !this.ccsdk.surveyDone && !this.scrollPixelsTrigger && TriggerUtils.checkScroll(scrollNow, this.minScrollPixels)) {
      this.scrollPixelsTrigger = true;
      // this.ccsdk.initSurvey();
      SurveyManager.addSurvey(this.ccsdk.surveyToken);
      // this.ccsdk.initSurvey();
      // SurveyManager.addSurvey(this.ccsdk.surveyToken);
    } else {
      //already executed?
      //or condition not satisified yet.
    }
  }

  //run only once?
  TriggerPopUpByURLPattern() {
    //!(window as any).globalSurveyRunning && 
    if (!this.ccsdk.surveyRunning && !this.ccsdk.surveyDone && !this.urlParamTrigger && TriggerUtils.checkInUrl(this.inUrl)) {
      this.urlParamTrigger = true;
      // this.ccsdk.initSurvey();
      SurveyManager.addSurvey(this.ccsdk.surveyToken);
    } else {

    }
  }

  TriggerPopUpByNotURLPattern() {
    //!(window as any).globalSurveyRunning && 
    if (!this.ccsdk.surveyRunning && !this.ccsdk.surveyDone && !this.notUrlParamTrigger && !TriggerUtils.checkInUrl(this.inUrl)) {
      this.notUrlParamTrigger = true;
      // this.ccsdk.initSurvey();
      SurveyManager.addSurvey(this.ccsdk.surveyToken);
    } else {

    }
  }

  TriggerPopUpByUTMParameter() {
    let utmP = this.utm.split("=");
    let utmVal = Cookie.getParameterByName(utmP[0], undefined);
    //!(window as any).globalSurveyRunning && 
    if (!this.ccsdk.surveyRunning && !this.ccsdk.surveyDone && !this.utmParamTrigger && utmVal === utmP[1]) {
      this.utmParamTrigger = true;

      // this.ccsdk.initSurvey();
      SurveyManager.addSurvey(this.ccsdk.surveyToken);
    }
  }

  resetTriggers() {
    this.pageCountTrigger = false;
    this.pageTimeTrigger = false;
    this.siteTimeTrigger = false;
    this.urlParamTrigger = false;
    this.scrollPixelsTrigger = false;
  }
}

export { Triggers };


// function triggerHandler(surveyHandler) {
//   //survey specific Trigger Handlers
//   // self.surveyRunning = self.util.get('#' + self.surveyToken  + "-survey").length == 1;
  // Cookie.set(Constants.CCTriggerPageElapsedTime, new Date(), undefined, window.location.href);
  // Cookie.set(Constants.CCTriggerSiteElapsedTime, new Date(), undefined, undefined);
//   surveyHandler.triggers.TriggerPopUpByTimeSpentOnSite(surveyHandler.siteInterval);
//   // surveyHandler.surveyRunning = surveyHandler.util.get('#' + self.surveyToken  + "-survey").length == 1;
//   surveyHandler.triggers.TriggerPopUpByTimeSpentOnPage(surveyHandler.pageInterval);
// }

//call below functions when survey is locked and loaded.
// self.triggers.TriggerPopUpByURLPattern(/xyz=33/);
// self.triggers.TriggerPopUpByUTMParameter();
// self.triggerInterval = setInterval(self.triggerHandler, 1000, self);