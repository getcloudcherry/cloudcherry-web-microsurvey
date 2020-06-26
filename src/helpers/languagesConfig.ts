const allLanguages: any[] = [
  {
    code: "en-gb",
    name: "English UK",
    text: "English UK",
    locale: "en-GB",
  },
  {
    code: "fr",
    name: "French",
    text: "français",
    locale: "fr-FR",
  },
  {
    code: "de",
    name: "German",
    text: "Deutsch",
    locale: "de-DE",
  },
  {
    code: "zh",
    name: "Chinese",
    text: "中文",
    locale: "zh-CN",
  },
  {
    code: "ja",
    name: "Japanese",
    text: "日本語",
    locale: "ja-JP",
  },
  {
    code: "es",
    name: "Spanish",
    text: "español",
    locale: "es-ES",
  },
  {
    code: "it",
    name: "Italian",
    text: "italiano",
    locale: "it-IT",
  },
  {
    code: "nl",
    name: "Dutch",
    text: "Nederlands",
    locale: "nl-NL",
  },
  {
    code: "ko",
    name: "Korean",
    text: "한국어",
    locale: "ko-KR",
  },
  {
    code: "pt",
    name: "Portuguese",
    text: "português",
    locale: "pt-PT",
  },
  {
    code: "da",
    name: "Danish",
    text: "dansk",
    locale: "da-DK",
  },
  {
    code: "fi",
    name: "Finnish",
    text: "suomi",
    locale: "fi-FI",
  },
  {
    code: "no",
    name: "Norwegian",
    text: "Norsk",
    locale: "nn-NO",
  },
  {
    code: "sv",
    name: "Swedish",
    text: "svenska",
    locale: "sv-SE",
  },
  {
    code: "ru",
    name: "Russian",
    text: "Русский",
    locale: "ru-RU",
  },
  {
    code: "pl",
    name: "Polish",
    text: "język polski",
    locale: "pl-PL",
  },
  {
    code: "tr",
    name: "Turkish",
    text: "Türkçe",
    locale: "tr-TR",
  },
  {
    code: "ar",
    name: "Arabic",
    text: "العربية",
    locale: "ar-AE",
  },
  {
    code: "th",
    name: "Thai",
    text: "ไทย",
    locale: "th-TH",
  },
  {
    code: "hu",
    name: "Hungarian",
    text: "magyar",
    locale: "hu-HU",
  },
  {
    code: "he",
    name: "Hebrew",
    text: "עברית",
    locale: "he-IL",
  },
  {
    code: "id",
    name: "Indonesian",
    text: "Bahasa Indonesia",
    locale: "id-ID",
  },
  {
    code: "ms",
    name: "Melayu",
    text: "Bahasa Melayu",
    locale: "ms-MY",
  },
  {
    code: "bn",
    name: "Bengali",
    text: "বাংলা",
    locale: "bn-IN",
  },
  {
    code: "fa",
    name: "Farsi",
    text: "فارسی",
    locale: "fa-IR",
  },
  {
    code: "gu",
    name: "Gujarati",
    text: "ગુજરાતી",
    locale: "gu-IN",
  },
  {
    code: "hi",
    name: "Hindi",
    text: "हिन्दी",
    locale: "hi-IN",
  },
  {
    code: "kn",
    name: "Kannada",
    text: "ಕನ್ನಡ",
    locale: "kn-IN",
  },
  {
    code: "ml",
    name: "Malayalam",
    text: "മലയാളം",
    locale: "ml-IN",
  },
  {
    code: "mr",
    name: "Marathi",
    text: "मराठी",
    locale: "mr-IN",
  },
  {
    code: "pa",
    name: "Punjabi",
    text: "ਪੰਜਾਬੀ",
    locale: "pa-IN",
  },
  {
    code: "ta",
    name: "Tamil",
    text: "தமிழ்",
    locale: "ta-IN",
  },
  {
    code: "te",
    name: "Telugu",
    text: "తెలుగు",
    locale: "te-IN",
  },
  {
    code: "as",
    name: "Assamese",
    text: "অসমীয়া",
    locale: "as-IN",
  },
  {
    code: "ur",
    name: "Urdu",
    text: "اردو",
    locale: "ur-PK",
  },
  {
    code: "tl",
    name: "Tagalog",
    text: "Tagalog",
    locale: "tl-PH",
  },
  {
    code: "vi",
    name: "Vietnamese",
    text: "Tiếng Việt",
    locale: "vi-VN",
  },
  {
    code: "or",
    name: "Odiya",
    text: "ଓଡ଼ିଆ",
    locale: "or-IN",
  },
];

class LanguagesConfig {
  constructor() {}
  getLanguageText(languages: string[]) {
    return languages.map((language) => {
      let languageObj = allLanguages.filter(
        (allLanguage) =>
          allLanguage.text === language || allLanguage.locale === language
      );
      if (languageObj && languageObj.length > 0) {
        return languageObj[0].text;
      }
      return;
    });
  }
}

export { LanguagesConfig };
