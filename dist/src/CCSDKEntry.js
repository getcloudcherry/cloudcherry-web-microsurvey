"use strict";
var SurveyHandler_1 = require("./SurveyHandler");
var DomSurvey_1 = require("./helpers/dom/DomSurvey");
var DomUtilities_1 = require("./helpers/dom/DomUtilities");
var Scrollbar_1 = require("./helpers/dom/Scrollbar");
var localCCSDK = {
    init: init,
    destroy: destroy,
    trigger: trigger,
};
var instances = {};
var CCSDKEntry = (function () {
    function CCSDKEntry(surveyToken, config) {
        this.setupSurvey(surveyToken, config);
    }
    CCSDKEntry.prototype.setupSurvey = function (surveyToken, config) {
        this.survey = new SurveyHandler_1.SurveyHandler(surveyToken);
        this.config = config;
        this.util = new DomUtilities_1.DomUtilities;
        this.surveyToken = surveyToken;
        this.config.themeColor = (config && config.themeColor) ?
            config.themeColor : "#db3c39";
        console.log(this.config);
        var data = this.survey.fetchQuestions();
        var self = this;
        data.then(function (surveyData) {
            console.log(surveyData);
            self.survey.attachSurvey(surveyData);
            self.dom = new DomSurvey_1.DomSurvey();
            self.dom.setTheme(self.config.themeColor);
            self.dom.setupListeners();
            self.util.trigger(document, surveyToken + '-ready', { 'survey': self });
        });
    };
    CCSDKEntry.prototype.trigger = function (type, target) {
        var self = this;
        switch (type) {
            case 'click':
                document.querySelectorAll(target)[0].addEventListener('click', function () {
                    console.log('click trigger');
                    self.survey.displayWelcomeQuestion();
                    console.log(self);
                    Scrollbar_1.Scrollbar.initAll();
                });
                break;
            case 'launch':
            default:
                self.survey.displayWelcomeQuestion();
                Scrollbar_1.Scrollbar.initAll();
                break;
        }
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
        if (arguments && arguments.length == 0) {
            var time = new Date();
            console.log(this.time);
        }
        else {
            var args = Array.from(arguments);
            console.log(arguments);
            var functionName = args.splice(0, 1)[0];
            return localCCSDK[functionName].apply(this, args);
        }
    };
    if (queue) {
        for (var _i = 0, queue_1 = queue; _i < queue_1.length; _i++) {
            var q = queue_1[_i];
            var args = Array.from(q);
            var functionName = args.splice(0, 1)[0];
            localCCSDK[functionName].apply(this, args);
        }
    }
    var eventCCReady = document.createEvent('Event');
    eventCCReady.initEvent('ccready', true, true);
    document.dispatchEvent(eventCCReady);
    window.CCSDK = localCCSDK;
}
function init(surveyToken) {
    console.log(arguments[arguments.length - 1]);
    var config = (typeof arguments[1] === 'object') ? arguments[1] : {};
    instances[surveyToken] = (instances[surveyToken]) ?
        instances[surveyToken] : new CCSDKEntry(surveyToken, config);
    return instances[surveyToken];
}
exports.init = init;
function destroy(surveyToken) {
    this.survey.destroy();
    instances[surveyToken] = null;
}
exports.destroy = destroy;
function trigger(type, target) {
    instances[this.surveyToken].trigger(type, target);
}
exports.trigger = trigger;
//# sourceMappingURL=CCSDKEntry.js.map