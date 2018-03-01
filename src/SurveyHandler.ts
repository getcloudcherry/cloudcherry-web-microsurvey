
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
  prefillDirect : any;
  prefillWithTags: any;
  prefillWithNote : any;
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
  // isPartialAvailable : Boolean;

  constructor(ccsdk) {
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
    this.displayThankYouCb = (e: any) => {
      //perform final post
      this.finalPost();
      let thankyouHtml: any = templates.thankyou;
      // thankyouHtml = thankyouHtml.replace("{{question}}", this.surveyData.thankyouText);
      // thankyouHtml = thankyouHtml.replace("{{question}}", LanguageTextFilter.translateMessages(this, "thankyouText"));
      let thankyouText = this.ccsdk.config.thankyouText ? this.ccsdk.config.thankyouText : (this.surveyData.thankyouText ? this.surveyData.thankyouText : 'Thank You');
      let startText = this.ccsdk.config.startButtonText ? this.ccsdk.config.startButtonText : 'Start';
      thankyouHtml = thankyouHtml.replace("{{question}}", thankyouText);
      thankyouHtml = thankyouHtml.replace("{{button}}", startText);
      this.ccsdk.dom.replaceInQuestionsContainer(thankyouHtml);
      //TODO : Fix this Add class not working???
      let thankyouContainer: any = this.util.get("#cc-thankyou-container");
      (window as any).ccsdkDebug ? console.log(thankyouContainer) : '';
      this.util.addClass(thankyouContainer[0], 'show-thankyou-slide');
      let onSurveyEndEvent = new CustomEvent(Constants.SURVEY_END_EVENT + "-" + this.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyEndEvent);
      //set done cookie for 30 days.
      Cookie.set(this.surveyToken + '-finish', 'true', 30, '/');
      setTimeout(() => {
        this.destroy();
      }, 2000);
    }

    this.destroySurveyCb = (e: any) => {
      let self: SurveyHandler = this;
      //send end survey event.
      let onSurveyEndEvent = new CustomEvent(Constants.SURVEY_END_EVENT + "-" + this.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyEndEvent);
      self.destroy();
    }

    this.acceptAnswersCb = (e: any) => {
      let self: SurveyHandler = this;
      // (window as any).ccsdkDebug?console.log(self):'';
      // (window as any).ccsdkDebug?console.log('question answered',e:'')
      let data: any = <any>e.detail;
      let response: any = {};
      response.questionId = data.questionId;
      switch (data.type) {
        case 'scale':
          response.text = null;
          response.number = Number(data.data.number);
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'nps':
          response.text = null;
          response.number = Number(data.data.number);
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'radio':
          response.text = data.data.text;
          response.number = null;
          // response.number = Number(data.data.number);
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'radioImage':
          response.text = data.data.text;
          response.number = null;
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'smile':
          response.text = null;
          response.number = Number(data.data.number);
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'star':
          response.text = null;
          response.number = Number(data.data.number);
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'multiline':
          response.text = data.data.text;
          response.number = null;
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex(data.index);
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'singleline':
          response.text = data.data.text;
          response.number = null;
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex(data.index);
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'number':
          response.text = null;
          response.number = Number(data.data.number);
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex(data.index);
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'checkbox':
          response.text = data.data.text;
          response.number = null;
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex(data.index);
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'select':
          response.text = data.data.text;
          response.number = null;
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex(data.index);
          // self.ccsdk.dom.nextQuestion();
          break;
        case 'slider':
          response.text = data.data.text;
          response.number = Number(data.data.number);
          // (window as any).ccsdkDebug?console.log(data):'';
          self.postPartialAnswer(data.index, response);
          self.ccsdk.dom.domSelectElements();
          self.ccsdk.dom.setQIndex(data.index);
          // self.ccsdk.dom.nextQuestion();
          break;
        default:
          break;
      }
    }
  }

  fetchQuestions() {
    this.randomNumber = parseInt((String)(Math.random() * 1000));
    let surveyUrl = Config.SURVEY_BY_TOKEN.replace("{token}", "" + this.surveyToken);
    surveyUrl = surveyUrl.replace("{tabletId}", "" + this.randomNumber);
    surveyUrl = Config.API_URL + surveyUrl;
    let data = RequestHelper.get(surveyUrl);

    // (window as any).ccsdkDebug?console.log(data):'';
    return data;
    // this.surveyData = data.then(function();
    // (window as any).ccsdkDebug?console.log(this.surveyData):'';
  }

  removeAnswer(questionId) {
    delete this.answers[questionId];
    delete this.surveyAnswers[questionId];
  }

  attachSurvey(surveyData: any) {
    this.surveyData = surveyData;
    this.setupSurveyContainer();
    //clean survey
    this.cleanSurvey();
    this.displayQuestions();
    this.displayThankYou();
    this.destroySurvey();
  }

  cleanSurvey() {
    this.questionsToDisplay = [];
    this.answers = {};
    this.surveyAnswers = {};
    this.conditionalQuestions = [];
  }

  setupSurveyContainer() {
    let surveyHtml: any = templates.question_survey;
    surveyHtml = surveyHtml.replace("{{surveyToken}}", this.surveyToken);
    surveyHtml = surveyHtml.replace("{{animation}}", this.surveyDisplay.surveyPopupAnimation);
    surveyHtml = surveyHtml.replace(/{{location}}/g, this.surveyDisplay.surveyPosition);
    this.ccsdk.dom.appendInBody(surveyHtml);
  }

  displayQuestionSelector() {

  }

  displayWelcomeQuestion() {
    //call this with true when welcome container is clicked.
    // this.ccsdk.addThrottlingEntries(false);
    let onSurveyImpressionEvent = new CustomEvent(Constants.SURVEY_IMPRESSION_EVENT + "-" + this.surveyToken);
    document.dispatchEvent(onSurveyImpressionEvent);
    this.ccsdk.surveyStartTime = new Date();
    let self = this;
    let welcomeHtml: any = templates.question_start;
    welcomeHtml = welcomeHtml.replace("{{surveyToken}}", this.surveyToken);
    // welcomeHtml = welcomeHtml.replace("{{question}}", this.surveyData.welcomeText);
    let welcomeText = this.ccsdk.config.welcomeText ? this.ccsdk.config.welcomeText : 'Welcome';
    welcomeHtml = welcomeHtml.replace("{{question}}", welcomeText);
    // welcomeHtml = welcomeHtml.replace("{{question}}", LanguageTextFilter.translateMessages(this, "welcomeText"));
    let startText = this.ccsdk.config.startButtonText ? this.ccsdk.config.startButtonText : 'Start';
    welcomeHtml = welcomeHtml.replace("{{button}}", startText);
    welcomeHtml = welcomeHtml.replace("{{location}}", this.surveyDisplay.position);
    welcomeHtml = welcomeHtml.replace("{{animation}}", this.surveyDisplay.welcomePopupAnimation);
    // (window as any).ccsdkDebug?console.log("Appending in body"):'';
    this.ccsdk.dom.appendInBody(welcomeHtml);
    this.ccsdk.dom.showWelcomeContainer();
    if ((typeof this.ccsdk.config.keepAlive != undefined) && (this.ccsdk.config.keepAlive > 0)) {
      this.welcomeQuestionDisplayTime = new Date();
      this.welcomeInterval = setInterval(() => { self.checkWelcomeQuestionDisplay(self.ccsdk.config.keepAlive) }
        , 1000);
    }

    this.acceptAnswers();
    // self.survey.displayLanguageSelector();

  }

  checkWelcomeQuestionDisplay(keepAlive) {
    let self = this;
    let now = new Date();
    if (keepAlive) {
      // console.log((now.getTime() - this.welcomeQuestionDisplayTime.getTime()) / 1000);
      if (keepAlive <= (now.getTime() - this.welcomeQuestionDisplayTime.getTime()) / 1000) {
        self.killWelcomeQuestion();
      }
    }
  }

  killWelcomeQuestion() {
    this.destroy();
    clearInterval(this.welcomeInterval);
  }
  cancelKillWelcomeQuestion() {
    clearInterval(this.welcomeInterval);
  }

  displayLanguageSelector() {
    let self = this;
    let options1: string;
    let qId = 'languageSelector';
    let cTemplate1 = templates.language_selector;
    options1 = this.util.generateLanguageSelectOptions(["default"].concat(Object.keys(this.surveyData.translated)));
    cTemplate1 = cTemplate1.replace(/{{questionId}}/g, qId);
    cTemplate1 = cTemplate1.replace("{{options}}", options1);
    cTemplate1 = cTemplate1.replace("{{requiredLabel}}", true ? "*" : "");
    this.ccsdk.dom.replaceInQuestionsContainer(cTemplate1);
    let $questionContainer = document.
      querySelectorAll(".cc-questions-container");
    let $body = document.getElementsByTagName("body")[0];

    this.util.addClass($questionContainer[0].firstChild, 'show-slide');
    this.languageSelect = new Select(qId);
    let submitBtn = document.querySelectorAll('.submit-icon');
    this.util.removeClassAll(submitBtn, 'act-cc-button-next');
    this.util.addClassAll(submitBtn, 'act-cc-button-lang-next');
    this.languageSelect.init(qId);
    let selectRes = '';
    let ref = this.util.initListener('click', '#' + qId + " .cc-select-options .cc-select-option", function () {
      self.ccsdk.debug ? console.log('languageSelectOption') : '';
      selectRes = document.querySelectorAll('#' + qId + " .cc-select-trigger")[0].innerHTML;
    });
    this.domListeners.push(ref);
    ref.internalHandler = this.util.listener($body, ref.type, ref.id, ref.cb);


    let languageSelect = this.util.initListener("click", ".act-cc-button-lang-next", function () {
      self.ccsdk.debug ? console.log('languageNext') : '';
      self.ccsdk.config.language = "default";
      self.ccsdk.config.language = selectRes; //language selection from menu then show first question
      //set config rtl or ltr
      let isRTL = /[\u0600-\u06FF]/.test(selectRes);
      self.ccsdk.config.textDirection = isRTL?'rtl':'ltr';
      self.ccsdk.setHtmlTextDirection();
      self.util.removeClassAll(submitBtn, 'act-cc-button-lang-next');
      self.util.addClassAll(submitBtn, 'act-cc-button-next');
      self.ccsdk.dom.loadFirstQuestion();        // this.loadFirstQuestion();
      self.postPrefillPartialAnswer();
      

    });
    this.domListeners.push(languageSelect);

    languageSelect.internalHandler = this.util.listener($body, languageSelect.type, languageSelect.id, languageSelect.cb);



    // this.util.addClass(thankyouContainer[0], 'show-thankyou-slide');

    // this.ccsdk.dom.appendInBody(cTemplate1);
    // this.ccsdk.dom.showLanguageSelector();
    (window as any).ccsdkDebug ? console.log(cTemplate1) : '';
  }

  displayThankYou() {
    let self: SurveyHandler = this;
    document.addEventListener('ccdone', this.displayThankYouCb);
  }


  displayQuestions() {
    //check question is supported, based on question types.
    //filter pre fill questions.
    this.questions = this.surveyData.questions;
    
    // this.questionsToDisplay = (this.surveyData.questions as any[]).filter(this.filterQuestions);
    this.filterQuestions();
    //sort questions and display them?
    this.questionsToDisplay = this.questionsToDisplay.sort(this.questionCompare);
    let ccSurvey: any;
    ccSurvey = document.getElementsByClassName("cc-questions-container");
    // ccSurvey = ccSurvey[0];
    let surveyObject = ccSurvey[0];
    // (window as any).ccsdkDebug?console.log(this.questionsToDisplay):'';
    //chec
    //for now just do 1st question.
    for (let question of this.questionsToDisplay) {
      if (this.checkConditionals(question)) {
        let compiledTemplate = this.compileTemplate(question);
        question.compiledTemplate = compiledTemplate;
        // surveyObject.innerHTML += compiledTemplate;
        //register handlers for onclick?
      } else {
        if (this.isPrefillQuestion(question)) {
          this.prefillQuestions.push(question);
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

  getAnswerForQuestionId(questionId: string) {
    let answer = this.surveyAnswers[questionId];
    if(typeof answer  === 'undefined') {
      for(let response of this.prefillResponses) {
        if(response.questionId == questionId) {
          return response;
        }
      }
    }
    return this.surveyAnswers[questionId];
  }

  acceptAnswers() {
    let self: SurveyHandler = this;
    // (window as any).ccsdkDebug?console.log('add question answered listener':'')
    document.addEventListener('q-answered', this.acceptAnswersCb);
  }

  fillPrefillQuestionObject(id: any, response: any) {
    let question: any = this.getQuestionById(id);
    let responseStored = this.getPrefillResponseById(id);
    if (responseStored != null) {
      this.updatePrefillResponseById(id, response);
    } else {
      this.prefillResponses.push(response)
    }
  }

  fillPrefill(tag: any, value: object) {
    this.prefillWithTags[tag.toLowerCase()] = value;
    (window as any).ccsdkDebug ? console.log('prefillByTag', this.prefillWithTags) : '';
  }

  fillPrefillByNote(note:any, value: object){
    this.prefillWithNote[note.toLowerCase()] = value;
    (window as any).ccsdkDebug ? console.log('prefillByNote', this.prefillWithNote) : '';
    
  }

  fillPrefillDirect(questionId : string, value : object){
    this.prefillDirect[questionId] = value;
    (window as any).ccsdkDebug ? console.log('prefillDirect', this.prefillDirect) : '';
    
  }

  fillPrefillQuestion(id: any, value: any, valueType: string) {
    let question: any = this.getQuestionById(id);
    // console.log(this.questions);
    let response: any;
    let responseStored = this.getPrefillResponseById(id);
    if (responseStored != null) {
      response = responseStored;
    } else {
      response = {
        questionId: question.id,
        questionText: question.text,
        textInput: null,
        numberInput: null
      };
    }
    valueType = this.getAnswerTypeFromDisplayType(question.displayType);

    if (valueType.toLowerCase() == "number") {
      response.numberInput = value;
    }
    if (valueType.toLowerCase() == "text") {
      response.textInput = value;
    }
    if (responseStored != null) {
      this.updatePrefillResponseById(id, response);
    } else {
      this.prefillResponses.push(response)
    }

  }

  postPrefillPartialAnswer() {
    let surveyPartialUrl = Config.SURVEY_PARTIAL_RESPONSE.replace("{id}", this.surveyData.partialResponseId);
    surveyPartialUrl = surveyPartialUrl.replace("{complete}", "false");
    surveyPartialUrl = surveyPartialUrl.replace("{tabletId}", "" + this.randomNumber);
    surveyPartialUrl = Config.API_URL + surveyPartialUrl;
    (window as any).ccsdkDebug ? console.log("Posting Prefill Responses to Server") : '';
    (window as any).ccsdkDebug ? console.log(this.prefillResponses) : '';
    if(typeof this.prefillResponses !== 'undefined' && this.prefillResponses.length > 0) {
      return RequestHelper.post(surveyPartialUrl, this.prefillResponses);
    } else {
      // console.log('No Prefill data');
      return;
    }
  }

  updatePrefillResponseById(id: any, resp: any) {
    for (let response of this.prefillResponses) {
      if (response.questionId == id) {
        response = resp;
      }
    }
  }

  getPrefillResponseById(id: any) {
    for (let response of this.prefillResponses) {
      if (response.questionId == id) {
        return response;
      }
    }
    return null;
  }

  getQuestionById(id: any) {
    for (let question of this.questions) {
      if (question.id == id) {
        return question;
      }
    }
  }

  postPartialAnswer(index: any, response: any) {
    // let data = new FormData();
    //in case of file.
    // let input = document.querySelector('input[type="file"]') ;
    // data.append('file', input.files[0]);
    let question: any = this.questionsToDisplay[index];
    if (typeof question === 'undefined') {
      //now?
      // return (window as any).ccsdkDebug?console.log("No Partial Remaining"):'';
    }
    let data: any = {
      comparator: 0,
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
    let surveyPartialUrl = Config.SURVEY_PARTIAL_RESPONSE.replace("{id}", this.surveyData.partialResponseId);
    //if this is the last of displayed question
    (window as any).ccsdkDebug ? console.log("partial response", question.id == this.questionsToDisplay[this.questionsToDisplay.length - 1].id) : '';
    if (question.id == this.questionsToDisplay[this.questionsToDisplay.length - 1].id) {
      surveyPartialUrl = surveyPartialUrl.replace("{complete}", "true");
    } else {
      surveyPartialUrl = surveyPartialUrl.replace("{complete}", "false");
    }
    surveyPartialUrl = surveyPartialUrl.replace("{tabletId}", "" + this.randomNumber);
    surveyPartialUrl = Config.API_URL + surveyPartialUrl;
    //add partial answer to main answer
    this.surveyAnswers[question.id] = data;

    data = [data];
    // let result = RequestHelper.post(surveyPartialUrl, "[" + JSON.stringify(data) + "]");
    let onSurveyAnswerEvent = new CustomEvent(Constants.SURVEY_ANSWER_EVENT + "-" + this.surveyToken);
    document.dispatchEvent(onSurveyAnswerEvent);
    if (question.id == this.questionsToDisplay[this.questionsToDisplay.length - 1].id) {
     //last question post moved to separate function
      return RequestHelper.post(surveyPartialUrl, data);
     
    } else {
      return RequestHelper.post(surveyPartialUrl, data);
    }

  }

  finalPost(){
    //last question
    let postSurveyFinalUrl = Config.POST_SURVEY_FINAL.replace("{tokenId}", this.ccsdk.surveyToken);
    postSurveyFinalUrl = Config.API_URL + postSurveyFinalUrl;
    let answersAll = [];
    for (let answer in this.surveyAnswers) {
      answersAll.push(this.surveyAnswers[answer]);
    }
    for (let answer in this.prefillResponses){
      answersAll.push(this.prefillResponses[answer]);
    }
    let timeAtPost = new Date().getTime();
    let finalData = {
      id: this.ccsdk.surveyToken,
      user: this.ccsdk.config.username,
      locationId: null,
      responses: answersAll,
      nps: 0,
      surveyClient: Constants.SURVEY_CLIENT,
      responseDuration: Math.floor((timeAtPost - this.ccsdk.surveyStartTime.getTime()) / 1000)
    };
    return RequestHelper.post(postSurveyFinalUrl, finalData);
    
  }

  /**
   *
   * check if conditions are satsified which are required to display question?
   *
   * @param {any} question
   * @memberof Survey
   */
  checkConditionals(question: any) {
    return true;
  }

  compileTemplate(question: any) {
    let self: SurveyHandler = this;
    //get question type
    let questionTemplate;
    // (window as any).ccsdkDebug?console.log(question):'';
    if(question != 'undefined'){
      switch (question.displayType) {
        case "Slider":
          let opt: any = question.multiSelect[0].split("-");
          let optMin: any = opt[0].split(";");
          let optMax: any = opt[1].split(";");
          //get text question template and compile it.
          questionTemplate = templates.question_slider;
          questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
          questionTemplate = questionTemplate.replace(/{{min}}/g, optMin[0]);
          if (optMin[1]) {
            questionTemplate = questionTemplate.replace(/{{minLabel}}/g, optMin[1] + "-");
          } else {
            questionTemplate = questionTemplate.replace(/{{minLabel}}/g, "");
          }
          questionTemplate = questionTemplate.replace(/{{max}}/g, optMax[0]);
          if (optMax[1]) {
            questionTemplate = questionTemplate.replace(/{{maxLabel}}/g, optMax[1] + "-");
          } else {
            questionTemplate = questionTemplate.replace(/{{maxLabel}}/g, "");
          }
          questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
          questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
          questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
          break;
        case "Scale":
          //get text question template and compile it.
          (window as any).ccsdkDebug ? console.log(question.questionTags) : '';
          if (question.questionTags.includes("NPS")) {
            questionTemplate = templates.question_nps;
            questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
            questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
            questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
            questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
          } else if (question.questionTags.includes("CSAT")) {
            if (question.questionTags.includes("csat_satisfaction_5")) {
              questionTemplate = templates.question_csat_satisfaction_5;
            } else if (question.questionTags.includes("csat_agreement_5")) {
              questionTemplate = templates.question_csat_agreement_5;
            }
            questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
            questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
            questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
            questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
          } else {
            let tileColor = '';
            let style = '';
            if(question.attributes != null && question.attributes.scaleColor.length > 0){
              tileColor = question.attributes.scaleColor;
            }else if (question.presentationMode != null && question.presentationMode.includes("Color")) {
              tileColor = question.presentationMode.split(':')[1];
            }
            if(tileColor.length > 0){
              let tileColorDark = this.util.shadeBlendConvert(-0.3, tileColor, undefined);
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
            questionTemplate = questionTemplate.replace(/{{style}}/g, style);
            questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
            questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
            questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
            questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
            //construct NPS scale here....
            let startRange = 0.0;
            let endRange = 10.0;
            let options = "";
            let startRangeLabel = "";
            // let startRangeLabel = "";
            // let endRangeLabel = "Very likely";
            let endRangeLabel = "";
            let displayLegend = LanguageTextFilter.translateDisplayLegend(this, question);
            if (displayLegend) {
              if (displayLegend.length > 0) {
                startRangeLabel = displayLegend[0] ? displayLegend[0] : null;
                endRangeLabel = displayLegend[1] ? displayLegend[1] : null;
              }
            }
            if (question.multiSelect.length > 0) {
              startRange = parseFloat(question.multiSelect[0].split("-")[0]);
              if (startRangeLabel == null) {
                startRangeLabel = question.multiSelect[0].split("-")[0].split(";")[1];
              }
              endRange = parseFloat(question.multiSelect[0].split("-")[1]);
              if (endRangeLabel == null) {
                endRangeLabel = question.multiSelect[0].split("-")[1].split(";")[1];
              }
            }
            startRangeLabel = startRangeLabel == null ? "" : startRangeLabel;
            endRangeLabel = endRangeLabel == null ? "" : endRangeLabel;
            let mobileImageUrl = '';
            let imageVisibility010 = 'hide';
            let imageVisibility110 = 'hide';
            let scaleVisibility = 'show-inline';
            let scaleImageContainer = '';
            if(startRange == 0 && endRange == 10){
              mobileImageUrl = "https://cx.getcloudcherry.com/microsurvey-assets/scale-0-10-neutral.svg";
              imageVisibility010 = 'show';
              imageVisibility110 = 'hide';
              scaleVisibility = 'hide';
              scaleImageContainer = 'scale-image-container';
            }else if(startRange == 1 && endRange == 10){
              mobileImageUrl = "https://cx.getcloudcherry.com/microsurvey-assets/scale-1-10-neutral.svg";
              imageVisibility010 = 'hide';
              imageVisibility110 = 'show';
              scaleVisibility = 'hide';
              scaleImageContainer = 'scale-image-container';
            }
            // console.log('scale', startRange, endRange);
            let divider: any = 1;
            if (endRange < 11) {
            } else {
              divider = (endRange - startRange) / 10.0;
            }
            let initial = 0.0;
            let optionStyle = '';
            // console.log((window as any).isMobile);
            if((window as any).isMobile){
              if(endRange > 6 && endRange < 11){
                 optionStyle = 'width:' +((100/(endRange - startRange + 1)) -.5)+ '%';
              }
            }else{
              imageVisibility010 = 'hide';
              imageVisibility110 = 'hide';
              scaleVisibility = 'show-inline';
              scaleImageContainer = '';
              mobileImageUrl="";

            }
            for (let initial = startRange; initial <= endRange; initial += divider) {
              options += '<span data-rating="' + initial + '" class="option-number-item option-scale '+scaleVisibility+'" style="'+optionStyle+'">' + initial + '</span>';
            }
            if ((endRange-startRange+1) <= 11) {
              var optionLeftExtraClass = 'option-left-rating-text-small-container';
              var optionRightExtraClass = 'option-right-rating-text-small-container';
              var optionMaxWidth = (((endRange - startRange + 1)*38/2) - 5) +'px';
              // console.log(optionMaxWidth);
            }
            questionTemplate = questionTemplate.replace("{{optionsRange}}", options);
            // questionTemplate = questionTemplate.replace("{{maxWidth}}", optionMaxWidth);
            questionTemplate = questionTemplate.replace(/maxWidth/g, optionMaxWidth);
            questionTemplate = questionTemplate.replace(/{{optionLeftExtraClass}}/g, optionLeftExtraClass);
            questionTemplate = questionTemplate.replace(/{{optionRightExtraClass}}/g, optionRightExtraClass);
            questionTemplate = questionTemplate.replace("{{leftLabel}}", startRangeLabel);
            questionTemplate = questionTemplate.replace("{{rightLabel}}", endRangeLabel);
            questionTemplate = questionTemplate.replace(/{{mobileImageUrl}}/g, '"'+mobileImageUrl+'"');
            questionTemplate = questionTemplate.replace("{{imageVisibility010}}", imageVisibility010);
            questionTemplate = questionTemplate.replace("{{imageVisibility110}}", imageVisibility110);
            questionTemplate = questionTemplate.replace("{{scaleImageContainer}}", scaleImageContainer);
          }

          break;
        case "Text":
          //get text question template and compile it.
          questionTemplate = templates.question_text;
          questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
          questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
          questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
          questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
          questionTemplate = questionTemplate.replace("{{validationHint}}", question.validationHint ? question.validationHint : "");

          break;
        case "Number":
          //get text question template and compile it.
          questionTemplate = templates.question_number;
          questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
          questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
          questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
          questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
          questionTemplate = questionTemplate.replace("{{validationHint}}", question.validationHint ? question.validationHint : "");

          break;
        case "MultilineText":
          //get text question template and compile it.
          questionTemplate = templates.question_multi_line_text;
          questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
          questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
          questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
          questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
          questionTemplate = questionTemplate.replace("{{validationHint}}", question.validationHint ? question.validationHint : "");

          break;
        case "MultiSelect":
          let acTemplate: string;
          let multiSelect1;
          //get text question template and compile it.
          multiSelect1 = Array.prototype.slice.call(LanguageTextFilter.translateMultiSelect(this, question));
          if (question.presentationMode == 'Invert') {
            // console.log('selection option before reverse', multiSelect1);
            multiSelect1.reverse();
            // console.log('selection option after reverse', multiSelect1);
            // console.log('selection api option', question.multiSelect);
          }
          //get text question template and compile it.
          if (((question.displayStyle == 'radiobutton/checkbox') || (question.displayStyle == 'icon')) && (multiSelect1.length < 6)) {
            // (window as any).ccsdkDebug?console.log(question.displayStyle):'';
            let checkOptionContainsImage: boolean = self.util.checkOptionContainsImage(multiSelect1);
            // (window as any).ccsdkDebug?console.log('select radio image',checkOptionContainsImage):'';
            if (checkOptionContainsImage
              && (
                ((multiSelect1.length > 0) && multiSelect1[0].includes("Male"))
                || ((multiSelect1.length > 0) && multiSelect1[0].includes("Yes"))
                || ((multiSelect1.length > 1) && multiSelect1[1].includes("Yes")))
              
            ) {
              // (window as any).ccsdkDebug?console.log('select type 2'):'';
              acTemplate = templates.question_checkbox;
              let options2 = self.util.generateCheckboxImageOptions(multiSelect1, question.id);
              // (window as any).ccsdkDebug?console.log(options2):'';
              questionTemplate = acTemplate;
              questionTemplate = questionTemplate.replace(/{{options}}/g, options2);
              acTemplate = questionTemplate;
            }else if(checkOptionContainsImage){
              // (window as any).ccsdkDebug?console.log('select type 2'):'';
              acTemplate = templates.question_checkbox;
              let options2 = self.util.generateCheckboxIgnoreImageOptions(multiSelect1, question.id);
              // (window as any).ccsdkDebug?console.log(options2):'';
              questionTemplate = acTemplate;
              questionTemplate = questionTemplate.replace(/{{options}}/g, options2);
              acTemplate = questionTemplate;
            } else {
              let options3: string = self.util.generateCheckboxOptions(multiSelect1, question.id);
              // (window as any).ccsdkDebug?console.log(options2):'';
              acTemplate = templates.question_checkbox;
              questionTemplate = acTemplate.replace(/{{options}}/g, options3);
              acTemplate = questionTemplate;
            }
          } else {
            // (window as any).ccsdkDebug?console.log('select type 3'):'';
            acTemplate = templates.question_multi_select;

            // acTemplate = templates.question_select;
            let options3 = self.util.generateSelectOptions(multiSelect1);

            if (!self.ccsdk.config.language.includes('Default')) {
              if (
                typeof question.translated !== 'undefined'
                && question.translated != null
                && typeof question.translated[self.ccsdk.config.language] !== 'undefined'
                && question.translated[self.ccsdk.config.language].multiSelect !== 'undefined'
                && question.translated[self.ccsdk.config.language].multiSelect.length > 0
              ) {
                multiSelect1 = Array.prototype.slice.call(question.translated[self.ccsdk.config.language].multiSelect);
                if (question.presentationMode == 'Invert') {
                  multiSelect1.reverse();
                }
                options3 = self.util.generateSelectOptions(multiSelect1);
              }
            }
            // questionTemplate = acTemplate;
            self.ccsdk.debug ? console.log(options3) : '';
            questionTemplate = acTemplate.replace(/{{options}}/g, options3);
            acTemplate = questionTemplate;

          }
          questionTemplate = acTemplate;
          questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
          questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
          questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
          questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");

          break;
        case "Select":
          let acTemplate1: string;
          let acTemplate2: string;
          let options1: string;
          let options2: string;
          let multiSelect;
          //get text question template and compile it.
          multiSelect = Array.prototype.slice.call(LanguageTextFilter.translateMultiSelect(this, question));
          if (question.presentationMode == 'Invert') {
            // console.log('selection option before reverse', multiSelect);
            multiSelect.reverse();
            // console.log('selection option after reverse', multiSelect);
            // console.log('selection api option', question.multiSelect);
          }
          if ((question.displayStyle == 'radiobutton/checkbox') && (multiSelect.length < 6)) {
            // if(question.displayStyle == 'radiobutton/checkbox'){
            // (window as any).ccsdkDebug?console.log('select type 1'):'';
            // (window as any).ccsdkDebug?console.log(question.displayStyle):'';
            // acTemplate1 = templates.question_radio;
            // questionTemplate = acTemplate1;
            let checkOptionContainsImage: boolean = self.util.checkOptionContainsImage(multiSelect);
            // (window as any).ccsdkDebug?console.log('select radio image',checkOptionContainsImage):'';
            if (checkOptionContainsImage 
              && (
                  ((multiSelect.length > 0) && multiSelect[0].includes("Male") )
                || ((multiSelect.length > 0) &&multiSelect[0].includes("Yes") )
                || ((multiSelect.length > 1) &&multiSelect[1].includes("Yes")))
            ) {
              // (window as any).ccsdkDebug?console.log('select type 2'):'';
              acTemplate2 = templates.question_radio_image;
              options2 = self.util.generateRadioImageOptions(multiSelect, question.id);
              // (window as any).ccsdkDebug?console.log(options2):'';
              questionTemplate = acTemplate2;
              questionTemplate = questionTemplate.replace(/{{options}}/g, options2);
            }else if(checkOptionContainsImage){
              // (window as any).ccsdkDebug?console.log('select type 2'):'';
              acTemplate2 = templates.question_radio_image;
              options2 = self.util.generateRadioIgnoreImageOptions(multiSelect, question.id);
              // (window as any).ccsdkDebug?console.log(options2):'';
              questionTemplate = acTemplate2;
              questionTemplate = questionTemplate.replace(/{{options}}/g, options2);
            } else {
              acTemplate1 = templates.question_radio;
              questionTemplate = acTemplate1;
              options1 = self.util.generateRadioOptions(multiSelect, question.id);
              questionTemplate = questionTemplate.replace("{{options}}", options1);
            }
          } else if ((question.displayStyle == 'icon') && (multiSelect.length < 6)) {
            acTemplate1 = templates.question_radio;
            questionTemplate = acTemplate1;
            options1 = self.util.generateRadioOptions(multiSelect, question.id);
            questionTemplate = questionTemplate.replace("{{options}}", options1);

          } else {

            // (window as any).ccsdkDebug?console.log('select type 3'):'';
            acTemplate1 = templates.question_select;
            options1 = self.util.generateSelectOptions(multiSelect);
            if (!self.ccsdk.config.language.includes('Default')) {
              if (typeof question.translated !== 'undefined'
                && question.translated != null
                && typeof question.translated[self.ccsdk.config.language] !== 'undefined'
                && question.translated[self.ccsdk.config.language].multiSelect !== 'undefined'
                && question.translated[self.ccsdk.config.language].multiSelect.length > 0
              ) {
                multiSelect = Array.prototype.slice.call(question.translated[self.ccsdk.config.language].multiSelect);
                if (question.presentationMode == 'Invert') {
                  multiSelect.reverse();
                }
                options1 = self.util.generateSelectOptions(multiSelect);
              }
            }
            questionTemplate = acTemplate1;
            questionTemplate = questionTemplate.replace("{{options}}", options1);


          }
          questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
          questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
          questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
          questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
          // (window as any).ccsdkDebug?console.log(questionTemplate):'';

          break;
        case "Smile-5":
          //get text question template and compile it.
          if (question.presentationMode == "Invert") {
            questionTemplate = templates.question_smile_5_inverted;

          } else {

            questionTemplate = templates.question_smile_5;
          }
          // let startRangeLabel = "Very unlikely";
          // let endRangeLabel = "Very likely";
          let startRangeLabel = "";
          let endRangeLabel = "";
          let displayLegend2 = LanguageTextFilter.translateDisplayLegend(this, question);
          
          if (displayLegend2) {
            if (displayLegend2.length > 0) {
              startRangeLabel = displayLegend2[0] ? displayLegend2[0] : null;
              endRangeLabel = displayLegend2[1] ? displayLegend2[1] : null;
            }
          }
          startRangeLabel = startRangeLabel == null ? "" : startRangeLabel;
          endRangeLabel = endRangeLabel == null ? "" : endRangeLabel;
          questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
          questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
          questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
          questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
          questionTemplate = questionTemplate.replace("{{leftLabel}}", startRangeLabel);
          questionTemplate = questionTemplate.replace("{{rightLabel}}", endRangeLabel);
          break;
        case "Star-5":
          //get text question template and compile it.
          let startRangeLabel1 = "";
          let endRangeLabel1 = "";
          let displayLegend3 = LanguageTextFilter.translateDisplayLegend(this, question);
          
          if (displayLegend3) {
            if (displayLegend3.length > 0) {
              startRangeLabel1 = displayLegend3[0] ? displayLegend3[0] : null;
              endRangeLabel1 = displayLegend3[1] ? displayLegend3[1] : null;
            }
          }
          startRangeLabel1 = startRangeLabel1 == null ? "" : startRangeLabel1;
          endRangeLabel1 = endRangeLabel1 == null ? "" : endRangeLabel1;
          questionTemplate = templates.question_star_5;
          questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
          questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
          questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
          questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
          questionTemplate = questionTemplate.replace("{{leftLabel}}", startRangeLabel1);
          questionTemplate = questionTemplate.replace("{{rightLabel}}", endRangeLabel1);
          break;
      }
    }
    return questionTemplate;
  }

  questionCompare(a: any, b: any) {
    return a.sequence - b.sequence;
  }
  
  getAnswerTypeFromDisplayType(displayType: string) {
    // console.log('question type',displayType);
    let type: string;
    switch (displayType) {
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
      case "Smile-5":
        type = "number";
        break;
      case "Star-5":
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
    for (let question of this.questions) {
      if (!question.isRetired) {
        //filter out prefill question only if it is filled?.
        // if(!this.isQuestionFilled(question)){
        if (this.isPrefillTags(question)) {
          self.ccsdk.debug ? console.log(this.prefillResponses) : '';
          continue;
        }
        if (this.isPrefillNote(question)){
          self.ccsdk.debug ? console.log(this.prefillResponses) : '';
          continue;
        }
        if (this.isPrefillDirect(question)) {
          self.ccsdk.debug ? console.log(this.prefillResponses) : '';
          continue;
        }
        if (!(this.isPrefillQuestion(question))) {

          // if (this.isPrefillTags(question)) {
          //   self.ccsdk.debug ? console.log(this.prefillResponses) : '';
          //   continue;
          // }
          if (
            question.conditionalFilter != null &&
            (question.conditionalFilter.filterquestions == null
              || question.conditionalFilter.filterquestions.length == 0)
          ) {
            //check supported display types
            let supportedDisplayTypes = "Slider, Scale, Text, Number, MultilineText, MultiSelect, Smile-5, Star-5";
            if(supportedDisplayTypes.indexOf(question.displayType) > -1){
              this.questionsToDisplay.push(question);
            }
          } else {
            //if conditions full filled, fill it in questionsToDisplay
            if(ConditionalFlowFilter.filterQuestion(this, question)) {
               //auto does that
            } else {
              this.conditionalQuestions.push(question);
            }
          }
        } else {
          this.fillPrefillWithTags(question);
          this.fillPrefillWithNote(question);
          ConditionalFlowFilter.filterQuestion(this, question);
        }
        // }
      }
    }
    //re condition questions.
    for(let question of this.questions) {
      ConditionalFlowFilter.filterQuestion(this, question);
    }

    // console.log(this.conditionalQuestions);
  }

  isPrefillTags(question: any) {
    if (typeof question.questionTags !== 'undefined' && question.questionTags.length > 0) {
      for (let tag of question.questionTags) {        
        switch (tag.toLowerCase()) {
          case "screensize":
            //add size to prefill array
            this.fillPrefillQuestion(question.id, "Width:" + window.innerWidth + "px / Height:" + window.innerHeight + "px", "text");
            return true;
        }
      }
    }
    return false;
  }
  isPrefillNote(question:any){
    if (typeof question.note !== 'undefined' 
    && question.note != null 
    && question.note.length > 0
    && this.prefillWithNote[question.note.toLowerCase()]
  ) {
      let type = this.getAnswerTypeFromDisplayType(question.displayType);
      this.fillPrefillQuestion(question.id, this.prefillWithNote[question.note.toLowerCase()] ,type);
      return true;
    }
    return false;
  }

  isPrefillDirect(question: any) {
    if (typeof question !== 'undefined'
      && this.prefillDirect[question.id]
    ) {
      let type = this.getAnswerTypeFromDisplayType(question.displayType);
      this.fillPrefillQuestion(question.id, this.prefillDirect[question.id], type);
      return true;
    }
    return false;
  }

  fillPrefillWithTags(question: any) {
    // console.log(this.prefillWithTags);
    if (typeof question.questionTags !== 'undefined' && question.questionTags.length > 0) {
      for (let tag of question.questionTags) {
        if (typeof this.prefillWithTags[tag.toLowerCase()] !== 'undefined') {     
          let type = this.getAnswerTypeFromDisplayType(question.displayType);
          this.fillPrefillQuestion(question.id, this.prefillWithTags[tag.toLowerCase()], type);
        }
      }
    }
  }

  fillPrefillWithNote(question: any){
    if (typeof question.note !== 'undefined' && question.note!= null && question.note.length > 0) {
        if (typeof this.prefillWithNote[question.note.toLowerCase()] !== 'undefined') {
          let type = this.getAnswerTypeFromDisplayType(question.displayType);
          this.fillPrefillQuestion(question.id, this.prefillWithNote[question.note.toLowerCase()], type);
        }
    }
  }



  getConditionalSurveyQuestions(): any {
    return this.conditionalQuestions;
  }

  isPrefillQuestion(question: any) {
    if (question.apiFill == true) {
      return true;
    }
    if (question.staffFill == true) {
      return true;
    }
    return false;
  }

  isQuestionFilled(question: any) {
    for (let response of this.prefillResponses) {
      if (response.questionId == question.questionId) {
        return true;
      }
    }
    return false;
  }

  destroySurvey() {
    let self: SurveyHandler = this;
    document.addEventListener('ccclose', this.destroySurveyCb);
  }

  destroy() {
    let surveyContainer = this.ccsdk.dom.getSurveyContainer(this.surveyToken);
    let welcomeContainer = this.ccsdk.dom.getWelcomeContainer(this.surveyToken);
    if (typeof surveyContainer != 'undefined') {
      this.util.remove(surveyContainer);
    }
    if (typeof welcomeContainer != 'undefined') {
      this.util.remove(welcomeContainer);
    }
    document.removeEventListener('ccclose', this.destroySurveyCb);
    document.removeEventListener('ccdone', this.displayThankYouCb);
    document.removeEventListener('q-answered', this.acceptAnswersCb);
    (window as any).globalSurveyRunning = false;
    let bodyElement = <HTMLElement>document.
      getElementsByTagName("body")[0];
    this.util.removeClass(bodyElement, "blurr");

  }
}

export { SurveyHandler };
