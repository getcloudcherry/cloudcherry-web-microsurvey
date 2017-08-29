class Question {
  id : String;
  user : String;
  setName : String;
  sequence : Number;
  text : String;
  audio : String;
  displayType : String;
  multiSelect : any;
  displayLegend : String;
  multiSelectChoiceTag : any;
  leadingDisplayTexts : any;
  staffFill : Boolean;
  apiFill : Boolean;
  displayLocation : any;
  displayLocationByTag : any;
  userWeight : Number;
  displayStyle : String;
  conditionalToQuestion : any;
  conditionalAnswerCheck : any;
  conditionalNumber : Number;
  endOfSurvey : Boolean;
  endOfSurveyMessage : any;
  conditionalFilter : any;
  presentationMode : any;
  analyticsTag : any;
  isRequired : Boolean;
  questionTags : String[];
  topicTags : any;
  goodAfter : any;
  goodBefore : any;
  timeOfDayAfter : any;
  isRetired : Boolean;
  note : any;
  backgroundURL : String;
  disclaimerText : String;
  validationRegex : any;
  validationHint : any;
  translated : any;
  timeLimit : any;
  interactiveLiveAPIPreFillUrl : String;
  restrictedData : Boolean;
  attributes : any;
  perLocationOverride : any;

}

export default Question;

/*

{
      "id": "598a25b2977ac32f48e064f3",
      "user": "wowlabz",
      "setName": null,
      "sequence": 1,
      "text": "Theme Classification",
      "audio": null,
      "displayType": "Text",
      "multiSelect": [],
      "displayLegend": null,
      "multiSelectChoiceTag": [],
      "leadingDisplayTexts": [],
      "staffFill": false,
      "apiFill": true,
      "displayLocation": [],
      "displayLocationByTag": [],
      "userWeight": 0,
      "displayStyle": null,
      "conditionalToQuestion": null,
      "conditionalAnswerCheck": null,
      "conditionalNumber": 0,
      "endOfSurvey": false,
      "endOfSurveyMessage": null,
      "conditionalFilter": null,
      "presentationMode": null,
      "analyticsTag": null,
      "isRequired": false,
      "questionTags": [
        "Theme"
      ],
      "topicTags": [],
      "goodAfter": null,
      "goodBefore": null,
      "timeOfDayAfter": null,
      "timeOfDayBefore": null,
      "isRetired": false,
      "note": null,
      "backgroundURL": null,
      "disclaimerText": null,
      "validationRegex": null,
      "validationHint": null,
      "translated": {},
      "timeLimit": 0,
      "interactiveLiveAPIPreFillUrl": null,
      "restrictedData": false,
      "attributes": null,
      "perLocationOverride": null
    },
*/