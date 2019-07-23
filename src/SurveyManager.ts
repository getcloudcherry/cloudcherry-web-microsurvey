
//Survey Manager manages and queues survey.

class SurveyManager {

  static surveyQueue: any = [];
  static processQueueInterval: any = null;
  static prefillQueue: any = {};
  static surveyInstances: any = {};

  static initializeSurvey(surveyId: string) {
    //check if survey ran?
    //do survey initialization.
    if (!SurveyManager.surveyInstances || !SurveyManager.surveyInstances[surveyId]) {
      console.error('Microsurvey not properly set up. Contact Support.');
      return;
    }

    SurveyManager.surveyInstances[surveyId].setupSurvey();
  }

  static addSurvey(surveyId) {
    (window as any).ccsdkDebug ? console.log("Adding survey ID : " + surveyId) : '';
    if (SurveyManager.surveyQueue.indexOf(surveyId) === -1) {
      SurveyManager.surveyQueue.push(surveyId);
    }
    if (SurveyManager.processQueueInterval == null) {
      SurveyManager.processQueueInterval = setInterval(SurveyManager.processQueueIntervalCB, 100);
    }
  }

  static removeSurvey(surveyId) {
    if (SurveyManager.surveyQueue.length > 0) {
      for (let survey in SurveyManager.surveyQueue) {
        if (SurveyManager.surveyQueue[survey].surveyId == surveyId) {
          SurveyManager.surveyQueue.splice(survey, 1);
          break;
        }
      }
    }
    if (SurveyManager.surveyQueue.length == 0) {
      clearInterval(SurveyManager.processQueueInterval);
    }
  }

  static processQueueIntervalCB() {
    if ((window as any).globalSurveyRunning == true) {
      return;
    } else {
      let surveyId = SurveyManager.surveyQueue.pop();
      (window as any).ccsdkDebug ? console.log("Processing survey ID " + surveyId) : '';
      if (surveyId == undefined) {
        clearInterval(SurveyManager.processQueueInterval);
        SurveyManager.processQueueInterval = null;
      } else {
        (window as any).globalSurveyRunning = true;
        SurveyManager.initializeSurvey(surveyId);
      }
    }
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