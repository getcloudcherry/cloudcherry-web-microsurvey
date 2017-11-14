import { CCSDKConfig } from "./interfaces/CCSDKConfig";
import { DisplayConfig } from "./interfaces/DisplayConfig";
import { SurveyHandler } from "./SurveyHandler";
import { DomSurvey } from "./helpers/dom/DomSurvey";
import { DomUtilities } from "./helpers/dom/DomUtilities";
import { Scrollbar } from "./helpers/dom/ScrollBar";
import { Cookie } from './helpers/Cookie';
import { Constants } from './Constants';
import { Slider } from "./helpers/dom/Slider";
import { SurveyManager } from "./SurveyManager";
import { Triggers } from './Triggers';
import { Survey } from "./Survey";
/**
 * functions that are exposed to SDK User are written here.
 * Entry point for CCSDK.
 */


let localCCSDK = {
  init : init,
  destroy : destroy,
  trigger : trigger,
  on : on,
  prefill : prefill,
  fillPrefill : fillPrefill
};

// let instances : any = {};

(window as any).globalSurveyRunning = false;
(window as any).ccsdkDebug = true;

if(typeof (window as any).CCSDK !== 'undefined') {
  var queue = (window as any).CCSDK.q;
  (window as any).CCSDK = function()   {
      if(arguments && arguments.length == 0)   {
          var time = new Date();
          // console.log(this.time);
      } else {
          console.log(arguments);
          var args = (Array as any).from(arguments);
          // console.log(arguments);
          //Call this functions as ccsdk('functionName', ['argument1', 'argument2']);
          var functionName = args.splice(0,1)[0];
          console.log(functionName);
          return localCCSDK[functionName].apply(this, args);
      }
  };
  if(queue){
    for(var q of queue) {
        var args = (Array as any).from(q);
        var functionName = args.splice(0, 1)[0];
        localCCSDK[functionName].apply(this, args);
    }
  }
  let eventCCReady : Event = document.createEvent('Event');
  eventCCReady.initEvent('ccready', true, true);
  document.dispatchEvent(eventCCReady);

}

export function init(surveyToken : any) {
  //config options can be set in arguments[1]
  //available config options : themeColor
  // console.log(arguments[arguments.length - 1]);
  let config = (typeof arguments[1] === 'object')? arguments[1] : {};
  //create survey instance
  SurveyManager.surveyInstances[surveyToken] = (SurveyManager.surveyInstances[surveyToken]) ? SurveyManager.surveyInstances[surveyToken] : new Survey(surveyToken, config);
  
  return SurveyManager.surveyInstances[surveyToken];
}

export function destroy(surveyToken : string){
  // this.survey.destroy();
  //remove from trigger manager, delete instance.
  delete SurveyManager.surveyInstances[surveyToken];
}
//
export function trigger(surveyToken : string, type : string, target : string) {
  console.log(SurveyManager.surveyInstances);
  SurveyManager.surveyInstances[surveyToken].trigger(type, target);
  //tell trigger manager to register trigger.
}

export function on(surveyToken : string, type : string, callback : any) {
  SurveyManager.surveyInstances[surveyToken].on(type, callback);
}

export function prefill(surveyToken : string, questionId : string, answerObject : any) {
  SurveyManager.surveyInstances[surveyToken].prefill(questionId, answerObject);
}

export function fillPrefill(surveyToken : string, questionTag : string, answer : any) {
  SurveyManager.surveyInstances[surveyToken].fillPrefill(questionTag, answer);
}

export function show(surveyToken : string) {
  SurveyManager.surveyInstances[surveyToken].show();
}

export function hide(surveyToken : string) {
  SurveyManager.surveyInstances[surveyToken].hide();
}

//on exit detect


//
// export function prefill(id : string, value : string, valueType : string) {
//   SurveyManager.surveyInstances[this.surveyToken].prefill(id, value, valueType);
// }

// setInterval(function() {
//   //collect data and add to cookies.
// }, 1000);
