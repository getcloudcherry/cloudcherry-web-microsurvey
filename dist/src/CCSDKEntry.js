"use strict";
require("./css/questions.css");
var SurveyHandler_1 = require("./SurveyHandler");
var DomSurvey_1 = require("./helpers/Dom/DomSurvey");
var CCSDKEntry = (function () {
    function CCSDKEntry(surveyToken) {
        this.survey = new SurveyHandler_1.SurveyHandler(surveyToken);
        var data = this.survey.fetchQuestions();
        var self = this;
        data.then(function (surveyData) {
            self.survey.surveyData = surveyData;
            self.survey.displayQuestions();
            this.dom = new DomSurvey_1.DomSurvey('#db3c39');
        });
    }
    CCSDKEntry.prototype.trigger = function (type, target) {
        var self = this;
        document.getElementById("anywhere").addEventListener('click', function () {
            console.log('click trigger');
            self.survey.displayWelcomeQuestion();
        });
    };
    CCSDKEntry.prototype.prefill = function (id, value, valueType) {
        this.survey.fillPrefillQuestion(id, value, valueType);
    };
    CCSDKEntry.prototype.prefillPost = function () {
        this.survey.postPrefillPartialAnswer();
    };
    return CCSDKEntry;
}());
var instances = {};
function init(surveyToken) {
    instances[surveyToken] = new CCSDKEntry(surveyToken);
}
exports.init = init;
function trigger(surveyToken, type, target) {
    instances[surveyToken].trigger(type, target);
}
exports.trigger = trigger;
function prefill(surveyToken, id, value, valueType) {
    instances[surveyToken].prefill(id, value, valueType);
}
exports.prefill = prefill;
