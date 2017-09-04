"use strict";
var Config_1 = require("./Config");
var Request_1 = require("./helpers/Request");
var Templates_1 = require("./helpers/Templates");
var DomUtilities_1 = require("./helpers/dom/DomUtilities");
var SurveyHandler = (function () {
    function SurveyHandler(surveyToken) {
        this.surveyToken = surveyToken;
        this.surveyData = {};
        this.questions = [];
        this.questionsToDisplay = [];
        this.prefillQuestions = [];
        this.answers = [];
        this.util = new DomUtilities_1.DomUtilities();
    }
    SurveyHandler.prototype.fetchQuestions = function () {
        this.randomNumber = parseInt((String)(Math.random() * 1000));
        var surveyUrl = Config_1.Config.SURVEY_BY_TOKEN.replace("{token}", "" + this.surveyToken);
        surveyUrl = surveyUrl.replace("{tabletId}", "" + this.randomNumber);
        surveyUrl = Config_1.Config.API_URL + surveyUrl;
        var data = Request_1.RequestHelper.get(surveyUrl);
        console.log(data);
        return data;
    };
    SurveyHandler.prototype.setupSurveyContainer = function () {
        document.querySelectorAll("body")[0].insertAdjacentHTML('afterbegin', Templates_1.templates.question_survey);
    };
    SurveyHandler.prototype.displayWelcomeQuestion = function () {
        document.querySelectorAll("body")[0].insertAdjacentHTML('afterbegin', Templates_1.templates.question_start);
        var startContainer = document.querySelectorAll(".act-cc-welcome-question-box")[0];
        this.util.addClass(startContainer, "show");
    };
    SurveyHandler.prototype.displayQuestions = function () {
        this.questions = this.surveyData.questions;
        this.questionsToDisplay = this.surveyData.questions.filter(this.filterQuestions);
        this.questionsToDisplay = this.questionsToDisplay.sort(this.questionCompare);
        var ccSurvey;
        ccSurvey = document.getElementsByClassName("cc-questions-container");
        var surveyObject = ccSurvey[0];
        for (var _i = 0, _a = this.questionsToDisplay; _i < _a.length; _i++) {
            var question = _a[_i];
            if (this.checkConditionals(question)) {
                var compiledTemplate = this.compileTemplate(question);
                surveyObject.innerHTML += compiledTemplate;
            }
            else {
                if (this.isPrefillQuestion(question)) {
                    this.prefillQuestions.push(question);
                }
            }
        }
    };
    SurveyHandler.prototype.fillPrefillQuestion = function (id, value, valueType) {
        var question = this.getQuestionById(id);
        var response;
        var responseStored = this.getPrefillResponseById(id);
        if (responseStored != null) {
            response = responseStored;
        }
        else {
            response = {
                questionId: question.id,
                questionText: question.text,
                textInput: null,
                numberInput: null
            };
        }
        if (valueType.toLowerCase() == "number") {
            response.numberInput = value;
        }
        if (valueType.toLowerCase() == "text") {
            response.textInput = value;
        }
        if (responseStored != null) {
            this.updatePrefillResponseById(id, response);
        }
        else {
            this.prefillResponses.push(response);
        }
    };
    SurveyHandler.prototype.postPrefillPartialAnswer = function () {
        var surveyPartialUrl = Config_1.Config.SURVEY_PARTIAL_RESPONSE.replace("{id}", this.surveyData.partialResponseId);
        surveyPartialUrl = surveyPartialUrl.replace("{complete}", "false");
        surveyPartialUrl = surveyPartialUrl.replace("{tabletId}", "" + this.randomNumber);
        surveyPartialUrl = Config_1.Config.API_URL + surveyPartialUrl;
        return Request_1.RequestHelper.post(surveyPartialUrl, this.prefillResponses);
    };
    SurveyHandler.prototype.updatePrefillResponseById = function (id, resp) {
        for (var _i = 0, _a = this.prefillResponses; _i < _a.length; _i++) {
            var response = _a[_i];
            if (response.questionId == id) {
                response = resp;
            }
        }
    };
    SurveyHandler.prototype.getPrefillResponseById = function (id) {
        for (var _i = 0, _a = this.prefillResponses; _i < _a.length; _i++) {
            var response = _a[_i];
            if (response.questionId == id) {
                return response;
            }
        }
        return null;
    };
    SurveyHandler.prototype.getQuestionById = function (id) {
        for (var _i = 0, _a = this.questions; _i < _a.length; _i++) {
            var question = _a[_i];
            if (question.id == id) {
                return question;
            }
        }
    };
    SurveyHandler.prototype.postPartialAnswer = function (index, response) {
        var question = this.questionsToDisplay[index];
        if (typeof question === 'undefined') {
            return console.log("No Partial Remaining");
        }
        var data = {
            questionId: question.id,
            questionText: question.text,
            textInput: null,
            numberInput: 5
        };
        console.log("Submitting for : " + index);
        var surveyPartialUrl = Config_1.Config.SURVEY_PARTIAL_RESPONSE.replace("{id}", this.surveyData.partialResponseId);
        if (question.id == this.questionsToDisplay[this.questionsToDisplay.length - 1].id) {
            surveyPartialUrl = surveyPartialUrl.replace("{complete}", "true");
        }
        else {
            surveyPartialUrl = surveyPartialUrl.replace("{complete}", "false");
        }
        surveyPartialUrl = surveyPartialUrl.replace("{tabletId}", "" + this.randomNumber);
        surveyPartialUrl = Config_1.Config.API_URL + surveyPartialUrl;
        this.answers.push(data);
        data = [data];
        return Request_1.RequestHelper.post(surveyPartialUrl, data);
    };
    SurveyHandler.prototype.checkConditionals = function (question) {
        return true;
    };
    SurveyHandler.prototype.compileTemplate = function (question) {
        var questionTemplate;
        console.log(question);
        switch (question.displayType) {
            case "Scale":
                questionTemplate = Templates_1.templates.question_scale;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");
                break;
            case "Text":
                questionTemplate = Templates_1.templates.question_text;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");
                break;
            case "MultilineText":
                questionTemplate = Templates_1.templates.question_multi_line_text;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");
                break;
            case "MultiSelect":
                questionTemplate = Templates_1.templates.question_multi_select;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");
                break;
            case "Select":
                questionTemplate = Templates_1.templates.question_select;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");
                break;
            case "Smile-5":
                questionTemplate = Templates_1.templates.question_smile_5;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace("{{is_required}}", question.isRequired ? "*" : "");
                break;
        }
        return questionTemplate;
    };
    SurveyHandler.prototype.questionCompare = function (a, b) {
        return a.sequence - b.sequence;
    };
    SurveyHandler.prototype.filterQuestions = function (question) {
        if (question.apiFill == true) {
            return false;
        }
        if (question.staffFill == true) {
            return false;
        }
        if (question.isRetired == true) {
            return false;
        }
        return true;
    };
    SurveyHandler.prototype.isPrefillQuestion = function (question) {
        if (question.apiFill == true) {
            return true;
        }
        if (question.staffFill == true) {
            return true;
        }
        return false;
    };
    return SurveyHandler;
}());
exports.SurveyHandler = SurveyHandler;
//# sourceMappingURL=SurveyHandler.js.map