import { isArray } from "util";
import { LanguageTextFilter } from "./LanguageTextFilter";
import { isAnd, isOr, doesSatisfy, questionCompare } from "./filter-utils";

class ConditionalFlowFilter {
  public static filterQuestion(surveyHandler: any, question: any) {
    let aAddedCount = 0;
    let aRemovedCount = 0;

    if (surveyHandler.getAnswerForQuestionId(question.id) != null) {
      for (let aQuestion of surveyHandler.getConditionalSurveyQuestions()) {
        // console.log( aQuestion );
        if (aQuestion.conditionalFilter != null) {
          // let iSatisfied = false;
          // let iFailed = false;
          // for ( let aFilterByQuestion of aQuestion.conditionalFilter.filterquestions ) {
          //   if ( isAnd( aFilterByQuestion ) ) {
          //     if ( doesSatisfy( surveyHandler, aFilterByQuestion ) && !iFailed ) {
          //       iSatisfied = true;
          //     } else {
          //       iFailed = true;
          //       break;
          //     }
          //   } else if ( isOr( aFilterByQuestion ) ) {
          //     if ( doesSatisfy( surveyHandler, aFilterByQuestion ) ) {
          //       iSatisfied = true;
          //       break;
          //     }
          //   }
          // }
          const surveyQuestions = surveyHandler.getSurveyQuestions();
          if (doesSatisfy(surveyHandler, question)) {
            if (surveyQuestions.indexOf(aQuestion) === -1) {
              surveyQuestions.push(aQuestion);
              aAddedCount++;
            }
          } else {
            if (surveyQuestions.indexOf(aQuestion) !== -1) {
              aRemovedCount++;
              surveyQuestions.splice(surveyQuestions.indexOf(aQuestion), 1);
              // surveyHandler.removePartial(aQuestion.id);
              //removing from partial requires not posting partial after each question rather than posting them all at once.
              surveyHandler.removeAnswer(aQuestion.id);
            }
          }
        }
      }
    }
    if (aAddedCount > 0 || aRemovedCount > 0) {
      surveyHandler.getSurveyQuestions().sort(questionCompare);
      // surveyHandler.sendConditionalFLowQuestionsData(surveyHandler.getSurveyQuestions().size());
      return true;
    } else {
      // return false;
    }
    // ( window as any ).ccsdkDebug ? console.log( surveyHandler.getSurveyQuestions() ) : '';
  }
}

export { ConditionalFlowFilter };
