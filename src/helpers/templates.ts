import '../css/main.scss';
import  * as QuestionSurvey from '../templates/Survey.html';
import  * as QuestionStart from '../templates/QuestionStart.html';
import  * as QuestionSingleline from '../templates/QuestionSingleline.html';
import  * as QuestionNumber from '../templates/QuestionNumber.html';
import  * as QuestionMultiline from '../templates/QuestionMultiline.html';
import  * as QuestionCheckbox from '../templates/QuestionCheckbox.html';
import  * as QuestionRadio from '../templates/QuestionRadio.html';
import  * as QuestionRadioMore from '../templates/QuestionRadioMore.html';
import  * as QuestionRadioImage from '../templates/QuestionRadioImage.html';
import  * as QuestionScale from '../templates/QuestionScale.html';
import  * as QuestionNPS from '../templates/QuestionNPS.html';
import  * as QuestionSelect from '../templates/QuestionSelect.html';
import  * as QuestionSmile from '../templates/QuestionSmile.html';
import  * as QuestionStar from '../templates/QuestionStar.html';
import  * as QuestionSlider from '../templates/QuestionSlider.html';
import  * as OptionRadioImage from '../templates/OptionRadioImage.html';
import  * as OptionCheckbox from '../templates/OptionCheckbox.html';
import  * as ThankYou from '../templates/ThankYou.html';

let templates = {
  question_survey : "",
  question_start : "",
  question_text : "",
  question_number: "",
  question_scale : "",
  question_nps : "",
  question_multi_line_text : "",
  question_multi_select : "",
  question_radio_more : "",
  question_radio : "",
  question_radio_image : "",
  question_checkbox : "",
  question_select : "",
  question_smile_5 : "",
  question_star_5 : "",
  question_slider : "",
  option_radio_image : "",
  option_checkbox : "",
  thankyou : "",

};


templates.question_survey = QuestionSurvey;

templates.question_start = QuestionStart;

templates.question_text = QuestionSingleline;
templates.question_number= QuestionNumber;


templates.question_scale = QuestionScale;
templates.question_nps = QuestionNPS;

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
templates.option_checkbox = OptionCheckbox;

templates.thankyou = ThankYou;


export {templates};
