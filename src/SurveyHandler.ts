// import 'whatwg-fetch';
import config from "./config";
import { RequestHelper } from './helpers/Request';
import { templates } from "./helpers/Templates";

// console.log($);
// console.log($);
class SurveyHandler {
  surveyToken : String;
  surveyData : any;
  questions : any;
  questionsToDisplay : any;
  randomNumber : Number;
  welcomeQuestion : any;
  welcomeQuestionButtonText : any;

  constructor(surveyToken : String) {
    this.surveyToken = surveyToken;
    this.surveyData = {};
    this.questions = [];
    this.questionsToDisplay = [];
  }

  async fetchQuestions() {
    this.randomNumber = parseInt((String)(Math.random() * 1000));
    let surveyUrl = config.SURVEY_BY_TOKEN.replace("{token}", "" + this.surveyToken);
    surveyUrl = surveyUrl.replace("{tabletId}", "" + this.randomNumber);
    surveyUrl = config.API_URL + surveyUrl;
    let data = await RequestHelper.get(surveyUrl);
    this.surveyData = await data;
    // console.log(this.surveyData);
    return this.surveyData;
  }

  async postPartial(response : any) {

  }

  displayWelcomeQuestion() {
    $("#cc-welcome-question-box").addClass('show');
  }

  displayQuestions() {
    //check question is supported, based on question types.
    //filter pre fill questions.
    this.questions = this.surveyData.questions;
    this.questionsToDisplay = this.surveyData.questions.filter(this.filterQuestions);
    //sort questions and display them?
    this.questionsToDisplay = this.questionsToDisplay.sort(this.questionCompare);
    let ccSurvey : any;
    ccSurvey = document.getElementsByClassName("cc-survey-content");
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

      }
      //else don't display it.
    }
    // this.postPartialAnswer(this.questionsToDisplay[0], "test");

  }

  async postPartialAnswer(question : any, response : any) {
    // let data = new FormData();
    //in case of file.
    // var input = document.querySelector('input[type="file"]') ;
    // data.append('file', input.files[0]);
    let surveyPartialUrl = config.SURVEY_PARTIAL_RESPONSE.replace("{id}", this.surveyData.partialResponseId);
    surveyPartialUrl = surveyPartialUrl.replace("{complete}", "false");
    surveyPartialUrl = surveyPartialUrl.replace("{tabletId}", "" + this.randomNumber);
    surveyPartialUrl = config.API_URL + surveyPartialUrl;
    let data : any = {
        questionId : question.id,
        questionText : question.text,
        textInput : "yolo!?",
        numberInput : 5
    };
    console.log(JSON.stringify(data));
    let result = RequestHelper.post(surveyPartialUrl, data);
    console.log(result);

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
}

export { SurveyHandler };
