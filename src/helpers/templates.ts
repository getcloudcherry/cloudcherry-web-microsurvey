import '../css/main.scss';
import  * as QuestionSurvey from '../templates/Survey.html';
import  * as QuestionStart from '../templates/QuestionStart.html';
import  * as QuestionSingleline from '../templates/QuestionSingleline.html';
import  * as QuestionMultiline from '../templates/QuestionMultiline.html';
import  * as QuestionCheckbox from '../templates/QuestionCheckbox.html';
import  * as QuestionRadio from '../templates/QuestionRadio.html';
import  * as QuestionScale from '../templates/QuestionScale.html';
import  * as QuestionSelect from '../templates/QuestionSelect.html';
import  * as QuestionSmile from '../templates/QuestionSmile.html';
import  * as QuestionStar from '../templates/QuestionStar.html';

let templates = {
  question_survey : "",
  question_start : "",
  question_text : "",
  question_scale : "",
  question_multi_line_text : "",
  question_multi_select : "",
  question_select : "",
  question_smile_5 : "",
  question_star_5 : ""
};


templates.question_survey = QuestionSurvey;

templates.question_start = QuestionStart;

templates.question_text = QuestionSingleline;


templates.question_scale = QuestionScale;


templates.question_multi_line_text = QuestionMultiline;


templates.question_multi_select = QuestionSelect;


templates.question_select = QuestionSelect;


templates.question_smile_5 = QuestionSmile;

templates.question_star_5 = QuestionStar;


export {templates};
