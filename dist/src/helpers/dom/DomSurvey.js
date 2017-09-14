"use strict";
var DomUtilities_1 = require("./DomUtilities");
var Select_1 = require("./Select");
var Theme_1 = require("./Theme");
var DomSurvey = (function () {
    function DomSurvey() {
        this.trackSelects = [];
        this.trackRadios = [];
        var self = this;
        this.domListeners = [];
        var ccSDK = {
            qIndex: 0,
            totalQuestions: 0
        };
        this.qIndex = 0;
        this.qResponse = {};
        this.domSelectElements();
        this.util = new DomUtilities_1.DomUtilities();
        this.util.ready(function () {
        });
    }
    DomSurvey.prototype.setTheme = function (brandColor) {
        var self = this;
        this.util.ready(function () {
            self.theme = new Theme_1.Theme(brandColor);
        });
    };
    DomSurvey.prototype.setQIndex = function (index) {
        this.qIndex = index;
    };
    DomSurvey.prototype.getQindex = function () {
        return this.qIndex;
    };
    DomSurvey.prototype.domSelectElements = function () {
        this.$questionContainer = document.
            querySelectorAll(".cc-questions-container .cc-question-container");
        this.$popupContainer = document.querySelectorAll(".cc-popup-container");
        this.$popupContainer2 = document.querySelectorAll(".cc-popup-container-2");
        this.$body = document.querySelectorAll("body")[0];
    };
    DomSurvey.prototype.addListener = function (id, type, cb) {
        var ref = {
            id: id,
            type: type,
            cb: cb,
            internalHandler: undefined,
        };
        this.domListeners.push(ref);
        return ref;
    };
    DomSurvey.prototype.setupListeners = function () {
        var self = this;
        var startSurvey = this.addListener(".act-cc-survey-start", "click", function () {
            self.startSurvey();
        });
        startSurvey.internalHandler = this.util.listener(this.$body, startSurvey.type, startSurvey.id, startSurvey.cb);
        var nextQue = this.addListener(".act-cc-button-next", "click", function () {
            self.nextQuestion();
        });
        nextQue.internalHandler = this.util.listener(this.$body, nextQue.type, nextQue.id, nextQue.cb);
        this.util.listener(this.$body, "click", ".act-cc-button-prev", function () {
            self.prevQuestion();
        });
        this.util.listener(self.$body, "click", ".act-cc-button-close", function () {
            self.destroyListeners();
            self.util.trigger(document, 'ccclose', undefined);
        });
        this.util.listener(self.$body, "click", ".act-cc-button-minimize", function () {
            self.minimizeSurvey();
        });
    };
    DomSurvey.prototype.minimizeSurvey = function () {
        var _this = this;
        this.util.removeClass(this.$popupContainer2[0], 'hide-right-left');
        this.util.addClass(this.$popupContainer2[0], 'hide-up-bottom');
        setTimeout(function () {
            _this.util.removeClass(_this.$popupContainer2[0], 'show-slide');
        }, 200);
        this.util.removeClass(this.$popupContainer[0], 'hide-right-left');
        this.util.addClass(this.$popupContainer[0], 'hide-bottom-up');
        setTimeout(function () {
            _this.util.addClass(_this.$popupContainer[0], 'show-slide');
        }, 200);
    };
    DomSurvey.prototype.destroyListeners = function () {
        for (var _i = 0, _a = this.domListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            console.log('removing listener', listener);
            this.util.removeListener(this.$body, listener.type, listener.internalHandler);
        }
    };
    DomSurvey.prototype.startSurvey = function () {
        this.domSelectElements();
        console.log("click in setup listener survey start");
        this.util.addClassAll(this.$popupContainer2, 'show-slide');
        this.util.removeClass(this.$popupContainer[0], 'show-slide');
        this.loadFirstQuestion();
    };
    DomSurvey.prototype.updateProgress = function () {
        var el = document.querySelectorAll("#progress-line")[0];
        el.style.width = (this.qIndex / this.$questionContainer.length) * 100 + '%';
    };
    DomSurvey.prototype.loadFirstQuestion = function () {
        this.util.removeClassAll(this.$questionContainer, 'show-slide');
        this.util.addClass(this.$questionContainer[0], 'show-slide');
        this.loadQuestionSpecifics(this.$questionContainer[0], 0);
    };
    DomSurvey.prototype.nextQuestion = function () {
        console.log('submit ' + this.qResponse.type, this.qResponse);
        var isRequired = false;
        var q = this.$questionContainer[this.qIndex];
        isRequired = q.getAttribute('data-required').toLowerCase() == 'true' ? true : false;
        var span = this.$questionContainer[this.qIndex].querySelectorAll(".cc-question-container__required")[0];
        if (isRequired && Object.keys(this.qResponse).length === 0) {
            if (span) {
                this.util.addClass(span, "show");
                this.util.removeClass(span, "hide");
            }
            return;
        }
        else {
            if (span) {
                this.util.removeClass(span, "show");
                this.util.addClass(span, "hide");
            }
            this.submitQuestion(this.qIndex, this.qResponse, this.qResponse.type);
        }
        this.qResponse = {};
        this.qIndex++;
        var nextButtonState = 'initial';
        console.log(this.$questionContainer);
        var nextQ = this.$questionContainer[this.qIndex];
        console.log(this.qIndex);
        if (!nextQ &&
            (this.qIndex == this.$questionContainer.length)) {
            var leftIcon = this.util.get('.cc-icon-left');
            var rightIcon = this.util.get('.cc-icon-right');
            var nextIcon = this.util.get('.act-cc-button-next');
            this.util.addClassAll(leftIcon, 'hide-slide');
            this.util.addClassAll(rightIcon, 'hide-slide');
            this.util.addClassAll(nextIcon, 'hide-slide');
            this.util.trigger(document, 'ccdone', undefined);
            this.util.removeClassAll(this.$questionContainer, 'show-slide');
            this.updateProgress();
        }
        else {
            if (!nextQ
                && (this.qIndex > this.$questionContainer.length)) {
                this.qIndex = 0;
            }
            this.util.removeClassAll(this.$questionContainer, 'show-slide');
            this.util.addClass(nextQ, 'show-slide');
            this.updateProgress();
            this.loadQuestionSpecifics(nextQ, this.qIndex);
        }
    };
    DomSurvey.prototype.prevQuestion = function () {
        this.qIndex--;
        if (!this.$questionContainer[this.qIndex]) {
            this.qIndex = this.$questionContainer.length - 1;
        }
        this.util.removeClassAll(this.$questionContainer, 'show-slide');
        this.util.addClass(this.$questionContainer[this.qIndex], 'show-slide');
        this.updateProgress();
    };
    DomSurvey.prototype.appendInBody = function (html) {
        document.querySelectorAll("body")[0].insertAdjacentHTML('afterbegin', html);
    };
    DomSurvey.prototype.appendInQuestionsContainer = function (html) {
        document.querySelectorAll(".cc-questions-container")[0].insertAdjacentHTML('afterbegin', html);
    };
    DomSurvey.prototype.showWelcomeContainer = function () {
        var _this = this;
        setTimeout(function () {
            var startContainer = document.
                querySelectorAll(".act-cc-welcome-question-box")[0];
            _this.util.addClass(startContainer, "show-slide");
        }, 200);
    };
    DomSurvey.prototype.getSurveyContainer = function (token) {
        return document.querySelectorAll("#" + token + "-survey")[0];
    };
    DomSurvey.prototype.getWelcomeContainer = function (token) {
        return document.querySelectorAll("#" + token + "-welcome")[0];
    };
    DomSurvey.prototype.loadQuestionSpecifics = function (q, index) {
        var self = this;
        var qType = q.getAttribute('data-type');
        var qId = q.getAttribute('data-id');
        console.log(qType);
        switch (qType) {
            case 'scale':
                this.setupListenersQuestionScale(index, qId);
                break;
            case 'multiline':
                this.setupListenersQuestionMultiline(index, qId);
                break;
            case 'select':
                this.setupListenersQuestionSelect(index, qId);
                break;
            case 'checkbox':
                this.setupListenersQuestionCheckbox(index, qId);
                break;
            case 'star':
                this.setupListenersQuestionStar(index, qId);
                break;
            case 'smile':
                this.setupListenersQuestionSmile(index, qId);
                break;
            case 'slider':
                this.setupListenersQuestionSlider(index, qId);
                break;
            default:
                break;
        }
    };
    DomSurvey.prototype.setupListenersQuestionScale = function (index, qId) {
        var self = this;
        this.util.listener(this.$body, 'click', '.act-cc-question-scale span.option-number-item', function () {
            var allOptions = document.querySelectorAll('.act-cc-question-scale span.option-number-item');
            var rating = this.getAttribute('data-rating');
            self.util.removeClassAll(allOptions, "selected");
            self.util.addClass(this, "selected");
            console.log('Scale selected', rating);
            self.qResponse.type = 'scale';
            self.qResponse.text = null;
            self.qResponse.number = rating;
        });
    };
    DomSurvey.prototype.setupListenersQuestionCheckbox = function (index, qId) {
        var self = this;
        this.util.listener(this.$body, 'click', '#' + qId + ' .cc-checkbox', function () {
            var rating = [].filter.call(document.querySelectorAll('#' + qId + ' .cc-checkbox input'), function (c) {
                return c.checked;
            }).map(function (c) {
                return c.value;
            }).join(',');
            console.log('Checkbox selected', rating);
            self.qResponse.type = 'checkbox';
            self.qResponse.text = rating;
            self.qResponse.number = null;
        });
    };
    DomSurvey.prototype.setupListenersQuestionStar = function (index, qId) {
        var self = this;
        this.util.listener(this.$body, 'click', '#' + qId + ' .option-star-box', function () {
            var allOptions = document.querySelectorAll('#' + qId + ' .option-star-box');
            var rating = this.getAttribute('data-rating');
            self.util.removeClassAll(allOptions, "selected");
            self.util.addClass(this, "selected");
            console.log('Star selected', rating);
            self.qResponse.type = 'star';
            self.qResponse.text = null;
            self.qResponse.number = rating;
        });
    };
    DomSurvey.prototype.setupListenersQuestionSmile = function (index, qId) {
        var self = this;
        this.util.listener(this.$body, 'click', '#' + qId + ' .option-smile-box', function () {
            var allOptions = document.querySelectorAll('#' + qId + ' .option-smile-box');
            var rating = this.getAttribute('data-rating');
            self.util.removeClassAll(allOptions, "selected");
            self.util.addClass(this, "selected");
            console.log('Smile selected', rating);
            self.qResponse.type = 'smile';
            self.qResponse.text = null;
            self.qResponse.number = rating;
        });
    };
    DomSurvey.prototype.setupListenersQuestionMultiline = function (index, qId) {
        var self = this;
        var multilineRes = '';
        this.util.listener(this.$body, 'change', '#' + qId, function () {
            multilineRes = this.value;
            self.qResponse.type = 'multiline';
            self.qResponse.text = multilineRes;
            self.qResponse.number = null;
        });
    };
    DomSurvey.prototype.setupListenersQuestionSingleline = function (index, qId) {
        var self = this;
        var singlelineRes = '';
        this.util.listener(this.$body, 'change', '#' + qId, function () {
            singlelineRes = this.value;
            self.qResponse.type = 'singleline';
            self.qResponse.text = singlelineRes;
            self.qResponse.number = null;
        });
    };
    DomSurvey.prototype.setupListenersQuestionSlider = function (index, qId) {
        var self = this;
        var sliderRes = '';
        var ref = this.addListener('#' + qId + " input", "change", function () {
            sliderRes = this.value;
            self.qResponse.type = 'slider';
            self.qResponse.number = sliderRes;
            self.qResponse.text = null;
        });
        ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
    };
    DomSurvey.prototype.setupListenersQuestionSelect = function (index, qId) {
        var self = this;
        if (!self.util.arrayContains.call(self.trackSelects, qId)) {
            self.select = new Select_1.Select(qId);
            self.select.init(qId);
            self.trackSelects.push(qId);
        }
        var selectRes = '';
        this.util.listener(this.$body, 'click', '#' + qId + " .cc-select-options .cc-select-option", function () {
            selectRes = this.getAttribute('data-value');
            console.log(selectRes);
            self.qResponse.type = 'select';
            self.qResponse.text = selectRes;
            self.qResponse.number = null;
        });
    };
    DomSurvey.prototype.submitQuestion = function (index, data, type) {
        console.log('type', type, 'res', data);
        this.util.trigger(document, 'q-answered', {
            index: index,
            data: data,
            type: type
        });
    };
    return DomSurvey;
}());
exports.DomSurvey = DomSurvey;
//# sourceMappingURL=DomSurvey.js.map