// import 'whatwg-fetch';

function makeRequest (method : string, url : string, postParams : string, headers : any) : any {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if ((this as any).status >= 200 && (this as any).status < 300) {
        let res : any = xhr.response?JSON.parse(xhr.response):'';
        resolve(res);
      } else {
        reject({
          status: (this as any).status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: (this as any).status,
        statusText: xhr.statusText
      });
    };
    if (headers) {
      Object.keys(headers).forEach(function (key) {
        xhr.setRequestHeader(key, headers[key]);
      });
    }
    // var params : any = postParams;
    // We'll need to stringify if we've been given an object
    // If we have a string, this is skipped.
    // if (params && typeof params === 'object') {
    //   params = Object.keys(params).map(function (key) {
    //     return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    //   }).join('&');
    // }
    xhr.send(postParams);
  });
}

class RequestHelper {

  static getWithHeaders(url : string, headers : any) {
    return makeRequest("GET", url, null, headers);
  }

  static postWithHeaders(url : string, data : Object, headers : any) {
    headers["Content-Type"] = "application/json; charset=utf-8";
    return makeRequest("POST", url, JSON.stringify(data), headers);
    
  }

  static get(url : string) {
    return makeRequest("GET", url, null, null);
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
    //   console.log('Request failed ', error);
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
  static post(url : string, data : Object) {
    //consider, file upload?
    // console.log("[" + JSON.stringify(data) + "]");
    console.log("Sending : " + data);
    return makeRequest("POST", url, JSON.stringify(data), { "Content-Type" : "application/json; charset=utf-8" });
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
    //   console.log('Request failed ', error);
    // });
  }

}

export { RequestHelper };
