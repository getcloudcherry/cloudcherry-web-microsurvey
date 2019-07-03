import { Cookie } from './helpers/Cookie';
import { SurveyManager } from "./SurveyManager";
import { Survey } from "./Survey";
import { PrefillsBatchOrSingle, PrefillDictionary } from './types';

/**
 * functions that are exposed to SDK User are written here.
 * Entry point for CCSDK.
 */
// declare var Sentry: any;

let localCCSDK = {
  init: init,
  destroy: destroy,
  trigger: trigger,
  hide: hide,
  show: show,
  on: on,
  prefill: prefill,
  prefillByTag: prefillByTag,
  prefillByNote: prefillByNote
};

// let instances : any = {};

(window as any).globalSurveyRunning = false;
(window as any).ccsdkDebug = false;
(window as any).isMobile = window.innerWidth <= 768 ? true : false;

if (typeof (window as any).CCSDK !== 'undefined') {
  var queue = (window as any).CCSDK.q;
  (window as any).CCSDK = function () {
    if (arguments && arguments.length == 0) {
      var time = new Date();
    } else {
      (window as any).ccsdkDebug ? console.log(arguments) : '';
      var args = (Array as any).from(arguments);
      //Call this functions as ccsdk('functionName', ['argument1', 'argument2']);
      var functionName = args.splice(0, 1)[0];
      (window as any).ccsdkDebug ? console.log(functionName) : '';
      return localCCSDK[functionName].apply(this, args);
    }
  };
  if (queue) {
    for (var q of queue) {
      var args = (Array as any).from(q);
      var functionName = args.splice(0, 1)[0];
      localCCSDK[functionName].apply(this, args);
    }
  }
  let eventCCReady: Event = document.createEvent('Event');
  eventCCReady.initEvent('ccready', true, true);
  document.dispatchEvent(eventCCReady);
}

export function init(surveyToken: any) {
  //config options can be set in arguments[1]
  //available config options : themeColor
  surveyToken = decodeURIComponent(surveyToken).trim();
  let config = (typeof arguments[1] === 'object') ? arguments[1] : {};
  //create survey instance
  if (typeof Cookie.get(surveyToken + '-finish') !== 'undefined' && Cookie.get(surveyToken + '-finish')) {
    return;
  }
  if (typeof Cookie.get(surveyToken + '-coolDown') !== 'undefined' && Cookie.get(surveyToken + '-coolDown')) {
    return;
  }

  if (typeof config.isActive !== 'undefined' && config.isActive) {
    SurveyManager.surveyInstances[surveyToken] = (SurveyManager.surveyInstances[surveyToken]) ? SurveyManager.surveyInstances[surveyToken] : new Survey(surveyToken, config);
    SurveyManager.surveyInstances[surveyToken].tracking.trackEvent('Init MicroSurvey', {
      token: surveyToken,
      data: {
        name: (<any>window).isMobile ? 'Mobile Mode' : 'Desktop Mode',
        action: surveyToken
      }
    }, null, null);
    console.log(SurveyManager.surveyInstances, 'onInit');
    return SurveyManager.surveyInstances[surveyToken];
  } else {
    //do nothing
  }

}

export function destroy(surveyToken: string) {
  //remove from trigger manager, delete instance.
  if (!SurveyManager ||
    !SurveyManager.surveyInstances ||
    !SurveyManager.surveyInstances[surveyToken] ||
    !SurveyManager.surveyInstances[surveyToken].dom) {
    return;
  }
  SurveyManager.surveyInstances[surveyToken].dom.destroyListeners();
  SurveyManager.surveyInstances[surveyToken].destroy();
  delete SurveyManager.surveyInstances[surveyToken];
}
//
export function trigger(surveyToken: string, type: string, target: string) {
  (window as any).ccsdkDebug ? console.log(SurveyManager.surveyInstances) : '';

  if (typeof SurveyManager.surveyInstances[surveyToken] != 'undefined') {
    SurveyManager.surveyInstances[surveyToken].tracking.trackEvent('Trigger Type', {
      token: surveyToken,
      data: {
        name: type,
        action: surveyToken
      }
    }, null, null);
    SurveyManager.surveyInstances[surveyToken].trigger(type, target);
  }
  //tell trigger manager to register trigger.
}

export function on(surveyToken: string, type: string, callback: any) {
  if (typeof SurveyManager.surveyInstances[surveyToken] != 'undefined') {
    SurveyManager.surveyInstances[surveyToken].tracking.trackEvent('Event Listeners', {
      token: surveyToken,
      data: {
        name: type,
        action: surveyToken
      }
    }, null, null);
    SurveyManager.surveyInstances[surveyToken].on(type, callback);
  }
}

export function prefill(surveyToken: string, ...restArgs: PrefillsBatchOrSingle) {
  if (typeof SurveyManager.surveyInstances[surveyToken] != 'undefined') {
    let questionId;
    if (typeof restArgs[0] === 'string') {
      questionId = restArgs[0];
    } else {
      questionId = Object.keys((<PrefillDictionary>restArgs[0])).length + ' Questions';
    }
    SurveyManager.surveyInstances[surveyToken].tracking.trackEvent('Prefill', {
      token: surveyToken,
      data: {
        name: questionId,
        action: surveyToken
      }
    }, null, null);
    SurveyManager.surveyInstances[surveyToken].prefill(restArgs, 'DIRECT');
  }
}

export function prefillByTag(surveyToken: string, ...restArgs: PrefillsBatchOrSingle) {
  if (typeof SurveyManager.surveyInstances[surveyToken] != 'undefined') {
    let questionTag;
    if (typeof restArgs[0] === 'string') {
      questionTag = restArgs[0];
    } else {
      questionTag = Object.keys((<PrefillDictionary>restArgs[0])).length + ' Questions';
    }
    SurveyManager.surveyInstances[surveyToken].tracking.trackEvent('Prefill by tag', {
      token: surveyToken,
      data: {
        name: questionTag,
        action: surveyToken
      }
    }, null, null);
    SurveyManager.surveyInstances[surveyToken].prefill(restArgs, 'BY_TAG');
  }
}

export function prefillByNote(surveyToken: string, ...restArgs: PrefillsBatchOrSingle) {
  if (typeof SurveyManager.surveyInstances[surveyToken] != 'undefined') {
    let questionNote;
    if (typeof restArgs[0] === 'string') {
      questionNote = restArgs[0];
    } else {
      questionNote = Object.keys((<PrefillDictionary>restArgs[0])).length + ' Questions';
    }
    SurveyManager.surveyInstances[surveyToken].tracking.trackEvent('Prefill by Note', {
      token: surveyToken,
      data: {
        name: questionNote,
        action: surveyToken
      }
    }, null, null);
    SurveyManager.surveyInstances[surveyToken].prefill(restArgs, 'BY_NOTE');
  }
}

export function show(surveyToken: string) {
  if (typeof SurveyManager.surveyInstances[surveyToken] != 'undefined') {
    SurveyManager.surveyInstances[surveyToken].show();
  }
}

export function hide(surveyToken: string) {
  if (typeof SurveyManager.surveyInstances[surveyToken] != 'undefined') {
    SurveyManager.surveyInstances[surveyToken].dom.destroyListeners();
    SurveyManager.surveyInstances[surveyToken].destroy();
    SurveyManager.surveyInstances[surveyToken].hide();
  }
}