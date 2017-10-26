import { CCSDKConfig } from "./interfaces/CCSDKConfig";
import { DisplayConfig } from "./interfaces/DisplayConfig";
import { SurveyHandler } from "./SurveyHandler";
import { DomSurvey } from "./helpers/dom/DomSurvey";
import { DomUtilities } from "./helpers/dom/DomUtilities";
import { Scrollbar } from "./helpers/dom/Scrollbar";
import { Cookie } from './helpers/Cookie';
import { Constants } from './Constants';
import { Slider } from "./helpers/dom/Slider";
import { SurveyManager } from "./SurveyManager";
import { TriggerManager } from "./TriggerManager";
import { Triggers } from './Triggers';

class Survey {
  survey : SurveyHandler;
  dom : DomSurvey;
  surveyData : any;
  util : DomUtilities;
  scrollbar : Scrollbar;
  slider : Slider;
  config : CCSDKConfig;
  surveyToken : string;
  triggers : Triggers;
  surveyRunning : boolean;
  surveyDone : boolean;
  surveyStatus : string;

  constructor(surveyToken : string, config : CCSDKConfig) {
    this.surveyDone = false;
    this.surveyStatus = '';
    this.surveyToken = surveyToken;
    this.config = config;
    this.surveyRunning = false;
    // this.setupSurvey();
    this.triggers = new Triggers(this);
    TriggerManager.addSurvey(this.surveyToken, this.triggers);
    this.survey = new SurveyHandler(this);
    this.util = new DomUtilities;
    //set themeColor of survey
    this.config.themeColor = ( this.config && this.config.themeColor )?
    this.config.themeColor:"#db3c39";
      //use config variable textDirection and set dir
    this.setHtmlTextDirection();
    this.setDisplayOptions();
    this.util.trigger(document, this.surveyToken + '-ready', {'survey' : this});
  }

  setupSurvey(){
    this.getSurveyData();
  }

  setHtmlTextDirection(){
    let htmlDir : string = document.getElementsByTagName('html')[0].getAttribute('dir');
    let direction : string = ( this.config && this.config.textDirection )?
    this.config.textDirection:(htmlDir?htmlDir:"ltr");
    document.getElementsByTagName('html')[0].setAttribute('dir', direction);
  }

  setDisplayOptions(){
    this.survey.surveyDisplay.position =  this.config && this.config.display && this.config.display.position ?
    this.config.display.position : "bottom right";
    this.survey.surveyDisplay.welcomePopupAnimation =  this.config && this.config.display && this.config.display.welcomePopupAnimation ?
    "hide-"+ this.config.display.welcomePopupAnimation : "hide-right-left";
    this.survey.surveyDisplay.surveyPopupAnimation =  this.config && this.config.display && this.config.display.surveyPopupAnimation ?
    "hide-"+ this.config.display.surveyPopupAnimation : "hide-right-left";
    this.survey.surveyDisplay.surveyPosition =  this.config && this.config.display && this.config.display.surveyPosition ?
    this.config.display.surveyPosition : ( this.config.display.position.search(/bottom/gi)==-1?"top":"bottom" ) ;
  }

  getSurveyData(){
    let data = this.survey.fetchQuestions();
    let self : Survey = this;
    data.then(function(surveyData) {
        console.log(surveyData);
        self.surveyData = surveyData;
        //copy data.
        let event = new CustomEvent(Constants.SURVEY_DATA_EVENT + "-" + self.surveyToken , { detail : JSON.parse(JSON.stringify(surveyData)) });
        document.dispatchEvent(event);
        self.initSurvey();
    });
  }

  initSurvey() {
    //if survey already run don't run?
    //if default trigger initiated and survey already run then don't run.
    let self : Survey = this;
    // if(!self.surveyRunning) {
    //   self.surveyRunning = true;
    // }
    self.dom = new DomSurvey(this);
    self.dom.setTheme(self.config.themeColor);
    self.survey.attachSurvey(this.surveyData);
    self.dom.setupListeners();
    self.survey.displayWelcomeQuestion();
    //survey start event.
    let onSurveyStartEvent = new CustomEvent(Constants.SURVEY_START_EVENT + "-" + this.surveyToken);
    document.dispatchEvent(onSurveyStartEvent);
  }

  public on(type: string, callback : any) {
    document.addEventListener(type + "-" + this.surveyToken, function(e : any) {
      callback(e.detail);
    });
  }

  public prefill(questionId : string, answerObject : any) {
    //save this in this.surveyHandler
    this.survey.fillPrefillQuestionObject(questionId, answerObject);
  }

  public fillPrefill(questionTag : string, answer : any) {
    //save this in this.surveyHandler
    this.survey.fillPrefill(questionTag, answer);
  }

  public trigger(type : string, target : any) {
    let self : Survey = this;
    switch( type ){
      case 'click':
        this.triggers.enableClickTrigger(target, function(){
          // self.initSurvey();
          // Scrollbar.initAll();
          // self.slider = new Slider();
          // self.setupSurvey();
          SurveyManager.addSurvey(self.surveyToken);

        });
        break;
      case 'page-count':
        let count : number  = parseInt(target);
        this.triggers.enablePageCountTrigger(count);

      break;
      case 'site-count':
        let count2 : number  = parseInt(target);
        this.triggers.enableSiteCountTrigger(count2);
      break;
      case 'page-time':
        this.triggers.enablePageTimeTrigger(parseInt(target));
      break;
      case 'site-time':
        this.triggers.enableSiteTimeTrigger(parseInt(target));
      break;
      case 'url-match':
        this.triggers.enablePopUpByURLPatternTrigger(target);
      break;
      case 'utm-match':
        this.triggers.enablePopUpByUTMPatternTrigger(target);
        break;
      case 'scroll-pixels':
        this.triggers.enableScrollPixelsTrigger(parseInt(target));
        break;
      case 'launch':
        SurveyManager.addSurvey(self.surveyToken);
        break;
      default:
        break;
    }
  }
}

export { Survey };