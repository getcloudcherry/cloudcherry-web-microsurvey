
class ConditionalFlowFilter {
  public static filterQuestion(surveyHandler : any, question : any) {
    let aAddedCount = 0;
    let aRemovedCount = 0;

    if (surveyHandler.getAnswerForQuestionId(question.id) != null) {
        for (let aQuestion of surveyHandler.getConditionalSurveyQuestions()) {
            if (aQuestion.conditionalFilter != null) {
                let iSatisfied = false;
                let iFailed = false;
                for (let aFilterByQuestion of aQuestion.conditionalFilter.filterquestions) {
                    if (ConditionalFlowFilter.isAnd(aFilterByQuestion)) {
                        if (ConditionalFlowFilter.doesSatisfy(surveyHandler, aFilterByQuestion) && !iFailed) {
                            iSatisfied = true;
                        } else {
                            iFailed = true;
                            break;
                        }
                    } else if (ConditionalFlowFilter.isOr(aFilterByQuestion)) {
                        if (ConditionalFlowFilter.doesSatisfy(surveyHandler, aFilterByQuestion)) {
                            iSatisfied = true;
                            break;
                        }
                    }
                }
                if (iSatisfied && !iFailed) {
                    if (!surveyHandler.getSurveyQuestions().includes(aQuestion)) {
                        surveyHandler.getSurveyQuestions().push(aQuestion);
                        aAddedCount++;
                    }
                } else {
                    if (surveyHandler.getSurveyQuestions().includes(aQuestion)) {
                        aRemovedCount++;
                        surveyHandler.getSurveyQuestions().splice(surveyHandler.getSurveyQuestions().indexOf(aQuestion), 1);
                        // surveyHandler.removePartial(aQuestion.id);
                        //removing from partial requires not posting partial after each question rather than posting them all at once.
                        surveyHandler.removeAnswer(aQuestion.id);
                    }
                }
            }
        }
    }
    if (aAddedCount > 0 || aRemovedCount > 0) {
        surveyHandler.getSurveyQuestions().sort(ConditionalFlowFilter.questionCompare);
        // surveyHandler.sendConditionalFLowQuestionsData(surveyHandler.getSurveyQuestions().size());
        return true;
    } else {
      // return false;
    }
    (window as any).ccsdkDebug?console.log(surveyHandler.getSurveyQuestions()):'';
  }

  private static questionCompare(a : any, b : any) {
    return a.sequence - b.sequence;
  }

  private static isAnd(filterQuestion : any) : boolean {
      if (filterQuestion.groupBy == null || filterQuestion.groupBy.toUpperCase() == "AND") {
          return true;
      }
      return false;
  }

  private static isOr(filterQuestion : any) : boolean{
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

  /**
   * Contains logic to control conditional flow and whether to show or hide the questions based on the user input
   *
   * @param filterQuestion
   * @return
   */
  private static doesSatisfy(surveyHandler : any, filterQuestion : any) : boolean {
      if (ConditionalFlowFilter.isNumberCheck(filterQuestion)) {
          if (filterQuestion.answerCheck[0].toLowerCase() == "lt") {
              if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId) != null)
                  if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput != null && surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput < filterQuestion.number) {
                      return true;
                  }
          } else if (filterQuestion.answerCheck[0].toLowerCase() == ("gt")) {
              if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId) != null)
                  if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput != null && surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput > filterQuestion.number) {
                      return true;
                  }
          } else if (filterQuestion.answerCheck[0].toLowerCase() == ("eq")) {
              if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId) != null)
                  if (surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput != null && surveyHandler.getAnswerForQuestionId(filterQuestion.questionId).numberInput == filterQuestion.number) {
                      return true;
                  }
          }
      } else {
          let iFoundAll = false;
          for (let aAnswer of filterQuestion.answerCheck) {
            //   console.log('hello',surveyHandler.getAnswerForQuestionId(filterQuestion.questionId), aAnswer);

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

export { ConditionalFlowFilter };