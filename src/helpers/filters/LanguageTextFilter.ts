class LanguageTextFilter {

    public static translateQuestionText(surveyHandler : any, question : any) {
        if(surveyHandler.ccsdk.config.language != 'default') {
            if(typeof question.translated[surveyHandler.ccsdk.config.language] !== 'undefined') {
                return question.translated[surveyHandler.ccsdk.config.language].text;
            } else {
                return question.text.split(':').join(': ');
            }
        } else {
            return question.text.split(':').join(': ');
        }
    }

    public static translateMessages(surveyHandler : any, type : string) {
        if (typeof surveyHandler.surveyData.translated[surveyHandler.ccsdk.config.language] !== 'undefined') {
            if(surveyHandler.ccsdk.config.language != 'default') {
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

}

export { LanguageTextFilter };