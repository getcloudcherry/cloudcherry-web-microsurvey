import { SurveyHandler } from "./SurveyHandler";
import { DomSurvey } from "./helpers/dom/DomSurvey";
import { Scrollbar } from "./helpers/dom/Scrollbar";

/**
 * functions that are exposed to SDK User are written here.
 * Entry point for CCSDK.
 */

let localCCSDK = {
  init : init,
  trigger : trigger,
  prefill : prefill
};
let instances: any = {};
class CCSDKEntry {
  survey : SurveyHandler;
  dom : DomSurvey;
  scrollbar : Scrollbar;
  constructor(surveyToken : string) {
    this.survey = new SurveyHandler(surveyToken);

    let data = this.survey.fetchQuestions();
    let self : CCSDKEntry = this;
    data.then(function(surveyData) {
        console.log(surveyData);
        self.survey.surveyData = surveyData;
        self.survey.setupSurveyContainer();
        self.survey.displayQuestions();
        self.dom = new DomSurvey("#db3c39");
        // dom(self);
    });

    //on fetch questions show
  }

  trigger(type : string, target : string) {
    let self : CCSDKEntry = this;
    document.querySelectorAll(target)[0].addEventListener('click',function(){
      console.log('click trigger');
      self.survey.displayWelcomeQuestion();
      self.dom.setupListners();
      Scrollbar.initAll();

    });
  }

  prefill(id : string, value : string, valueType : string) {
    this.survey.fillPrefillQuestion(id, value , valueType);
  }

  prefillPost() {
    this.survey.postPrefillPartialAnswer();
  }
}

if(typeof (window as any).CCSDK !== 'undefined') {
  var queue = (window as any).CCSDK.q;
  (window as any).CCSDK = function()   {
      if(arguments.length == 0)   {
          var time = new Date();
          console.log(this.time);
      } else {
          // console.log(arguments);
          var args = (Array as any).from(arguments);
          console.log(arguments);
          //Call this functions as ccsdk('functionName', ['argument1', 'argument2']);
          var functionName = args.splice(0,1)[0];
          // console.log(functionName);
          localCCSDK[functionName].apply(this, args);
      }
  };
  for(var q of queue) {
      var args = (Array as any).from(q);
      var functionName = args.splice(0, 1)[0];
      localCCSDK[functionName].apply(this, args);
  }
}



export function init(surveyToken : any) {
  instances[surveyToken] = new CCSDKEntry(surveyToken);
}

export function trigger(surveyToken : any, type : string, target : string) {
  instances[surveyToken].trigger(type, target);
}

export function prefill(surveyToken : any, id : string, value : string, valueType : string) {
  instances[surveyToken].prefill(id, value, valueType);
}
