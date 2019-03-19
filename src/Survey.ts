import { CCSDKConfig } from "./interfaces/CCSDKConfig";
import { DisplayConfig } from "./interfaces/DisplayConfig";
import { SurveyHandler } from "./SurveyHandler";
import { DomSurvey } from "./helpers/dom/DomSurvey";
import { DomUtilities } from "./helpers/dom/DomUtilities";
import { Scrollbar } from "./helpers/dom/ScrollBar";
import { Cookie } from './helpers/Cookie';
import { Constants } from './Constants';
import { Slider } from "./helpers/dom/Slider";
import { SurveyManager } from "./SurveyManager";
import { TriggerManager } from "./TriggerManager";
import { Triggers } from './Triggers';
import { RequestHelper } from './helpers/Request';
import { Config } from './Config';
import { MatomoTracker } from './helpers/tracking';
import { templates } from "./helpers/templates";
import { PrefillsBatchOrSingle, PrefillType } from "./typings";

class Survey {
  survey: SurveyHandler;
  dom: DomSurvey;
  surveyData: any;
  util: DomUtilities;
  scrollbar: Scrollbar;
  slider: Slider;
  config: CCSDKConfig;
  surveyToken: string;
  triggers: Triggers;
  surveyRunning: boolean;
  surveyDone: boolean;
  surveyStatus: string;
  isThrottled: boolean;
  thorttlingLogic: any;
  loginData: any;
  debug: false;
  surveyStartTime: any;
  requester = new RequestHelper();
  tracking: MatomoTracker;

  constructor( surveyToken: string, config: CCSDKConfig ) {
    this.isThrottled = true;
    this.surveyDone = false;
    this.surveyStatus = '';
    this.surveyToken = surveyToken;
    this.config = config;
    this.surveyRunning = false;
    this.thorttlingLogic = null;
    this.tracking = new MatomoTracker();
    this.tracking.token = surveyToken;
    if ( typeof this.config.textDirection === 'undefined' ) {
      this.config.textDirection = "ltr";
    }

    this.triggers = new Triggers( this );
    TriggerManager.addSurvey( this.surveyToken, this.triggers );
    this.survey = new SurveyHandler( this );
    this.util = new DomUtilities;
    //set themeColor of survey
    this.config.brandColor = ( this.config && this.config.brandColor ) ?
      this.config.brandColor : "#db3c39";
    //use config variable textDirection and set dir
    this.setHtmlTextDirection();
    this.setDisplayOptions();
    this.util.trigger( document, this.surveyToken + '-ready', { 'survey': this } );
    //do login
    this.config.username = "test";
    this.config.password = "test";
    this.config.location = "location";
    this.config.language = "English (Default)";
    //check trigger conditions and add itself to 
    //based on new config
    //gotta and these.
    this.trigger( "click", this.config.cssSelector );
    // this.trigger("scroll-pixels", this.config.scrollPercent);
    // this.trigger("page-time", this.config.waitSeconds);
    // this.trigger("url-match", this.config.grepURL);
    // this.trigger("url-not-match", this.config.grepInvertURL);
    // this.config.scrollPercent = 10;
    // this.config.waitSeconds = 5;
    this.triggers.setConditionalTriggers( this.config );
    // this.login(function() {
    //on login
    // });
  }

  getSurveyThrottlingLogic( cb ) {
    let getThrottleUrl = Config.API_URL + Config.GET_SURVEY_THROTTLE_LOGIC.replace( '{location}', this.config.location );
    let headers = {};
    headers[ Constants.AUTHORIZATION ] = Constants.AUTHORIZATION_BEARER + " " + this.loginData.access_token;
    let self = this;
    let successcb = function ( data ) {
      self.thorttlingLogic = data;
      self.checkThrottling( cb );
    };

    RequestHelper.getWithHeaders( getThrottleUrl, headers, successcb, null );
  }

  checkThrottling( cb ) {
    if ( this.thorttlingLogic != null ) {
      if ( this.thorttlingLogic.inputIds == null ) {
        this.thorttlingLogic.inputIds = [];
      }
      this.thorttlingLogic.inputIds.push( this.thorttlingLogic[ this.thorttlingLogic.uniqueIDQuestionIdOrTag.toLowerCase() ] );
      if ( this.thorttlingLogic.logics != null && this.thorttlingLogic.logics.length > 0 && this.config != null ) {
        this.thorttlingLogic.logics[ 0 ].filter.location = [];
        this.thorttlingLogic.logics[ 0 ].filter.location.push( this.config.location );
      }
    }
    let self = this;
    let postThrottleUrl = Config.API_URL + Config.POST_THROTTLING;
    let headers = {};
    headers[ Constants.AUTHORIZATION ] = Constants.AUTHORIZATION + " " + this.loginData.access_token;
    let successcb = function ( throttleResponse ) {

      if ( typeof throttleResponse[ 0 ][ self.thorttlingLogic.uniqueIDQuestionIdOrTag.toLowerCase() ] && throttleResponse[ 0 ].value ) {
        //get survey data?  
        cb();
      }
    };

    RequestHelper.postWithHeaders( postThrottleUrl, this.thorttlingLogic, headers, successcb, null );
  }

  addThrottlingEntries( isOpen: boolean ) {
    let addThrottleUrl = Config.API_URL + Config.POST_THROTTLING_ADD_ENTRIES;
    let headers = {};
    this.loginData = { access_token: "help" };
    headers[ Constants.AUTHORIZATION ] = Constants.AUTHORIZATION + " " + this.loginData.access_token;
    //fill this from config and data.
    let successcb = ( throttleResponse ) => {
      this.debug ? console.log( throttleResponse ) : '';
    }

    RequestHelper.postWithHeaders( addThrottleUrl, {
      user: "",
      mobile: "",
      emailId: "",
      customId: "",
      surveySentDate: "",
      surveyOpenDate: "",
      channel: "",
      isOpened: isOpen
    }, headers, successcb, null );

  }

  setupSurvey() {
    // this.getSurveyData();
    this.initSurvey();
  }

  setHtmlTextDirection() {
    let ccSDKElement = document.querySelector( '.cc-sdk' );
    if ( !ccSDKElement ) {
      return;
    }
    let ccSDKDir: string = ccSDKElement.getAttribute( 'dir' );
    let direction: string = ( this.config && this.config.textDirection ) ?
      this.config.textDirection : ( ccSDKDir ? ccSDKDir : "ltr" );
    ccSDKElement.setAttribute( 'dir', direction );
  }

  setDisplayOptions() {
    this.survey.surveyDisplay.position = this.config && this.config.position ?
      this.config.position : "bottom right";
    let welcomePopupAnimation = 'hide-right-left';
    // this.survey.surveyDisplay.welcomePopupAnimation =  this.config && this.config.display && this.config.display.welcomePopupAnimation ?
    // "hide-"+ this.config.display.welcomePopupAnimation : "hide-right-left";
    // this.survey.surveyDisplay.surveyPopupAnimation =  this.config && this.config.display && this.config.display.surveyPopupAnimation ?
    // "hide-"+ this.config.display.surveyPopupAnimation : "hide-right-left";
    // this.survey.surveyDisplay.surveyPosition =  this.config && this.config.display && this.config.display.surveyPosition ?
    // this.config.display.surveyPosition : ( this.config.display.position.search(/bottom/gi)==-1?"top":"bottom" ) ;

    switch ( this.survey.surveyDisplay.position ) {
      case 'bottom right':
        welcomePopupAnimation = 'hide-right-left';
        break;
      case 'right bottom':
        welcomePopupAnimation = 'hide-right-left';
        break;
      case 'top right':
        welcomePopupAnimation = 'hide-right-left';
        break;
      case 'right top':
        welcomePopupAnimation = 'hide-right-left';
        break;
      case 'bottom left':
        welcomePopupAnimation = 'hide-left-right';
        break;
      case 'left bottom':
        welcomePopupAnimation = 'hide-left-right';
        break;
      case 'top left':
        welcomePopupAnimation = 'hide-left-right';
        break;
      case 'left top':
        welcomePopupAnimation = 'hide-left-right';
        break;
      default:
        welcomePopupAnimation = 'hide-right-left';
        break;
    }
    this.survey.surveyDisplay.welcomePopupAnimation = welcomePopupAnimation;
    this.tracking.trackEvent( 'Welcome Pop up Position', {
      token: this.tracking.token,
      data: {
        name: this.survey.surveyDisplay.position,
        action: null
      }
    }, null, null );

    this.survey.surveyDisplay.surveyPosition = this.config.position.search( /bottom/gi ) == -1 ? "top" : "bottom";
  }

  getSurveyData() {
    let self: Survey = this;
    let successcb = function ( surveyData ) {
      self.debug ? console.log( surveyData ) : '';
      // console.log(surveyData);

      self.surveyData = surveyData;
      if ( surveyData && surveyData.questions && surveyData.questions[ 0 ] ) {
        self.tracking.username = surveyData.questions[ 0 ].user;
      }

      self.tracking.token = self.surveyToken;

      self.tracking.trackEvent( 'Login Success', {
        token: self.tracking.token,
        data: {
          name: 'Token',
          action: self.surveyToken
        }
      }, console.log, console.error )
      self.tracking.trackEvent( 'Survey Length', {
        token: self.tracking.token,
        data: {
          name: `${ surveyData.questions.length } Questions`,
          action: `${ surveyData.preFill ? surveyData.preFill.length : 0 } Prefills`
        }
      }, null, null );
      let event = new CustomEvent( Constants.SURVEY_DATA_EVENT + "-" + self.surveyToken, { detail: JSON.parse( JSON.stringify( surveyData ) ) } );
      document.dispatchEvent( event );
      if ( !self.config.skipWelcomePage ) {
        self.dom.hideLoader();
      }
      if ( self.surveyData ) {
        self.initSurveyQuestions();
      } else {
        this.tracking.trackEvent( 'Expired Survey', {
          token: this.tracking.token,
          data: {
            name: null,
            action: null
          }
        }, null, null );
        self.survey.displayWelcomeQuestion( "The Survey has been expired" );
      }
    };
    let errorcb = null;
    this.survey.fetchQuestions( successcb, errorcb );
  }

  initSurvey() {
    //if survey already run don't run?
    //if default trigger initiated and survey already run then don't run.
    let self: Survey = this;
    // if(!self.surveyRunning) {
    //   self.surveyRunning = true;
    // }
    self.surveyRunning = true;
    self.dom = new DomSurvey( this );
    self.dom.setTheme( self.config.brandColor, this.config.keepAlive ? this.config.keepAlive : 0 );
    // self.survey.attachSurvey(this.surveyData);
    // self.config.language = "हिन्दी";
    self.config.language = "default";
    if ( self.surveyToken && decodeURIComponent( self.surveyToken ).trim() !== '' && !self.config.skipWelcomePage ) {
      self.survey.displayWelcomeQuestion();
    } else if ( self.config.skipWelcomePage ) {
      let onImpressionEvent = new CustomEvent( Constants.SURVEY_IMPRESSION_EVENT + "-" + this.surveyToken );
      document.dispatchEvent( onImpressionEvent );
      self.dom.startSurvey();
      self.survey.setCoolDownPeriod( self.config, self.surveyToken );
      this.surveyStartTime = new Date();
      self.survey.acceptAnswers();
    }
    self.dom.setupListeners();
    // self.survey.displayLanguageSelector();
    //survey start event.
    // let onSurveyStartEvent = new CustomEvent(Constants.SURVEY_START_EVENT + "-" + this.surveyToken);
    // document.dispatchEvent(onSurveyStartEvent);
  }

  initSurveyQuestions() {
    let self: Survey = this;
    self.survey.attachSurvey( this.surveyData );
    // self.dom.setupListeners();
    // self.config.language = "हिन्दी";
    self.config.language = "default";
    // self.survey.displayLanguageSelector();
    //survey start event.
    this.dom.initSurveyDom();
    let onSurveyStartEvent = new CustomEvent( Constants.SURVEY_START_EVENT + "-" + this.surveyToken );
    document.dispatchEvent( onSurveyStartEvent );
  }

  public on( type: string, callback: any ) {
    document.addEventListener( type + "-" + this.surveyToken, function ( e: any ) {
      callback( e.detail );
    } );
  }

  public show() {
    //do show and hide things.
    SurveyManager.setSurveyRunning();
    //show survey
    this.setupSurvey();

  }

  public hide() {
    SurveyManager.unsetSurveyRunning();
    this.survey.destroy();
    this.tracking.trackEvent( 'Survey Destroyed', {
      token: this.tracking.token,
      data: {
        name: ( <any>new Date() - ( <any>window ).globalSurveyStartTime ) + 's',
        action: null
      }
    }, null, null );
  }

  public destroy() {
    //remove all listeners?
    SurveyManager.unsetSurveyRunning();
    this.survey.destroy();
  }


  public prefill( restOfArgs: PrefillsBatchOrSingle, type: PrefillType ) {
    let prefillObject;
    if ( typeof restOfArgs[ 0 ] !== 'object' ) {
      prefillObject = {
        [ restOfArgs[ 0 ] ]: restOfArgs
      };
    } else {
      prefillObject = restOfArgs[ 0 ];
    }
    //save this in this.surveyHandler
    if ( type === 'DIRECT' ) {
      this.survey.fillPrefillDirect( prefillObject );
    } else if ( type === 'BY_TAG' ) {
      this.survey.fillPrefill( prefillObject );
    } else if ( type === 'BY_NOTE' ) {
      this.survey.fillPrefillByNote( prefillObject );
    }
  }


  public trigger( type: string, target: any ) {
    let self: Survey = this;
    switch ( type ) {
      case 'click':
        console.log( 'enable click trigger ##' )
        this.triggers.enableClickTrigger( target, function () {
          // self.initSurvey();
          // Scrollbar.initAll();
          // self.slider = new Slider();
          // self.setupSurvey();
          SurveyManager.addSurvey( self.surveyToken );

        } );
        break;
      case 'page-count':
        let count: number = parseInt( target );
        this.triggers.enablePageCountTrigger( count );

        break;
      case 'site-count':
        let count2: number = parseInt( target );
        this.triggers.enableSiteCountTrigger( count2 );
        break;
      case 'page-time':
        this.triggers.enablePageTimeTrigger( parseInt( target ) );
        break;
      case 'site-time':
        this.triggers.enableSiteTimeTrigger( parseInt( target ) );
        break;
      case 'url-match':
        this.triggers.enablePopUpByURLPatternTrigger( target );
        break;
      case 'url-not-match':
        this.triggers.enablePopUpByNotURLPatternTrigger( target );
        break;
      case 'utm-match':
        this.triggers.enablePopUpByUTMPatternTrigger( target );
        break;
      case 'scroll-pixels':
        this.triggers.enableScrollPixelsTrigger( parseInt( target ) );
        break;
      case 'launch':
        SurveyManager.addSurvey( self.surveyToken );
        break;
      default:
        break;
    }
  }
}

export { Survey };