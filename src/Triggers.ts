import { Cookie } from "./helpers/Cookie";
import { Constants } from "./Constants";

class Triggers {

  ccsdk : any;
  pageCountTrigger : boolean;
  pageTimeTrigger : boolean;
  static siteTimeTrigger : boolean;
  static urlParamTrigger : boolean;
  static scrollPercentageTrigger : boolean;

  constructor(ccsdk) {
    this.ccsdk = ccsdk;
    this.pageCountTrigger = false;
    this.pageTimeTrigger = false;
    Triggers.siteTimeTrigger = false;
    Triggers.urlParamTrigger = false;
    Triggers.scrollPercentageTrigger = false;
  }

  TriggerPopUpByPageCount(minPageCount : number) {
    let pageCount = parseInt(Cookie.get(Constants.CCTriggerSitePageViewCount));
    if(pageCount == NaN) {
      pageCount = 0;
    }
    if(!this.ccsdk.surveyRunning && !this.pageCountTrigger && pageCount > minPageCount) {
      this.pageCountTrigger = true;
      //displayQuestion
      this.ccsdk.initSurvey();
    } else {
      //already executed.
      //or condition not satisified yet.
    }
  }
  //minPageTime in seconds
  TriggerPopUpByTimeSpentOnPage(minPageTime : number) {
    let pageStartTime = new Date(Cookie.get(Constants.CCTriggerPageStartTime)).getTime();
    let pageTime = new Date(Cookie.get(Constants.CCTriggerPageElapsedTime)).getTime();

    if(!this.ccsdk.surveyRunning && !this.ccsdk.surveyRunning && !this.pageTimeTrigger && Math.round((pageTime - pageStartTime) / 1000) > minPageTime ) {
      this.pageTimeTrigger = true;
      //displayQuestion
      this.ccsdk.initSurvey();
    } else {
      //already executed.
      //or condition not satisified yet.
    }
  }

  TriggerPopUpByTimeSpentOnSite(minSiteTime : number) {
    let siteStartTime = new Date(Cookie.get(Constants.CCTriggerSiteStartTime)).getTime();
    let siteTime = new Date(Cookie.get(Constants.CCTriggerSiteElapsedTime)).getTime();

    if(!this.ccsdk.surveyRunning && !this.ccsdk.surveyRunning && !Triggers.siteTimeTrigger && Math.round((siteTime - siteStartTime) / 1000) > minSiteTime ) {
      Triggers.siteTimeTrigger = true;
      //displayQuestion
      this.ccsdk.initSurvey();
    } else {
      //already executed.
      //or condition not satisified yet.
    }
  }

  TriggerPopUpByInactivity() {
    
  }

  TriggerPopUpByScrollPercentage(minScrollPercent : number, scrollNow : number, totalScroll : number) {
    let scrollPercent = scrollNow / totalScroll;
    if(!this.ccsdk.surveyRunning && !Triggers.scrollPercentageTrigger && scrollPercent > minScrollPercent) {
      Triggers.scrollPercentageTrigger = true;
      this.ccsdk.initSurvey();
      // this.ccsdk.initSurvey();
    } else {
      //already executed?
      //or condition not satisified yet.
    }
  }

  //run only once?
  TriggerPopUpByURLPattern(inUrl : RegExp) {
    if(!this.ccsdk.surveyRunning && !Triggers.urlParamTrigger && window.location.href.match(inUrl)) {
      Triggers.urlParamTrigger = true;
      this.ccsdk.initSurvey();
    } else {

    }
  }

  TriggerPopUpByUTMParameter() {
    let utmVal = Cookie.getParameterByName("utm", undefined);
  }

  resetTriggers() {
    this.pageCountTrigger = false;
    this.pageTimeTrigger = false;
    Triggers.siteTimeTrigger = false;
    Triggers.urlParamTrigger = false;
    Triggers.scrollPercentageTrigger = false;
  }
}

export { Triggers };