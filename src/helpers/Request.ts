// import 'whatwg-fetch';

class RequestHelper {

  static async get(url : String) {
    let request : Request = new Request( (url as any) , new Object());
    return await fetch(request).then( (response : Response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        // error.response = response;
        throw error;
      }
    }).then( (response : Response) => {
      return response.json();
    }).catch( (error : Error) => {
      console.log('Request failed ', error);
    });
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
  static async post(url : String, data : Object) {
    //consider, file upload?
    // console.log("[" + JSON.stringify(data) + "]");
    let request : Request = new Request( (url as any), { 
      method : "POST", 
      headers : { 
        "Cotent-Type" : "application/text" 
      },
      body : "[" + JSON.stringify(data) + "]"
    });
    return await fetch(request).then( (response : Response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        let error : Error = new Error(response.statusText);
        // error.response = response;
        throw error;
      }
    }).then( (response : Response) => {
      return response.json();
    }).catch( (error : Error) => {
      console.log('Request failed ', error);
    });
  }

}

export { RequestHelper };