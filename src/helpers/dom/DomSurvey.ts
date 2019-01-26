import { DomUtilities } from './DomUtilities';
// import { ScrollBar } from './ScrollBar';
import { Select } from './Select';
import { Theme } from './Theme';
import { ConditionalFlowFilter } from "../filters/ConditionalFlowFilter";
import { Slider } from "./Slider";
import { Constants } from "../../Constants";
import { setInterval } from 'timers';

class DomSurvey {

  util: DomUtilities;
  // scrollbar : ScrollBar;
  domListeners: any;
  select: Select;
  theme: Theme;
  qIndex: number;
  currentQuestionId: string;
  $questionContainer: any;
  $innerQuestionContainer: any;
  $popupContainer: any;
  $popupContainer2: any;
  $body: any;
  qResponse: any;
  trackSelects: any = [];
  trackRadios: any = [];
  ccsdk: any;
  currentQuestionListeners: any = [];
  trackSetupListeners: any;
  $startBtn: any;
  bodyElement: any;


  constructor( ccsdk: any ) {
    let self: DomSurvey = this;
    this.domListeners = [];
    this.ccsdk = ccsdk;
    this.qIndex = 0;
    this.qResponse = {};
    this.domSelectElements();
    this.util = new DomUtilities()
    // self.scrollbar = new ScrollBar("data-cc-scrollbar");
    this.util.ready( function () {
      // self.util.addClassAll(self.$popupContainer,'show-slide');
    } );
  }

  setTheme( brandColor, time ) {
    let self: DomSurvey = this;
    this.util.ready( function () {
      self.theme = new Theme( brandColor, time );
    } );
  }

  setQIndex( index: number ) {
    this.qIndex = index;
  }

  getQindex() {
    return this.qIndex;
  }

  domSelectElements() {
    this.$questionContainer = document.
      querySelectorAll( ".cc-questions-container" );
    this.$popupContainer = document.querySelectorAll( ".cc-popup-container" );
    this.$popupContainer2 = document.querySelectorAll( ".cc-popup-container-2" );
    this.$body = document.querySelectorAll( "body" )[ 0 ];
    // this.select = new Select();

  }



  removePrevListener( id: string ): boolean {
    for ( let listener of this.domListeners ) {
      if ( listener.id == id ) {
        let index = this.domListeners.indexOf( listener );
        ( window as any ).ccsdkDebug ? console.log( "removing listener", id ) : '';
        ( window as any ).ccsdkDebug ? console.log( "removing listener index", index ) : '';
        this.util.removeListener( this.$body, listener.type, listener.internalHandler );
        if ( index > -1 ) {
          this.domListeners.splice( index, 1 );
        }
        ( window as any ).ccsdkDebug ? console.log( this.domListeners ) : '';
      }
    }
    return true;
  }

  setupListeners() {
    let self = this;
    let startSurvey = this.util.initListener( "click", ".act-cc-survey-start", function () {
      if ( ( !self.util.hasClass( self.$startBtn, 'disabled' ) ) && ( self.ccsdk.surveyStatus != 'minimized' ) ) {
        let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
        document.dispatchEvent( onSurveyClickEvent );
        self.util.addClass( self.$startBtn, 'disabled' );
        self.showLoader();
        self.startSurvey();
      } else {
        self.initSurveyDom();
      }
    } );
    this.domListeners.push( startSurvey );

    startSurvey.internalHandler = this.util.listener( this.$body, startSurvey.type, startSurvey.id, startSurvey.cb );

    let nextQue = this.util.initListener( "click", ".act-cc-button-next", function () {
      // alert("working");
      let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyClickEvent );
      self.nextQuestion();
    } );
    this.domListeners.push( nextQue );

    nextQue.internalHandler = this.util.listener( this.$body, nextQue.type, nextQue.id, nextQue.cb );

    let prevQue = this.util.initListener( "click", ".act-cc-button-prev", function () {
      let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyClickEvent );
      self.prevQuestion();
    } );
    this.domListeners.push( prevQue );

    prevQue.internalHandler = this.util.listener( this.$body, prevQue.type, prevQue.id, prevQue.cb );

    let closeSurvey = this.util.initListener( "click", ".act-cc-button-close", function () {
      let onSurveyCloseEvent = new CustomEvent( Constants.SURVEY_CLOSE_EVENT + "-" + self.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyCloseEvent );
      self.ccsdk.survey.answers = {};
      self.trackSelects = [];
      self.destroyListeners();
      self.util.trigger( document, 'ccclose', undefined );
      self.bodyElement = <HTMLElement>document.
        getElementsByTagName( "body" )[ 0 ];
      self.util.removeClass( self.bodyElement, "blurr" )
      self.ccsdk.survey.destroy();

    } );
    this.domListeners.push( closeSurvey );


    closeSurvey.internalHandler = this.util.listener( this.$body, closeSurvey.type, closeSurvey.id, closeSurvey.cb );

    let minSurvey = this.util.initListener( "click", ".act-cc-button-minimize", function () {
      self.minimizeSurvey();
    } );
    this.domListeners.push( minSurvey );


    minSurvey.internalHandler = this.util.listener( self.$body, minSurvey.type, minSurvey.id, minSurvey.cb );
  }


  minimizeSurvey() {
    // this.$popupContainer[0].removeClass('');
    this.util.removeClass( this.$popupContainer2[ 0 ], 'hide-right-left' );
    this.util.addClass( this.$popupContainer2[ 0 ], 'hide-right-left' );
    setTimeout( () => {
      this.util.removeClass( this.$popupContainer2[ 0 ], 'show-slide' );
    }, 200 );
    this.util.removeClass( this.$popupContainer[ 0 ], 'hide-right-left' );
    this.util.addClass( this.$popupContainer[ 0 ], 'hide-right-left' );
    setTimeout( () => {
      this.util.addClass( this.$popupContainer[ 0 ], 'show-slide' );
    }, 200 );
    this.ccsdk.surveyStatus = 'minimized';
    let resumeText = this.ccsdk.config.resumeButtonText ? this.ccsdk.config.resumeButtonText : 'Resume';
    this.$startBtn.innerHTML = resumeText;
    this.util.removeClass( this.$startBtn, 'disabled' );

    //update all start btns
    // Array.prototype.forEach.call($startBtn, (el, i) => {
    //   el.innerHTML = resumeText;
    // });

  }

  destroyListeners() {
    // (window as any).ccsdkDebug?console.log("Removing all listeners"):'';
    for ( let listener of this.domListeners ) {
      this.util.removeListener( this.$body, listener.type, listener.internalHandler );
    }
    for ( let listener of this.ccsdk.survey.domListeners ) {
      this.util.removeListener( this.$body, listener.type, listener.internalHandler );
    }
    if ( this.ccsdk.survey.languageSelect ) {
      this.ccsdk.survey.languageSelect.destroyListeners();
    }
    if ( this.select ) {
      this.select.destroyListeners();
    }

  }

  startSurvey() {
    this.ccsdk.survey.cancelKillWelcomeQuestion();
    this.ccsdk.getSurveyData();
  }

  initSurveyDom() {
    this.domSelectElements();
    // (window as any).ccsdkDebug?console.log("click in setup listener survey start"):'';
    this.util.addClassAll( this.$popupContainer2, 'show-slide' );
    this.util.removeClass( this.$popupContainer[ 0 ], 'show-slide' );
    if ( this.ccsdk.surveyStatus == 'minimized' ) {
      //resume survey
    } else {
      //start survey
      //check if only one language is configured
      ( window as any ).ccsdkDebug ? console.log( this.ccsdk.surveyData ) : '';
      if ( this.ccsdk.surveyData.translated === null || ( this.ccsdk.surveyData.translated && Object.keys( this.ccsdk.surveyData.translated ).length < 1 ) ) {
        this.loadFirstQuestion();
      } else {
        this.ccsdk.survey.displayLanguageSelector();
      }
    }
  }

  updateProgress() {
    let el = <HTMLElement>document.querySelectorAll( "#progress-line" )[ 0 ];
    el.style.width = ( this.qIndex / this.ccsdk.survey.questionsToDisplay.length ) * 100 + '%';
  }

  loadFirstQuestion() {
    // applyRuleToAllEl(this.$questionContainer, );
    // this.util.removeClassAll(this.$questionContainer, 'show-slide');
    // this.util.addClass(this.$questionContainer, 'show-slide');

    this.loadQuestionSpecifics( this.$questionContainer, 0 );
    this.util.removeClassAll( this.$questionContainer[ 0 ].firstChild, 'show-slide' );
    this.util.addClass( this.$questionContainer[ 0 ].firstChild, 'show-slide' );
    let leftIcon: any = this.util.get( '.act-cc-button-prev' );
    this.util.addClassAll( leftIcon, 'hide-slide' );
    let onSurveyQuestionEvent = new CustomEvent( Constants.SURVEY_QUESTION_EVENT + "-" + this.ccsdk.surveyToken );
    document.dispatchEvent( onSurveyQuestionEvent );
  }

  nextQuestion() {
    ( window as any ).ccsdkDebug ? console.log( 'next question q response init', this.qResponse ) : '';
    // console.log('next question q response init',this.qResponse);
    //empty the domListner
    // this.util.removeAllListeners(this.domListeners);
    let onSurveyQuestionEvent = new CustomEvent( Constants.SURVEY_QUESTION_EVENT + "-" + this.ccsdk.surveyToken );
    document.dispatchEvent( onSurveyQuestionEvent );
    //submit the current response
    // (window as any).ccsdkDebug?console.log('submit ',this.qResponse.type, this.qResponse):'';
    let isRequired: boolean = false;
    let q: HTMLElement = this.$questionContainer[ 0 ].firstChild;
    // (window as any).ccsdkDebug?console.log(this.$questionContainer):'';
    let span: Element = this.$questionContainer[ 0 ].firstChild.querySelectorAll( ".cc-question-container__required" )[ 0 ]
    let validationSpan: Element = this.$questionContainer[ 0 ].firstChild.querySelectorAll( ".cc-question-container__validation" )[ 0 ]
    if ( span )
      this.util.removeClass( span, "show" );
    if ( validationSpan )
      this.util.removeClass( validationSpan, "show" );


    //check if question is required 
    isRequired = q.getAttribute( 'data-required' ).toLowerCase() == 'true' ? true : false;
    // console.log('required check',Object.keys(this.qResponse).length, isRequired, this.qResponse);
    // if (isRequired && Object.keys(this.qResponse).length === 0) {
    if ( isRequired && ( Object.keys( this.qResponse ).length === 0 ) ) {
      if ( span ) {
        this.util.addClass( span, "show" );
        this.util.removeClass( span, "hide" );
      }
      return;
    } else if ( isRequired && ( !this.qResponse.text ) && ( !this.qResponse.number ) ) {
      if ( span ) {
        this.util.addClass( span, "show" );
        this.util.removeClass( span, "hide" );
      }
      return;
    } else {
      if ( span ) {
        this.util.removeClass( span, "show" );
        this.util.addClass( span, "hide" );
      }

      //check if validationRegex is set and is fulfilled
      let validationRegex = this.ccsdk.survey.questionsToDisplay[ this.qIndex ].validationRegex
      if ( validationRegex ) {
        ( window as any ).ccsdkDebug ? console.log( 'validationRegex', validationRegex ) : '';
        ( window as any ).ccsdkDebug ? console.log( 'response', this.qResponse ) : '';
        let pattern = validationRegex.match( new RegExp( '^/(.*?)/([gimy]*)$' ) );
        let regex = new RegExp( validationRegex );
        if ( this.qResponse.text ) {
          if ( regex.test( this.qResponse.text ) ) {
            this.util.removeClass( validationSpan, "show" );
            this.util.addClass( validationSpan, "hide" );
          } else {
            if ( validationSpan ) {
              this.util.addClass( validationSpan, "show" );
              this.util.removeClass( validationSpan, "hide" );
            }
            return;
          }
        }
        else if ( this.qResponse.number ) {
          ( window as any ).ccsdkDebug ? console.log( 'test regex text', regex.test( this.qResponse.number ) ) : '';

          if ( regex.test( this.qResponse.number ) ) {
            this.util.removeClass( validationSpan, "show" );
            this.util.addClass( validationSpan, "hide" );
          } else {
            if ( validationSpan ) {
              this.util.addClass( validationSpan, "show" );
              this.util.removeClass( validationSpan, "hide" );
            }
            return;
          }
        }
      }



      if ( this.qResponse !== 'undefined' ) {
        // (window as any).ccsdkDebug?console.log('qindex ' + this.qIndex):'';
        if ( typeof this.ccsdk.survey.answers[ this.currentQuestionId ] !== 'undefined'
          && this.qResponse.type == this.ccsdk.survey.answers[ this.currentQuestionId ].type
          && this.qResponse.text == this.ccsdk.survey.answers[ this.currentQuestionId ].text
          && this.qResponse.number == this.ccsdk.survey.answers[ this.currentQuestionId ].number
        ) {
          // console.log('no submit');
          //don't submit if already submitted.
        } else if ( typeof this.ccsdk.survey.answers[ this.currentQuestionId ] !== 'undefined'
          && !this.qResponse.text
          && !this.qResponse.number
        ) {
          // console.log('no submit 2');

          //previous entry filled
        } else {
          // (window as any).ccsdkDebug?console.log('submitting ' + this.currentQuestionId):'';
          // console.log(this.qResponse);

          let qId = this.qResponse.questionId ? this.qResponse.questionId : this.currentQuestionId;
          this.submitQuestion( this.qIndex, this.qResponse, this.qResponse.type, qId );
          //save response
          this.ccsdk.survey.answers[ this.currentQuestionId ] = JSON.parse( JSON.stringify( this.qResponse ) );
        }
      }
    }
    ConditionalFlowFilter.filterQuestion( this.ccsdk.survey, this.ccsdk.survey.questionsToDisplay[ this.qIndex ] );
    // console.log(this.ccsdk.survey.questionsToDisplay);
    //go to next question
    this.qIndex++;
    //reset the post parameters
    // this.qResponse = typeof this.ccsdk.survey.answers[this.currentQuestionId] !== 'undefined' ? JSON.parse(JSON.stringify(this.ccsdk.survey.answers[this.currentQuestionId])) : {};
    // this.qResponse = {};
    let nextButtonState: string = 'initial';
    // (window as any).ccsdkDebug?console.log(this.$questionContainer):'';
    let nextQ: HTMLElement = this.$questionContainer;
    // (window as any).ccsdkDebug?console.log(this.qIndex):'';
    if ( this.qIndex == this.ccsdk.survey.questionsToDisplay.length ) {
      //Last run to show thank you message
      let leftIcon: any = this.util.get( '.act-cc-button-prev' );
      let rightIcon: any = this.util.get( '.cc-icon-right' );
      let nextIcon: any = this.util.get( '.act-cc-button-next' );
      this.util.addClassAll( leftIcon, 'hide' );
      this.util.addClassAll( rightIcon, 'hide' );
      this.util.addClassAll( nextIcon, 'hide' );
      this.util.trigger( document, 'ccdone', undefined );
      this.util.removeClass( this.$questionContainer[ 0 ].firstChild, 'show-slide' );
      this.updateProgress();
    } else {
      if ( ( this.qIndex > this.ccsdk.survey.questionsToDisplay.length ) ) {
        //reset the counter to show first question
        this.qIndex = 0;
      }
      //repopulate qResponse based on answers.
      // ( window as any ).ccsdkDebug ? console.log( 'previous answer', this.ccsdk.survey.answers[ this.currentQuestionId ] ) : '';
      this.qResponse = typeof this.ccsdk.survey.answers[ this.currentQuestionId ] !== 'undefined' ? JSON.parse( JSON.stringify( this.ccsdk.survey.answers[ this.currentQuestionId ] ) ) : {};
      // this.util.removeClassAll(this.$questionContainer[0].firstChild, 'show-slide');
      // this.util.addClass(nextQ, 'show-slide');
      this.updateProgress();
      this.loadQuestionSpecifics( nextQ, this.qIndex );
      this.util.addClass( this.$questionContainer[ 0 ].firstChild, 'show-slide' );
      // if(nextButtonState === 'dirty'){
      // this.submitQuestion(this.qIndex, 'test', 'multiline');
      // }
    }
    if ( this.qIndex == 0 ) {
      let leftIcon: any = this.util.get( '.act-cc-button-prev' );
      this.util.addClassAll( leftIcon, 'hide-slide' );
    } else {
      let leftIcon: any = this.util.get( '.act-cc-button-prev' );
      this.util.addClass( leftIcon[ 0 ], 'show-slide' );
      this.util.removeClass( leftIcon[ 0 ], 'hide-slide' );
    }
    // ( window as any ).ccsdkDebug ? console.log( 'next question q response end', this.qResponse ) : '';
    // this.qResponse = {};

  }

  prevQuestion() {
    this.qIndex--;
    if ( !this.ccsdk.survey.questionsToDisplay.length || this.qIndex < 0 ) {
      this.qIndex = 0;
      return;
      // this.qIndex = this.$questionContainer.length - 1;
    }
    // ( window as any ).ccsdkDebug ? console.log( this.qIndex ) : '';
    let onSurveyQuestionEvent = new CustomEvent( Constants.SURVEY_QUESTION_EVENT + "-" + this.ccsdk.surveyToken );
    document.dispatchEvent( onSurveyQuestionEvent );
    //re populate qResponse based on answers.
    // this.util.removeClassAll(this.$questionContainer,'show-slide');
    this.loadQuestionSpecifics( null, this.qIndex );
    this.qResponse = typeof this.ccsdk.survey.answers[ this.currentQuestionId ] !== 'undefined' ? JSON.parse( JSON.stringify( this.ccsdk.survey.answers[ this.currentQuestionId ] ) ) : {};
    ( window as any ).ccsdkDebug ? console.log( "prevQuestion qResponse", this.qResponse ) : '';
    this.util.addClass( this.$questionContainer[ 0 ].firstChild, 'show-slide' );
    this.updateProgress();
    if ( this.qIndex == 0 ) {
      let leftIcon: any = this.util.get( '.act-cc-button-prev' );
      this.util.addClassAll( leftIcon, 'hide-slide' );
      this.util.removeClassAll( leftIcon, 'show-slide' );
    }
  }

  showLoader() {
    let $loader = document.querySelectorAll( ".cc-loaderimg" )[ 0 ];
    this.util.addClass( $loader, 'show' );
    this.util.removeClass( $loader, 'hide' );
  }
  hideLoader() {
    let $loader = document.querySelectorAll( ".cc-loaderimg" )[ 0 ];
    this.util.removeClass( $loader, 'show' );
    this.util.addClass( $loader, 'hide' );
  }

  appendInBody( html ) {
    document.querySelectorAll( "body" )[ 0 ].insertAdjacentHTML(
      'afterbegin', html
    );
    //force update domSelect
    this.domSelectElements();
  }

  replaceInQuestionsContainer( html ) {
    this.$questionContainer[ 0 ].innerHTML = html;
    this.domSelectElements();
  }

  appendInQuestionsContainer( html ) {
    document.querySelectorAll( ".cc-questions-container" )[ 0 ].insertAdjacentHTML(
      'afterbegin', html
    );
    //force update domSelect
    this.domSelectElements();
  }

  showWelcomeContainer() {
    setTimeout( () => {
      let startContainer = <HTMLElement>document.
        querySelectorAll( ".act-cc-welcome-question-box" )[ 0 ];
      let bodyElement = <HTMLElement>document.
        getElementsByTagName( "body" )[ 0 ];
      this.util.addClass( startContainer, "show-slide" );
      // this.util.addClass( bodyElement, "blurr" );
    }, 200 );
    // console.debug()
    this.$startBtn = document.querySelectorAll( ".act-cc-survey-start" )[ 0 ];

  }

  showLanguageSelector() {
    setTimeout( () => {
      let startContainer = <HTMLElement>document.
        querySelectorAll( ".cc-language-selector" )[ 0 ];
      let bodyElement = <HTMLElement>document.
        getElementsByTagName( "body" )[ 0 ];
      this.util.addClass( startContainer, "show-slide" );
      // this.util.addClass( bodyElement, "blurr" );
    }, 200 );
    let self = this;
    if ( this.util.checkIfListenerExists( '.cc-language-select', this.domListeners ) ) {
      // return;
      // ( window as any ).ccsdkDebug ? console.log( "language select - previous listeners exists" ) : '';
      this.removePrevListener( '.cc-language-select' );
    }
    let languageSelect = this.util.initListener( "click", ".cc-language-select", function () {
      // let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
      // document.dispatchEvent(onSurveyClickEvent);
      //select language show next question.
      // self.startSurvey();
      self.ccsdk.config.language = "default";
      self.ccsdk.config.language = ""; //language selection from menu then show first question
    } );

    languageSelect.internalHandler = this.util.listener( this.$body, languageSelect.type, languageSelect.id, languageSelect.cb );
  }

  getSurveyContainer( token: string ) {
    return document.querySelectorAll( "#" + token + "-survey" )[ 0 ];
  }

  getWelcomeContainer( token: string ) {
    return document.querySelectorAll( "#" + token + "-welcome" )[ 0 ];
  }

  loadQuestionSpecifics( q: HTMLElement, index: number ) {
    let self: DomSurvey = this;
    this.$questionContainer[ 0 ].innerHTML = "";
    let compiledTemplate = this.ccsdk.survey.compileTemplate( this.ccsdk.survey.questionsToDisplay[ index ] );
    // console.log( compiledTemplate );
    this.$questionContainer[ 0 ].innerHTML += compiledTemplate;
    let qType: string = this.$questionContainer[ 0 ].firstChild.getAttribute( 'data-type' );
    let qId: string = this.$questionContainer[ 0 ].firstChild.getAttribute( 'data-id' );
    this.qResponse = {};
    // (window as any).ccsdkDebug?console.log("QTYIPE AND QID " , qType, qId):'';
    this.currentQuestionId = qId.substring( 2, qId.length );
    // console.log( 'qtype', qType )
    switch ( qType ) {
      case 'scale':
        let allOptions1: any = document.querySelectorAll( '#' + qId + ' .option-number-item' );
        let optionWidth1 = ( 100 / allOptions1.length ) - .6;
        // (window as any).ccsdkDebug?console.log("Option width", allOptions1, optionWidth1.toFixed(2)):'';
        // self.util.css(allOptions1 , 'width',  optionWidth1.toFixed(1) + '%');
        this.setupListenersQuestionScale( index, qId );
        break;
      case 'nps':
        this.setupListenersQuestionNPS( index, qId );
        break;
      case 'multiline':
        this.setupListenersQuestionMultiline( index, qId );
        break;
      case 'select':
        if ( typeof this.select !== 'undefined' ) {
          this.select.destroyListeners();
        }
        this.setupListenersQuestionSelect( index, qId );
        break;
      case 'radio':
        this.setupListenersQuestionRadio( index, qId );
        break;
      case 'radioImage':
        this.setupListenersQuestionRadioImage( index, qId );
        break;
      case 'checkbox':
        this.setupListenersQuestionCheckbox( index, qId );
        break;
      case 'star':
        this.setupListenersQuestionStar( index, qId );
        break;
      case 'smile':
        this.setupListenersQuestionSmile( index, qId );
        break;
      case 'csat':
        this.setupListenersQuestionCsat( index, qId );
        break;
      case 'slider':
        this.setupListenersQuestionSlider( index, qId );
        break;
      case 'singleline':
        this.setupListenersQuestionSingleline( index, qId );
        break;
      case 'number':
        this.setupListenersQuestionNumber( index, qId );
      default:
        break;
    }
  }

  // question specific listeners

  setupListenersQuestionScale( index: number, qId: string ) {
    var self: DomSurvey = this;
    let selectedRating = <HTMLElement>document.querySelectorAll( '#' + qId + ' .cc-nps-selected-rating' )[ 0 ];
    let selectedRating1 = <HTMLElement>document.querySelectorAll( '#' + qId + ' .cc-nps-selected-rating' )[ 1 ];
    //add id too.
    if ( this.util.checkIfListenerExists( '#' + qId + ' .option-number-item', this.domListeners ) ) {
      // return;
      // ( window as any ).ccsdkDebug ? console.log( "scale question - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId + ' .option-number-item' );
    }

    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    // ( window as any ).ccsdkDebug ? console.log( 'scale question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValue = this.ccsdk.survey.answers[ questionId ].number;
      let previousSelection = document.querySelectorAll( '#' + qId + ' .option-number-item[data-rating="' + previousValue + '"]' )[ 0 ];
      // ( window as any ).ccsdkDebug ? console.log( 'scale previous selection', previousSelection ) : '';
      if ( typeof previousSelection !== 'undefined' ) {
        this.util.addClass( previousSelection, "selected" );
        self.qResponse.type = 'scale';
        self.qResponse.text = null;
        self.qResponse.number = previousValue;
        self.qResponse.questionId = qId;
        selectedRating.innerHTML = previousValue;
        selectedRating1.innerHTML = previousValue;

      }

    }

    let ref = this.util.initListener( 'click', '#' + qId + ' .option-number-item', function () {
      let allOptions: any = document.querySelectorAll( '#' + qId + ' .option-number-item' );

      let rating: number = this.getAttribute( 'data-rating' );
      self.util.removeClassAll( allOptions, "selected" );
      self.util.addClass( this, "selected" );
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // (window as any).ccsdkDebug?console.log('Scale selected',rating):'';
      self.qResponse.type = 'scale';
      self.qResponse.text = null;
      self.qResponse.number = rating;
      self.qResponse.questionId = qId;
      selectedRating.innerHTML = '' + rating;
      selectedRating1.innerHTML = '' + rating;

      //move to next question automagically
      // alert('calling next questions inside scale');
      let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyClickEvent );
      setTimeout( () => {
        self.nextQuestion();
      }, 500 );
      // self.util.trigger(document,'q-answered', {
      //   index : index,
      //   rating : rating,
      //   type : 'scale'
      // });
    } );
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );
  }

  setupListenersQuestionNPS( index: number, qId: string ) {
    var self: DomSurvey = this;
    let selectedRating = <HTMLElement>document.querySelectorAll( '#' + qId + ' .cc-nps-selected-rating' )[ 0 ];
    let allOptions: any = document.querySelectorAll( '#' + qId + ' .option-number-item' );

    //add id too.
    if ( this.util.checkIfListenerExists( '#' + qId + ' .option-number-item', this.domListeners ) ) {
      //remove listeners
      // ( window as any ).ccsdkDebug ? console.log( "nps question - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId + ' .option-number-item' );

    }

    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    ( window as any ).ccsdkDebug ? console.log( 'nps question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValue = this.ccsdk.survey.answers[ questionId ].number;
      let previousSelection = document.querySelectorAll( '#' + qId + ' .option-number-item[data-rating="' + previousValue + '"]' )[ 0 ];
      ( window as any ).ccsdkDebug ? console.log( 'nps previous selection', previousSelection ) : '';
      if ( typeof previousSelection !== 'undefined' ) {
        this.util.addClass( previousSelection, "selected" );
        let $mobileRating = document.querySelectorAll( ".act-cc-nps-selected-rating" )[ 0 ];
        $mobileRating.innerHTML = previousValue;
        self.qResponse.type = 'nps';
        self.qResponse.text = null;
        self.qResponse.number = previousValue;
        self.qResponse.questionId = qId;
      }

    }

    // (window as any).ccsdkDebug?console.log(self.domListeners):'';
    let ref = this.util.initListener( 'click', '#' + qId + ' .option-number-item', function () {
      let rating: number = this.getAttribute( 'data-rating' );
      self.util.removeClassAll( allOptions, "selected" );
      self.util.addClass( this, "selected" );
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // (window as any).ccsdkDebug?console.log('Scale selected',rating):'';
      self.qResponse.type = 'nps';
      self.qResponse.text = null;
      self.qResponse.number = rating;
      self.qResponse.questionId = qId;
      selectedRating.innerHTML = '' + rating;
      //move to next question automagically

      let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyClickEvent );

      // alert('calling next questions inside scale');
      setTimeout( () => {
        self.nextQuestion();
      }, 500 );
      // self.util.trigger(document,'q-answered', {
      //   index : index,
      //   rating : rating,
      //   type : 'scale'
      // });
    } );
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );
  }

  setupListenersQuestionCheckbox( index: number, qId: string ) {
    var self: DomSurvey = this;
    if ( this.util.checkIfListenerExists( '#' + qId + ' .cc-checkbox', this.domListeners ) ) {
      // return;
      ( window as any ).ccsdkDebug ? console.log( "checkbox question - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId + ' .cc-checkbox' );
    }

    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    ( window as any ).ccsdkDebug ? console.log( 'radio question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValues = this.ccsdk.survey.answers[ questionId ].text;
      if ( previousValues ) {
        previousValues = previousValues.split( ',' );
        for ( let previousValue of previousValues ) {
          let previousSelection = document.querySelectorAll( '#' + qId + ' input[value="' + previousValue + '"]' )[ 0 ];
          ( window as any ).ccsdkDebug ? console.log( 'radio previous selection', previousSelection ) : '';
          if ( typeof previousSelection !== 'undefined' ) {
            this.util.addClass( previousSelection, "selected" );
            previousSelection.setAttribute( 'checked', 'checked' );
            self.qResponse.type = 'checkbox';
            self.qResponse.text = previousValue;
            self.qResponse.number = null;
            self.qResponse.questionId = qId;
          }
        }
      }
    }

    let ref = this.util.initListener( 'click', '#' + qId + ' .cc-checkbox', function () {
      // let allOptions : any = document.querySelectorAll('#'+qId+' .cc-checkbox input');
      // let rating : number = this.querySelectorAll('input')[0].value;
      let rating: string = [].filter.call( document.querySelectorAll( '#' + qId + ' .cc-checkbox input' ), function ( c ) {
        return c.checked;
      } ).map( function ( c ) {
        return c.value;
      } ).join( ',' );

      ( window as any ).ccsdkDebug ? console.log( 'Checkbox selected', rating ) : '';

      self.qResponse.type = 'checkbox';
      self.qResponse.text = rating;
      self.qResponse.number = null;
      self.qResponse.questionId = qId;
      //move to next question automagically
      // self.nextQuestion();
    } );
    this.domListeners.push( ref );
    let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
    document.dispatchEvent( onSurveyClickEvent );
    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );
  }

  setupListenersQuestionRadio( index: number, qId: string ) {
    var self: DomSurvey = this;
    if ( this.util.checkIfListenerExists( '#' + qId + ' .cc-checkbox input', this.domListeners ) ) {
      // return;
      //remove listeners
      ( window as any ).ccsdkDebug ? console.log( "radio question - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId + ' .cc-checkbox input' );
    }

    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    ( window as any ).ccsdkDebug ? console.log( 'radio question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValue = this.ccsdk.survey.answers[ questionId ].text;
      let previousSelection = document.querySelectorAll( '#' + qId + ' input[value="' + previousValue + '"]' )[ 0 ];
      ( window as any ).ccsdkDebug ? console.log( 'radio previous selection', previousSelection ) : '';
      if ( typeof previousSelection !== 'undefined' ) {
        this.util.addClass( previousSelection, "selected" );
        previousSelection.setAttribute( 'checked', 'checked' );
        self.qResponse.type = 'radio';
        self.qResponse.text = previousValue;
        self.qResponse.number = null;
        self.qResponse.questionId = qId;
      }

    }



    let ref = this.util.initListener( 'click', '#' + qId + ' .cc-checkbox input', function () {
      // let allOptions : any = document.querySelectorAll('#'+qId+' .cc-checkbox');
      let rating: string = this.value;
      // self.util.removeClassAll(allOptions, "selected");
      // self.util.addClass(this, "selected");
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // (window as any).ccsdkDebug?console.log('Star selected',rating):'';
      self.qResponse.type = 'radio';
      self.qResponse.text = rating;
      self.qResponse.number = null;
      self.qResponse.questionId = qId;
      let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyClickEvent );
      //move to next question automagically
      setTimeout( () => {
        self.nextQuestion();
      }, 500 );
    } );
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );
  }

  setupListenersQuestionRadioImage( index: number, qId: string ) {
    var self: DomSurvey = this;
    if ( this.util.checkIfListenerExists( '#' + qId + ' .cc-checkbox input', this.domListeners ) ) {
      ( window as any ).ccsdkDebug ? console.log( "radio image question - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId + ' .cc-checkbox input' );
    }

    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    ( window as any ).ccsdkDebug ? console.log( 'radio image question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValue = this.ccsdk.survey.answers[ questionId ].text;
      let previousSelection = document.querySelectorAll( '#' + qId + ' input[value="' + previousValue + '"]' )[ 0 ];
      ( window as any ).ccsdkDebug ? console.log( 'radio image previous selection', previousSelection ) : '';
      if ( typeof previousSelection !== 'undefined' ) {
        this.util.addClass( previousSelection, "selected" );
        previousSelection.setAttribute( 'checked', 'checked' );
        self.qResponse.type = 'radioImage';
        self.qResponse.text = previousValue;
        self.qResponse.number = null;
        self.qResponse.questionId = qId;
      }

    }

    let ref = this.util.initListener( 'click', '#' + qId + ' .cc-checkbox input', function () {
      // let allOptions : any = document.querySelectorAll('#'+qId+' .cc-checkbox');
      let rating: string = this.value;
      // self.util.removeClassAll(allOptions, "selected");
      // self.util.addClass(this, "selected");
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // (window as any).ccsdkDebug?console.log('Star selected',rating):'';
      self.qResponse.type = 'radioImage';
      self.qResponse.text = rating;
      self.qResponse.number = null;
      self.qResponse.questionId = qId;
      let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyClickEvent );
      //move to next question automagically
      setTimeout( () => {
        self.nextQuestion();
      }, 500 );
    } );
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );
  }

  setupListenersQuestionStar( index: number, qId: string ) {
    var self: DomSurvey = this;
    if ( this.util.checkIfListenerExists( '#' + qId + ' .option-star-box', this.domListeners ) ) {
      //remove listeners
      ( window as any ).ccsdkDebug ? console.log( "smile question - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId + ' .option-star-box' );

    }
    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    ( window as any ).ccsdkDebug ? console.log( 'star question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValue = this.ccsdk.survey.answers[ questionId ].number;
      let previousSelection = document.querySelectorAll( '#' + qId + ' .option-star-box[data-rating="' + previousValue + '"]' )[ 0 ];
      ( window as any ).ccsdkDebug ? console.log( 'star previous selection', previousSelection ) : '';
      if ( typeof previousSelection !== 'undefined' && previousSelection != null ) {
        this.util.addClass( previousSelection, "selected" );
        self.qResponse.type = 'star';
        self.qResponse.text = null;
        self.qResponse.number = previousValue;
        self.qResponse.questionId = qId;
      }

    }
    let ref = this.util.initListener( 'click', '#' + qId + ' .option-star-box', function () {
      let allOptions: any = document.querySelectorAll( '#' + qId + ' .option-star-box' );
      let rating: number = this.getAttribute( 'data-rating' );
      self.util.removeClassAll( allOptions, "selected" );
      self.util.addClass( this, "selected" );

      //select previous sibling
      // let child : any = this.previousSibling;
      // while( ( child = child.previousSibling) != null ){
      //   self.util.addClass(child, "selected");
      // }


      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // (window as any).ccsdkDebug?console.log('Star selected',rating):'';
      self.qResponse.type = 'star';
      self.qResponse.text = null;
      self.qResponse.number = rating;
      self.qResponse.questionId = qId;

      let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyClickEvent );
      //move to next question automagically
      setTimeout( () => {
        self.nextQuestion();
      }, 500 );
    } );
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );
  }

  setupListenersQuestionSmile( index: number, qId: string ) {
    var self: DomSurvey = this;
    if ( this.util.checkIfListenerExists( '#' + qId + ' .option-smile-box', this.domListeners ) ) {
      //remove listeners
      ( window as any ).ccsdkDebug ? console.log( "smile question - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId + ' .option-smile-box' );

    }
    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    ( window as any ).ccsdkDebug ? console.log( 'smile question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValue = this.ccsdk.survey.answers[ questionId ].number;
      let previousSelection = document.querySelectorAll( '#' + qId + ' .option-smile-box[data-rating="' + previousValue + '"]' )[ 0 ];
      ( window as any ).ccsdkDebug ? console.log( 'smile previous selection', previousSelection ) : '';
      if ( typeof previousSelection !== 'undefined' && previousSelection != null ) {

        this.util.addClass( previousSelection, "selected" );
        self.qResponse.type = 'smile';
        self.qResponse.text = null;
        self.qResponse.number = previousValue;
        self.qResponse.questionId = qId;
      }

    }

    let ref = this.util.initListener( 'click', '#' + qId + ' .option-smile-box', function () {
      let allOptions: any = document.querySelectorAll( '#' + qId + ' .option-smile-box' );
      let rating: number = this.getAttribute( 'data-rating' );
      self.util.removeClassAll( allOptions, "selected" );
      self.util.addClass( this, "selected" );

      //select previous siblings
      // let child : any = this.previousSibling;
      // while( ( child = child.previousSibling) != null ){
      //   self.util.addClass(child, "selected");
      // }
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // (window as any).ccsdkDebug?console.log('Smile selected',rating):'';
      self.qResponse.type = 'smile';
      self.qResponse.text = null;
      self.qResponse.number = rating;
      self.qResponse.questionId = qId;

      let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyClickEvent );
      //move to next question automagically
      setTimeout( () => {
        self.nextQuestion();
      }, 500 );
    } );
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );
  }


  setupListenersQuestionCsat( index: number, qId: string ) {
    var self: DomSurvey = this;
    if ( this.util.checkIfListenerExists( '#' + qId + ' .option-smile-box', this.domListeners ) ) {
      //remove listeners
      ( window as any ).ccsdkDebug ? console.log( "csat question - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId + ' .option-smile-box' );
    }
    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    ( window as any ).ccsdkDebug ? console.log( 'csat question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValue = this.ccsdk.survey.answers[ questionId ].number;
      let previousSelection = document.querySelectorAll( '#' + qId + ' .option-smile-box[data-rating="' + previousValue + '"]' )[ 0 ];
      ( window as any ).ccsdkDebug ? console.log( 'csat previous selection', previousSelection ) : '';
      if ( typeof previousSelection !== 'undefined' && previousSelection != null ) {

        this.util.addClass( previousSelection, "selected" );
        previousSelection.querySelectorAll( "input" )[ 0 ].setAttribute( 'checked', 'checked' );
        self.qResponse.type = 'smile';
        self.qResponse.text = null;
        self.qResponse.number = previousValue;
        self.qResponse.questionId = qId;

      }

    }

    let ref = this.util.initListener( 'click', '#' + qId + ' .option-smile-box', function () {
      let allOptions: any = document.querySelectorAll( '#' + qId + ' .option-smile-box' );
      let rating: number = this.getAttribute( 'data-rating' );
      self.util.removeClassAll( allOptions, "selected" );
      self.util.addClass( this, "selected" );
      this.querySelectorAll( "input" )[ 0 ].setAttribute( 'checked', 'checked' );
      let child: any = this.previousSibling;
      while ( ( child = child.previousSibling ) != null ) {
        // (window as any).ccsdkDebug?console.log('questionscale', 'previousSiblings', child):'';
        self.util.addClass( child, "selected" );
      }
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // (window as any).ccsdkDebug?console.log('Smile selected',rating):'';
      self.qResponse.type = 'smile';
      self.qResponse.text = null;
      self.qResponse.number = rating;
      self.qResponse.questionId = qId;
      console.log( 'dispatching event in csat', this )
      let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyClickEvent );
      //move to next question automagically
      setTimeout( () => {
        self.nextQuestion();
      }, 500 );
    } );
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );
  }

  setupListenersQuestionMultiline( index: number, qId: string ) {
    let self: DomSurvey = this;
    let multilineRes: string = '';
    if ( this.util.checkIfListenerExists( '#' + qId, this.domListeners ) ) {
      //remove listeners
      ( window as any ).ccsdkDebug ? console.log( "multiine question - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId );

    }
    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    ( window as any ).ccsdkDebug ? console.log( 'multiine question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValue = this.ccsdk.survey.answers[ questionId ].text;
      ( window as any ).ccsdkDebug ? console.log( 'multiine input box', document.querySelectorAll( '#' + qId )[ 0 ] ) : '';
      let previousSelection = <HTMLInputElement>document.querySelectorAll( '#' + qId )[ 0 ];
      ( window as any ).ccsdkDebug ? console.log( 'multiine previous selection', previousSelection ) : '';
      ( window as any ).ccsdkDebug ? console.log( 'multiine previous value', previousValue ) : '';
      if ( typeof previousSelection !== 'undefined' &&
        previousSelection != null &&
        typeof previousValue !== 'undefined' ) {
        previousSelection.value = previousValue;
        self.qResponse.type = 'multiline';
        self.qResponse.text = previousValue;
        self.qResponse.number = null;
        self.qResponse.questionId = qId;
      }
    }
    let ref = this.util.initListener( 'change', '#' + qId, function () {
      multilineRes = this.value;
      self.qResponse.type = 'multiline';
      self.qResponse.text = multilineRes;
      self.qResponse.number = null;
      self.qResponse.questionId = qId;
    } );
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );
  }

  setupListenersQuestionSingleline( index: number, qId: string ) {
    let self: DomSurvey = this;
    let singlelineRes: string = '';
    if ( this.util.checkIfListenerExists( '#' + qId, this.domListeners ) ) {
      //remove listeners
      ( window as any ).ccsdkDebug ? console.log( "singleline question - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId );
    }
    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    ( window as any ).ccsdkDebug ? console.log( 'singleline question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValue = this.ccsdk.survey.answers[ questionId ].text;
      ( window as any ).ccsdkDebug ? console.log( 'singleline input box', document.querySelectorAll( '#' + qId )[ 0 ] ) : '';
      let previousSelection = <HTMLInputElement>document.querySelectorAll( '#' + qId )[ 0 ];
      ( window as any ).ccsdkDebug ? console.log( 'singleline previous selection', previousSelection ) : '';
      ( window as any ).ccsdkDebug ? console.log( 'singleline previous value', previousValue ) : '';
      if ( typeof previousSelection !== 'undefined' &&
        previousSelection != null &&
        typeof previousValue !== 'undefined' ) {
        previousSelection.value = previousValue;
        self.qResponse.type = 'singleline';
        self.qResponse.text = previousValue;
        self.qResponse.number = null;
        self.qResponse.questionId = qId;
      }
    }
    let ref = this.util.initListener( 'change', '#' + qId, function () {
      singlelineRes = this.value;
      self.qResponse.type = 'singleline';
      self.qResponse.text = singlelineRes;
      self.qResponse.number = null;
      self.qResponse.questionId = qId;
    } );
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );

    // console.log( 'singleline qResponse', self.qResponse );
  }

  setupListenersQuestionNumber( index: number, qId: string ) {
    let self: DomSurvey = this;
    let numberRes: string = '';
    if ( this.util.checkIfListenerExists( '#' + qId, this.domListeners ) ) {
      //remove listeners
      ( window as any ).ccsdkDebug ? console.log( "number question - previous listeners exists" ) : '';
      this.removePrevListener( '#' + qId );

    }
    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    ( window as any ).ccsdkDebug ? console.log( 'number question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValue = this.ccsdk.survey.answers[ questionId ].number;
      ( window as any ).ccsdkDebug ? console.log( 'number input box', document.querySelectorAll( '#' + qId )[ 0 ] ) : '';
      let previousSelection = <HTMLInputElement>document.querySelectorAll( '#' + qId )[ 0 ];
      ( window as any ).ccsdkDebug ? console.log( 'number previous selection', previousSelection ) : '';
      ( window as any ).ccsdkDebug ? console.log( 'number previous value', previousValue ) : '';
      if ( typeof previousSelection !== 'undefined' &&
        previousSelection != null &&
        typeof previousValue !== 'undefined' ) {
        previousSelection.value = previousValue;
        self.qResponse.type = 'number';
        self.qResponse.text = null;
        self.qResponse.number = previousValue;
        self.qResponse.questionId = qId;
      }
    }
    let ref = this.util.initListener( 'change', '#' + qId, function () {
      numberRes = this.value;
      self.qResponse.type = 'number';
      self.qResponse.text = null;
      self.qResponse.number = numberRes;
      self.qResponse.questionId = qId;
    } );
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );
  }

  setupListenersQuestionSlider( index: number, qId: string ) {
    let self: DomSurvey = this;
    let sliderRes: string = '';
    let slider = new Slider();
    let sliderInput = <HTMLInputElement>document.querySelectorAll( '#' + qId + " input" )[ 0 ];

    if ( this.util.checkIfListenerExists( '#' + qId + " input", this.domListeners ) ) {
      // return;

    }
    //set previous value
    let questionId: any;
    questionId = qId.substring( 2, qId.length );
    ( window as any ).ccsdkDebug ? console.log( 'slider question', this.ccsdk.survey.answers[ questionId ] ) : '';
    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      let previousValue = this.ccsdk.survey.answers[ questionId ].number;
      ( window as any ).ccsdkDebug ? console.log( 'slider input box', document.querySelectorAll( '#' + qId )[ 0 ] ) : '';
      let previousSelection = <HTMLInputElement>document.querySelectorAll( '#' + qId + " .act-slider-tip" )[ 0 ];
      ( window as any ).ccsdkDebug ? console.log( 'slider previous selection', previousSelection ) : '';
      ( window as any ).ccsdkDebug ? console.log( 'slider previous value', previousValue ) : '';
      if ( typeof previousSelection !== 'undefined' &&
        previousSelection != null &&
        typeof previousValue !== 'undefined' ) {
        previousSelection.innerHTML = previousValue;
        sliderInput.value = previousValue;
        self.qResponse.type = 'slider';
        self.qResponse.number = previousValue;
        self.qResponse.text = null;
        self.qResponse.questionId = qId;
      }
    }
    let ref = this.util.initListener( "change", '#' + qId + " input", function () {
      sliderRes = this.value;
      self.qResponse.type = 'slider';
      self.qResponse.number = sliderRes;
      self.qResponse.text = null;
      self.qResponse.questionId = qId;
      //move to next question automagically
      // self.nextQuestion();
    } );
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );
  }

  setupListenersQuestionSelect( index: number, qId: string ) {
    let self: DomSurvey = this;
    let questionId: any;
    ( window as any ).ccsdkDebug ? console.log( 'select que', this.domListeners ) : '';
    questionId = qId.substring( 2, qId.length );
    // (window as any).ccsdkDebug?console.log(this.ccsdk.survey.answers[questionId]):'';
    // (window as any).ccsdkDebug?console.log(this.ccsdk.survey.surveyAnswers[questionId]):'';
    if ( this.util.checkIfListenerExists( '#' + qId + " .cc-select-options .cc-select-option", this.domListeners ) ) {
      ( window as any ).ccsdkDebug ? console.log( 'select que listner exists' ) : '';
      this.removePrevListener( '#' + qId + " .cc-select-options .cc-select-option" );

      // return;
    }
    ( window as any ).ccsdkDebug ? console.log( 'select que' ) : '';

    // if(!self.util.arrayContains.call(self.trackSelects, qId)){
    ( window as any ).ccsdkDebug ? console.log( 'select que initialize select' ) : '';

    self.select = new Select( qId );
    self.select.destroyListeners();
    self.select.init( qId );

    if ( typeof this.ccsdk.survey.answers[ questionId ] !== 'undefined' && this.ccsdk.survey.answers[ questionId ] !== '' ) {
      if ( this.ccsdk.survey.answers[ questionId ].text ) {
        let question = this.ccsdk.survey.getQuestionById( questionId );
        self.select.setValue( this.ccsdk.survey.answers[ questionId ].text, question, this.ccsdk.survey );
        self.select.selectOptions( this.ccsdk.survey.answers[ questionId ].text );
        self.qResponse.type = 'select';
        self.qResponse.text = this.ccsdk.survey.answers[ questionId ].text;
        self.qResponse.number = null;
        self.qResponse.questionId = qId;
      }
    }
    self.trackSelects.push( qId );
    // }
    let selectRes: string = '';
    let ref = this.util.initListener( 'click', '#' + qId + " .cc-select-options .cc-select-option", function () {
      // selectRes = this.getAttribute('data-value');
      selectRes = document.querySelectorAll( '#' + qId + " .cc-select-trigger" )[ 0 ].getAttribute( 'data-selection-value' );
      // (window as any).ccsdkDebug?console.log(selectRes):'';
      self.qResponse.type = 'select';
      self.qResponse.text = selectRes;
      self.qResponse.number = null;
      self.qResponse.questionId = qId;
      //move to next question automagically

      let onSurveyClickEvent = new CustomEvent( Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken );
      document.dispatchEvent( onSurveyClickEvent );

      // self.nextQuestion();
    } );

    // this.util.removeListener(this.$body, ref.type, listener.internalHandler);    
    this.domListeners.push( ref );

    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );

  }



  // addListenersNextButtonSubmit(index : number, data : any, type : string){
  //   let self : DomSurvey = this;
  //   let btnNext = self.util.get('.act-cc-button-next')[0];
  //   self.util.on('click', btnNext, this.submitQuestion(
  //     index, data, type
  //   ));
  //
  // }

  // removeListenersNextButtonSubmit(index : number, data : any, type : string){
  //   let self : DomSurvey = this;
  //   let btnNext = self.util.get('.act-cc-button-next');
  //   self.util.on('click', btnNext, this.submitQuestion(
  //     index, data, type
  //   ));
  //   self.util.off('click', btnNext, this.submitQuestion(
  //     index, data, type
  //   ));
  // }

  submitQuestion( index: number, data: any, type: string, qId: string ) {
    // (window as any).ccsdkDebug?console.log('type', type ,'res',data):'';
    this.util.trigger( document, 'q-answered', {
      index: index,
      data: data,
      type: type,
      questionId: qId.substring( 2, qId.length )
    } );
  }



}

export { DomSurvey }
