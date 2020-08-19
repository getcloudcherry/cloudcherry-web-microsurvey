import { LanguageTextFilter } from "./LanguageTextFilter";
import { isAnd, doesSatisfy, isOr, checkLanguage } from "./filter-utils";

class ConditionalTextFilter {
  public static filterText(surveyHandler: any, question: any): string {
    let conditionalText =
      question.text == null
        ? ""
        : LanguageTextFilter.translateQuestionText(surveyHandler, question);
    if (question.text != null) {
      let conditionalText: string = question.text.split(":");
      if (question.setName && question.text.indexOf(":") !== -1) {
        conditionalText =
          conditionalText[0] +
          ': <br><span class="text-normal">' +
          conditionalText[1] +
          "</span>";
      } else {
        conditionalText = conditionalText[0];
      }
    }
    if (question.leadingDisplayTexts == null) {
      conditionalText = LanguageTextFilter.translateQuestionText(
        surveyHandler,
        question
      );
      return conditionalText;
    } else if (question.leadingDisplayTexts.length == 0) {
      conditionalText = LanguageTextFilter.translateQuestionText(
        surveyHandler,
        question
      );
      return conditionalText;
    } else {
      for (let fOption of question.leadingDisplayTexts) {
        if (
          fOption != null &&
          fOption.filter != null &&
          fOption.filter.filterquestions != null
        ) {
          // let iSatisfied: boolean = false;
          // let iFailed: boolean = false;

          // for (let filterByQuestion of fOption.filter.filterquestions) {
          //   if (isAnd(filterByQuestion)) {
          //     if (doesSatisfy(surveyHandler, filterByQuestion) && !iFailed) {
          //       iSatisfied = true;
          //     } else {
          //       iFailed = true;
          //       break;
          //     }
          //   } else if (isOr(filterByQuestion)) {
          //     if (doesSatisfy(surveyHandler, filterByQuestion)) {
          //       iSatisfied = true;
          //       break;
          //     }
          //   }
          // }
          if (doesSatisfy(surveyHandler, question)) {
            if (
              checkLanguage(surveyHandler, fOption) ||
              (surveyHandler.ccsdk.config &&
                surveyHandler.ccsdk.config.language &&
                surveyHandler.ccsdk.config.language
                  .toLowerCase()
                  .indexOf("default") !== -1 &&
                fOption.language === null) ||
              (surveyHandler.ccsdk.config &&
                !surveyHandler.ccsdk.config.language &&
                fOption.language === null)
            ) {
              let groupTitle;
              if (question.setName && conditionalText.indexOf(":") !== -1) {
                groupTitle = conditionalText.split(":")[0];
                conditionalText =
                  groupTitle +
                  ': <br><span class="text-normal">' +
                  fOption.text +
                  "</span>";
              } else {
                conditionalText = fOption.text;
              }
            }
            conditionalText;
          }
        }
      }
    }

    return conditionalText;
  }
}

export { ConditionalTextFilter };
