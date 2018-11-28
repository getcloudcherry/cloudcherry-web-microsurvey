export function isAnd( filterQuestion: any ): boolean {
  if ( !filterQuestion ) {
    return false;
  }
  if ( filterQuestion.groupBy == null || filterQuestion.groupBy.toUpperCase() == "AND" ) {
    return true;
  }
}

export function isOr( filterQuestion: any ): boolean {
  if ( !filterQuestion ) {
    return false;
  }
  if ( filterQuestion.groupBy != null && filterQuestion.groupBy.toUpperCase() == "OR" ) {
    return true;
  }
}

export function isNumberCheck( filterQuestion: any ): boolean {
  if ( !filterQuestion ) {
    return false;
  }
  if ( filterQuestion.answerCheck[ 0 ] === "lt" || filterQuestion.answerCheck[ 0 ] === "gt" || filterQuestion.answerCheck[ 0 ] === "eq" ) {
    return true;
  }
}


/**
  * Contains logic to control conditional flow and whether to show or hide the questions based on the user input
  *
  * @param filterQuestion
  * @return
  */
export function doesSatisfy( surveyHandler: any, filterQuestion: any ): boolean {
  if ( isNumberCheck( filterQuestion ) ) {
    if ( filterQuestion.answerCheck[ 0 ].toLowerCase() == "lt" ) {
      if ( surveyHandler.getAnswerForQuestionId( filterQuestion.questionId ) != null )
        if ( surveyHandler.getAnswerForQuestionId( filterQuestion.questionId ).numberInput != null && surveyHandler.getAnswerForQuestionId( filterQuestion.questionId ).numberInput < filterQuestion.number ) {
          return true;
        }
    } else if ( filterQuestion.answerCheck[ 0 ].toLowerCase() == ( "gt" ) ) {
      if ( surveyHandler.getAnswerForQuestionId( filterQuestion.questionId ) != null )
        if ( surveyHandler.getAnswerForQuestionId( filterQuestion.questionId ).numberInput != null && surveyHandler.getAnswerForQuestionId( filterQuestion.questionId ).numberInput > filterQuestion.number ) {
          return true;
        }
    } else if ( filterQuestion.answerCheck[ 0 ].toLowerCase() == ( "eq" ) ) {
      if ( surveyHandler.getAnswerForQuestionId( filterQuestion.questionId ) != null )
        if ( surveyHandler.getAnswerForQuestionId( filterQuestion.questionId ).numberInput != null && surveyHandler.getAnswerForQuestionId( filterQuestion.questionId ).numberInput == filterQuestion.number ) {
          return true;
        }
    }
  } else {
    let iFoundAll = false;
    let question = surveyHandler.getQuestionById( filterQuestion.questionId );
    let questionAnswer = surveyHandler.getAnswerForQuestionId( filterQuestion.questionId );
    let questionAnswerText = questionAnswer != null && questionAnswer.textInput != null ? questionAnswer.textInput : '';
    if ( !questionAnswer ) {
      return false;
    }
    for ( let aAnswer of filterQuestion.answerCheck ) {
      if ( question.displayType === 'MultiSelect' ) {
        let selectedOptions = questionAnswer.textInput.split( ',' );
        if ( selectedOptions.indexOf( aAnswer ) !== -1 ) {
          iFoundAll = true;
        }
      } else if ( questionAnswerText === aAnswer ) {
        iFoundAll = true;
      }
    }
    return iFoundAll;
  }
  return false;
}

export function questionCompare( a: any, b: any ) {
  return a.sequence - b.sequence;
}

export function checkLanguage(surveyHandler, fOption) {
  if (surveyHandler.ccsdk.config && surveyHandler.ccsdk.config.language) {
    return fOption.language === surveyHandler.ccsdk.config.language 
  }
  return false;
}
