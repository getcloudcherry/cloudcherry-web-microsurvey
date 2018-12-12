import { CCSDKConfig } from "./interfaces/CCSDKConfig";
import { DisplayConfig } from "./interfaces/DisplayConfig";
import { SurveyHandler } from "./SurveyHandler";
import { DomSurvey } from "./helpers/dom/DomSurvey";
import { DomUtilities } from "./helpers/dom/DomUtilities";
import { Scrollbar } from "./helpers/dom/ScrollBar";
import { Cookie } from './helpers/Cookie';
import { Constants } from './Constants';
import { Slider } from "./helpers/dom/Slider";
import { SurveyManager } from "./SurveyManager";
import { Triggers } from './Triggers';
import { Survey } from "./Survey";
/**
 * functions that are exposed to SDK User are written here.
 * Entry point for CCSDK.
 */


let localCCSDK = {
  init: init,
  destroy: destroy,
  trigger: trigger,
  hide: hide,
  show: show,
  on: on,
  prefill: prefill,
  prefillByTag: prefillByTag,
  prefillByNote: prefillByNote
};

// let instances : any = {};

( window as any ).globalSurveyRunning = false;
( window as any ).ccsdkDebug = false;
( window as any ).isMobile = window.innerWidth <= 768 ? true : false;

if ( typeof ( window as any ).CCSDK !== 'undefined' ) {
  var queue = ( window as any ).CCSDK.q;
  ( window as any ).CCSDK = function () {
    if ( arguments && arguments.length == 0 ) {
      var time = new Date();
    } else {
      ( window as any ).ccsdkDebug ? console.log( arguments ) : '';
      var args = ( Array as any ).from( arguments );
      //Call this functions as ccsdk('functionName', ['argument1', 'argument2']);
      var functionName = args.splice( 0, 1 )[ 0 ];
      ( window as any ).ccsdkDebug ? console.log( functionName ) : '';
      return localCCSDK[ functionName ].apply( this, args );
    }
  };
  if ( queue ) {
    for ( var q of queue ) {
      var args = ( Array as any ).from( q );
      var functionName = args.splice( 0, 1 )[ 0 ];
      localCCSDK[ functionName ].apply( this, args );
    }
  }
  let eventCCReady: Event = document.createEvent( 'Event' );
  eventCCReady.initEvent( 'ccready', true, true );
  document.dispatchEvent( eventCCReady );

}

export function init( surveyToken: any ) {
  //config options can be set in arguments[1]
  //available config options : themeColor
  surveyToken = decodeURIComponent( surveyToken ).trim();
  let config = ( typeof arguments[ 1 ] === 'object' ) ? arguments[ 1 ] : {};
  //create survey instance
  if ( typeof Cookie.get( surveyToken + '-finish' ) !== 'undefined' && Cookie.get( surveyToken + '-finish' ) ) {
    return;
  }
  if ( typeof config.isActive !== 'undefined' && config.isActive ) {
    SurveyManager.surveyInstances[ surveyToken ] = ( SurveyManager.surveyInstances[ surveyToken ] ) ? SurveyManager.surveyInstances[ surveyToken ] : new Survey( surveyToken, config );
    return SurveyManager.surveyInstances[ surveyToken ];
  } else {
    //do nothing
  }

}

export function destroy( surveyToken: string ) {
  //remove from trigger manager, delete instance.
  if ( !SurveyManager ||
    !SurveyManager.surveyInstances ||
    !SurveyManager.surveyInstances[ surveyToken ] ||
    !SurveyManager.surveyInstances[ surveyToken ].dom ) {
    return;
  }
  SurveyManager.surveyInstances[ surveyToken ].dom.destroyListeners();
  SurveyManager.surveyInstances[ surveyToken ].destroy();
  delete SurveyManager.surveyInstances[ surveyToken ];
}
//
export function trigger( surveyToken: string, type: string, target: string ) {
  ( window as any ).ccsdkDebug ? console.log( SurveyManager.surveyInstances ) : '';
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    SurveyManager.surveyInstances[ surveyToken ].trigger( type, target );
  }
  //tell trigger manager to register trigger.
}

export function on( surveyToken: string, type: string, callback: any ) {
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    SurveyManager.surveyInstances[ surveyToken ].on( type, callback );
  }
}

export function prefill( surveyToken: string, questionId: string, answerObject: any ) {
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    SurveyManager.surveyInstances[ surveyToken ].prefill( questionId, answerObject );
  }
}

export function prefillByTag( surveyToken: string, questionTag: string, answer: any ) {
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    SurveyManager.surveyInstances[ surveyToken ].fillPrefill( questionTag, answer );
  }
}

export function prefillByNote( surveyToken: string, questionNote: string, answer: any ) {
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    SurveyManager.surveyInstances[ surveyToken ].fillPrefillByNote( questionNote, answer );
  }
}

export function show( surveyToken: string ) {
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    SurveyManager.surveyInstances[ surveyToken ].show();
  }
}

export function hide( surveyToken: string ) {
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    SurveyManager.surveyInstances[ surveyToken ].dom.destroyListeners();
    SurveyManager.surveyInstances[ surveyToken ].destroy();
    SurveyManager.surveyInstances[ surveyToken ].hide();
  }
}

//on exit detect


//
// export function prefill(id : string, value : string, valueType : string) {
//   SurveyManager.surveyInstances[this.surveyToken].prefill(id, value, valueType);
// }

// setInterval(function() {
//   //collect data and add to cookies.
// }, 1000);
