"use strict";
var Config = (function () {
    function Config() {
    }
    return Config;
}());
Config.API_URL = "https://api.getcloudcherry.com";
Config.SURVEY_BY_TOKEN = "/api/SurveyByToken/{token}/{tabletId}";
Config.SURVEY_PARTIAL_RESPONSE = "/api/PartialSurvey/{id}/{complete}/JS-Web/{tabletId}";
Config.CDN_URL = "https://contentcdn.azureedge.net/assets/ ";
exports.Config = Config;
//# sourceMappingURL=Config.js.map