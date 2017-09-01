import './css/survey.css';
import './css/questions.css';
import './css/utilities.css';
import { SurveyHandler } from "./SurveyHandler";
import { dom } from "./helpers/Dom";

/**
 * functions that are exposed to SDK User are written here.
 * Entry point for CCSDK.
 */

class CCSDKEntry {
  survey : SurveyHandler;
  init = function(surveyToken : String) {
    this.survey = new SurveyHandler(surveyToken);
    let data = this.survey.fetchQuestions();
    let self : CCSDKEntry = this;
    data.then(function(surveyData) {
        self.survey.surveyData = surveyData;
        self.survey.displayQuestions();
        dom(self);
    });

    //on fetch questions show 
  }

  trigger = function(type : String, target : String) {
    let self : CCSDKEntry = this;
    document.getElementById("anywhere").addEventListener('click',function(){
      console.log('click trigger');
      self.survey.displayWelcomeQuestion();
    });
  }

  prefill = function(id : String, value : String, valueType : String) {
    this.survey.fillPrefillQuestion(id, value , valueType);
  }

  prefillPost = function() {
    this.survey.postPrefillPartialAnswer();
  }
}

let instances: any = {};

export function init(surveyToken : any) {
  instances[surveyToken] = new CCSDKEntry();
  instances[surveyToken].init(surveyToken);
}

export function trigger(surveyToken : any, type : String, target : String) {
  instances[surveyToken].trigger(type, target);
}

export function prefill(surveyToken : any, id : String, value : String, valueType : String) {
  instances[surveyToken].prefill(id, value, valueType);
}