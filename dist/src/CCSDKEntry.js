"use strict";
var SurveyHandler_1 = require("./SurveyHandler");
var DomSurvey_1 = require("./helpers/dom/DomSurvey");
var Scrollbar_1 = require("./helpers/dom/Scrollbar");
var localCCSDK = {
    init: init,
    trigger: trigger,
    prefill: prefill
};
var instances = {};
var CCSDKEntry = (function () {
    function CCSDKEntry(surveyToken) {
        this.survey = new SurveyHandler_1.SurveyHandler(surveyToken);
        var data = this.survey.fetchQuestions();
        var self = this;
        data.then(function (surveyData) {
            self.survey.surveyData = surveyData;
            self.survey.setupSurveyContainer();
            self.survey.displayQuestions();
            self.dom = new DomSurvey_1.DomSurvey("#db3c39");
        });
    }
    CCSDKEntry.prototype.trigger = function (type, target) {
        var self = this;
        document.querySelectorAll(target)[0].addEventListener('click', function () {
            console.log('click trigger');
            self.survey.displayWelcomeQuestion();
            self.dom.setupListners();
            Scrollbar_1.Scrollbar.initAll();
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
if (typeof window.CCSDK !== 'undefined') {
    var queue = window.CCSDK.q;
    window.CCSDK = function () {
        if (arguments.length == 0) {
            var time = new Date();
            console.log(this.time);
        }
        else {
            var args = Array.from(arguments);
            console.log(arguments);
            var functionName = args.splice(0, 1)[0];
            localCCSDK[functionName].apply(this, args);
        }
    };
    for (var _i = 0, queue_1 = queue; _i < queue_1.length; _i++) {
        var q = queue_1[_i];
        var args = Array.from(q);
        var functionName = args.splice(0, 1)[0];
        localCCSDK[functionName].apply(this, args);
    }
}
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
//# sourceMappingURL=CCSDKEntry.js.map