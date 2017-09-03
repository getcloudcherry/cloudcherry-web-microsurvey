"use strict";
require("../css/survey.css");
require("../css/questions.css");
require("../css/utilities.css");
var templates = {
    question_start: "",
    question_text: "",
    question_scale: "",
    question_multi_line_text: "",
    question_multi_select: "",
    question_select: "",
    question_smile_5: ""
};
exports.templates = templates;
templates.question_start = '<div class="pop-box right-bottom">\
  <div class="overlay"></div>\
  <img src="../Navigation_Iconset/Close_Icon.svg" class="is-pop-box-close pop-box__close">\
  <div class="message-box">\
    <h2 class="message-box__text">What was the main purpose of your visit to our website today?</h2>	\
    <a href="#" class="message-box__btn">Tell Us More...</a>	\
  </div>\
</div>\
';
templates.question_text = '<div class="main-box">\
  <div class="main-box__text">\
    <p>{{question}}</p>\
  </div>\
  <div class="main-box__content">\
    <ul class="main-box__list">\
      <li>\
        <label class="ui checkbox" for="check-one">\
          <input type="checkbox" name="" id="check-one">\
          <span>Learn more about a product</span>\
        </label>\
      </li>\
    </ul>\
  </div>\
</div>';
templates.question_scale = '<div class="main-box">\
  <div class="main-box__text">\
    <p>{{question}}</p>\
  </div>\
  <div class="main-box__content rating-color">\
    <div class="main-box__list">\
      <span class="number-item zero">0</span>\
      <span class="number-item one">1</span>\
      <span class="number-item two">2</span>\
      <span class="number-item three">3</span>\
      <span class="number-item four">4</span>\
      <span class="number-item five">5</span>\
      <span class="number-item six">6</span>\
      <span class="number-item seven">7</span>\
      <span class="number-item eight">8</span>\
      <span class="number-item nine">9</span>\
      <span class="number-item ten">10</span>\
      <span class="clearfix"></span>\
      <span class="left-rating-text">Not at all likely</span>\
      <span class="right-rating-text">Very likely</span>\
    </div>\
  </div>\
</div>';
templates.question_multi_line_text = '<div class="main-box radio-toggle" style="display: ;">\
  <div class="main-box__text">\
    <p>{{question}}</p>\
  </div>\
  <div class="main-box__content">\
    <textarea class="multiline-box" placeholder="Share your thoughts..."></textarea>\
  </div>\
</div>';
templates.question_multi_select = '<div class="main-box">\
  <div class="main-box__text">\
    <p>{{question}}</p>\
  </div>\
  <div class="main-box__content">\
    <ul class="main-box__list">\
      <li>\
        <label class="ui checkbox" for="check-one">\
          <input type="checkbox" name="" id="check-one">\
          <span>Learn more about a product</span>\
        </label>\
      </li>\
    </ul>\
  </div>\
</div>';
templates.question_select = '<div class="main-box">\
  <div class="main-box__text">\
    <p>{{question}}</p>\
  </div>\
  <div class="main-box__content">\
    <ul class="main-box__list">\
      <li>\
        <label class="ui checkbox" for="check-one">\
          <input type="checkbox" name="" id="check-one">\
          <span>Learn more about a product</span>\
        </label>\
      </li>\
    </ul>\
  </div>\
</div>';
templates.question_smile_5 = '<div class="main-box"">\
  <div class="main-box__text">\
    <p>{{question}}</p>\
  </div>\
  <div class="main-box__content rating-color">\
    <div class="main-box__list">\
      <span class="smile-box"><img src="images/Sad_Smilie.svg"></span>\
      <span class="smile-box"><img src="images/StraightFace_smilie.svg"></span>\
      <span class="smile-box"><img src="images/MEh_smilie.svg"></span>\
      <span class="smile-box"><img src="images/Similing_Smilie.svg"></span>\
      <span class="smile-box"><img src="images/Happy_Smilie.svg"></span>\
    </div>\
  </div>\
</div>';
