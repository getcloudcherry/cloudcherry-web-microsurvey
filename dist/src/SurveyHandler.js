"use strict";
var Config_1 = require("./Config");
var Request_1 = require("./helpers/Request");
var Templates_1 = require("./helpers/Templates");
var DomUtilities_1 = require("./helpers/dom/DomUtilities");
var DomSurvey_1 = require("./helpers/dom/DomSurvey");
var SurveyHandler = (function () {
    function SurveyHandler(surveyToken) {
        var _this = this;
        this.surveyToken = surveyToken;
        this.surveyData = {};
        this.questions = [];
        this.questionsToDisplay = [];
        this.prefillQuestions = [];
        this.answers = [];
        this.util = new DomUtilities_1.DomUtilities();
        this.dom = new DomSurvey_1.DomSurvey();
        this.displayThankYouCb = function (e) {
            var thankyouHtml = Templates_1.templates.thankyou;
            thankyouHtml = thankyouHtml.replace("{{question}}", _this.surveyData.thankyouText);
            thankyouHtml = thankyouHtml.replace("{{button}}", 'Start');
            _this.dom.appendInQuestionsContainer(thankyouHtml);
            var thankyouContainer = _this.util.get("#cc-thankyou-container");
            _this.util.addClassAll(thankyouContainer, 'show-slide');
        };
        this.destroySurveyCb = function (e) {
            var self = _this;
            self.destroy();
        };
        this.acceptAnswersCb = function (e) {
            var self = _this;
            console.log(self);
            console.log('question answered', e);
            var data = e.detail;
            var response = {};
            switch (data.type) {
                case 'scale':
                    response.text = null;
                    response.number = data.data.number;
                    self.postPartialAnswer(data.index, response);
                    self.dom.domSelectElements();
                    break;
                case 'smile':
                    response.text = null;
                    response.number = data.data.number;
                    self.postPartialAnswer(data.index, response);
                    self.dom.domSelectElements();
                    break;
                case 'star':
                    response.text = null;
                    response.number = data.data.number;
                    self.postPartialAnswer(data.index, response);
                    self.dom.domSelectElements();
                    break;
                case 'multiline':
                    response.text = data.data.text;
                    response.number = null;
                    console.log(data);
                    self.postPartialAnswer(data.index, response);
                    self.dom.domSelectElements();
                    self.dom.setQIndex(data.index);
                    break;
                case 'singleline':
                    response.text = data.data.text;
                    response.number = null;
                    console.log(data);
                    self.postPartialAnswer(data.index, response);
                    self.dom.domSelectElements();
                    self.dom.setQIndex(data.index);
                    break;
                case 'checkbox':
                    response.text = data.data.text;
                    response.number = null;
                    console.log(data);
                    self.postPartialAnswer(data.index, response);
                    self.dom.domSelectElements();
                    self.dom.setQIndex(data.index);
                    break;
                case 'select':
                    response.text = data.data.text;
                    response.number = data.data.number;
                    console.log(data);
                    self.postPartialAnswer(data.index, response);
                    self.dom.domSelectElements();
                    self.dom.setQIndex(data.index);
                    break;
                case 'slider':
                    response.text = data.data.text;
                    response.number = data.data.number;
                    console.log(data);
                    self.postPartialAnswer(data.index, response);
                    self.dom.domSelectElements();
                    self.dom.setQIndex(data.index);
                    break;
                default:
                    break;
            }
        };
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
    SurveyHandler.prototype.attachSurvey = function (surveyData) {
        this.surveyData = surveyData;
        this.setupSurveyContainer();
        this.displayQuestions();
        this.displayThankYou();
        this.destroySurvey();
    };
    SurveyHandler.prototype.setupSurveyContainer = function () {
        var surveyHtml = Templates_1.templates.question_survey;
        surveyHtml = surveyHtml.replace("{{surveyToken}}", this.surveyToken);
        this.dom.appendInBody(surveyHtml);
    };
    SurveyHandler.prototype.displayWelcomeQuestion = function () {
        var welcomeHtml = Templates_1.templates.question_start;
        welcomeHtml = welcomeHtml.replace("{{surveyToken}}", this.surveyToken);
        welcomeHtml = welcomeHtml.replace("{{question}}", this.surveyData.welcomeText);
        welcomeHtml = welcomeHtml.replace("{{button}}", 'Start');
        console.log("Appending in body");
        this.dom.appendInBody(welcomeHtml);
        this.dom.showWelcomeContainer();
        this.acceptAnswers();
    };
    SurveyHandler.prototype.displayThankYou = function () {
        var self = this;
        document.addEventListener('ccdone', this.displayThankYouCb);
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
    SurveyHandler.prototype.acceptAnswers = function () {
        var self = this;
        console.log('add question answered listener');
        document.addEventListener('q-answered', this.acceptAnswersCb);
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
            textInput: response.text,
            numberInput: response.number
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
        var self = this;
        var questionTemplate;
        console.log(question);
        switch (question.displayType) {
            case "Slider":
                var opt = question.multiSelect[0].split("-");
                var optMin = opt[0].split(";");
                var optMax = opt[1].split(";");
                questionTemplate = Templates_1.templates.question_slider;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace("{{min}}", optMin[0]);
                questionTemplate = questionTemplate.replace("{{minLabel}}", optMin[1]);
                questionTemplate = questionTemplate.replace("{{max}}", optMax[0]);
                questionTemplate = questionTemplate.replace("{{maxLabel}}", optMax[1]);
                questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
                questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
                break;
            case "Scale":
                questionTemplate = Templates_1.templates.question_scale;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
                questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
                break;
            case "Text":
                questionTemplate = Templates_1.templates.question_text;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
                questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
                break;
            case "MultilineText":
                questionTemplate = Templates_1.templates.question_multi_line_text;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
                questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
                break;
            case "MultiSelect":
                var acTemplate = void 0;
                if (question.displayStyle == 'radiobutton/checkbox') {
                    console.log(question.displayStyle);
                    acTemplate = Templates_1.templates.question_checkbox;
                }
                else {
                    acTemplate = Templates_1.templates.question_multi_select;
                }
                questionTemplate = acTemplate;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
                questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
                break;
            case "Select":
                var acTemplate1 = void 0;
                var acTemplate2 = void 0;
                var options1 = void 0;
                var options2 = void 0;
                if (question.displayStyle == 'radiobutton/checkbox') {
                    console.log('select type 1');
                    console.log(question.displayStyle);
                    acTemplate1 = Templates_1.templates.question_radio;
                    questionTemplate = acTemplate1;
                }
                else {
                    var checkOptionContainsImage = self.util.checkOptionContainsImage(question.multiSelect);
                    console.log('select radio image', checkOptionContainsImage);
                    if (checkOptionContainsImage) {
                        console.log('select type 2');
                        acTemplate2 = Templates_1.templates.question_radio_image;
                        options2 = self.util.generateRadioImageOptions(question.multiSelect, question.id);
                        console.log(options2);
                        questionTemplate = acTemplate2;
                        questionTemplate = questionTemplate.replace(/{{options}}/g, options2);
                    }
                    else {
                        console.log('select type 3');
                        acTemplate1 = Templates_1.templates.question_select;
                        options1 = self.util.generateSelectOptions(question.multiSelect);
                        questionTemplate = acTemplate1;
                        questionTemplate = questionTemplate.replace("{{options}}", options1);
                    }
                }
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
                questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
                console.log(questionTemplate);
                break;
            case "Smile-5":
                questionTemplate = Templates_1.templates.question_smile_5;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
                questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
                break;
            case "Star-5":
                questionTemplate = Templates_1.templates.question_star_5;
                questionTemplate = questionTemplate.replace("{{question}}", question.text);
                questionTemplate = questionTemplate.replace(/{{questionId}}/g, "id" + question.id);
                questionTemplate = questionTemplate.replace("{{isRequired}}", question.isRequired ? "true" : "false");
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
    SurveyHandler.prototype.destroySurvey = function () {
        var self = this;
        document.addEventListener('ccclose', this.destroySurveyCb);
    };
    SurveyHandler.prototype.destroy = function () {
        var surveyContainer = this.dom.getSurveyContainer(this.surveyToken);
        var welcomeContainer = this.dom.getWelcomeContainer(this.surveyToken);
        this.util.remove(surveyContainer);
        this.util.remove(welcomeContainer);
        document.removeEventListener('ccclose', this.destroySurveyCb);
        document.removeEventListener('ccdone', this.displayThankYouCb);
        document.removeEventListener('q-answered', this.acceptAnswersCb);
    };
    return SurveyHandler;
}());
exports.SurveyHandler = SurveyHandler;
//# sourceMappingURL=SurveyHandler.js.map