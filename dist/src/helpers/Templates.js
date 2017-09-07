"use strict";
require("../css/main.scss");
var QuestionSurvey = require("../templates/Survey.html");
var QuestionStart = require("../templates/QuestionStart.html");
var QuestionSingleline = require("../templates/QuestionSingleline.html");
var QuestionMultiline = require("../templates/QuestionMultiline.html");
var QuestionCheckbox = require("../templates/QuestionCheckbox.html");
var QuestionRadio = require("../templates/QuestionRadio.html");
var QuestionRadioMore = require("../templates/QuestionRadioMore.html");
var QuestionRadioImage = require("../templates/QuestionRadioImage.html");
var QuestionScale = require("../templates/QuestionScale.html");
var QuestionSelect = require("../templates/QuestionSelect.html");
var QuestionSmile = require("../templates/QuestionSmile.html");
var QuestionStar = require("../templates/QuestionStar.html");
var QuestionSlider = require("../templates/QuestionSlider.html");
var OptionRadioImage = require("../templates/OptionRadioImage.html");
var ThankYou = require("../templates/ThankYou.html");
var templates = {
    question_survey: "",
    question_start: "",
    question_text: "",
    question_scale: "",
    question_multi_line_text: "",
    question_multi_select: "",
    question_radio_more: "",
    question_radio: "",
    question_radio_image: "",
    question_checkbox: "",
    question_select: "",
    question_smile_5: "",
    question_star_5: "",
    question_slider: "",
    option_radio_image: "",
    thankyou: "",
};
exports.templates = templates;
templates.question_survey = QuestionSurvey;
templates.question_start = QuestionStart;
templates.question_text = QuestionSingleline;
templates.question_scale = QuestionScale;
templates.question_slider = QuestionSlider;
templates.question_multi_line_text = QuestionMultiline;
templates.question_multi_select = QuestionSelect;
templates.question_select = QuestionSelect;
templates.question_smile_5 = QuestionSmile;
templates.question_star_5 = QuestionStar;
templates.question_checkbox = QuestionCheckbox;
templates.question_radio = QuestionRadio;
templates.question_radio_more = QuestionRadioMore;
templates.question_radio_image = QuestionRadioImage;
templates.option_radio_image = OptionRadioImage;
templates.thankyou = ThankYou;
//# sourceMappingURL=Templates.js.map