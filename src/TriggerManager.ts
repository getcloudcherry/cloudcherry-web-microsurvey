//Manages trigger.
import { Cookie } from "./helpers/Cookie";
import { Constants } from "./Constants";
import { Triggers } from "./Triggers";
//collect initial data
//if on site time is null, add on site time
if(Cookie.get(Constants.CCTriggerSiteStartTime) == null) {
  Cookie.set(Constants.CCTriggerSiteStartTime, new Date(), undefined, undefined);
}
//always add on page Time
Cookie.set(Constants.CCTriggerPageStartTime, new Date(), undefined, undefined);

let sitePageViewCount = Cookie.get(Constants.CCTriggerSitePageViewCount);
if( sitePageViewCount == null) {
  Cookie.set(Constants.CCTriggerSitePageViewCount, 1, undefined, undefined);
} else {
  sitePageViewCount = (parseInt(sitePageViewCount) + 1).toString();
  Cookie.set(Constants.CCTriggerSitePageViewCount, sitePageViewCount, undefined, undefined);
}

let individualPageViewCount = Cookie.get(Constants.CCTriggerIndividualPageViewCount);
if( individualPageViewCount == null) {
  Cookie.set(Constants.CCTriggerIndividualPageViewCount, 1, undefined, window.location.href);
} else {
  individualPageViewCount = (parseInt(individualPageViewCount) + 1).toString();
  Cookie.set(Constants.CCTriggerIndividualPageViewCount, individualPageViewCount, undefined, window.location.href);
}

window.onscroll = function (e) {  
  // called when the window is scrolled.  
    let doc = document.documentElement;
    let left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    console.log(top);
    TriggerManager.processScrollTriggers(top);
} 


//TriggerManager adds to survey Queue
class TriggerManager {

  static triggerInterval : any = null;
  static triggerInstances : any = {};

  constructor() {
    //initialize triggers
    //add those triggers which aren't completed yet.
  }

  static addSurvey(surveyId : any, trigger : Triggers) {
    TriggerManager.triggerInstances[surveyId] = trigger;
    if(Object.keys(TriggerManager.triggerInstances).length >= 1) {
      console.log(TriggerManager.triggerInterval);
      if(TriggerManager.triggerInterval == null) {
        console.log("TriggerHandler : Setting up Interval Trigger Handlers.");
        TriggerManager.triggerInterval = setInterval(TriggerManager.processIntervalTriggers, 1000);
      }
      //processing sequential triggers if any.
      // console.log("TriggerHandler : Processing sequential triggers for  " + surveyId);
      // TriggerManager.processTriggersBySurveyId(surveyId);
    }
  }

  static removeSurvey(surveyId : string) {
    delete TriggerManager.triggerInstances[surveyId];
    if(Object.keys(TriggerManager.triggerInstances).length == 0) {
      clearInterval(TriggerManager.triggerInterval);
    }
  }

  static processIntervalTriggers() {
    //if some survey is already running skip processing surveys for now?or queue it?.
    Cookie.set(Constants.CCTriggerPageElapsedTime, new Date(), undefined, window.location.href);
    Cookie.set(Constants.CCTriggerSiteElapsedTime, new Date(), undefined, undefined);
    //set cookies and call every process Interval Triggers.
    for(let trigger in TriggerManager.triggerInstances) {
      TriggerManager.triggerInstances[trigger].processIntervalTriggers();
    }
  }

  static processScrollTriggers(scrollNow) {
    for(let trigger in TriggerManager.triggerInstances) {
      //process all scroll triggers.
      TriggerManager.triggerInstances[trigger].processScrollTriggers(scrollNow);
    }
  }

  static disableTriggers(surveyId : string) {
    TriggerManager.triggerInstances[surveyId].disableTriggers();
  }

};



export { TriggerManager };