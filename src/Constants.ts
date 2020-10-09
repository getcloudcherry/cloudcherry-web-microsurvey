class Constants {
  static CCTriggerPageStartTime = "cc-trigger-page-start-time";
  static CCTriggerPageElapsedTime = "cc-trigger-page-elapsed-time";
  static CCTriggerSiteStartTime = "cc-trigger-site-start-time";
  static CCTriggerSiteElapsedTime = "cc-trigger-site-elapsed-time";
  static CCTriggerSitePageViewCount = "cc-trigger-site-page-count";
  static CCTriggerIndividualPageViewCount = "cc-trigger-individual-page-count";
  static SURVEY_IMPRESSION_EVENT = "onImpression";
  static SURVEY_START_EVENT = "onStart";
  static SURVEY_DATA_EVENT = "onData";
  static SURVEY_END_EVENT = "onEnd";
  static SURVEY_CLOSE_EVENT = "onClose";
  static SURVEY_QUESTION_EVENT = "onQuestion";
  static SURVEY_ANSWER_EVENT = "onAnswer";
  static SURVEY_CLICK_EVENT = "onClick";
  static GRANT_TYPE = "password";
  static AUTHORIZATION = "Authorization";
  static AUTHORIZATION_BEARER = "Bearer";
  static SURVEY_CLIENT = "JS-MicroWeb";
}

export const DEFAULT_PREFILL_QUEUE = {
  DIRECT: [],
  BY_TAG: [],
  BY_NOTE: []
};

export { Constants };
