import { SurveyHandler } from "./SurveyHandler";


/**
 * functions that are exposed to SDK User are written here.
 * Entry point for CCSDK.
 */

// class CCSDKEntry {
//   async init(surveyToken : String) {
//     let survey = new SurveyHandler(surveyToken);
//     let surveyJson = await survey.fetchQuestions();
//     console.log(surveyJson);
//     survey.displayQuestions();
//   }
// }

// export { CCSDKEntry };


let CCSDKEntry = function() {

};

CCSDKEntry.survey = '';

CCSDKEntry.prototype.init = async function(surveyToken) {
  let survey = new SurveyHandler(surveyToken);
  CCSDKEntry.survey = survey;
  let surveyJson = await survey.fetchQuestions();
  console.log(surveyJson);
  survey.displayQuestions();
}

CCSDKEntry.prototype.trigger = function(type, target){
  console.log('in trigger');
  document.getElementById("anywhere").addEventListener('click',function(){
    console.log('click trigger');
    CCSDKEntry.survey.displayWelcomeQuestion();
  });
}

export { CCSDKEntry };
