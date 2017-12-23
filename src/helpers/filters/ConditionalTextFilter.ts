
import { LanguageTextFilter } from './LanguageTextFilter';
class ConditionalTextFilter {
  public static filterText(surveyHandler : any, question : any) : string {
      let conditionaText = question.text == null ? '' : LanguageTextFilter.translateQuestionText(surveyHandler, question);
      if(question.text != null){
          let conditionaText : string = question.text.split(':');
          if(question.text.includes(":")){
              conditionaText = conditionaText[0] + ': <br><span class="text-normal">'+conditionaText[1]+'</span>';
          } else {
              conditionaText = conditionaText[0];
          }
        }
          if (question.leadingDisplayTexts == null) {
            conditionaText = LanguageTextFilter.translateQuestionText(surveyHandler, question);
              return conditionaText;
          } else if (question.leadingDisplayTexts.length == 0) {
              conditionaText = LanguageTextFilter.translateQuestionText(surveyHandler, question);
              return conditionaText;
          } else {
              for (let fOption of question.leadingDisplayTexts) {
                  if (fOption != null && fOption.filter != null && fOption.filter.filterquestions != null) {
                      let iSatisfied : boolean = false;
                      let iFailed : boolean = false;
                      for (let filterByQuestion of fOption.filter.filterquestions) {
                          if (ConditionalTextFilter.isAnd(filterByQuestion)) {
                              if (ConditionalTextFilter.doesSatisfy(surveyHandler, filterByQuestion) && !iFailed) {
                                  iSatisfied = true;
                              } else {
                                  iFailed = true;
                                  break;
                              }
                          } else if (ConditionalTextFilter.isOr(filterByQuestion)) {
                              if (ConditionalTextFilter.doesSatisfy(surveyHandler, filterByQuestion)) {
                                  iSatisfied = true;
                                  break;
                              }
                          }
      
                      }
                      if (iSatisfied && !iFailed) {
                          conditionaText = fOption.text;
                      }
                  }
              }
          }
      
          return conditionaText;


  }

  private static isAnd(filterQuestion : any) : boolean {
    if (filterQuestion.groupBy == null || filterQuestion.groupBy.toUpperCase() == "AND") {
        return true;
    }
    return false;
  }

  private static isOr(filterQuestion : any) : boolean {
      if (filterQuestion.groupBy != null && filterQuestion.groupBy.toUpperCase() == "OR") {
          return true;
      }
      return false;
  }

  private static isNumberCheck(filterQuestion : any) : boolean  {
    if (filterQuestion.answerCheck[0].includes("lt") || filterQuestion.answerCheck[0].includes("gt") || filterQuestion.answerCheck[0].includes("eq")) {
        return true;
    }
    return false;
  }

  private static doesSatisfy(surveyHandler : any, filterQuestion : any) : boolean {
    if (ConditionalTextFilter.isNumberCheck(filterQuestion)) {
        if (filterQuestion.answerCheck[0].toLowerCase() == "lt") {
            if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId) != null)
                if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput != null && surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput < filterQuestion.number) {
                    return true;
                }
        } else if (filterQuestion.answerCheck[0].toLowerCase() == "gt") {
            if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId) != null)
                if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput != null && surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput > filterQuestion.number) {
                    return true;
                }
        } else if (filterQuestion.answerCheck[0].toLowerCase() == "eq") {
            if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId) != null)
                if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput != null && surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput == filterQuestion.number) {
                    return true;
                }
        }
    } else {
        let iFoundAll : boolean = false;
        for (let aAnswer of filterQuestion.answerCheck) {
            if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId) != null)
                if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).textInput != null && surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).textInput.includes(aAnswer)) {
                    iFoundAll = true;
                    break;
                } else {
                    iFoundAll = false;
                    break;
                }
        }
        if (iFoundAll)
            return true;
    }
    
    return false;
  }
}

export { ConditionalTextFilter };