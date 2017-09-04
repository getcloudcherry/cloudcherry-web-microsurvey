"use strict";
require("../css/main.scss");
var QuestionSurvey = require("../templates/Survey.html");
var QuestionStart = require("../templates/QuestionStart.html");
var QuestionSingleline = require("../templates/QuestionSingleline.html");
var QuestionMultiline = require("../templates/QuestionMultiline.html");
var QuestionScale = require("../templates/QuestionScale.html");
var QuestionSelect = require("../templates/QuestionSelect.html");
var QuestionSmile = require("../templates/QuestionSmile.html");
var QuestionStar = require("../templates/QuestionStar.html");
var templates = {
    question_survey: "",
    question_start: "",
    question_text: "",
    question_scale: "",
    question_multi_line_text: "",
    question_multi_select: "",
    question_select: "",
    question_smile_5: "",
    question_star_5: ""
};
exports.templates = templates;
templates.question_survey = QuestionSurvey;
templates.question_start = QuestionStart;
templates.question_text = QuestionSingleline;
templates.question_scale = QuestionScale;
templates.question_multi_line_text = QuestionMultiline;
templates.question_multi_select = QuestionSelect;
templates.question_select = QuestionSelect;
templates.question_smile_5 = QuestionSmile;
templates.question_star_5 = QuestionStar;
//# sourceMappingURL=Templates.js.map