class Config {
  static API_URL: String = "https://api.getcloudcherry.com";
  // static API_URL: String = "https://api-playground-shangrila .cloudcherry.com";
  static SURVEY_BY_TOKEN: String = "/api/SurveyByToken/{token}/";
  // static SURVEY_BY_TOKEN : String  = "/api/SurveyByToken/{token}/{tabletId}";
  static SURVEY_PARTIAL_RESPONSE: String =
    "/api/PartialSurvey/{id}/{complete}/JS-MicroWeb";
  // static SURVEY_PARTIAL_RESPONSE : String =  "/api/PartialSurvey/{id}/{complete}/JS-Web/{tabletId}";
  static CDN_URL: string = "https://cx.getcloudcherry.com/";
  static CDN_ASSET_URL: string =
    "https://cx.getcloudcherry.com/microsurvey-assets/";
  static POST_LOGIN_TOKEN = "/api/LoginToken";
  static GET_SURVEY_THROTTLE_LOGIC = "/api/SurveyThrottleLogic/{location}";
  static POST_THROTTLING = "/api/Throttling";
  static POST_THROTTLING_ADD_ENTRIES = "/api/Throttling/AddEntries";
  static POST_SURVEY_FINAL = "/api/surveybytoken/{tokenId}";
  static GET_CAMPAIGN = "/api/SurveyToken/Campaign/{token}/";
}

export { Config };
