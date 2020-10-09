import { Cookie } from "./helpers/Cookie";
import { SurveyManager } from "./SurveyManager";
import { PrefillsBatchOrSingle } from "./types";
import { WebSurvey } from "./WebSurvey";
import { TriggerManager } from "./TriggerManager";
import { WebSurveyTriggers } from "./WebSurveyTriggers";
import { DEFAULT_PREFILL_QUEUE } from "./Constants";

/**
 * functions that are exposed to SDK User are written here.
 * Entry point for CCSDK.
 */
// declare var Sentry: any;

let localCCSDK;

// let instances : any = {};

(window as any).globalSurveyRunning = false;
(window as any).ccsdkDebug = false;
(window as any).isMobile = window.innerWidth <= 768 ? true : false;

export function setUpEnv() {
  localCCSDK = {
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

  if (typeof (window as any).CCSDK !== "undefined") {
    var queue = (window as any).CCSDK.q;
    (window as any).CCSDK = function () {
      if (arguments && arguments.length == 0) {
        var time = new Date();
      } else {
        (window as any).ccsdkDebug ? console.log(arguments) : "";
        var args = (Array as any).from(arguments);
        //Call this functions as ccsdk('functionName', ['argument1', 'argument2']);
        var functionName = args.splice(0, 1)[0];
        (window as any).ccsdkDebug ? console.log(functionName) : "";
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
    let eventCCReady: Event = document.createEvent("Event");
    eventCCReady.initEvent("ccready", true, true);
    document.dispatchEvent(eventCCReady);
  }
}

setUpEnv();

export function init(surveyToken: any) {
  let isV2 = true;
  //config options can be set in arguments[1]
  //available config options : themeColor
  surveyToken = decodeURIComponent(surveyToken).trim();
  let config = typeof arguments[1] === "object" ? arguments[1] : {};
  //create survey instance
  if (
    typeof Cookie.get(surveyToken + "-finish") !== "undefined" &&
    Cookie.get(surveyToken + "-finish")
  ) {
    return;
  }
  if (
    typeof Cookie.get(surveyToken + "-coolDown") !== "undefined" &&
    Cookie.get(surveyToken + "-coolDown")
  ) {
    return;
  }

  if (typeof config.isActive !== "undefined" && config.isActive) {
    if (!SurveyManager.surveyInstances[surveyToken]) {
      // Add survey to instances list
      SurveyManager.addSurvey(surveyToken, new WebSurvey(surveyToken, config));
    }

    if (!TriggerManager.triggerInstances[surveyToken]) {
      // add trigger to instances list
      TriggerManager.addSurvey(surveyToken, new WebSurveyTriggers(config));
    }

    trackEvent(surveyToken);

    if (!TriggerManager.enqueueSurvey) {
      setUpCallBack();
    }

    if (SurveyManager.prefillQueue[surveyToken]) {
      let object = SurveyManager.prefillQueue[surveyToken];
      SurveyManager.surveyInstances[surveyToken].tracking.trackEvent(
        "Init MicroSurvey",
        {
          token: surveyToken,
          data: {
            name: "Prefill lazily",
            action: surveyToken
          }
        },
        null,
        null
      );

      Object.keys(DEFAULT_PREFILL_QUEUE).forEach((x) => {
        if (object[x] && object[x].length > 0) {
          SurveyManager.surveyInstances[surveyToken].prefill(object, x);
        }
      });

      delete SurveyManager.prefillQueue[surveyToken];
      // if (object.directPrefills) {
      //   object.directPrefills.forEach(x => {

      //   });
      //   delete object.directPrefills;
      // } else if (object.byTagPrefills) {
      //   object.byTagPrefills.forEach(x => {
      //     SurveyManager.surveyInstances[surveyToken].prefill(x, 'BY_TAG');
      //   });
      //   delete object.byTagPrefills;
      // } else if (object.byNotePrefills) {
      //   object.byTagPrefills.forEach(x => {
      //     SurveyManager.surveyInstances[surveyToken].prefill(x, 'BY_NOTE');
      //   });
      //   delete object.byNotePrefills;
      // }
    }
    return SurveyManager.surveyInstances[surveyToken];
  } else {
    //do nothing
  }
}

export function setUpCallBack() {
  TriggerManager.enqueueSurvey = (token) => {
    SurveyManager.addSurveyToQueue(token);
  };
}

export function trackEvent(surveyToken: any) {
  SurveyManager.surveyInstances[surveyToken].tracking.trackEvent(
    "Init MicroSurvey",
    {
      token: surveyToken,
      data: {
        name: (<any>window).isMobile ? "Mobile Mode" : "Desktop Mode",
        action: surveyToken
      }
    },
    null,
    null
  );
}

export function destroy(surveyToken: string) {
  //remove from trigger manager, delete instance.
  SurveyManager.destroy(surveyToken);
  TriggerManager;
}
//
export function trigger(surveyToken: string, type: string, target: string) {
  (window as any).ccsdkDebug ? console.log(SurveyManager.surveyInstances) : "";

  if (typeof SurveyManager.surveyInstances[surveyToken] != "undefined") {
    SurveyManager.surveyInstances[surveyToken].tracking.trackEvent(
      "Trigger Type",
      {
        token: surveyToken,
        data: {
          name: type,
          action: surveyToken
        }
      },
      null,
      null
    );
    SurveyManager.surveyInstances[surveyToken].trigger(type, target);
  }
  //tell trigger manager to register trigger.
}

export function on(surveyToken: string, type: string, callback: any) {
  if (typeof SurveyManager.surveyInstances[surveyToken] != "undefined") {
    SurveyManager.surveyInstances[surveyToken].tracking.trackEvent(
      "Event Listeners",
      {
        token: surveyToken,
        data: {
          name: type,
          action: surveyToken
        }
      },
      null,
      null
    );
    SurveyManager.surveyInstances[surveyToken].on(type, callback);
  }
}

function savePrefillAsObject(surveyToken, restArgs, type) {
  let prefill;
  if (typeof restArgs[0] === "string") {
    prefill = { [restArgs[0]]: restArgs[1] };
  } else {
    prefill = restArgs[0];
  }
  if (
    typeof SurveyManager.surveyInstances[surveyToken] != "undefined" &&
    restArgs[0]
  ) {
    SurveyManager.surveyInstances[surveyToken].prefill(prefill, type);
  } else {
    if (!SurveyManager.prefillQueue[surveyToken]) {
      SurveyManager.prefillQueue[surveyToken] = {
        DIRECT: [],
        BY_TAG: [],
        BY_NOTE: []
      };
    }
    SurveyManager.prefillQueue[surveyToken][type].push(prefill);
  }
}

export function prefill(
  surveyToken: string,
  ...restArgs: PrefillsBatchOrSingle
) {
  savePrefillAsObject(surveyToken, restArgs, "DIRECT");
}

export function prefillByTag(
  surveyToken: string,
  ...restArgs: PrefillsBatchOrSingle
) {
  savePrefillAsObject(surveyToken, restArgs, "BY_TAG");
}

export function prefillByNote(
  surveyToken: string,
  ...restArgs: PrefillsBatchOrSingle
) {
  savePrefillAsObject(surveyToken, restArgs, "BY_NOTE");
}

export function show(surveyToken: string) {
  if (typeof SurveyManager.surveyInstances[surveyToken] != "undefined") {
    SurveyManager.surveyInstances[surveyToken].show();
  }
}

export function hide(surveyToken: string, callback) {
  if (typeof SurveyManager.surveyInstances[surveyToken] != "undefined") {
    SurveyManager.surveyInstances[surveyToken].hide(callback);
  }
}
