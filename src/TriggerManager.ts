//Manages trigger.
import { Cookie } from "./helpers/Cookie";
import { Constants } from "./Constants";
import { Triggers } from "./Triggers";
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

let individualPageViewCount = Cookie.get(Constants.CCTriggerIndividualPageViewCount);
let pathname = window.location.pathname;
if (pathname.match(/\./)) {
  pathname = pathname.substring(0, pathname.lastIndexOf('/'));
}
if (individualPageViewCount == null) {

  Cookie.set(Constants.CCTriggerIndividualPageViewCount, 1, undefined, pathname);
} else {
  individualPageViewCount = (parseInt(individualPageViewCount) + 1).toString();
  Cookie.set(Constants.CCTriggerIndividualPageViewCount, individualPageViewCount, undefined, pathname);
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
  static triggerInstances: any = {};

  constructor() {
    //initialize triggers
    //add those triggers which aren't completed yet.
  }

  static addSurvey(surveyId: any, trigger: Triggers) {
    TriggerManager.triggerInstances[surveyId] = trigger;
    if (Object.keys(TriggerManager.triggerInstances).length >= 1) {
      (window as any).ccsdkDebug ? console.log(TriggerManager.triggerInterval) : '';
      if (TriggerManager.triggerInterval == null) {
        (window as any).ccsdkDebug ? console.log("TriggerHandler : Setting up Interval Trigger Handlers.") : '';
        TriggerManager.triggerInterval = setInterval(TriggerManager.processIntervalTriggers, 1000);
      }
      //processing sequential triggers if any.
      // console.log("TriggerHandler : Processing sequential triggers for  " + surveyId);
      // TriggerManager.processTriggersBySurveyId(surveyId);
    }
  }

  static removeSurvey(surveyId: string) {
    delete TriggerManager.triggerInstances[surveyId];
    if (Object.keys(TriggerManager.triggerInstances).length == 0) {
      clearInterval(TriggerManager.triggerInterval);
    }
  }

  static processIntervalTriggers() {
    //if some survey is already running skip processing surveys for now?or queue it?.
    let pathname = window.location.pathname;
    if (pathname.match(/\./)) {
      pathname = pathname.substring(0, pathname.lastIndexOf('/'));
    }
    Cookie.set(Constants.CCTriggerPageElapsedTime, new Date(), undefined, pathname);
    Cookie.set(Constants.CCTriggerSiteElapsedTime, new Date(), undefined, undefined);

    for (let trigger in TriggerManager.triggerInstances) {
      TriggerManager.triggerInstances[trigger].processIntervalTriggers();
      TriggerManager.triggerInstances[trigger].processConditionalTriggers();
    }
  }

  static processScrollTriggers(scrollNow) {
    for (let trigger in TriggerManager.triggerInstances) {
      //process all scroll triggers.
      TriggerManager.triggerInstances[trigger].processScrollTriggers(scrollNow);
    }
  }

  static disableTriggers(surveyId: string) {
    TriggerManager.triggerInstances[surveyId].disableTriggers();
  }

};



export { TriggerManager };