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
import { RequestHelper } from "./helpers/Request";
import { Config } from "./Config";
/**
 * functions that are exposed to SDK User are written here.
 * Entry point for CCSDK.
 */
declare var Sentry: any;
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
  let sentry = document.createElement( 'script' );
  sentry.src = "https://browser.sentry-cdn.com/4.5.3/bundle.min.js";
  sentry.crossOrigin = "anonymous";
  sentry.onload = () => {
    Sentry.init( { dsn: 'https://49d72b03f26d4936a104ceb51cd1f669@sentry.io/1391030' } );
  }
  document.head.appendChild( sentry );
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
  if ( typeof Cookie.get( surveyToken + '-coolDown' ) !== 'undefined' && Cookie.get( surveyToken + '-coolDown' ) ) {
    return;
  }

  if ( typeof config.isActive !== 'undefined' && config.isActive ) {
    setCoolDownPeriod( config, surveyToken );
    SurveyManager.surveyInstances[ surveyToken ] = ( SurveyManager.surveyInstances[ surveyToken ] ) ? SurveyManager.surveyInstances[ surveyToken ] : new Survey( surveyToken, config );
    SurveyManager.surveyInstances[ surveyToken ].tracking.trackEvent( 'Init MicroSurvey', {
      token: surveyToken,
      data: {
        name: ( <any>window ).isMobile ? 'Mobile Mode' : 'Desktop Mode',
        action: surveyToken
      }
    }, null, null );
    return SurveyManager.surveyInstances[ surveyToken ];
  } else {
    //do nothing
  }

}

export function setCoolDownPeriod( campaign, surveyToken ) {
  if ( campaign && campaign.coolDownPeriod && campaign.coolDownPeriod != 0 ) {
    Cookie.set( surveyToken + '-coolDown', 'true', campaign.coolDownPeriod / 86400, '/' );
  } else {
    Cookie.set( surveyToken + '-coolDown', 'true', 1, '/' );
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
    SurveyManager.surveyInstances[ surveyToken ].tracking.trackEvent( 'Trigger Type', {
      token: surveyToken,
      data: {
        name: type,
        action: surveyToken
      }
    }, null, null );
    SurveyManager.surveyInstances[ surveyToken ].trigger( type, target );
  }
  //tell trigger manager to register trigger.
}

export function on( surveyToken: string, type: string, callback: any ) {
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    SurveyManager.surveyInstances[ surveyToken ].tracking.trackEvent( 'Event Listeners', {
      token: surveyToken,
      data: {
        name: type,
        action: surveyToken
      }
    }, null, null );
    SurveyManager.surveyInstances[ surveyToken ].on( type, callback );
  }
}

export function prefill( surveyToken: string, questionId: string, answerObject: any ) {
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    SurveyManager.surveyInstances[ surveyToken ].tracking.trackEvent( 'Prefill', {
      token: surveyToken,
      data: {
        name: questionId,
        action: surveyToken
      }
    }, null, null );
    SurveyManager.surveyInstances[ surveyToken ].prefill( questionId, answerObject );
  }
}

export function prefillByTag( surveyToken: string, questionTag: string, answer: any ) {
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    SurveyManager.surveyInstances[ surveyToken ].tracking.trackEvent( 'Prefill by tag', {
      token: surveyToken,
      data: {
        name: questionTag,
        action: surveyToken
      }
    }, null, null );
    SurveyManager.surveyInstances[ surveyToken ].fillPrefill( questionTag, answer );
  }
}

export function prefillByNote( surveyToken: string, questionNote: string, answer: any ) {
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    SurveyManager.surveyInstances[ surveyToken ].tracking.trackEvent( 'Prefill by Note', {
      token: surveyToken,
      data: {
        name: questionNote,
        action: surveyToken
      }
    }, null, null );
    SurveyManager.surveyInstances[ surveyToken ].fillPrefillByNote( questionNote, answer );
  }
}

export function show( surveyToken: string ) {
  if ( typeof SurveyManager.surveyInstances[ surveyToken ] != 'undefined' ) {
    console.log( 'showing pop up' )
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