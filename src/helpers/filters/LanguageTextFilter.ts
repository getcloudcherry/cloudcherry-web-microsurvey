class LanguageTextFilter {

    public static translateQuestionText(surveyHandler : any, question : any) {
        if(!surveyHandler.ccsdk.config.language.includes('Default')) {
            if( question.translated != null && 
                typeof question.translated[surveyHandler.ccsdk.config.language] !== 'undefined') {
                if (question.translated[surveyHandler.ccsdk.config.language].text != null) {
                    let qText = question.translated[surveyHandler.ccsdk.config.language].text.split(':');
                    if (question.translated[surveyHandler.ccsdk.config.language].text.includes(":")) {
                        qText = qText[0] + ': <br><span class="text-normal">' + qText[1] + '</span>';
                    }
                    return qText;
                } else {
                    return question.translated[surveyHandler.ccsdk.config.language].text == null ? '' : question.translated[surveyHandler.ccsdk.config.language].text;
                }
                // return question.translated[surveyHandler.ccsdk.config.language].text;
            } else {
                if(question.text != null){
                    let qText = question.text.split(':');
                    if (question.text.includes(":")) {
                        qText = qText[0] + ': <br><span class="text-normal">' + qText[1] + '</span>';
                    }
                    return qText ;
                }else{
                    return question.text == null ? '':question.text;
                }
            }
        } else {
            if (question.text != null) {
                let qText = question.text.split(':');
                if (question.text.includes(":")) {
                    qText = qText[0] + ': <br><span class="text-normal">' + qText[1] + '</span>';
                }
                return qText;
            } else {
                return question.text == null ? '' : question.text;
            }
        }
    }

    public static translateMessages(surveyHandler : any, type : string) {
        if (surveyHandler.surveyData.translated != null && typeof surveyHandler.surveyData.translated[surveyHandler.ccsdk.config.language] !== 'undefined') {
            if(!surveyHandler.ccsdk.config.language.includes('Default')) {
                if(surveyHandler.surveyData.translated[surveyHandler.ccsdk.config.language] !== 'undefined') {
                    if(surveyHandler.surveyData.translated[surveyHandler.ccsdk.config.language][type] != null) {
                        return surveyHandler.surveyData.translated[surveyHandler.ccsdk.config.language][type];
                    } else {
                        return surveyHandler.surveyData[type];
                    }
                } else {
                    return surveyHandler.surveyData[type];
                }
            } else {
                return surveyHandler.surveyData[type];
            }
        }
    }

    public static translateDisplayLegend(surveyHandler: any, question: any) {
        if (!surveyHandler.ccsdk.config.language.includes('Default')) {
            if (question.translated != null &&
                typeof question.translated[surveyHandler.ccsdk.config.language] !== 'undefined') {
                return question.translated[surveyHandler.ccsdk.config.language].displayLegend;
            } else {
                return question.displayLegend;
            }
        } else {
            return question.displayLegend;
        }
    }

    public static translateMultiSelect(surveyHandler: any, question: any) {
        if (!surveyHandler.ccsdk.config.language.includes('Default')) {
            if (question.translated != null &&
                typeof question.translated[surveyHandler.ccsdk.config.language] !== 'undefined') {
                return question.translated[surveyHandler.ccsdk.config.language].multiSelect;
            } else {
                return question.multiSelect;
            }
        } else {
            return question.multiSelect;
        }
    }

}

export { LanguageTextFilter };