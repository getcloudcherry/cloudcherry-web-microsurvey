// import './css/survey.css';
import './css/questions.css';
// import './css/utilities.css';
import { SurveyHandler } from "./SurveyHandler";
import { dom } from "./helpers/Dom";
import { DomSurvey } from "./helpers/Dom/DomSurvey";

/**
 * functions that are exposed to SDK User are written here.
 * Entry point for CCSDK.
 */

class CCSDKEntry {
  survey : SurveyHandler;
  dom : DomSurvey;
  constructor(surveyToken : String) {
    this.survey = new SurveyHandler(surveyToken);
    let data = this.survey.fetchQuestions();
    let self : CCSDKEntry = this;
    data.then(function(surveyData) {
        self.survey.surveyData = surveyData;
        self.survey.displayQuestions();
        this.dom = new DomSurvey('#db3c39');

        // dom(self);

    });

    //on fetch questions show
  }

  trigger(type : String, target : String) {
    let self : CCSDKEntry = this;
    document.getElementById("anywhere").addEventListener('click',function(){
      console.log('click trigger');
      self.survey.displayWelcomeQuestion();
    });
  }

  prefill(id : String, value : String, valueType : String) {
    this.survey.fillPrefillQuestion(id, value , valueType);
  }

  prefillPost() {
    this.survey.postPrefillPartialAnswer();
  }
}

let instances: any = {};

export function init(surveyToken : any) {
  instances[surveyToken] = new CCSDKEntry(surveyToken);
}

export function trigger(surveyToken : any, type : String, target : String) {
  instances[surveyToken].trigger(type, target);
}

export function prefill(surveyToken : any, id : String, value : String, valueType : String) {
  instances[surveyToken].prefill(id, value, valueType);
}
