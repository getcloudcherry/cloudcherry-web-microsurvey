export function isAnd(filterQuestion: any): boolean {
  if (!filterQuestion) {
    return false;
  }
  if (
    filterQuestion.groupBy == null ||
    filterQuestion.groupBy.toUpperCase() == "AND"
  ) {
    return true;
  }
}

export function isOr(filterQuestion: any): boolean {
  if (!filterQuestion) {
    return false;
  }
  if (
    filterQuestion.groupBy != null &&
    filterQuestion.groupBy.toUpperCase() == "OR"
  ) {
    return true;
  }
}

export function isNumberCheck(filterQuestion: any): boolean {
  if (!filterQuestion) {
    return false;
  }
  if (
    filterQuestion.answerCheck[0] === "lt" ||
    filterQuestion.answerCheck[0] === "gt" ||
    filterQuestion.answerCheck[0] === "eq"
  ) {
    return true;
  }
}

/**
 * Contains logic to control conditional flow and whether to show or hide the questions based on the user input
 *
 * @param question
 * @return
 */
export function doesSatisfy(
  surveyHandler: any,
  question: any,
  filter: any
): boolean {
  const answers = surveyHandler.getAllAnswers();
  const list = surveyHandler.questions;

  return isConditionsSatisfied(
    list,
    filter,
    answers,
    question.hasLegacyDisplayLogic
  );
  // if (isNumberCheck(filterQuestion)) {
  //   if (filterQuestion.answerCheck[0].toLowerCase() == "lt") {
  //     if (answer)
  //       if (answer.numberInput != null && answer.numberInput < filterQuestion.number) {
  //         return true;
  //       }
  //   } else if (filterQuestion.answerCheck[0].toLowerCase() == ("gt")) {
  //     if (answer)
  //       if (answer.numberInput != null && answer.numberInput > filterQuestion.number) {
  //         return true;
  //       }
  //   } else if (filterQuestion.answerCheck[0].toLowerCase() == ("eq")) {
  //     if (answer)
  //       if (answer.numberInput != null && answer.numberInput == filterQuestion.number) {
  //         return true;
  //       }
  //   }
  // } else {
  //   // any text match for text answers
  //   if (filterQuestion.answerCheck[0] && filterQuestion.answerCheck[0].toLowerCase() === 'any text') {
  //     if (answer && answer.textInput && answer.textInput !== ' ') {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }

  //   let iFoundAll = false;
  //   let question = surveyHandler.getQuestionById(filterQuestion.questionId);
  //   let questionAnswerText = answer != null && answer.textInput != null ? answer.textInput : '';
  //   if (!answer) {
  //     return false;
  //   }
  //   for (let aAnswer of filterQuestion.answerCheck) {
  //     if (question.displayType === 'MultiSelect') {
  //       let selectedOptions = answer.textInput.split(',');
  //       if (selectedOptions.indexOf(aAnswer) !== -1) {
  //         iFoundAll = true;
  //       }
  //     } else if (questionAnswerText === aAnswer) {
  //       iFoundAll = true;
  //     }
  //   }
  //   return iFoundAll;
  // }
  // return false;
}

function checkACondition(questions, condition, responses) {
  var response = responses.find(function (x) {
    return x.questionId === condition.questionId;
  });

  var question = questions.find(function (x) {
    x.id === condition.questionId;
  });

  if (
    condition.answerCheck[0] &&
    condition.answerCheck[0].toLowerCase() === "any text"
  ) {
    if (response && response.textInput && response.textInput !== "") {
      return true;
    } else {
      return false;
    }
  }

  if (
    ["lt", "gt", "eq"].indexOf(condition.answerCheck[0]) === -1 &&
    condition.number === 0
  ) {
    if (!response || !response.textInput) {
      return false;
    }
    // Text match - single and multi select
    var responseOptions =
      Array.isArray(response.textInput) ||
      (question && question.displayType !== "MultiSelect")
        ? [response.textInput]
        : response.textInput.split(",");
    var filterOptions = condition.answerCheck.map(function (x) {
      return x.split(";")[0];
    });
    if (intersect(responseOptions, filterOptions).length > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    if (!response || (!response.numberInput && response.numberInput !== 0)) {
      return false;
    }
    switch (condition.answerCheck[0]) {
      case "lt":
        if (response.numberInput < condition.number) {
          return true;
        }
        break;
      case "gt":
        if (response.numberInput > condition.number) {
          return true;
        }
        break;
      case "eq":
        if (response.numberInput === condition.number) {
          return true;
        }
        break;
    }
    return false;
  }
}

function isConditionsSatisfied(
  questions,
  filter,
  responses,
  isLegacyCondition = true
) {
  if (isLegacyCondition) {
    return legacyConditionCheck(questions, filter, responses);
  } else {
    return latestConditionCheck(questions, filter, responses);
  }
}

function legacyConditionCheck(questions, filter, responses) {
  if (
    !filter ||
    !filter.filterquestions ||
    filter.filterquestions.length === 0
  ) {
    return true;
  } else {
    var prevResult = checkACondition(
      questions,
      filter.filterquestions[0],
      responses
    );
    for (var i = 1; i < filter.filterquestions.length; i++) {
      var condition = filter.filterquestions[i];
      if (filter.filterquestions[i - 1].groupBy === "OR") {
        prevResult =
          prevResult || checkACondition(questions, condition, responses);
      } else {
        prevResult =
          prevResult && checkACondition(questions, condition, responses);
      }
    }

    return prevResult;
  }
}

function latestConditionCheck(questions, filter, responses) {
  if (
    !filter ||
    !filter.filterquestions ||
    filter.filterquestions.length === 0
  ) {
    return true;
  } else {
    // set default segment if there are no segments
    var defaultSegment = "default";
    if (!filter.filtersegments || filter.filtersegments.length === 0) {
      filter.filtersegments = [
        {
          segmentName: defaultSegment,
          groupBy: null,
        },
      ];
    }
    /**
     * Create subset by segmentName (name it segmentSet)
     */
    var modifiedFilterQuestions = filter.filterquestions.reduce(function (
      acc,
      cur
    ) {
      // set default segment if the questions are not split by segments
      cur.segment = cur.segment || defaultSegment;
      if (!acc[cur.segment]) {
        acc[cur.segment] = [];
      }
      acc[cur.segment].push(cur);
      return acc;
    },
    {});

    if (modifiedFilterQuestions) {
      var preVal = [];
      var filterQuestionKeys = Object.keys(modifiedFilterQuestions);
      if (filterQuestionKeys && filterQuestionKeys.length > 0) {
        /**
         * Split AND to one bucket and OR to another by the corresponding segmentName
         */
        filterQuestionKeys.forEach(function (segmentName) {
          var filterCondition = modifiedFilterQuestions[segmentName];
          var j = 0;
          if (!preVal[segmentName]) {
            preVal[segmentName] = [];
          }
          preVal[segmentName][j] = checkACondition(
            questions,
            filterCondition[0],
            responses
          );
          for (var x = 1; x < filterCondition.length; x++) {
            if (filterCondition[x - 1].groupBy === "OR") {
              j = j + 1;
              preVal[segmentName][j] = checkACondition(
                questions,
                filterCondition[x],
                responses
              );
            } else {
              preVal[segmentName][j] =
                preVal[segmentName][j] &&
                checkACondition(questions, filterCondition[x], responses);
            }
          }
        });
        /**
         * Check condition for each segment set
         */
        var computedSegmentCollection = filterQuestionKeys.reduce(function (
          acc1,
          segment
        ) {
          if (!acc1[segment]) {
            acc1[segment] = false;
          }
          acc1[segment] = preVal[segment].reduce(function (acc, cur) {
            return acc || cur;
          }, false);

          return acc1;
        },
        {});
        /**
         * Groupby and flatten the boolean array
         */
        var segmentedGroup = segmentGroupBy(
          computedSegmentCollection,
          filter.filtersegments
        );
        var segmentedGroupRes = flattenNestedArrByOr(segmentedGroup);
        return segmentedGroupRes;
      }
    } else {
      return true;
    }
  }
}

export function flattenNestedArrByOr(nestedArr) {
  var val = false;
  if (typeof nestedArr === "boolean") return nestedArr;
  else if (nestedArr instanceof Array)
    for (var i = 0; i < nestedArr.length; ++i)
      val = val || flattenNestedArrByOr(nestedArr[i]);
  return val;
}

export function segmentGroupBy(collection, filterSegments) {
  var preVal = [];
  var j = 0;
  for (var i = 0; i < filterSegments.length; i++) {
    if (i === 0) {
      if (
        filterSegments[i].innerSegments &&
        filterSegments[i].innerSegments.length > 0
      ) {
        preVal[j] = flattenNestedArrByOr(
          segmentGroupBy(collection, filterSegments[i].innerSegments)
        );
      } else {
        preVal[j] = collection[filterSegments[i].segmentName];
      }
    } else {
      if (filterSegments[i - 1].groupBy === "OR") {
        j = j + 1;
        if (
          filterSegments[i].innerSegments &&
          filterSegments[i].innerSegments.length > 0
        ) {
          preVal[j] = flattenNestedArrByOr(
            segmentGroupBy(collection, filterSegments[i].innerSegments)
          );
        } else {
          preVal[j] = collection[filterSegments[i].segmentName];
        }
      } else {
        if (
          filterSegments[i].innerSegments &&
          filterSegments[i].innerSegments.length > 0
        ) {
          preVal[j] =
            preVal[j] &&
            flattenNestedArrByOr(
              segmentGroupBy(collection, filterSegments[i].innerSegments)
            );
        } else {
          preVal[j] = preVal[j] && collection[filterSegments[i].segmentName];
        }
      }
    }
  }

  return preVal;
}

function intersect(first, second) {
  var temp;
  if (second.length > first.length)
    (temp = second), (second = first), (first = temp); // indexOf to loop over shorter
  return first
    .filter(function (elm1) {
      return second.indexOf(elm1) > -1;
    })
    .filter(function (elm2, i, arr) {
      // extra step to remove duplicates
      return arr.indexOf(elm2) === i;
    });
}

export function questionCompare(a: any, b: any) {
  return a.sequence - b.sequence;
}

export function checkLanguage(surveyHandler, fOption) {
  if (surveyHandler.ccsdk.config && surveyHandler.ccsdk.config.language) {
    return fOption.language === surveyHandler.ccsdk.config.language;
  }
  return false;
}
