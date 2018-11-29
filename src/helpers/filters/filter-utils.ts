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
  const answer = surveyHandler.getAnswerForQuestionId( filterQuestion.questionId );
  if ( isNumberCheck( filterQuestion ) ) {
    if ( filterQuestion.answerCheck[ 0 ].toLowerCase() == "lt" ) {
      if ( answer != null )
        if ( answer.numberInput != null && answer.numberInput < filterQuestion.number ) {
          return true;
        }
    } else if ( filterQuestion.answerCheck[ 0 ].toLowerCase() == ( "gt" ) ) {
      if ( answer != null )
        if ( answer.numberInput != null && answer.numberInput > filterQuestion.number ) {
          return true;
        }
    } else if ( filterQuestion.answerCheck[ 0 ].toLowerCase() == ( "eq" ) ) {
      if ( answer != null )
        if ( answer.numberInput != null && answer.numberInput == filterQuestion.number ) {
          return true;
        }
    }
  } else {
    // any text match for text answers
    if ( filterQuestion.answerCheck[ 0 ] && filterQuestion.answerCheck[ 0 ].toLowerCase() === 'any text' ) {
      if ( answer.textInput && answer.textInput !== ' ' ) {
        return true;
      } else {
        return false;
      }
    }

    let iFoundAll = false;
    let question = surveyHandler.getQuestionById( filterQuestion.questionId );
    let questionAnswerText = answer != null && answer.textInput != null ? answer.textInput : '';
    if ( !answer ) {
      return false;
    }
    for ( let aAnswer of filterQuestion.answerCheck ) {
      if ( question.displayType === 'MultiSelect' ) {
        let selectedOptions = answer.textInput.split( ',' );
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
