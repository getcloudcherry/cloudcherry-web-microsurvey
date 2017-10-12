// import 'whatwg-fetch';
import { Config } from "./Config";
import { DisplayConfig } from "./interfaces/DisplayConfig";
import { RequestHelper } from './helpers/Request';
import { templates } from "./helpers/Templates";
import { DomUtilities } from "./helpers/dom/DomUtilities";
import { DomSurvey } from "./helpers/dom/DomSurvey";
import { ConditionalTextFilter } from "./helpers/filters/ConditionalTextFilter";
import { Constants } from "./Constants";

class SurveyHandler {
  surveyToken : string;
  surveyData : any;
  questions : any;
  prefillQuestions : any;
  questionsToDisplay : any;
  randomNumber : Number;
  welcomeQuestion : any;
  welcomeQuestionButtonText : any;
  prefillResponses : any;
  questionResponses : any;
  answers : any = {};
  surveyAnswers : any = {};
  util : DomUtilities;
  dom : DomSurvey;
  displayThankYouCb : any;
  destroySurveyCb : any;
  acceptAnswersCb : any;
  surveyDisplay : DisplayConfig; 
  currentQuestion : any;
  conditionalQuestions : any;
  ccsdk : any;
  // isPartialAvailable : Boolean;

  constructor(ccsdk) {
    this.surveyToken = ccsdk.surveyToken;
    this.surveyData = {};
    this.surveyDisplay = {
      'position' : '',
      'surveyPosition' : '',
      'welcomePopupAnimation' : '',
      'surveyPopupAnimation' : '',
    };
    this.ccsdk = ccsdk;
    this.questions = [];
    this.questionsToDisplay = [];
    this.prefillQuestions = [];
    this.conditionalQuestions = [];
    this.answers = {};
    this.util = new DomUtilities();
    this.dom = ccsdk.dom;
    this.displayThankYouCb = ( e : any) => {
      let thankyouHtml : any = templates.thankyou;
      thankyouHtml = thankyouHtml.replace("{{question}}", this.surveyData.thankyouText);
      thankyouHtml = thankyouHtml.replace("{{button}}", 'Start');
      this.ccsdk.dom.replaceInQuestionsContainer(thankyouHtml);
      //TODO : Fix this Add class not working???
      let thankyouContainer : any =  this.util.get("#cc-thankyou-container");
      console.log(thankyouContainer);
      this.util.addClass(thankyouContainer[0], 'show-thankyou-slide');
      let onSurveyEndEvent = new CustomEvent(Constants.SURVEY_END_EVENT + "-" + this.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyEndEvent);
    }
    this.destroySurveyCb = ( e : any ) => {
        let self : SurveyHandler = this;
        //send end survey event.
        let onSurveyEndEvent = new CustomEvent(Constants.SURVEY_END_EVENT + "-" + this.ccsdk.surveyToken);
        document.dispatchEvent(onSurveyEndEvent);
        self.destroy();
    }

    this.acceptAnswersCb = ( e : any ) => {
        let self : SurveyHandler = this;
        // console.log(self);
        // console.log('question answered',e)
          let data : any = <any>e.detail;
          let response : any = {};
          response.questionId = data.questionId;
          switch(data.type){
            case 'scale':
              response.text = null;
              response.number = Number(data.data.number);
              self.postPartialAnswer( data.index, response);
              self.ccsdk.dom.domSelectElements();
              // self.ccsdk.dom.nextQuestion();
            break;
            case 'nps':
            response.text = null;
            response.number = Number(data.data.number);
            self.postPartialAnswer( data.index, response);
            self.ccsdk.dom.domSelectElements();
            // self.ccsdk.dom.nextQuestion();
            break;
            case 'radio':
            response.text = null;
            response.number = Number(data.data.number);
            self.postPartialAnswer( data.index, response);
            self.ccsdk.dom.domSelectElements();
            // self.ccsdk.dom.nextQuestion();
            break;
            case 'radioImage':
            response.text = data.data.text;
            response.number = null;
            self.postPartialAnswer( data.index, response);
            self.ccsdk.dom.domSelectElements();
            // self.ccsdk.dom.nextQuestion();
            break;
            case 'smile':
              response.text = null;
              response.number = Number(data.data.number);
              self.postPartialAnswer( data.index, response);
              self.ccsdk.dom.domSelectElements();
              // self.ccsdk.dom.nextQuestion();
            break;
            case 'star':
              response.text = null;
              response.number = Number(data.data.number);
              self.postPartialAnswer( data.index, response);
              self.ccsdk.dom.domSelectElements();
              // self.ccsdk.dom.nextQuestion();
            break;
            case 'multiline':
              response.text = data.data.text;
              response.number = null;
              // console.log(data);
              self.postPartialAnswer( data.index, response);
              self.ccsdk.dom.domSelectElements();
              self.ccsdk.dom.setQIndex(data.index);
              // self.ccsdk.dom.nextQuestion();
            break;
            case 'singleline':
              response.text = data.data.text;
              response.number = null;
              // console.log(data);
              self.postPartialAnswer( data.index, response);
              self.ccsdk.dom.domSelectElements();
              self.ccsdk.dom.setQIndex(data.index);
              // self.ccsdk.dom.nextQuestion();
            break;
            case 'number':
            response.text = null;
            response.number = Number(data.data.number);
            // console.log(data);
            self.postPartialAnswer( data.index, response);
            self.ccsdk.dom.domSelectElements();
            self.ccsdk.dom.setQIndex(data.index);
            // self.ccsdk.dom.nextQuestion();
          break;
            case 'checkbox':
              response.text = data.data.text;
              response.number = null;
              // console.log(data);
              self.postPartialAnswer( data.index, response);
              self.ccsdk.dom.domSelectElements();
              self.ccsdk.dom.setQIndex(data.index);
              // self.ccsdk.dom.nextQuestion();
            break;
            case 'select':
              response.text = data.data.text;
              response.number = null;
              // console.log(data);
              self.postPartialAnswer( data.index, response);
              self.ccsdk.dom.domSelectElements();
              self.ccsdk.dom.setQIndex(data.index);
              // self.ccsdk.dom.nextQuestion();
            break;
            case 'slider':
              response.text = data.data.text;
              response.number = Number(data.data.number);
              // console.log(data);
              self.postPartialAnswer( data.index, response);
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
    // console.log(data);
    return data;
    // this.surveyData = data.then(function();
    // console.log(this.surveyData);
  }

  removeAnswer(questionId) {
    delete this.answers[questionId];
    delete this.surveyAnswers[questionId];
  }

  attachSurvey(surveyData : any){
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

  setupSurveyContainer(){
    let surveyHtml : any = templates.question_survey;
    surveyHtml = surveyHtml.replace("{{surveyToken}}", this.surveyToken);
    surveyHtml = surveyHtml.replace("{{animation}}", this.surveyDisplay.surveyPopupAnimation);
    surveyHtml = surveyHtml.replace(/{{location}}/g, this.surveyDisplay.surveyPosition);
    this.ccsdk.dom.appendInBody(surveyHtml);
  }

  displayWelcomeQuestion() {
    let welcomeHtml : any = templates.question_start;
    welcomeHtml = welcomeHtml.replace("{{surveyToken}}", this.surveyToken);
    welcomeHtml = welcomeHtml.replace("{{question}}", this.surveyData.welcomeText);
    welcomeHtml = welcomeHtml.replace("{{button}}", 'Start');
    welcomeHtml = welcomeHtml.replace("{{location}}", this.surveyDisplay.position );
    welcomeHtml = welcomeHtml.replace("{{animation}}", this.surveyDisplay.welcomePopupAnimation );
    // console.log("Appending in body");
    this.ccsdk.dom.appendInBody(welcomeHtml);
    this.ccsdk.dom.showWelcomeContainer();
    this.acceptAnswers();
  }

  displayThankYou() {
    let self : SurveyHandler = this;
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
    let ccSurvey : any;
    ccSurvey = document.getElementsByClassName("cc-questions-container");
    // ccSurvey = ccSurvey[0];
    let surveyObject = ccSurvey[0];
    // console.log(this.questionsToDisplay);
    //chec
    //for now just do 1st question.
    for(let question of this.questionsToDisplay) {
      if(this.checkConditionals(question)) {
        let compiledTemplate = this.compileTemplate(question);
        question.compiledTemplate = compiledTemplate;
        // surveyObject.innerHTML += compiledTemplate;
        //register handlers for onclick?
      } else {
        if(this.isPrefillQuestion(question)) {
          this.prefillQuestions.push(question);
        }
      }
      //else don't display it.
    }
    // console.log(surveyObject.innerHTML);
    // this.postPartialAnswer(this.questionsToDisplay[0], "test");

  }

  getSurveyQuestions() : any {
    return this.questionsToDisplay;
  }

  getAnswerForQuestionId(questionId : string) {
    return this.surveyAnswers[questionId];
  }

  acceptAnswers(){
    let self : SurveyHandler = this;
    // console.log('add question answered listener')
    document.addEventListener('q-answered', this.acceptAnswersCb);
  }

  fillPrefillQuestionObject(id : any, response : any) {
    let question : any = this.getQuestionById(id);
    let responseStored = this.getPrefillResponseById(id);
    if(responseStored != null) {
      this.updatePrefillResponseById(id, response);
    } else {
      this.prefillResponses.push(response)
    }
  }

  fillPrefillQuestion(id : any, value : any, valueType : string) {
    let question : any = this.getQuestionById(id);
    let response : any;
    let responseStored = this.getPrefillResponseById(id);
    if(responseStored != null) {
      response = responseStored;
    } else {
      response = {
        questionId : question.id,
        questionText : question.text,
        textInput : null,
        numberInput : null
      };
    }
    if(valueType.toLowerCase() == "number") {
      response.numberInput = value;
    }
    if(valueType.toLowerCase() == "text") {
      response.textInput = value;
    }
    if(responseStored != null) {
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
    return RequestHelper.post(surveyPartialUrl, this.prefillResponses);
  }

  updatePrefillResponseById(id : any, resp : any) {
    for(let response of this.prefillResponses) {
      if(response.questionId == id) {
        response = resp;
      }
    }
  }

  getPrefillResponseById(id : any) {
    for(let response of this.prefillResponses) {
      if(response.questionId == id) {
        return response;
      }
    }
    return null;
  }

  getQuestionById(id : any) {
    for(let question of this.questions) {
      if(question.id == id) {
        return question;
      }
    }
  }

  postPartialAnswer(index : any, response : any) {
    // let data = new FormData();
    //in case of file.
    // let input = document.querySelector('input[type="file"]') ;
    // data.append('file', input.files[0]);
    let question : any = this.questionsToDisplay[index];
    if(typeof question === 'undefined') {
      //now?
      // return console.log("No Partial Remaining");
    }
    let data : any = {
      comparator : 0,
      questionId : question.id,
      questionText : question.text,
      textInput : response.text,
      numberInput : response.number
    };
    // if(this.isPartialAvailable == false) {
    //   this.answers.push(data);
    //   return;
    // }
    // console.log("Submitting for : " + index);
    let surveyPartialUrl = Config.SURVEY_PARTIAL_RESPONSE.replace("{id}", this.surveyData.partialResponseId);
    //if this is the last of displayed question
    console.log("partial response",question.id == this.questionsToDisplay[this.questionsToDisplay.length - 1].id);
    if(question.id == this.questionsToDisplay[this.questionsToDisplay.length - 1].id) {
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
    return RequestHelper.post(surveyPartialUrl, data);

  }

  /**
   *
   * check if conditions are satsified which are required to display question?
   *
   * @param {any} question
   * @memberof Survey
   */
  checkConditionals(question : any) {
    return true;
  }

  compileTemplate(question : any) {
    let self : SurveyHandler = this;
    //get question type
    let questionTemplate;
    // console.log(question);

    switch(question.displayType) {
      case "Slider":
        let opt : any = question.multiSelect[0].split("-");
        let optMin : any = opt[0].split(";");
        let optMax : any = opt[1].split(";");
        //get text question template and compile it.
        questionTemplate = templates.question_slider;
        questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
        questionTemplate = questionTemplate.replace(/{{min}}/g, optMin[0]);
        if(optMin[1]){
          questionTemplate = questionTemplate.replace(/{{minLabel}}/g, optMin[1]+"-");
        }else{
          questionTemplate = questionTemplate.replace(/{{minLabel}}/g, "");
        }
        questionTemplate = questionTemplate.replace(/{{max}}/g, optMax[0]);
        if(optMax[1]){
          questionTemplate = questionTemplate.replace(/{{maxLabel}}/g, optMax[1]+"-");
        }else{
          questionTemplate = questionTemplate.replace(/{{maxLabel}}/g, "");
        }
        questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id"+question.id);
        questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
        questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
      break;
      case "Scale":
        //get text question template and compile it.
        if(question.questionTags.includes("NPS")) {
          questionTemplate = templates.question_nps;
          questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
          questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id"+question.id);
          questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
          questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
        } else {
          questionTemplate = templates.question_scale;
          questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
          questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id"+question.id);
          questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
          questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
          //construct NPS scale here....
          let startRange = 0.0;
          let endRange = 10.0;
          let options = "";
          if(question.multiSelect.length > 0) {
            startRange = parseFloat(question.multiSelect[0].split("-")[0]);
            endRange = parseFloat(question.multiSelect[0].split("-")[1]);
          }
          let divider : any = 1;            
          if(endRange < 11){
          }else{
            divider = (endRange - startRange) / 10.0;
          }
          let initial = 0.0;
          for(let initial = startRange ; initial <= endRange ; initial += divider) {
            options += '<span data-rating="'+ initial + '" class="option-number-item option-scale">' + initial + '</span>';
          }
          questionTemplate = questionTemplate.replace("{{optionsRange}}", options);
        }

      break;
      case "Text":
        //get text question template and compile it.
        questionTemplate = templates.question_text;
        questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
        questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id"+question.id);
        questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
        questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");

      break;
      case "Number":
      //get text question template and compile it.
      questionTemplate = templates.question_number;
      questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
      questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id"+question.id);
      questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
      questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");

    break;
      case "MultilineText":
        //get text question template and compile it.
        questionTemplate = templates.question_multi_line_text;
        questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
        questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id"+question.id);
        questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
        questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");

      break;
      case "MultiSelect":
        let acTemplate : string ;
        //get text question template and compile it.
        if(question.displayStyle == 'radiobutton/checkbox'){
          // console.log(question.displayStyle);
          let options3 : string = self.util.generateCheckboxOptions(question.multiSelect, question.id);
          // console.log(options2);
          acTemplate = templates.question_checkbox;
          questionTemplate = acTemplate.replace(/{{options}}/g, options3);
          acTemplate = questionTemplate;
        }else{
           acTemplate = templates.question_multi_select;
        }
        questionTemplate = acTemplate;
        questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
        questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id"+question.id);
        questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
        questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");

      break;
      case "Select":
      let acTemplate1 : string ;
        let acTemplate2 : string ;
        let options1 : string ;
        let options2 : string ;
        //get text question template and compile it.
        if(question.displayStyle == 'radiobutton/checkbox'){
          // console.log('select type 1');
          // console.log(question.displayStyle);
          acTemplate1 = templates.question_radio;
          questionTemplate = acTemplate1;
        }else{
          let checkOptionContainsImage : boolean = self.util.checkOptionContainsImage(question.multiSelect);
          // console.log('select radio image',checkOptionContainsImage);
          if(checkOptionContainsImage){
            // console.log('select type 2');
            acTemplate2 = templates.question_radio_image;
            options2 = self.util.generateRadioImageOptions(question.multiSelect, question.id);
            // console.log(options2);
            questionTemplate = acTemplate2;
            questionTemplate = questionTemplate.replace(/{{options}}/g, options2);
          }else{
            // console.log('select type 3');
            acTemplate1 = templates.question_select;
            options1 = self.util.generateSelectOptions(question.multiSelect);
            questionTemplate = acTemplate1;
            questionTemplate = questionTemplate.replace("{{options}}", options1);
          }

        }
        questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
        questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id"+question.id);
        questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
        questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
        // console.log(questionTemplate);

      break;
      case "Smile-5":
        //get text question template and compile it.
        questionTemplate = templates.question_smile_5;
        questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
        questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id"+question.id);
        questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
        questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
      break;
      case "Star-5":
        //get text question template and compile it.
        questionTemplate = templates.question_star_5;
        questionTemplate = questionTemplate.replace("{{question}}", ConditionalTextFilter.filterText(this, question));
        questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id"+question.id);
        questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
        questionTemplate = questionTemplate.replace("{{requiredLabel}}", question.isRequired ? "*" : "");
      break;
    }
    return questionTemplate;
  }

  questionCompare(a : any, b : any) {
    return a.sequence - b.sequence;
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
    for(let question of this.questions) {
      if(!question.isRetired) {
        //filter out prefill question only if it is filled?.
        if(!this.isQuestionFilled(question)){
          if( !(this.isPrefillQuestion(question))) {
            if(
              question.conditionalFilter != null && 
              ( question.conditionalFilter.filterquestions == null
              || question.conditionalFilter.filterquestions.length == 0)
            ) {
              this.questionsToDisplay.push(question);
            } else {
              this.conditionalQuestions.push(question);
            }
          }
        }
      }
    }
  }

  getConditionalSurveyQuestions() : any {
    return this.conditionalQuestions;
  }

  isPrefillQuestion(question : any) {
    if(question.apiFill == true) {
      return true;
    }
    if(question.staffFill == true) {
      return true;
    }
    return false;
  }

  isQuestionFilled(question : any) {
    for(let response of this.prefillResponses) {
      if(response.questionId == question.questionId) {
        return true;
      }
    }
    return false;
  }

  destroySurvey(){
    let self : SurveyHandler = this;
    document.addEventListener('ccclose', this.destroySurveyCb);
  }

  destroy(){
    let surveyContainer = this.ccsdk.dom.getSurveyContainer(this.surveyToken);
    let welcomeContainer = this.ccsdk.dom.getWelcomeContainer(this.surveyToken);
    this.util.remove(surveyContainer);
    this.util.remove(welcomeContainer);
    document.removeEventListener('ccclose', this.destroySurveyCb);
    document.removeEventListener('ccdone', this.displayThankYouCb);
    document.removeEventListener('q-answered', this.acceptAnswersCb);
    (window as any).globalSurveyRunning = false;
  }
}

export { SurveyHandler };
