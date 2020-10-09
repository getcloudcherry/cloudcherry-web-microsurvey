//Manages trigger.
import { Cookie } from "./helpers/Cookie";
import { Constants } from "./Constants";
import { WebSurveyTriggers } from "./WebSurveyTriggers";

//collect initial data
//if on site time is null, add on site time
if (Cookie.get(Constants.CCTriggerSiteStartTime) == null) {
  Cookie.set(Constants.CCTriggerSiteStartTime, new Date(), undefined, undefined);
}
//always add on page Time
Cookie.set(Constants.CCTriggerPageStartTime, new Date(), undefined, undefined);

let sitePageViewCount = Cookie.get(Constants.CCTriggerSitePageViewCount);
if (sitePageViewCount == null) {
  Cookie.set(Constants.CCTriggerSitePageViewCount, 1, undefined, undefined);
} else {
  sitePageViewCount = (parseInt(sitePageViewCount) + 1).toString();
  Cookie.set(Constants.CCTriggerSitePageViewCount, sitePageViewCount, undefined, undefined);
}

let pathname = window.location.pathname;
if (pathname.match(/\./)) {
  pathname = pathname.substring(0, pathname.lastIndexOf('/'));
}
let individualPageViewCount = Cookie.get(Constants.CCTriggerIndividualPageViewCount);
if (individualPageViewCount == null) {
  Cookie.set(Constants.CCTriggerIndividualPageViewCount + pathname, 1, undefined, undefined);
} else {
  individualPageViewCount = (parseInt(individualPageViewCount) + 1).toString();
  Cookie.set(Constants.CCTriggerIndividualPageViewCount + pathname, individualPageViewCount, undefined, undefined);
}

(window as any).click = 0;

window.onscroll = function (e) {
  // called when the window is scrolled.  
  let doc = document.documentElement;
  let left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  let top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  (window as any).ccsdkTopOffset = top;
  TriggerManager.processScrollTriggers(top);
}

document.onclick = function (e) {
  (window as any).click++;
}

//TriggerManager adds to survey Queue
class TriggerManager {

  static triggerInterval: any = null;
  static triggerInstances: {
    [key: string]: WebSurveyTriggers
  } = {};

  static enqueueSurvey: Function;

  constructor() {

  }

  static addSurvey(surveyId: any, trigger: WebSurveyTriggers) {
    TriggerManager.triggerInstances[surveyId] = trigger;

    trigger.evaluateCallBack = () => {
      TriggerManager.enqueueSurvey && TriggerManager.enqueueSurvey(surveyId);
    }

    if (Object.keys(TriggerManager.triggerInstances).length >= 1) {
      (window as any).ccsdkDebug ? console.log(TriggerManager.triggerInterval) : '';
      if (TriggerManager.triggerInterval == null) {
        (window as any).ccsdkDebug ? console.log("TriggerHandler : Setting up Interval Trigger Handlers.") : '';
        TriggerManager.triggerInterval = setInterval(TriggerManager.processIntervalTriggers, 1000);
      }
    }
  }

  static processIntervalTriggers() {
    //if some survey is already running skip processing surveys for now?or queue it?.
    let pathname = window.location.pathname;
    if (pathname.match(/\./)) {
      pathname = pathname.substring(0, pathname.lastIndexOf('/'));
    }
    Cookie.set(Constants.CCTriggerPageElapsedTime + pathname, new Date(), undefined, undefined);
    Cookie.set(Constants.CCTriggerSiteElapsedTime, new Date(), undefined, undefined);

    for (let trigger in TriggerManager.triggerInstances) {
      TriggerManager.triggerInstances[trigger].evaluateTriggers();
      // TriggerManager.triggerInstances[trigger].processConditionalTriggers();
    }
  }


  static processScrollTriggers(scrollY) {
    for (let trigger in TriggerManager.triggerInstances) {
      //process all scroll triggers.
      TriggerManager.triggerInstances[trigger].evaluateTriggers();
    }
  }
};



export { TriggerManager };