// import 'whatwg-fetch';
import { Config } from "./Config";
import { RequestHelper } from './helpers/Request';
import { templates } from "./helpers/Templates";
import { DomUtilities } from "./helpers/dom/DomUtilities";

// console.log($);
// console.log($);
class SurveyHandler {
  surveyToken : String;
  surveyData : any;
  questions : any;
  prefillQuestions : any;
  questionsToDisplay : any;
  randomNumber : Number;
  welcomeQuestion : any;
  welcomeQuestionButtonText : any;
  prefillResponses : any;
  questionResponses : any;
  answers : any;
  util : DomUtilities;
  // isPartialAvailable : Boolean;

  constructor(surveyToken : String) {
    this.surveyToken = surveyToken;
    this.surveyData = {};
    this.questions = [];
    this.questionsToDisplay = [];
    this.prefillQuestions = [];
    this.answers = [];
    this.util = new DomUtilities();
  }

  fetchQuestions() {
    this.randomNumber = parseInt((String)(Math.random() * 1000));
    let surveyUrl = Config.SURVEY_BY_TOKEN.replace("{token}", "" + this.surveyToken);
    surveyUrl = surveyUrl.replace("{tabletId}", "" + this.randomNumber);
    surveyUrl = Config.API_URL + surveyUrl;
    let data = RequestHelper.get(surveyUrl);
    console.log(data);
    return data;
    // this.surveyData = data.then(function();
    // console.log(this.surveyData);
  }

  setupSurveyContainer(){
    document.querySelectorAll("body")[0].insertAdjacentHTML(
      'afterbegin', templates.question_survey
    );
  }

  displayWelcomeQuestion() {
     document.querySelectorAll("body")[0].insertAdjacentHTML(
       'afterbegin', templates.question_start
     );
     let startContainer = <HTMLElement>document.querySelectorAll(".act-cc-welcome-question-box")[0];
      this.util.addClass(startContainer, "show");
  }

  displayQuestions() {
    //check question is supported, based on question types.
    //filter pre fill questions.
    this.questions = this.surveyData.questions;
    this.questionsToDisplay = (this.surveyData.questions as any[]).filter(this.filterQuestions);
    //sort questions and display them?
    this.questionsToDisplay = this.questionsToDisplay.sort(this.questionCompare);
    let ccSurvey : any;
    ccSurvey = document.getElementsByClassName("cc-questions-container");
    // ccSurvey = ccSurvey[0];
    let surveyObject = ccSurvey[0];

    //chec
    //for now just do 1st question.
    for(let question of this.questionsToDisplay) {
      if(this.checkConditionals(question)) {
        let compiledTemplate = this.compileTemplate(question);
        surveyObject.innerHTML += compiledTemplate;
        //register handlers for onclick?
      } else {
        if(this.isPrefillQuestion(question)) {
          this.prefillQuestions.push(question);
        }
      }
      //else don't display it.
    }
    // this.postPartialAnswer(this.questionsToDisplay[0], "test");

  }

  fillPrefillQuestion(id : any, value : any, valueType : String) {
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
    // console.log(await result);
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
    // var input = document.querySelector('input[type="file"]') ;
    // data.append('file', input.files[0]);
    let question : any = this.questionsToDisplay[index];
    if(typeof question === 'undefined') {
      //now?
      return console.log("No Partial Remaining");
    }
    let data : any = {
      questionId : question.id,
      questionText : question.text,
      textInput : null,
      numberInput : 5
    };
    // if(this.isPartialAvailable == false) {
    //   this.answers.push(data);
    //   return;
    // }
    console.log("Submitting for : " + index);
    let surveyPartialUrl = Config.SURVEY_PARTIAL_RESPONSE.replace("{id}", this.surveyData.partialResponseId);
    //if this is the last of displayed question
    if(question.id == this.questionsToDisplay[this.questionsToDisplay.length - 1].id) {
      surveyPartialUrl = surveyPartialUrl.replace("{complete}", "true");
    } else {
      surveyPartialUrl = surveyPartialUrl.replace("{complete}", "false");
    }
    surveyPartialUrl = surveyPartialUrl.replace("{tabletId}", "" + this.randomNumber);
    surveyPartialUrl = Config.API_URL + surveyPartialUrl;
    //add partial answer to main answer
    this.answers.push(data);

    data = [data];
    // let result = RequestHelper.post(surveyPartialUrl, "[" + JSON.stringify(data) + "]");
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
    //get question type
    let questionTemplate;
    console.log(question);

    switch(question.displayType) {
      case "Scale":
        //get text question template and compile it.
        questionTemplate = templates.question_scale;
        questionTemplate = questionTemplate.replace("{{question}}", question.text);
        questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");
      break;
      case "Text":
        //get text question template and compile it.
        questionTemplate = templates.question_text;
        questionTemplate = questionTemplate.replace("{{question}}", question.text);
        questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");

      break;
      case "MultilineText":
        //get text question template and compile it.
        questionTemplate = templates.question_multi_line_text;
        questionTemplate = questionTemplate.replace("{{question}}", question.text);
        questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");

      break;
      case "MultiSelect":
        //get text question template and compile it.
        questionTemplate = templates.question_multi_select;
        questionTemplate = questionTemplate.replace("{{question}}", question.text);
        questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");

      break;
      case "Select":
        //get text question template and compile it.
        questionTemplate = templates.question_select;
        questionTemplate = questionTemplate.replace("{{question}}", question.text);
        questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");

      break;
      case "Smile-5":
        //get text question template and compile it.
        questionTemplate = templates.question_smile_5;
        questionTemplate = questionTemplate.replace("{{question}}", question.text);
        questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");
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
  filterQuestions(question : any) {
    if(question.apiFill == true) {
      return false;
    }
    if(question.staffFill == true) {
      return false;
    }
    if(question.isRetired == true) {
      return false;
    }
    return true;
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
}

export { SurveyHandler };
