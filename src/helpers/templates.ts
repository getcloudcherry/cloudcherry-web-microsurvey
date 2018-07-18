import '../css/main.scss';
import * as QuestionSurvey from '../templates/Survey.html';
import * as QuestionStart from '../templates/QuestionStart.html';
import * as QuestionSingleline from '../templates/QuestionSingleline.html';
import * as QuestionNumber from '../templates/QuestionNumber.html';
import * as QuestionMultiline from '../templates/QuestionMultiline.html';
import * as QuestionCheckbox from '../templates/QuestionCheckbox.html';
import * as QuestionRadio from '../templates/QuestionRadio.html';
import * as QuestionRadioImage from '../templates/QuestionRadioImage.html';
import * as QuestionScale from '../templates/QuestionScale.html';
import * as QuestionCSATAgreement5 from '../templates/QuestionCSATAgreement5.html';
import * as QuestionCSATSatisfaction5 from '../templates/QuestionCSATSatisfaction5.html';
import * as QuestionNPS from '../templates/QuestionNPS.html';
import * as QuestionSelect from '../templates/QuestionSelect.html';
import * as QuestionMultiSelect from '../templates/QuestionMultiSelect.html';
import * as QuestionSmile from '../templates/QuestionSmile.html';
import * as QuestionSmileInverted from '../templates/QuestionSmileInverted.html';
import * as QuestionStar from '../templates/QuestionStar.html';
import * as QuestionSlider from '../templates/QuestionSlider.html';
import * as OptionRadioImage from '../templates/OptionRadioImage.html';
import * as OptionRadio from '../templates/OptionRadio.html';
import * as OptionCheckbox from '../templates/OptionCheckbox.html';
import * as OptionCheckboxImage from '../templates/OptionCheckboxImage.html';
import * as ThankYou from '../templates/ThankYou.html';

import * as LanguageSelector from '../templates/LanguageSelector.html';

let templates = {
  question_survey: "",
  question_start: "",
  question_text: "",
  question_number: "",
  question_scale: "",
  question_csat_agreement_5: "",
  question_csat_satisfaction_5: "",
  question_nps: "",
  question_multi_line_text: "",
  question_multi_select: "",
  question_radio: "",
  question_radio_image: "",
  question_checkbox: "",
  question_select: "",
  question_smile_5: "",
  question_smile_5_inverted: "",
  question_star_5: "",
  question_slider: "",
  option_radio_image: "",
  option_radio: "",
  option_checkbox: "",
  option_checkbox_image: "",
  thankyou: "",
  language_selector: ""

};


templates.question_survey = QuestionSurvey;

templates.question_start = QuestionStart;

templates.question_text = QuestionSingleline;
templates.question_number = QuestionNumber;


templates.question_scale = QuestionScale;
templates.question_csat_agreement_5 = QuestionCSATAgreement5;
templates.question_csat_satisfaction_5 = QuestionCSATSatisfaction5;
templates.question_nps = QuestionNPS;

templates.question_slider = QuestionSlider;


templates.question_multi_line_text = QuestionMultiline;


templates.question_multi_select = QuestionMultiSelect;


templates.question_select = QuestionSelect;


templates.question_smile_5 = QuestionSmile;
templates.question_smile_5_inverted = QuestionSmileInverted;

templates.question_star_5 = QuestionStar;

templates.question_checkbox = QuestionCheckbox;

templates.question_radio = QuestionRadio;

templates.question_radio_image = QuestionRadioImage;
templates.option_radio_image = OptionRadioImage;
templates.option_radio = OptionRadio;
templates.option_checkbox = OptionCheckbox;
templates.option_checkbox_image = OptionCheckboxImage;

templates.thankyou = ThankYou;

templates.language_selector = LanguageSelector;


export { templates };
