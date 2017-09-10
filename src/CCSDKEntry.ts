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
  surveyData : any;
  util : DomUtilities;
  scrollbar : Scrollbar;
  config : CCSDKConfig;
  surveyToken : string;
  constructor(surveyToken : string, config : CCSDKConfig) {
    this.surveyToken = surveyToken;
    this.config = config;
    this.setupSurvey();
    // this.trigger(undefined, undefined);

    //on fetch questions show
  }

  setupSurvey(){
    this.survey = new SurveyHandler(this.surveyToken);
    // this.config = this.config;
    this.util = new DomUtilities;
    //this.surveyToken = this.surveyToken;
    //set themeColor of survey
    this.config.themeColor = ( this.config && this.config.themeColor )?
      this.config.themeColor:"#db3c39";
      this.getSurveyData();
      // console.log(this.config);
  }

  getSurveyData(){
    let data = this.survey.fetchQuestions();
    let self : CCSDKEntry = this;
    data.then(function(surveyData) {
        // console.log(surveyData);
        // self.survey.attachSurvey(surveyData);
        // self.dom = new DomSurvey();
        // self.dom.setTheme(self  .config.themeColor);
        // self.dom.setupListeners();
        self.surveyData = surveyData;
        self.util.trigger(document, self.surveyToken + '-ready', {'survey' : self});
        // cb(surveyData)
        // dom(self);
    });
  }

 initSurvey( ){
    let self : CCSDKEntry = this;
    self.survey.attachSurvey(this.surveyData);
    self.dom = new DomSurvey();
    self.dom.setTheme(self.config.themeColor);
    self.dom.setupListeners();
    // self.util.trigger(document, self.surveyToken + '-ready', {'survey' : self});
    self.survey.displayWelcomeQuestion();

  }

  public trigger(type : string, target : string) {
    let self : CCSDKEntry = this;
    switch( type ){
      case 'click':
        document.querySelectorAll(target)[0].addEventListener('click',function(){
          // console.log('click trigger');
          self.initSurvey();
          Scrollbar.initAll();
        });
        break;
      case 'launch':
        self.initSurvey();
        Scrollbar.initAll();
      default:
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
  (window as any).CCSDK = localCCSDK;
}



export function init(surveyToken : any) {
  //config options can be set in arguments[1]
  //available config options : themeColor
  // console.log(arguments[arguments.length - 1]);
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
