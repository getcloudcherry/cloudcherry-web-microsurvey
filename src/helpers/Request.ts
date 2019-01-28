// import 'whatwg-fetch';

function makeRequest( method: string, url: string, postParams: string, headers: any, successcb: any, errorcb: any ): any {
  var xhr = new XMLHttpRequest();
  xhr.open( method, url );
  xhr.onload = function () {
    if ( ( this as any ).status >= 200 && ( this as any ).status < 300 ) {
      if ( xhr.response ) {
      }
      let res: any = xhr.response && typeof xhr.response === 'string' && !xhr.response.match( 'GIF' ) ? JSON.parse( xhr.response ) : '';
      if ( successcb ) successcb( res );
    } else {
      if ( errorcb ) {
        errorcb( {
          status: ( this as any ).status,
          statusText: xhr.statusText
        } );
      }
    }
  };
  xhr.onerror = function () {
    if ( errorcb ) {
      errorcb( {
        status: ( this as any ).status,
        statusText: xhr.statusText
      } );
    }
  };
  if ( headers ) {
    Object.keys( headers ).forEach( function ( key ) {
      xhr.setRequestHeader( key, headers[ key ] );
    } );
  }
  // var params : any = postParams;
  // We'll need to stringify if we've been given an object
  // If we have a string, this is skipped.
  // if (params && typeof params === 'object') {
  //   params = Object.keys(params).map(function (key) {
  //     return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  //   }).join('&');
  // }
  xhr.send( postParams );
}

class RequestHelper {

  static getWithHeaders( url: string, headers: any, successcb: any, errorcb: any ) {
    return makeRequest( "GET", url, null, headers, successcb, errorcb );
  }

  static postWithHeaders( url: string, data: Object, headers: any, successcb: any, errorcb: any ) {
    headers[ "Content-Type" ] = "application/json; charset=utf-8";
    return makeRequest( "POST", url, JSON.stringify( data ), headers, successcb, errorcb );

  }

  static get( url: string, successcb: any, errorcb: any ) {
    return makeRequest( "GET", url, null, null, successcb, errorcb );
    // let request : Request = new Request( (url as any) , new Object());
    // return fetch(request).then( (response : Response) => {
    //   if (response.status >= 200 && response.status < 300) {
    //     return Promise.resolve(response);
    //   } else {
    //     var error = new Error(response.statusText);
    //     // error.response = response;
    //     throw error;
    //   }
    // }).then( (response : Response) => {
    //   return response.json();
    // }).catch( (error : Error) => {
    //   (window as any).ccsdkDebug?console.log('Request failed ', error):'';
    // });
  }

  /**
   *
   * var data = new FormData()
   *  data.append('file', input.files[0])
   *  data.append('user', 'hubot')
   *
   * @static
   * @param {any} url
   * @param {any} data
   * @memberof Request
   */
  static post( url: string, data: Object, successcb: any, errorcb: any ) {
    //consider, file upload?
    // (window as any).ccsdkDebug?console.log("[" + JSON.stringify(data) + "]"):'';
    ( window as any ).ccsdkDebug ? console.log( "Sending : " + data ) : '';
    return makeRequest( "POST", url, JSON.stringify( data ), { "Content-Type": "application/json; charset=utf-8" }, successcb, errorcb );
    // let request : Request = new Request( (url as any), {
    //   method : "POST",
    //   headers : {
    //     "Content-Type" : "application/json; charset=utf-8"
    //   },
    //   body : JSON.stringify(data)
    // });
    // return fetch(request).then( (response : Response) => {
    //   if (response.status >= 200 && response.status < 300) {
    //     return Promise.resolve(response);
    //   } else {
    //     let error : Error = new Error(response.statusText);
    //     // error.response = response;
    //     throw error;
    //   }
    // }).then( (response : Response) => {
    //   return response.json();
    // }).catch( (error : Error) => {
    //   (window as any).ccsdkDebug?console.log('Request failed ', error):'';
    // });
  }

}

export { RequestHelper };
