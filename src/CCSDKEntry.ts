import { CCSDKConfig } from "./interfaces/CCSDKConfig";
import { SurveyHandler } from "./SurveyHandler";
import { DomSurvey } from "./helpers/dom/DomSurvey";
import { DomUtilities } from "./helpers/dom/DomUtilities";
import { Scrollbar } from "./helpers/dom/Scrollbar";

/**
 * functions that are exposed to SDK User are written here.
 * Entry point for CCSDK.
 */

let localCCSDK = {
  init : init,
  destroy : destroy,
  trigger : trigger,
  // prefill : prefill,
};

let instances: any = {};
class CCSDKEntry {
  survey : SurveyHandler;
  dom : DomSurvey;
  util : DomUtilities;
  scrollbar : Scrollbar;
  config : CCSDKConfig;
  surveyToken : string;
  constructor(surveyToken : string, config : CCSDKConfig) {
    this.setupSurvey(surveyToken, config);

    //on fetch questions show
  }

  setupSurvey(surveyToken : string, config : CCSDKConfig){
    this.survey = new SurveyHandler(surveyToken);
    this.config = config;
    this.util = new DomUtilities;
    this.surveyToken = surveyToken;
    //set themeColor of survey
    this.config.themeColor = ( config && config.themeColor )?
      config.themeColor:"#db3c39";
      console.log(this.config);
    let data = this.survey.fetchQuestions();
    let self : CCSDKEntry = this;
    data.then(function(surveyData) {
        console.log(surveyData);
        self.survey.attachSurvey(surveyData);
        self.dom = new DomSurvey();
        self.dom.setTheme(self.config.themeColor);
        self.dom.setupListeners();
        self.util.trigger(document, surveyToken + '-ready', {'survey' : self});
        // dom(self);
    });
  }

  public trigger(type : string, target : string) {
    let self : CCSDKEntry = this;
    switch( type ){
      case 'click':
        document.querySelectorAll(target)[0].addEventListener('click',function(){
          console.log('click trigger');
          // self.setupSurvey()
          self.survey.displayWelcomeQuestion();
          console.log(self);
          Scrollbar.initAll();
        });
        break;
      case 'launch':
      default:
        self.survey.displayWelcomeQuestion();
        Scrollbar.initAll();
        break;
    }
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
      if(arguments && arguments.length == 0)   {
          var time = new Date();
          console.log(this.time);
      } else {
          // console.log(arguments);
          var args = (Array as any).from(arguments);
          console.log(arguments);
          //Call this functions as ccsdk('functionName', ['argument1', 'argument2']);
          var functionName = args.splice(0,1)[0];
          // console.log(functionName);
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
  (window as any).CCSDK = localCCSDK;
}



export function init(surveyToken : any) {
  //config options can be set in arguments[1]
  //available config options : themeColor
  console.log(arguments[arguments.length - 1]);
  let config = (typeof arguments[1] === 'object')? arguments[1] : {};
  instances[surveyToken] = (instances[surveyToken])?
  instances[surveyToken]:new CCSDKEntry(surveyToken, config );
  return instances[surveyToken];
}

export function destroy(surveyToken : string){
  this.survey.destroy();
  instances[surveyToken] = null;
}
//
export function trigger(type : string, target : string) {
  instances[this.surveyToken].trigger(type, target);
}
//
// export function prefill(id : string, value : string, valueType : string) {
//   instances[this.surveyToken].prefill(id, value, valueType);
// }
