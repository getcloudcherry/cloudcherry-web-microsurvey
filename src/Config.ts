class Config {
  static API_URL : String = "https://api.getcloudcherry.com";
  static SURVEY_BY_TOKEN : String  = "/api/SurveyByToken/{token}/{tabletId}";
  static SURVEY_PARTIAL_RESPONSE : String =  "/api/PartialSurvey/{id}/{complete}";
  // static SURVEY_PARTIAL_RESPONSE : String =  "/api/PartialSurvey/{id}/{complete}/JS-Web/{tabletId}";
  static CDN_URL : string = "https://cx.getcloudcherry.com/";
  static CDN_ASSET_URL : string = "https://cx.getcloudcherry.com/microsurvey-assets/";
}

export {Config};
