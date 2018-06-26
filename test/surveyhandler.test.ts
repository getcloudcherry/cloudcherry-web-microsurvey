
import * as assert from 'assert';
import 'chai';
import { SurveyHandler } from "../src/SurveyHandler";
// import 'mocha';
( window as any ).ccsdkDebug ? console.log( 'running tests' ) : '';

let survey = new SurveyHandler( "WW-02872" );

describe( 'SurveyHandler', function () {
  describe( 'fetchQuestion', function () {
    it( 'should fetch all question if available', async function () {
      // let surveyJson = await survey.fetchQuestions();
      // (window as any).ccsdkDebug?console.log(surveyJson):'';
      // assert.notEqual(surveyJson, undefined);
      // console.log("test");
      //assert from others.
      // help();
    } );
  } );
} );
