class Cookie {
    /**
     * Set/Overwrite a cookie value
     *
     * @param name
     * @param value
     * @param days      OPTIONAL Days till this cookie will stay valid. Default is current session
     * @param path      OPTIONAL domain root will be used by default
     */
    static set(name : any, value : any, days : any, path : any) {
      if (days) {
          var date = new Date();
              date.setTime(date.getTime()+(days*24*60*60*1000));
          var expires = "; expires="+date.toUTCString();
      } else var expires = "";

      var dir = path || '/';
      document.cookie = name+"="+value+expires+"; path="+dir;
  }

  /**
   * Retrieve a cookie value
   *
   * @param name
   * @return String|null
   */
  static get(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }

  /**
   * Remove a cookie
   *
   * @param name
   */
  static delete(name) {
    Cookie.set(name,"",-1, undefined);
  }

  static getParameterByName(name : string, url : any) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}

export { Cookie };
