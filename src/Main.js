// import Promise from 'promise-polyfill';
// import 'whatwg-fetch';
import config from "./config";

import "./helpers/Dom";

//enqueue styles here.
import './css/survey.css';
import './css/questions.css';
import './css/utilities.css';

import { CCSDKEntry } from "./CCSDKEntry";

// // To add to window
// if (!window.Promise) {
//   window.Promise = Promise;
// }
// console.log(Zepto);
// let ccsdk : CCSDKEntry = new CCSDKEntry();
let ccsdk = new CCSDKEntry();
//handle SDK queue
/**
 * Register CCSDK to window.CCSDK object so that we can make calls using our window.CCSDK("functionName", "functionParam1", "functionParam2");
 */

// (window as any).CCSDK = ccsdk;
// window.CCSDK = ccsdk;
console.log('working');
if(typeof window.CCSDK !== 'undefined') {
  var queue = window.CCSDK.q;
  window.CCSDK = function()   {
      if(arguments.length == 0)   {
          var time = new Date();
          console.log(this.time);
      } else {
          // console.log(arguments);
          var args = Array.from(arguments);
          console.log(arguments);
          //Call this functions as ccsdk('functionName', ['argument1', 'argument2']);
          var functionName = args.splice(0,1)[0];
          // console.log(functionName);
          ccsdk[functionName].apply(this, args);
      }
  };
  for(var q of queue) {
      var args = Array.from(q);
      var functionName = args.splice(0, 1)[0];
      ccsdk[functionName].apply(this, args);
  }
}
