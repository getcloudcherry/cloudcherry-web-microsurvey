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
import * as QuestionDate from '../templates/QuestionDate.html';
import * as LanguageSelector from '../templates/LanguageSelector.html';

let templates = {
  question_survey: QuestionSurvey,
  question_start: QuestionStart,
  question_text: QuestionSingleline,
  question_number: QuestionNumber,
  question_scale: QuestionScale,
  question_csat_agreement_5: QuestionCSATAgreement5,
  question_csat_satisfaction_5: QuestionCSATSatisfaction5,
  question_nps: QuestionNPS,
  question_multi_line_text: QuestionMultiline,
  question_multi_select: QuestionMultiSelect,
  question_radio: QuestionRadio,
  question_radio_image: QuestionRadioImage,
  question_checkbox: QuestionCheckbox,
  question_select: QuestionSelect,
  question_smile_5: QuestionSmile,
  question_date: QuestionDate,
  question_smile_5_inverted: QuestionSmileInverted,
  question_star_5: QuestionStar,
  question_slider: QuestionSlider,
  option_radio_image: OptionRadioImage,
  option_radio: OptionRadio,
  option_checkbox: OptionCheckbox,
  option_checkbox_image: OptionCheckboxImage,
  thankyou: ThankYou,
  language_selector: LanguageSelector
};

export { templates };
