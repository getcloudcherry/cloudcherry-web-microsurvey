//Survey Manager manages and queues survey.

import { TriggerManager } from "./TriggerManager";
import { WebSurvey } from "./WebSurvey";
import { PrefillType } from "./types";
import { Cookie } from "./helpers/Cookie";

class SurveyManager {
  static surveyQueue: any = [];
  static processQueueInterval: any = null;
  static prefillQueue: {
    [surveyToken: string]: {
      [k in PrefillType]: any;
    };
  } = {};
  static surveyInstances: {
    [key: string]: WebSurvey;
  } = {};

  static initializeSurvey(surveyId: string) {
    //check if survey ran?
    //do survey initialization.
    if (
      !SurveyManager.surveyInstances ||
      !SurveyManager.surveyInstances[surveyId]
    ) {
      (<any>window).ccsdkDebug
        ? console.info(
            "Microsurvey not properly set up. Contact Support.",
            { tokenId: surveyId },
            {
              page: window.location.href
            }
          )
        : "";
      return;
    }

    SurveyManager.surveyInstances[surveyId].setupSurvey();
  }

  static addSurvey(surveyId, surveyInstance) {
    SurveyManager.surveyInstances[surveyId] = surveyInstance;

    if (SurveyManager.processQueueInterval == null) {
      SurveyManager.processQueueInterval = setInterval(
        SurveyManager.processQueueIntervalCB,
        100
      );
    }
  }

  static addSurveyToQueue(token) {
    (window as any).ccsdkDebug
      ? console.log("Adding survey ID : " + token)
      : "";
    if (SurveyManager.surveyQueue.indexOf(token) === -1) {
      if (
        typeof Cookie.get(token + "-finish") !== "undefined" &&
        Cookie.get(token + "-finish")
      ) {
        return;
      }
      if (
        typeof Cookie.get(token + "-coolDown") !== "undefined" &&
        Cookie.get(token + "-coolDown")
      ) {
        return;
      }
      SurveyManager.surveyQueue.push(token);
    }
  }

  static processQueueIntervalCB() {
    if ((window as any).globalSurveyRunning == true) {
      return;
    } else {
      let surveyId = SurveyManager.surveyQueue.pop();
      (window as any).ccsdkDebug
        ? console.log("Processing survey ID " + surveyId)
        : "";
      if (surveyId) {
        SurveyManager.initializeSurvey(surveyId);
      }
    }
  }

  public static destroy(token) {
    setTimeout(() => {
      delete SurveyManager.surveyInstances[token];
    }, 250);
  }

  static destroyIntervals() {
    clearInterval(SurveyManager.processQueueInterval);
    SurveyManager.processQueueInterval = null;
  }

  public static setSurveyRunning() {
    (window as any).globalSurveyRunning = true;
    (window as any).globalSurveyStartTime = new Date();
  }

  public static unsetSurveyRunning() {
    (window as any).globalSurveyRunning = false;
  }
}

export { SurveyManager };
