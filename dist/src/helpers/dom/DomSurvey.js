"use strict";
var DomUtilities_1 = require("./DomUtilities");
var Select_1 = require("./Select");
var Theme_1 = require("./Theme");
var DomSurvey = (function () {
    function DomSurvey(brandColor) {
        var self = this;
        var ccSDK = {
            qIndex: 0,
            totalQuestions: 0
        };
        this.qIndex = 0;
        this.util = new DomUtilities_1.DomUtilities();
        this.util.ready(function () {
            self.select = new Select_1.Select();
            self.theme = new Theme_1.Theme(brandColor);
        });
    }
    DomSurvey.prototype.setupListners = function () {
        var self = this;
        this.$questionContainer = document.querySelectorAll(".cc-questions-container .cc-question-container");
        this.$popupContainer = document.querySelectorAll(".cc-popup-container");
        this.$popupContainer2 = document.querySelectorAll(".cc-popup-container-2");
        this.$body = document.querySelectorAll("body")[0];
        this.util.listner(this.$body, "click", ".act-cc-survey-start", function (e) {
            console.log("click in setup listner survey start");
            self.util.addClassAll(self.$popupContainer2, 'show');
            self.util.removeClassAll(self.$popupContainer, 'show');
            self.loadFirstQuestion();
        });
        this.util.listner(self.$body, "click", ".act-cc-button-next", function (event) {
            self.nextQuestion();
        });
        this.util.listner(self.$body, "click", ".act-cc-button-prev", function (event) {
            self.prevQuestion();
        });
    };
    DomSurvey.prototype.updateProgress = function () {
        var el = document.querySelectorAll("#progress-line")[0];
        el.style.width = (this.qIndex / this.$questionContainer.length) * 100 + '%';
    };
    DomSurvey.prototype.loadFirstQuestion = function () {
        this.util.removeClassAll(this.$questionContainer, 'show');
        this.util.addClass(this.$questionContainer[0], 'show');
    };
    DomSurvey.prototype.nextQuestion = function () {
        this.qIndex++;
        if (this.$questionContainer[this.qIndex].length < 1) {
            this.qIndex = 0;
        }
        this.util.removeClassAll(this.$questionContainer, 'show');
        this.util.addClass(this.$questionContainer[this.qIndex], 'show');
        this.updateProgress();
    };
    DomSurvey.prototype.prevQuestion = function () {
        this.qIndex--;
        if (this.$questionContainer[this.qIndex].length < 1) {
            this.qIndex = this.$questionContainer.length - 1;
        }
        this.util.removeClassAll(this.$questionContainer, 'show');
        this.util.addClass(this.$questionContainer[this.qIndex], 'show');
        this.updateProgress();
    };
    return DomSurvey;
}());
exports.DomSurvey = DomSurvey;
//# sourceMappingURL=DomSurvey.js.map