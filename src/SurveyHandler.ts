
// import 'whatwg-fetch';
import { Config } from "./Config";
import { DisplayConfig } from "./interfaces/DisplayConfig";
import { RequestHelper } from './helpers/Request';
import { templates } from "./helpers/templates";
import { DomUtilities } from "./helpers/dom/DomUtilities";
import { DomSurvey } from "./helpers/dom/DomSurvey";
import { ConditionalTextFilter } from "./helpers/filters/ConditionalTextFilter";
import { Constants } from "./Constants";
import { LanguageTextFilter } from "./helpers/filters/LanguageTextFilter";
import { Select } from './helpers/dom/Select';
import { Cookie } from './helpers/Cookie';
import { ConditionalFlowFilter } from './helpers/filters/ConditionalFlowFilter';



class SurveyHandler {
  surveyToken: string;
  surveyData: any;
  questions: any;
  prefillQuestions: any;
  questionsToDisplay: any;
  randomNumber: Number;
  welcomeQuestion: any;
  welcomeQuestionButtonText: any;
  prefillResponses: any;
  prefillDirect: any;
  prefillWithTags: any;
  prefillWithNote: any;
  questionResponses: any;
  answers: any = {};
  surveyAnswers: any = {};
  util: DomUtilities;
  dom: DomSurvey;
  displayThankYouCb: any;
  destroySurveyCb: any;
  acceptAnswersCb: any;
  surveyDisplay: DisplayConfig;
  currentQuestion: any;
  conditionalQuestions: any;
  ccsdk: any;
  welcomeInterval: any;
  welcomeQuestionDisplayTime: any;
  domListeners: any;
  languageSelect: any;
  private _prefillsPartiallyPosted = false;
  // isPartialAvailable : Boolean;

  constructor( ccsdk ) {
    this.surveyToken = ccsdk.surveyToken;
    this.surveyData = {};
    this.surveyDisplay = {
      'position': '',
      'surveyPosition': '',
      'welcomePopupAnimation': '',
      'surveyPopupAnimation': '',
    };
    this.ccsdk = ccsdk;
    this.domListeners = [];
    this.questions = [];
    this.questionsToDisplay = [];
    this.prefillQuestions = [];
    this.conditionalQuestions = [];
    this.prefillResponses = [];
    this.prefillWithTags = {};
    this.prefillWithNote = {};
    this.prefillDirect = {};
    this.answers = {};
    this.util = new DomUtilities();
    this.dom = ccsdk.dom;
    this.displayThankYouCb = ( e: any ) => {
      //perform final post
      this.finalPost( null, null );
      if ( this.ccsdk && this.ccsdk.tracking ) {
        this.ccsdk.tracking.trackEvent( 'Completed Survey', {
          token: this.ccsdk.tracking.token,
          data: {
            name: null,
            action: null
          }
        }, null, null );
      }

      let thankyouHtml: any = templates.thankyou;
      // thankyouHtml = thankyouHtml.replace("{{question}}", this.surveyData.thankyouText);
      // thankyouHtml = thankyouHtml.replace("{{question}}", LanguageTextFilter.translateMessages(this, "thankyouText"));
      let thankyouText = this.ccsdk.config.thankyouText ? this.ccsdk.config.thankyouText : ( this.surveyData.thankyouText ? this.surveyData.thankyouText : 'Thank You' );
      let startText = this.ccsdk.config.startButtonText ? this.ccsdk.config.startButtonText : 'Start';
      thankyouHtml = thankyouHtml.replace( "{{question}}", thankyouText );
      thankyouHtml = thankyouHtml.replace( "{{button}}", startText );
      thankyouHtml = thankyouHtml.replace( "{{branding}}", this.surveyData.branding && this.surveyData.branding.toUpperCase() === 'NONE' ? 'no-branding' : 'full-branding' )
      this.ccsdk.dom.replaceInQuestionsContainer( thankyouHtml );
      //TODO : Fix this Add class not working???
      let thankyouContainer: any = this.util.get( "#cc-thankyou-container" );
      ( window as any ).ccsdkDebug ? console.log( thankyouContainer ) : '';
      this.util.addClass( thankyouContainer[ 0 ], 'show-thankyou-slide' );
      let onSurveyEndEvent = new CustomEvent( Constants.SURVEY_END_EVENT + "-" + this.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyEndEvent );
      //set done cookie for 30 days.
      Cookie.set( this.surveyToken + '-finish', 'true', 30, '/' );
      setTimeout( () => {
        this.ccsdk.dom.destroyListeners();
        this.destroy();
      }, 2000 );
    }

    this.destroySurveyCb = ( e: any ) => {
      let self: SurveyHandler = this;
      //send end survey event.
      let onSurveyEndEvent = new CustomEvent( Constants.SURVEY_END_EVENT + "-" + this.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyEndEvent );
      self.destroy();
    }

    this.acceptAnswersCb = ( e: any ) => {
      let self: SurveyHandler = this;
      // (window as any).ccsdkDebug?console.log(self):'';
      // (window as any).ccsdkDebug?console.log('question answered',e:'')
      let data: any = <any>e.detail;
      let response: any = {};
      response.questionId = data.questionId;
      switch ( data.type ) {
        case 'scale':
          response.text = null;
          response.number = Number( data.data.number );
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'nps':
          response.text = null;
          response.number = Number( data.data.number );
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'radio':
          response.text = data.data.text;
          response.number = null;
          // response.number = Number(data.data.number);
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'radioImage':
          response.text = data.data.text;
          response.number = null;
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'smile':
          response.text = null;
          response.number = Number( data.data.number );
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'star':
          response.text = null;
          response.number = Number( data.data.number );
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'multiline':
          response.text = data.data.text;
          response.number = null;
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex( data.index );
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'singleline':
          response.text = data.data.text;
          response.number = null;
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex( data.index );
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'number':
          response.text = null;
          response.number = Number( data.data.number );
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex( data.index );
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'checkbox':
          response.text = data.data.text;
          response.number = null;
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex( data.index );
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'select':
          response.text = data.data.text;
          response.number = null;
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex( data.index );
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'slider':
          response.text = data.data.text;
          response.number = Number( data.data.number );
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer( data.index, response, false, null, null );
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex( data.index );
          // self.ccsdk.dom.nextQuestion();
          break;
        default:
          break;
      }
    }
  }

  fetchQuestions( successcb, errorcb ) {
    this.randomNumber = parseInt( ( String )( Math.random() * 1000 ) );
    let surveyUrl = Config.SURVEY_BY_TOKEN.replace( "{token}", "" + this.surveyToken );
    // surveyUrl = surveyUrl.replace("{tabletId}", "" + this.randomNumber);
    surveyUrl = Config.API_URL + surveyUrl;
    RequestHelper.get( surveyUrl, successcb, errorcb );

    // (window as any).ccsdkDebug?console.log(data):'';
    // this.surveyData = data.then(function();
    // (window as any).ccsdkDebug?console.log(this.surveyData):'';
  }

  removeAnswer( questionId ) {
    delete this.answers[ questionId ];
    delete this.surveyAnswers[ questionId ];
  }

  attachSurvey( surveyData: any ) {
    this.surveyData = surveyData;
    this.setupPrefill();
    this.setupSurveyContainer();
    //clean survey
    this.cleanSurvey();
    this.displayQuestions();
    this.displayThankYou();
    this.destroySurvey();
  }

  setupPrefill() {
    if ( this.surveyData && this.surveyData.preFill && this.surveyData.preFill.length > 0 ) {
      this.surveyData.preFill.map( response => {
        this.fillPrefillQuestionObject( response.questionId, response );
      } )
    }
  }

  cleanSurvey() {
    this.questionsToDisplay = [];
    this.answers = {};
    this.surveyAnswers = {};
    this.conditionalQuestions = [];
  }

  setupSurveyContainer() {
    let surveyHtml: any = templates.question_survey;
    surveyHtml = surveyHtml.replace( "{{surveyToken}}", this.surveyToken );
    surveyHtml = surveyHtml.replace( "{{animation}}", this.surveyDisplay.surveyPopupAnimation );
    surveyHtml = surveyHtml.replace( /{{location}}/g, this.surveyDisplay.surveyPosition );
    this.ccsdk.dom.appendInBody( surveyHtml );
  }

  displayQuestionSelector() {

  }

  displayWelcomeQuestion( warningWelcomeText?: string ) {
    //call this with true when welcome container is clicked.
    // this.ccsdk.addThrottlingEntries(false);
    let onSurveyImpressionEvent = new CustomEvent( Constants.SURVEY_IMPRESSION_EVENT + "-" + this.surveyToken );
    document.dispatchEvent( onSurveyImpressionEvent );
    this.ccsdk.surveyStartTime = new Date();
    let self = this;
    let welcomeHtml: any = templates.question_start;
    welcomeHtml = welcomeHtml.replace( "{{surveyToken}}", this.surveyToken );
    // welcomeHtml = welcomeHtml.replace("{{question}}", this.surveyData.welcomeText);
    let welcomeText = this.ccsdk.config.welcomeText ? this.ccsdk.config.welcomeText : 'Welcome';
    // welcomeHtml = welcomeHtml.replace("{{question}}", LanguageTextFilter.translateMessages(this, "welcomeText"));
    let startText = this.ccsdk.config.startButtonText ? this.ccsdk.config.startButtonText : 'Start';
    if ( warningWelcomeText ) {
      document.getElementById( this.surveyToken + "-welcome" ).remove();
      welcomeHtml = welcomeHtml.replace( "{{question}}", warningWelcomeText );
      welcomeHtml = welcomeHtml.replace( "{{button}}", "Close" );
      welcomeHtml = welcomeHtml.replace( "{{action}}", "button-close" );
    } else {
      welcomeHtml = welcomeHtml.replace( "{{question}}", welcomeText );
      welcomeHtml = welcomeHtml.replace( "{{button}}", startText );
      welcomeHtml = welcomeHtml.replace( "{{action}}", "survey-start" );
    }
    welcomeHtml = welcomeHtml.replace( "{{location}}", this.surveyDisplay.position );
    welcomeHtml = welcomeHtml.replace( "{{animation}}", this.surveyDisplay.welcomePopupAnimation );
    // (window as any).ccsdkDebug?console.log("Appending in body"):'';
    this.ccsdk.dom.appendInBody( welcomeHtml );
    this.ccsdk.dom.showWelcomeContainer();
    if ( ( typeof this.ccsdk.config.keepAlive != undefined ) && ( this.ccsdk.config.keepAlive > 0 ) ) {
      this.welcomeQuestionDisplayTime = new Date();
      this.welcomeInterval = setInterval( () => { self.checkWelcomeQuestionDisplay( self.ccsdk.config.keepAlive ) }
        , 1000 );
    }

    this.acceptAnswers();
    // self.survey.displayLanguageSelector();

  }

  checkWelcomeQuestionDisplay( keepAlive ) {
    let self = this;
    let now = new Date();
    if ( keepAlive ) {
      // console.log((now.getTime() - this.welcomeQuestionDisplayTime.getTime()) / 1000);
      if ( keepAlive <= ( now.getTime() - this.welcomeQuestionDisplayTime.getTime() ) / 1000 ) {
        self.killWelcomeQuestion();
      }
    }
  }

  killWelcomeQuestion() {
    this.destroy();
    clearInterval( this.welcomeInterval );
  }
  cancelKillWelcomeQuestion() {
    clearInterval( this.welcomeInterval );
  }

  displayLanguageSelector() {
    let self = this;
    let options1: string;
    let qId = 'languageSelector';
    let cTemplate1 = templates.language_selector;
    options1 = this.util.generateLanguageSelectOptions( [ "default" ] );
    if ( this.surveyData.translated ) {
      options1 = this.util.generateLanguageSelectOptions( [ "default" ].concat( Object.keys( this.surveyData.translated ) ) );
    }
    cTemplate1 = cTemplate1.replace( /{{questionId}}/g, qId );
    cTemplate1 = cTemplate1.replace( "{{options}}", options1 );
    cTemplate1 = cTemplate1.replace( "{{requiredLabel}}", true ? "*" : "" );
    this.ccsdk.dom.replaceInQuestionsContainer( cTemplate1 );
    let $questionContainer = document.
      querySelectorAll( ".cc-questions-container" );
    let $body = document.getElementsByTagName( "body" )[ 0 ];

    this.util.addClass( $questionContainer[ 0 ].firstChild, 'show-slide' );
    this.languageSelect = new Select( qId );
    let submitBtn = document.querySelectorAll( '.submit-icon' );
    this.util.removeClassAll( submitBtn, 'act-cc-button-next' );
    this.util.addClassAll( submitBtn, 'act-cc-button-lang-next' );
    if ( this.languageSelect ) {
      this.languageSelect.destroyListeners();
    }
    this.languageSelect.init( qId );
    let selectRes = '';
    if ( this.util.checkIfListenerExists( '#' + qId + " .cc-select-options .cc-select-option", this.domListeners ) ) {
      // return;
      ( window as any ).ccsdkDebug ? console.log( "display language select - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId + " .cc-select-options .cc-select-option" );
    }
    let ref = this.util.initListener( 'click', '#' + qId + " .cc-select-options .cc-select-option", function () {
      self.ccsdk.debug ? console.log( 'languageSelectOption' ) : '';
      selectRes = document.querySelectorAll( '#' + qId + " .cc-select-trigger" )[ 0 ].innerHTML;
    } );
    this.domListeners.push( ref );
    ref.internalHandler = this.util.listener( $body, ref.type, ref.id, ref.cb );


    let languageSelect2 = this.util.initListener( "click", ".act-cc-button-lang-next", function () {
      self.ccsdk.debug ? console.log( 'languageNext' ) : '';
      self.ccsdk.config.language = "default";
      self.ccsdk.config.language = selectRes; //language selection from menu then show first question
      //set config rtl or ltr
      let isRTL = /[\u0600-\u06FF]/.test( selectRes );
      self.ccsdk.config.textDirection = isRTL ? 'rtl' : 'ltr';
      self.ccsdk.setHtmlTextDirection();
      self.util.removeClassAll( submitBtn, 'act-cc-button-lang-next' );
      self.util.addClassAll( submitBtn, 'act-cc-button-next' );
      self.ccsdk.dom.loadFirstQuestion();        // this.loadFirstQuestion();
      // self.postPrefillPartialAnswer( false, null, null );
    } );
    this.domListeners.push( languageSelect2 );

    languageSelect2.internalHandler = this.util.listener( $body, languageSelect2.type, languageSelect2.id, languageSelect2.cb );



    // this.util.addClass(thankyouContainer[0], 'show-thankyou-slide');

    // this.ccsdk.dom.appendInBody(cTemplate1);
    // this.ccsdk.dom.showLanguageSelector();
    ( window as any ).ccsdkDebug ? console.log( cTemplate1 ) : '';
  }

  displayThankYou() {
    let self: SurveyHandler = this;
    document.addEventListener( 'ccdone', this.displayThankYouCb );
  }


  displayQuestions() {
    //check question is supported, based on question types.
    //filter pre fill questions.
    this.questions = this.surveyData.questions;

    // this.questionsToDisplay = (this.surveyData.questions as any[]).filter(this.filterQuestions);
    this.filterQuestions();
    //sort questions and display them?
    this.questionsToDisplay = this.questionsToDisplay.sort( this.questionCompare );
    let ccSurvey: any;
    ccSurvey = document.getElementsByClassName( "cc-questions-container" );
    // ccSurvey = ccSurvey[0];
    let surveyObject = ccSurvey[ 0 ];
    // (window as any).ccsdkDebug?console.log(this.questionsToDisplay):'';
    //chec
    //for now just do 1st question.
    for ( let question of this.questionsToDisplay ) {
      if ( this.checkConditionals( question ) ) {
        let compiledTemplate = this.compileTemplate( question );
        question.compiledTemplate = compiledTemplate;
        // surveyObject.innerHTML += compiledTemplate;
        //register handlers for onclick?
      } else {
        if ( this.isPrefillQuestion( question ) ) {
          this.prefillQuestions.push( question );
        }
      }
      //else don't display it.
    }
    // (window as any).ccsdkDebug?console.log(surveyObject.innerHTML):'';
    // this.postPartialAnswer(this.questionsToDisplay[0], "test");

  }

  getSurveyQuestions(): any {
    return this.questionsToDisplay;
  }

  getAnswerForQuestionId( questionId: string ) {
    let answer = this.surveyAnswers[ questionId ];
    if ( typeof answer === 'undefined' ) {
      for ( let response of this.prefillResponses ) {
        if ( response.questionId == questionId ) {
          return response;
        }
      }
    }
    return this.surveyAnswers[ questionId ];
  }

  acceptAnswers() {
    let self: SurveyHandler = this;
    // (window as any).ccsdkDebug?console.log('add question answered listener':'')
    document.addEventListener( 'q-answered', this.acceptAnswersCb );
  }

  fillPrefillQuestionObject( id: any, response: any ) {
    let question: any = this.getQuestionById( id );
    let responseStored = this.getPrefillResponseById( id );
    if ( responseStored != null ) {
      this.updatePrefillResponseById( id, response );
    } else {
      this.prefillResponses.push( response )
    }
  }

  fillPrefill( tag: any, value: object ) {
    this.prefillWithTags[ tag.toLowerCase() ] = value;
    ( window as any ).ccsdkDebug ? console.log( 'prefillByTag', this.prefillWithTags ) : '';
  }

  fillPrefillByNote( note: any, value: object ) {
    this.prefillWithNote[ note.toLowerCase() ] = value;
    ( window as any ).ccsdkDebug ? console.log( 'prefillByNote', this.prefillWithNote ) : '';

  }

  fillPrefillDirect( questionId: string, value: object ) {
    this.prefillDirect[ questionId ] = value;
    ( window as any ).ccsdkDebug ? console.log( 'prefillDirect', this.prefillDirect ) : '';

  }

  fillPrefillQuestion( id: any, value: any, valueType: string ) {
    let question: any = this.getQuestionById( id );
    // console.log(this.questions);
    let response: any;
    let responseStored = this.getPrefillResponseById( id );
    if ( responseStored != null ) {
      response = responseStored;
    } else {
      response = {
        questionId: question.id,
        questionText: question.text,
        textInput: null,
        numberInput: null
      };
    }
    valueType = this.getAnswerTypeFromDisplayType( question.displayType );

    if ( valueType.toLowerCase() == "number" ) {
      response.numberInput = value;
    }
    if ( valueType.toLowerCase() == "text" ) {
      response.textInput = value;
    }
    if ( responseStored != null ) {
      this.updatePrefillResponseById( id, response );
    } else {
      this.prefillResponses.push( response )
    }

  }

  postPrefillPartialAnswer( fullSubmission = false, successcb, errorcb ) {
    if ( !fullSubmission && this._prefillsPartiallyPosted ) {
      return;
    }
    this._prefillsPartiallyPosted = true;
    if ( !this.surveyData.partialResponseId ) {
      return;
    }
    let surveyPartialUrl = Config.SURVEY_PARTIAL_RESPONSE.replace( "{id}", this.surveyData.partialResponseId );
    surveyPartialUrl = surveyPartialUrl.replace( "{complete}", "false" );
    surveyPartialUrl = surveyPartialUrl.replace( "{tabletId}", "" + this.randomNumber );
    surveyPartialUrl = Config.API_URL + surveyPartialUrl;
    ( window as any ).ccsdkDebug ? console.log( "Posting Prefill Responses to Server" ) : '';
    ( window as any ).ccsdkDebug ? console.log( this.prefillResponses ) : '';

    if ( !this.surveyData.partialResponseId ) {
      // run successCB if there is one.
      if ( successcb ) {
        successcb();
      }
      return;
    }
    if ( typeof this.prefillResponses !== 'undefined' && this.prefillResponses.length > 0 ) {
      RequestHelper.postWithHeaders( surveyPartialUrl, this.prefillResponses, {}, successcb, errorcb );
    } else {
      // console.log('No Prefill data');
      return;
    }
  }

  updatePrefillResponseById( id: any, resp: any ) {
    for ( let response of this.prefillResponses ) {
      if ( response.questionId == id ) {
        response = resp;
      }
    }
  }

  getPrefillResponseById( id: any ) {
    for ( let response of this.prefillResponses ) {
      if ( response.questionId == id ) {
        return response;
      }
    }
    return null;
  }

  getQuestionById( id: any ) {
    for ( let question of this.questions ) {
      if ( question.id == id ) {
        return question;
      }
    }
  }

  postPartialAnswer( index: any, response: any, complete = false, successcb, errorcb ) {
    this.postPrefillPartialAnswer( complete, null, null );
    // let data = new FormData();
    //in case of file.
    // let input = document.querySelector('input[type="file"]') ;
    // data.append('file', input.files[0]);

    let question: any = this.questionsToDisplay[ index ];
    if ( typeof question === 'undefined' ) {
      //now?
      // return (window as any).ccsdkDebug?console.log("No Partial Remaining"):'';
    }
    let data: any = {
      questionId: question.id,
      questionText: question.text,
      textInput: response.text,
      numberInput: response.number
    };
    // if(this.isPartialAvailable == false) {
    //   this.answers.push(data);
    //   return;
    // }
    // (window as any).ccsdkDebug?console.log("Submitting for : " + index):'';
    let surveyPartialUrl = Config.SURVEY_PARTIAL_RESPONSE.replace( "{id}", this.surveyData.partialResponseId );
    //if this is the last of displayed question
    ( window as any ).ccsdkDebug ? console.log( "partial response", question.id == this.questionsToDisplay[ this.questionsToDisplay.length - 1 ].id ) : '';
    // if (question.id == this.questionsToDisplay[this.questionsToDisplay.length - 1].id) {
    //   surveyPartialUrl = surveyPartialUrl.replace("{complete}", `${complete}`);
    // } else {
    surveyPartialUrl = surveyPartialUrl.replace( "{complete}", `${ complete }` );
    // }
    // surveyPartialUrl = surveyPartialUrl.replace("{tabletId}", "" + this.randomNumber);
    surveyPartialUrl = Config.API_URL + surveyPartialUrl;
    //add partial answer to main answer
    this.surveyAnswers[ question.id ] = data;

    data = [ data ];

    let onSurveyAnswerEvent = new CustomEvent( Constants.SURVEY_ANSWER_EVENT + "-" + this.surveyToken );
    document.dispatchEvent( onSurveyAnswerEvent );

    if ( !this.surveyData.partialResponseId ) {
      // run success callback and return
      if ( successcb ) {
        successcb();
      }
      return;
    }

    if ( question.id == this.questionsToDisplay[ this.questionsToDisplay.length - 1 ].id ) {
      //last question post moved to separate function
      RequestHelper.postWithHeaders( surveyPartialUrl, data, {}, successcb, errorcb );
    } else {
      RequestHelper.postWithHeaders( surveyPartialUrl, data, {}, successcb, errorcb );
    }

  }

  finalPost( successcb, errorcb ) {
    //last question
    let postSurveyFinalUrl = Config.POST_SURVEY_FINAL.replace( "{tokenId}", this.ccsdk.surveyToken );
    postSurveyFinalUrl = Config.API_URL + postSurveyFinalUrl;
    let answersAll = [];
    // hack for partial flushing
    let lastAnswer;

    if ( Object.keys( this.surveyAnswers ).length == 0 ) {
      return;
    }
    for ( let answer in this.surveyAnswers ) {
      let response = this.surveyAnswers[ answer ];
      if ( response && ( response.textInput !== null || response.numberInput !== null ) ) {
        answersAll.push( response );
        lastAnswer = response;
      }
    }
    for ( let answer in this.prefillResponses ) {
      answersAll.push( this.prefillResponses[ answer ] );
    }
    let timeAtPost = new Date().getTime();
    let finalData = {
      id: this.ccsdk.surveyToken,
      user: this.ccsdk.config.username,
      locationId: null,
      responses: answersAll,
      nps: 0,
      surveyClient: Constants.SURVEY_CLIENT,
      responseDuration: Math.floor( ( timeAtPost - this.ccsdk.surveyStartTime.getTime() ) / 1000 )
    };
    if ( lastAnswer ) {
      let _lastAnswer = {
        text: lastAnswer.textInput,
        number: lastAnswer.numberInput
      }
      this.postPartialAnswer( this.questionsToDisplay.length - 1, _lastAnswer, true, null, null )
    }

    if ( finalData.responses && finalData.responses.length > 0 ) {
      RequestHelper.postWithHeaders( postSurveyFinalUrl, finalData, {}, successcb, errorcb );
    } else {
      successcb();
    }

  }

  /**
   *
   * check if conditions are satsified which are required to display question?
   *
   * @param {any} question
   * @memberof Survey
   */
  checkConditionals( question: any ) {
    return true;
  }

  compileTemplate( question: any ) {
    let self: SurveyHandler = this;
    //get question type
    let questionTemplate;
    // (window as any).ccsdkDebug?console.log(question):'';
    if ( question != 'undefined' ) {
      switch ( question.displayType ) {
        case "Slider":
          let displayLegend = question.displayLegend;
          let opt: any = question.multiSelect[ 0 ].split( "-" );
          let optMin: any = opt[ 0 ].split( ";" );
          let optMax: any = opt[ 1 ].split( ";" );
          //get text question template and compile it.
          questionTemplate = templates.question_slider;
          questionTemplate = questionTemplate.replace( "{{question}}", ConditionalTextFilter.filterText( this, question ) );
          questionTemplate = questionTemplate.replace( /{{min}}/g, optMin[ 0 ] );
          if ( displayLegend[ 0 ] ) {
            questionTemplate = questionTemplate.replace( /{{minLabel}}/g, displayLegend[ 0 ] + '-' );
          } else {
            questionTemplate = questionTemplate.replace( /{{minLabel}}/g, "" );
          }
          questionTemplate = questionTemplate.replace( /{{max}}/g, optMax[ 0 ] );
          if ( displayLegend[ 1 ] ) {
            questionTemplate = questionTemplate.replace( /{{maxLabel}}/g, displayLegend[ 1 ] + "-" );
          } else {
            questionTemplate = questionTemplate.replace( /{{maxLabel}}/g, "" );
          }
          questionTemplate = questionTemplate.replace( /{{questionId}}/g, "id" + question.id );
          questionTemplate = questionTemplate.replace( "{{isRequired}}", question.isRequired ? "true" : "false" );
          questionTemplate = questionTemplate.replace( "{{requiredLabel}}", question.isRequired ? "*" : "" );
          break;
        case "Scale":
          //get text question template and compile it.
          ( window as any ).ccsdkDebug ? console.log( question.questionTags ) : '';
          if ( question.questionTags.includes( "NPS" ) ) {
            questionTemplate = templates.question_nps;
            questionTemplate = questionTemplate.replace( "{{question}}", ConditionalTextFilter.filterText( this, question ) );
            questionTemplate = questionTemplate.replace( /{{questionId}}/g, "id" + question.id );
            questionTemplate = questionTemplate.replace( "{{isRequired}}", question.isRequired ? "true" : "false" );
            questionTemplate = questionTemplate.replace( "{{requiredLabel}}", question.isRequired ? "*" : "" );
          } else if ( question.questionTags.includes( "CSAT" ) ) {
            if ( question.questionTags.includes( "csat_satisfaction_5" ) ) {
              questionTemplate = templates.question_csat_satisfaction_5;
            } else if ( question.questionTags.includes( "csat_agreement_5" ) ) {
              questionTemplate = templates.question_csat_agreement_5;
            }
            questionTemplate = questionTemplate.replace( "{{question}}", ConditionalTextFilter.filterText( this, question ) );
            questionTemplate = questionTemplate.replace( /{{questionId}}/g, "id" + question.id );
            questionTemplate = questionTemplate.replace( "{{isRequired}}", question.isRequired ? "true" : "false" );
            questionTemplate = questionTemplate.replace( "{{requiredLabel}}", question.isRequired ? "*" : "" );
          } else {
            let tileColor = '';
            let style = '';
            if ( question.attributes != null && question.attributes.scaleColor && question.attributes.scaleColor.length > 0 ) {
              if ( question.attributes.scaleColor !== 'Gradient' ) {
                tileColor = question.attributes.scaleColor;
              } else {
                tileColor = "#02BAEE"
              }
            } else if ( question.presentationMode != null && question.presentationMode.indexOf( "Color" ) !== -1 ) {
              tileColor = question.presentationMode.split( ':' )[ 1 ];
            }
            if ( tileColor.length > 0 ) {
              let tileColorDark = this.util.shadeBlendConvert( -0.3, tileColor, undefined );
              style = '\
                <style>\
                #id'+ question.id + ' .option-number-item.option-scale{\
                  background-color : '+ tileColor + ';\
                }\
                #id'+ question.id + ' .option-number-item.option-scale:hover,\
                #id'+ question.id + ' .option-number-item.option-scale.selected{\
                  background-color : '+ tileColorDark + ';\
                }\
                </style>\
              ';
            }

            questionTemplate = templates.question_scale;
            questionTemplate = questionTemplate.replace( /{{style}}/g, style );
            questionTemplate = questionTemplate.replace( "{{question}}", ConditionalTextFilter.filterText( this, question ) );
            questionTemplate = questionTemplate.replace( /{{questionId}}/g, "id" + question.id );
            questionTemplate = questionTemplate.replace( "{{isRequired}}", question.isRequired ? "true" : "false" );
            questionTemplate = questionTemplate.replace( "{{requiredLabel}}", question.isRequired ? "*" : "" );
            //construct NPS scale here....
            let startRange = 0.0;
            let endRange = 10.0;
            let options = "";
            let startRangeLabel = "";
            // let startRangeLabel = "";
            // let endRangeLabel = "Very likely";
            let endRangeLabel = "";
           
            if(question.questionTags.includes("ces_agree_5") || question.questionTags.includes("ces_agree_7")) {
              startRangeLabel = "Strongly Disagree";
              endRangeLabel = "Strongly Agree";
            }
            else if(question.questionTags.includes("ces_effort_5") || question.questionTags.includes("ces_effort_7")) {
              startRangeLabel = "Low Effort";
              endRangeLabel = "High Effort";
            }
            else if( question.anchorMetricName != null ) {
              let metricName = question.anchorMetricName;
              let customMetric = this.surveyData.customMetrics[metricName];
              startRangeLabel = customMetric.optionCategories[0].label;
              endRangeLabel = customMetric.optionCategories[2].label; 
            }
            
            let displayLegend = LanguageTextFilter.translateDisplayLegend( this, question );
            if ( displayLegend ) {
              if ( displayLegend.length > 0 ) {
                startRangeLabel = displayLegend[ 0 ] ? displayLegend[ 0 ] : null;
                endRangeLabel = displayLegend[ 1 ] ? displayLegend[ 1 ] : null;
              }
            }
            if ( question.multiSelect.length > 0 ) {
              startRange = parseFloat( question.multiSelect[ 0 ].split( "-" )[ 0 ] );
              if ( startRangeLabel == null ) {
                startRangeLabel = question.multiSelect[ 0 ].split( "-" )[ 0 ].split( ";" )[ 1 ];
              }
              endRange = parseFloat( question.multiSelect[ 0 ].split( "-" )[ 1 ] );
              if ( endRangeLabel == null ) {
                endRangeLabel = question.multiSelect[ 0 ].split( "-" )[ 1 ].split( ";" )[ 1 ];
              }
            }
            startRangeLabel = startRangeLabel == null ? "" : startRangeLabel;
            endRangeLabel = endRangeLabel == null ? "" : endRangeLabel;
            let mobileImageUrl = '';
            let imageVisibility010 = 'hide';
            let imageVisibility110 = 'hide';
            let scaleVisibility = 'show-inline';
            let scaleImageContainer = '';
            if ( startRange == 0 && endRange == 10 ) {
              mobileImageUrl = "https://cx.getcloudcherry.com/microsurvey-assets/scale-0-10-neutral.svg";
              imageVisibility010 = 'show';
              imageVisibility110 = 'hide';
              scaleVisibility = 'hide';
              scaleImageContainer = 'scale-image-container';
            } else if ( startRange == 1 && endRange == 10 ) {
              mobileImageUrl = "https://cx.getcloudcherry.com/microsurvey-assets/scale-1-10-neutral.svg";
              imageVisibility010 = 'hide';
              imageVisibility110 = 'show';
              scaleVisibility = 'hide';
              scaleImageContainer = 'scale-image-container';
            }
            // console.log('scale', startRange, endRange);
            let divider: any = 1;
            if ( endRange < 11 ) {
            } else {
              divider = ( endRange - startRange ) / 10.0;
            }
            let initial = 0.0;
            let optionStyle = '';
            let legendDimension;
            if ( ( window as any ).isMobile ) {
              if ( endRange < 11 ) {
                let parentContainer = window.innerWidth - 40;
                let dimension = ( ( 100 / ( endRange - startRange + 1 ) ) - .5 ) * parentContainer / 100;
                dimension = dimension > 48 ? 48 : dimension;
                legendDimension = ( endRange - startRange + 1 ) * ( dimension + 1 );
                optionStyle = `width:${ dimension }px;height:${ dimension }px;padding:${ ( dimension - 15 ) / 2 }px;`;
              }
            } else {
              imageVisibility010 = 'hide';
              imageVisibility110 = 'hide';
              scaleVisibility = 'show-inline';
              scaleImageContainer = '';
              mobileImageUrl = "";
            }
            
            if( question.questionTags.includes("CES") ) {
              for ( let initial = startRange; initial <= endRange; initial += divider ) {
                options += '<span data-rating="' + initial + '" class="option-number-item option-'+ endRange +'-scale-' + initial + ' ' + scaleVisibility + '" style="' + optionStyle + '">' + initial + '</span>';
              }
            }
            else if(question.anchorMetricName != null) {  
              let metricName = question.anchorMetricName;
              let customMetric = this.surveyData.customMetrics[metricName];
              for(var iterator in customMetric.optionCategories) {  
                let startRange = parseFloat(customMetric.optionCategories[iterator].categoryRange.split(",")[0]);
                let endRange = parseFloat(customMetric.optionCategories[iterator].categoryRange.split(",")[1]);
                
                for (let initial = startRange; initial <= endRange; initial += divider) {             
                  options += '<span data-rating="' + initial + '" class="option-number-item option-scale"' + scaleVisibility + '" style="background:' + customMetric.optionCategories[iterator].color + '">' + initial + '</span>';
                }
              }
            }
            else {
              for ( let initial = startRange; initial <= endRange; initial += divider ) {
                options += '<span data-rating="' + initial + '" class="option-number-item option-scale ' + scaleVisibility + '" style="' + optionStyle + '">' + initial + '</span>';
              }
            }
            
            if ( ( endRange - startRange + 1 ) <= 11 ) {
              var optionLeftExtraClass = 'option-left-rating-text-small-container';
              var optionRightExtraClass = 'option-right-rating-text-small-container';
              var optionMaxWidth = ( ( ( endRange - startRange + 1 ) * 38 / 2 ) - 5 ) + 'px';
              // console.log(optionMaxWidth);
            }
            questionTemplate = questionTemplate.replace( "{{legendStyle}}", `style="position:relative;width:${ mobileImageUrl ? '100%' : legendDimension + 'px' };min-height: 20px;"` )
            questionTemplate = questionTemplate.replace( /\{\{radialLegend\}\}/g, mobileImageUrl ? 'radial-legend' : 'unknown-class' );
            questionTemplate = questionTemplate.replace( "{{optionsRange}}", options );
            // questionTemplate = questionTemplate.replace("{{maxWidth}}", optionMaxWidth);
            questionTemplate = questionTemplate.replace( /maxWidth/g, mobileImageUrl ? '35%;width:35%' : optionMaxWidth );
            questionTemplate = questionTemplate.replace( /{{optionLeftExtraClass}}/g, optionLeftExtraClass );
            questionTemplate = questionTemplate.replace( /{{optionRightExtraClass}}/g, optionRightExtraClass );
            questionTemplate = questionTemplate.replace( "{{leftLabel}}", startRangeLabel );
            questionTemplate = questionTemplate.replace( "{{rightLabel}}", endRangeLabel );
            questionTemplate = questionTemplate.replace( /{{mobileImageUrl}}/g, '"' + mobileImageUrl + '"' );
            questionTemplate = questionTemplate.replace( "{{imageVisibility010}}", imageVisibility010 );
            questionTemplate = questionTemplate.replace( "{{imageVisibility110}}", imageVisibility110 );
            questionTemplate = questionTemplate.replace( "{{scaleImageContainer}}", scaleImageContainer );
          }

          break;
        case "Text":
          //get text question template and compile it.
          questionTemplate = templates.question_text;
          questionTemplate = questionTemplate.replace( "{{question}}", ConditionalTextFilter.filterText( this, question ) );
          questionTemplate = questionTemplate.replace( /{{questionId}}/g, "id" + question.id );
          questionTemplate = questionTemplate.replace( "{{isRequired}}", question.isRequired ? "true" : "false" );
          questionTemplate = questionTemplate.replace( "{{requiredLabel}}", question.isRequired ? "*" : "" );
          questionTemplate = questionTemplate.replace( "{{validationHint}}", question.validationHint ? question.validationHint : "" );

          break;
        case "Number":
          //get text question template and compile it.
          questionTemplate = templates.question_number;
          questionTemplate = questionTemplate.replace( "{{question}}", ConditionalTextFilter.filterText( this, question ) );
          questionTemplate = questionTemplate.replace( /{{questionId}}/g, "id" + question.id );
          questionTemplate = questionTemplate.replace( "{{isRequired}}", question.isRequired ? "true" : "false" );
          questionTemplate = questionTemplate.replace( "{{requiredLabel}}", question.isRequired ? "*" : "" );
          questionTemplate = questionTemplate.replace( "{{validationHint}}", question.validationHint ? question.validationHint : "" );

          break;
        case "MultilineText":
          //get text question template and compile it.
          questionTemplate = templates.question_multi_line_text;
          questionTemplate = questionTemplate.replace( "{{question}}", ConditionalTextFilter.filterText( this, question ) );
          questionTemplate = questionTemplate.replace( /{{questionId}}/g, "id" + question.id );
          questionTemplate = questionTemplate.replace( "{{isRequired}}", question.isRequired ? "true" : "false" );
          questionTemplate = questionTemplate.replace( "{{requiredLabel}}", question.isRequired ? "*" : "" );
          questionTemplate = questionTemplate.replace( "{{characterLimit}}", question.attributes && question.attributes.characterLimit ? question.attributes.characterLimit : "" );
          questionTemplate = questionTemplate.replace( "{{validationHint}}", question.validationHint ? question.validationHint : "" );

          break;
        case "MultiSelect":
          let acTemplate: string;
          let multiSelect1;
          //get text question template and compile it.
          multiSelect1 = Array.prototype.slice.call( LanguageTextFilter.translateMultiSelect( this, question ) );
          if ( question.presentationMode == 'Invert' ) {
            // console.log('selection option before reverse', multiSelect1);
            multiSelect1.reverse();
            // console.log('selection option after reverse', multiSelect1);
            // console.log('selection api option', question.multiSelect);
          }
          //get text question template and compile it.
          if ( ( ( question.displayStyle == 'radiobutton/checkbox' ) || ( question.displayStyle == 'icon' ) ) && ( multiSelect1.length < 6 ) ) {
            // (window as any).ccsdkDebug?console.log(question.displayStyle):'';
            let checkOptionContainsImage: boolean = self.util.checkOptionContainsImage( multiSelect1 );
            // (window as any).ccsdkDebug?console.log('select radio image',checkOptionContainsImage):'';
            if ( checkOptionContainsImage
              && (
                ( ( multiSelect1.length > 0 ) && multiSelect1[ 0 ].indexOf( "Male" ) !== -1 )
                || ( ( multiSelect1.length > 0 ) && multiSelect1[ 0 ].indexOf( "Yes" ) !== -1 )
                || ( ( multiSelect1.length > 1 ) && multiSelect1[ 1 ].indexOf( "Yes" ) !== -1 ) )

            ) {
              // (window as any).ccsdkDebug?console.log('select type 2'):'';
              acTemplate = templates.question_checkbox;
              let options2 = self.util.generateCheckboxImageOptions( question.multiSelect, multiSelect1, question.id );
              // (window as any).ccsdkDebug?console.log(options2):'';
              questionTemplate = acTemplate;
              questionTemplate = questionTemplate.replace( /{{options}}/g, options2 );
              acTemplate = questionTemplate;
            } else if ( checkOptionContainsImage ) {
              // (window as any).ccsdkDebug?console.log('select type 2'):'';
              acTemplate = templates.question_checkbox;
              let options2 = self.util.generateCheckboxIgnoreImageOptions( question.multiSelect, multiSelect1, question.id );
              // (window as any).ccsdkDebug?console.log(options2):'';
              questionTemplate = acTemplate;
              questionTemplate = questionTemplate.replace( /{{options}}/g, options2 );
              acTemplate = questionTemplate;
            } else {
              let options3: string = self.util.generateCheckboxOptions( question.multiSelect, multiSelect1, question.id );
              // (window as any).ccsdkDebug?console.log(options2):'';
              acTemplate = templates.question_checkbox;
              questionTemplate = acTemplate.replace( /{{options}}/g, options3 );
              acTemplate = questionTemplate;
            }
          } else {
            // (window as any).ccsdkDebug?console.log('select type 3'):'';
            acTemplate = templates.question_multi_select;

            // acTemplate = templates.question_select;
            let options3 = self.util.generateSelectOptions( question.multiSelect, multiSelect1 );

            if ( self.ccsdk.config.language.indexOf( 'Default' ) === -1 ) {
              if (
                typeof question.translated !== 'undefined'
                && question.translated != null
                && typeof question.translated[ self.ccsdk.config.language ] !== 'undefined'
                && question.translated[ self.ccsdk.config.language ].multiSelect !== 'undefined'
                && question.translated[ self.ccsdk.config.language ].multiSelect.length > 0
              ) {
                multiSelect1 = Array.prototype.slice.call( question.translated[ self.ccsdk.config.language ].multiSelect );
                if ( question.presentationMode == 'Invert' ) {
                  multiSelect1.reverse();
                }
                options3 = self.util.generateSelectOptions( question.multiSelect, multiSelect1 );
              }
            }
            // questionTemplate = acTemplate;
            self.ccsdk.debug ? console.log( options3 ) : '';
            questionTemplate = acTemplate.replace( /{{options}}/g, options3 );
            acTemplate = questionTemplate;

          }
          questionTemplate = acTemplate;
          questionTemplate = questionTemplate.replace( "{{question}}", ConditionalTextFilter.filterText( this, question ) );
          questionTemplate = questionTemplate.replace( /{{questionId}}/g, "id" + question.id );
          questionTemplate = questionTemplate.replace( "{{isRequired}}", question.isRequired ? "true" : "false" );
          questionTemplate = questionTemplate.replace( "{{requiredLabel}}", question.isRequired ? "*" : "" );

          break;
        case "Select":
          let acTemplate1: string;
          let acTemplate2: string;
          let options1: string;
          let options2: string;
          let multiSelect;
          //get text question template and compile it.
          multiSelect = Array.prototype.slice.call( LanguageTextFilter.translateMultiSelect( this, question ) );
          let invertedMultiSelect;
          if ( question.presentationMode == 'Invert' ) {
            // console.log('selection option before reverse', multiSelect);
            invertedMultiSelect = question.multiSelect ? question.multiSelect.slice().reverse() : [];
            multiSelect.reverse();
            // console.log('selection option after reverse', multiSelect);
            // console.log('selection api option', question.multiSelect);
          } else {
            invertedMultiSelect = question.multiSelect;
          }
          if ( ( question.displayStyle == 'radiobutton/checkbox' ) && ( multiSelect.length < 6 ) ) {
            // if(question.displayStyle == 'radiobutton/checkbox'){
            // (window as any).ccsdkDebug?console.log('select type 1'):'';
            // (window as any).ccsdkDebug?console.log(question.displayStyle):'';
            // acTemplate1 = templates.question_radio;
            // questionTemplate = acTemplate1;

            let checkOptionContainsImage: boolean = self.util.checkOptionContainsImage( multiSelect );
            ( window as any ).ccsdkDebug ? console.log( 'select radio image', checkOptionContainsImage ) : '';
            if ( checkOptionContainsImage
              && (
                ( ( multiSelect.length > 0 ) && multiSelect[ 0 ].indexOf( "Male" ) !== -1 )
                || ( ( multiSelect.length > 0 ) && multiSelect[ 0 ].indexOf( "Yes" ) !== -1 )
                || ( ( multiSelect.length > 1 ) && multiSelect[ 1 ].indexOf( "Yes" ) !== -1 ) )
            ) {
              // (window as any).ccsdkDebug?console.log('select type 2'):'';
              acTemplate2 = templates.question_radio_image;

              options2 = self.util.generateRadioImageOptions( invertedMultiSelect, multiSelect, question.id );
              ( window as any ).ccsdkDebug ? console.log( { options2 } ) : '';
              questionTemplate = acTemplate2;
              questionTemplate = questionTemplate.replace( /{{options}}/g, options2 );
            } else if ( checkOptionContainsImage ) {
              // (window as any).ccsdkDebug?console.log('select type 2'):'';
              acTemplate2 = templates.question_radio_image;
              options2 = self.util.generateRadioIgnoreImageOptions( invertedMultiSelect, multiSelect, question.id );
              // (window as any).ccsdkDebug?console.log(options2):'';
              questionTemplate = acTemplate2;
              questionTemplate = questionTemplate.replace( /{{options}}/g, options2 );
            } else {
              acTemplate1 = templates.question_radio;
              questionTemplate = acTemplate1;

              options1 = self.util.generateRadioOptions( invertedMultiSelect, multiSelect, question.id );
              questionTemplate = questionTemplate.replace( "{{options}}", options1 );
            }
          } else if ( ( question.displayStyle == 'icon' ) && ( multiSelect.length < 6 ) ) {
            acTemplate1 = templates.question_radio;
            questionTemplate = acTemplate1;
            let invertedMultiSelect;
            if ( question.presentationMode == 'Invert' ) {
              invertedMultiSelect = question.multiSelect ? question.multiSelect.slice().reverse() : [];
            } else {
              invertedMultiSelect = question.multiSelect;
            }
            options1 = self.util.generateRadioOptions( invertedMultiSelect, multiSelect, question.id );
            questionTemplate = questionTemplate.replace( "{{options}}", options1 );

          } else {

            ( window as any ).ccsdkDebug ? console.log( 'select type 3' ) : '';
            acTemplate1 = templates.question_select;
            options1 = self.util.generateSelectOptions( invertedMultiSelect, multiSelect );
            if ( self.ccsdk.config.language.indexOf( 'Default' ) === -1 ) {
              if ( typeof question.translated !== 'undefined'
                && question.translated != null
                && typeof question.translated[ self.ccsdk.config.language ] !== 'undefined'
                && question.translated[ self.ccsdk.config.language ].multiSelect !== 'undefined'
                && question.translated[ self.ccsdk.config.language ].multiSelect.length > 0
              ) {
                multiSelect = Array.prototype.slice.call( question.translated[ self.ccsdk.config.language ].multiSelect );
                if ( question.presentationMode == 'Invert' ) {
                  multiSelect.reverse();
                }
                options1 = self.util.generateSelectOptions( invertedMultiSelect, multiSelect );
              }
            }
            questionTemplate = acTemplate1;
            questionTemplate = questionTemplate.replace( "{{options}}", options1 );


          }
          // console.log( questionTemplate );
          questionTemplate = questionTemplate.replace( "{{question}}", ConditionalTextFilter.filterText( this, question ) );
          questionTemplate = questionTemplate.replace( /{{questionId}}/g, "id" + question.id );
          questionTemplate = questionTemplate.replace( "{{isRequired}}", question.isRequired ? "true" : "false" );
          questionTemplate = questionTemplate.replace( "{{requiredLabel}}", question.isRequired ? "*" : "" );
          // (window as any).ccsdkDebug?console.log(questionTemplate):'';

          break;
        case "Smile-5":
          //get text question template and compile it.
          if ( question.presentationMode == "Invert" ) {
            questionTemplate = templates.question_smile_5_inverted;

          } else {

            questionTemplate = templates.question_smile_5;
          }
          // let startRangeLabel = "Very unlikely";
          // let endRangeLabel = "Very likely";
          let startRangeLabel = "";
          let endRangeLabel = "";
          let displayLegend2 = LanguageTextFilter.translateDisplayLegend( this, question );

          if ( displayLegend2 ) {
            if ( displayLegend2.length > 0 ) {
              startRangeLabel = displayLegend2[ 0 ] ? displayLegend2[ 0 ] : null;
              endRangeLabel = displayLegend2[ 1 ] ? displayLegend2[ 1 ] : null;
            }
          }
          startRangeLabel = startRangeLabel == null ? "" : startRangeLabel;
          endRangeLabel = endRangeLabel == null ? "" : endRangeLabel;
          questionTemplate = questionTemplate.replace( "{{question}}", ConditionalTextFilter.filterText( this, question ) );
          questionTemplate = questionTemplate.replace( /{{questionId}}/g, "id" + question.id );
          questionTemplate = questionTemplate.replace( "{{isRequired}}", question.isRequired ? "true" : "false" );
          questionTemplate = questionTemplate.replace( "{{requiredLabel}}", question.isRequired ? "*" : "" );
          questionTemplate = questionTemplate.replace( "{{leftLabel}}", startRangeLabel );
          questionTemplate = questionTemplate.replace( "{{rightLabel}}", endRangeLabel );
          break;
        case "Star-5":
          //get text question template and compile it.
          let startRangeLabel1 = "";
          let endRangeLabel1 = "";
          let displayLegend3 = LanguageTextFilter.translateDisplayLegend( this, question );

          if ( displayLegend3 ) {
            if ( displayLegend3.length > 0 ) {
              startRangeLabel1 = displayLegend3[ 0 ] ? displayLegend3[ 0 ] : null;
              endRangeLabel1 = displayLegend3[ 1 ] ? displayLegend3[ 1 ] : null;
            }
          }
          startRangeLabel1 = startRangeLabel1 == null ? "" : startRangeLabel1;
          endRangeLabel1 = endRangeLabel1 == null ? "" : endRangeLabel1;
          questionTemplate = templates.question_star_5;
          questionTemplate = questionTemplate.replace( "{{question}}", ConditionalTextFilter.filterText( this, question ) );
          questionTemplate = questionTemplate.replace( /{{questionId}}/g, "id" + question.id );
          questionTemplate = questionTemplate.replace( "{{isRequired}}", question.isRequired ? "true" : "false" );
          questionTemplate = questionTemplate.replace( "{{requiredLabel}}", question.isRequired ? "*" : "" );
          questionTemplate = questionTemplate.replace( "{{leftLabel}}", startRangeLabel1 );
          questionTemplate = questionTemplate.replace( "{{rightLabel}}", endRangeLabel1 );
          break;
      }
    }
    return questionTemplate;
  }

  questionCompare( a: any, b: any ) {
    return a.sequence - b.sequence;
  }

  getAnswerTypeFromDisplayType( displayType: string ) {
    // console.log('question type',displayType);
    let type: string;
    switch ( displayType ) {
      case "Slider":
        type = "number";
        break;
      case "Scale":
        type = "number";
        break;
      case "Text":
        type = "text";
        break;
      case "Number":
        type = "number";
        break;
      case "MultilineText":
        type = "text";
        break;
      case "MultiSelect":
        type = "text";
        break;
      case "Select":
        type = "text";
        break;
      case "Dropdown":
        type = "text";
        break;
      case "Smile-5":
        type = "number";
        break;
      case "Star-5":
        type = "number";
        break;
      case "Date":
        type = "number";
        break;
      default:
        type = "text";
        break;
    }

    return type;
  }

  /**
   *
   * filterQuestions - filters questions so that we don't display the one which satisifes any of the following condition
   *  isRetired = true
   *  statffFill = true
   *  apiFill = true
   *  preFill = true
   *
   * @param {any} question
   * @returns
   * @memberof Survey
   */
  filterQuestions() {
    let self = this;
    for ( let question of this.questions ) {
      if ( !question.isRetired ) {
        //filter out prefill question only if it is filled?.
        // if(!this.isQuestionFilled(question)){
        if ( this.isPrefillTags( question ) ) {
          self.ccsdk.debug ? console.log( 'prefillTags', this.prefillResponses ) : '';
          continue;
        }
        if ( this.isPrefillNote( question ) ) {
          self.ccsdk.debug ? console.log( this.prefillResponses ) : '';
          continue;
        }
        if ( this.isPrefillDirect( question ) ) {
          self.ccsdk.debug ? console.log( this.prefillResponses ) : '';
          continue;
        }
        if ( !( this.isPrefillQuestion( question ) ) ) {
          if (
            question.conditionalFilter === null ||
            ( question.conditionalFilter != null &&
              ( question.conditionalFilter.filterquestions == null
                || question.conditionalFilter.filterquestions.length == 0 ) )
          ) {
            //check supported display types
            let supportedDisplayTypes = "Slider, Scale, Text, Number, MultilineText, MultiSelect, Smile-5, Star-5";
            if ( supportedDisplayTypes.indexOf( question.displayType ) > -1 ) {
              this.questionsToDisplay.push( question );
            }
          } else {
            //if conditions full filled, fill it in questionsToDisplay
            if ( ConditionalFlowFilter.filterQuestion( this, question ) ) {
              //auto does that
            } else {
              this.conditionalQuestions.push( question );
            }
          }
        } else {
          this.fillPrefillWithTags( question );
          this.fillPrefillWithNote( question );
          ConditionalFlowFilter.filterQuestion( this, question );
        }
        // }
      }
    }
    //re condition questions.
    for ( let question of this.questions ) {
      // console.log(this.questionsToDisplay);
      ConditionalFlowFilter.filterQuestion( this, question );
    }

    // console.log(this.conditionalQuestions);
  }

  isPrefillTags( question: any ) {
    if ( typeof question.questionTags !== 'undefined' && question.questionTags && question.questionTags.length > 0 ) {
      for ( let tag of question.questionTags ) {
        switch ( tag.toLowerCase() ) {
          case "screensize":
            //add size to prefill array
            this.fillPrefillQuestion( question.id, "Width:" + window.innerWidth + "px / Height:" + window.innerHeight + "px", "text" );
            return true;
          default:
            if ( typeof this.prefillWithTags[ tag.toLowerCase() ] != 'undefined' ) {
              let type = this.getAnswerTypeFromDisplayType( question.displayType );
              this.fillPrefillQuestion( question.id, this.prefillWithTags[ tag.toLowerCase() ], type );
              return true;
            }
        }
      }
    }
    return false;
  }
  isPrefillNote( question: any ) {
    if ( typeof question.note !== 'undefined'
      && question.note != null
      && question.note.length > 0
      && this.prefillWithNote[ question.note.toLowerCase() ]
    ) {
      let type = this.getAnswerTypeFromDisplayType( question.displayType );
      this.fillPrefillQuestion( question.id, this.prefillWithNote[ question.note.toLowerCase() ], type );
      return true;
    }
    return false;
  }

  isPrefillDirect( question: any ) {
    if ( typeof question !== 'undefined'
      && this.prefillDirect[ question.id ]
    ) {
      let type = this.getAnswerTypeFromDisplayType( question.displayType );
      this.fillPrefillQuestion( question.id, this.prefillDirect[ question.id ], type );
      return true;
    }
    return false;
  }

  fillPrefillWithTags( question: any ) {
    ( window as any ).ccsdkDebug ? console.log( 'fillprefillwithtags', this.prefillWithTags ) : '';
    if ( typeof question.questionTags !== 'undefined' && question.questionTags.length > 0 ) {
      for ( let tag of question.questionTags ) {
        ( window as any ).ccsdkDebug ? console.log( 'fillprefillwithtags', tag ) : '';
        if ( typeof this.prefillWithTags[ tag.toLowerCase() ] !== 'undefined' ) {
          ( window as any ).ccsdkDebug ? console.log( 'prefil ', tag.toLowerCase(), this.prefillWithTags[ tag.toLowerCase() ], this.prefillWithTags ) : '';

          let type = this.getAnswerTypeFromDisplayType( question.displayType );
          this.fillPrefillQuestion( question.id, this.prefillWithTags[ tag.toLowerCase() ], type );
        }
      }
    }
  }

  fillPrefillWithNote( question: any ) {
    if ( typeof question.note !== 'undefined' && question.note != null && question.note.length > 0 ) {
      if ( typeof this.prefillWithNote[ question.note.toLowerCase() ] !== 'undefined' ) {
        let type = this.getAnswerTypeFromDisplayType( question.displayType );
        this.fillPrefillQuestion( question.id, this.prefillWithNote[ question.note.toLowerCase() ], type );
      }
    }
  }



  getConditionalSurveyQuestions(): any {
    return this.conditionalQuestions;
  }

  isPrefillQuestion( question: any ) {
    if ( question.apiFill == true ) {
      return true;
    }
    if ( question.staffFill == true ) {
      return true;
    }
    return false;
  }

  isQuestionFilled( question: any ) {
    for ( let response of this.prefillResponses ) {
      if ( response.questionId == question.questionId ) {
        return true;
      }
    }
    return false;
  }

  removePrevListener( id: string ): boolean {
    for ( let listener of this.domListeners ) {
      if ( listener.id == id ) {
        let index = this.domListeners.indexOf( listener );
        ( window as any ).ccsdkDebug ? console.log( "removing listener", id ) : '';
        ( window as any ).ccsdkDebug ? console.log( "removing listener index", index ) : '';
        this.util.removeListener( document.querySelectorAll( "body" )[ 0 ], listener.type, listener.internalHandler );
        if ( index > -1 ) {
          this.domListeners.splice( index, 1 );
        }
        ( window as any ).ccsdkDebug ? console.log( this.domListeners ) : '';
      }
    }
    return true;
  }

  destroySurvey() {
    let self: SurveyHandler = this;
    document.addEventListener( 'ccclose', this.destroySurveyCb );
  }

  destroy() {
    let surveyContainer = this.ccsdk.dom.getSurveyContainer( this.surveyToken );
    let welcomeContainer = this.ccsdk.dom.getWelcomeContainer( this.surveyToken );
    if ( typeof surveyContainer != 'undefined' ) {
      this.util.remove( surveyContainer );
    }
    if ( typeof welcomeContainer != 'undefined' ) {
      this.util.remove( welcomeContainer );
    }
    document.removeEventListener( 'ccclose', this.destroySurveyCb );
    document.removeEventListener( 'ccdone', this.displayThankYouCb );
    document.removeEventListener( 'q-answered', this.acceptAnswersCb );
    ( window as any ).globalSurveyRunning = false;
    // let bodyElement = <HTMLElement>document.
    //   getElementsByTagName( "body" )[ 0 ];
    // this.util.removeClass( bodyElement, "blurr" );

  }
}

export { SurveyHandler };
