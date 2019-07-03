import { templates } from '../templates';
import { Config } from '../../Config';

class DomUtilities {

  sbcRip: any;

  constructor() {
    // HTMLElement.prototype.matches = HTMLElement.prototype.matches ||
    // HTMLElement.prototype.matchesSelector ||
    // HTMLElement.prototype.webkitMatchesSelector ||
    // HTMLElement.prototype.mozMatchesSelector ||
    // HTMLElement.prototype.msMatchesSelector ||
    // HTMLElement.prototype.oMatchesSelector;
  }

  get(selector: string) {
    return document.querySelectorAll(selector);
  }

  appendStyle(css: string): void {
    let head: any = document.head || document.getElementsByTagName('head')[0];
    let style: any = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }

  remove(el: any) {
    el.parentNode.removeChild(el);
  }

  removeAll(elements: any): void {
    Array.prototype.forEach.call(elements, (el, i) => {
      el.parentNode.removeChild(el);
    });
  }

  css(elements: any, property: string, value: any) {
    Array.prototype.forEach.call(elements, (el, i) => {
      el.style[property] = value;
    });
  }

  removeClassAll(elements: any, className: string): void {
    Array.prototype.forEach.call(elements, (el, i) => {
      this.removeClass(el, className);
    });
  }

  addClassAll(elements: any, className: string): void {
    Array.prototype.forEach.call(elements, (el, i) => {
      this.addClass(el, className);
    });
  }

  removeClass(el: any, className: string): void {
    // console.log(el);
    if (!el) {
      return;
    }
    if (el.classList)
      el.classList.remove(className);
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
  addClass(el: any, className: string) {
    if (!el) {
      return;
    }
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
  }
  toggleClass(el: any, className: string): void {
    if (el.classList) {
      if (el.classList.contains(className))
        el.classList.remove(className);
      else
        el.classList.add(className);
    }


  }
  hasClass(el: any, className: string) {
    if (el.classList)
      return el.classList.contains(className);
    else
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
  ready(fn: any): void {
    if ((<any>document).attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  getParents(el: any, parentSelector: any): any {
    // If no parentSelector defined will bubble up all the way to *document*
    if (parentSelector === undefined) {
      parentSelector = document;
    }

    var parents = [];
    var p = el.parentNode;

    while (p !== parentSelector) {
      var o = p;
      parents.push(o);
      p = o.parentNode;
    }
    parents.push(parentSelector); // Push that parentSelector you wanted to stop at

    return parents;
  }

  listener(el: any, evt: any, sel: any, handler: any): any {
    let selectorMatches = function (el, selector) {
      var p = Element.prototype;
      var f = p.matches || p.webkitMatchesSelector || (<any>p).mozMatchesSelector || (<any>p).msMatchesSelector || function (s) {
        return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
      };
      return f.call(el, selector);
    }
    let internalHandler = function (event) {
      var t = event.target;
      while (t && t !== this) {
        if (selectorMatches(t, sel)) {
          handler.call(t, event);
        }
        t = t.parentNode;
      }
    };
    el.addEventListener(evt, internalHandler);
    return internalHandler;
  }




  initListener(type: string, id: string, cb: any) {
    let ref: any = {
      id: id,
      type: type,
      cb: cb,
      internalHandler: undefined,
    };
    return ref;
  }

  checkIfListenerExists(id: string, ar: any): boolean {
    for (let listener of ar) {
      if (listener.id == id) {
        return true;
      }
    }
    return false;
  }

  on(evt: any, el: any, handler: any) {
    el.addEventListener(evt, handler);
  }
  off(evt: any, el: any, handler: any) {
    el.removeEventListener(evt, handler);
  }
  removeListener(el: any, evt: any, handler: any) {
    el.removeEventListener(evt, handler);
  }
  removeAllListeners(ar: any): boolean {
    for (let listener of ar) {
      this.removeListener(document.querySelectorAll("body")[0], listener.type, listener.internalHandler);
    }
    return true;
  }

  trigger(el: any, eventName: string, data: Object) {
    if (typeof CustomEvent === 'function') {
      var event = <any>new CustomEvent(eventName, { detail: data });
    } else {
      var event = <any>document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, data);
    }

    el.dispatchEvent(event);
  }

  removeTrigger(el: any, eventName: string) {
    el.removeEventListener(eventName);
  }

  shadeBlendConvert(p: number, from: any, to: string): string {
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (from) != "string" || (from[0] != 'r' && from[0] != '#') || (typeof (to) != "string" && typeof (to) != "undefined")) return null; //ErrorCheck
    if (!this.sbcRip) this.sbcRip = function (d) {
      var l = d.length, RGB = new Object();
      if (l > 9) {
        d = d.split(",");
        if (d.length < 3 || d.length > 4) return null;//ErrorCheck
        RGB[0] = i(d[0].slice(4)), RGB[1] = i(d[1]), RGB[2] = i(d[2]), RGB[3] = d[3] ? parseFloat(d[3]) : -1;
      } else {
        if (l == 8 || l == 6 || l < 4) return null; //ErrorCheck
        if (l < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? d[4] + "" + d[4] : ""); //3 digit
        d = i(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = l == 9 || l == 5 ? r(((d >> 24 & 255) / 255) * 10000) / 10000 : -1;
      }
      return RGB;
    }
    var i = parseInt, r = Math.round, h = from.length > 9, h = typeof (to) == "string" ? to.length > 9 ? true : to == "c" ? !h : false : h, b = p < 0, p = b ? p * -1 : p, to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF", f = this.sbcRip(from), t = this.sbcRip(to);
    if (!f || !t) return null; //ErrorCheck
    if (h) return "rgb(" + r((t[0] - f[0]) * p + f[0]) + "," + r((t[1] - f[1]) * p + f[1]) + "," + r((t[2] - f[2]) * p + f[2]) + (f[3] < 0 && t[3] < 0 ? ")" : "," + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3]) + ")");
    else return "#" + (0x100000000 + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255) * 0x1000000 + r((t[0] - f[0]) * p + f[0]) * 0x10000 + r((t[1] - f[1]) * p + f[1]) * 0x100 + r((t[2] - f[2]) * p + f[2])).toString(16).slice(f[3] > -1 || t[3] > -1 ? 1 : 3);
  }

  hexToRGB(hex: string, alpha: any): string {
    if (!hex || [4, 7].indexOf(hex.length) === -1) {
      return; // throw new Error('Bad Hex');
    }

    hex = hex.substr(1);
    // if shortcuts (#F00) -> set to normal (#FF0000)
    if (hex.length === 3) {
      hex = hex.split('').map(function (el) {
        return el + el + '';
      }).join('');
    }

    var r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }


  arrayContains(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
      indexOf = Array.prototype.indexOf;
    } else {
      indexOf = function (needle) {
        var i = -1, index = -1;

        for (i = 0; i < this.length; i++) {
          var item = this[i];

          if ((findNaN && item !== item) || item === needle) {
            index = i;
            break;
          }
        }

        return index;
      };
    }

    return indexOf.call(this, needle) > -1;
  }

  generateSelectOptions(arr: string[], translatedArr: string[]) {
    if (Array.isArray(arr)) {
      let i: number = 0;
      let res: string = '';
      for (i = 0; i < arr.length; i++) {
        let translatedOpt = (translatedArr[i] || arr[i]).split(';');
        let arrOpt = arr[i].split(';');
        res += '<option value="' + arrOpt[0] + '">' + (translatedOpt[0]) + '</option>';
      }
      return res;
    }
  }
  generateLanguageSelectOptions(arr: any) {
    if (Array.isArray(arr)) {
      let i: number = 0;
      let res: string = '';
      for (i = 0; i < arr.length; i++) {
        if (arr[i] == 'default') {
          res += '<option value="' + arr[i] + '">English (Default)</option>';
        } else {
          res += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
        }
      }
      return res;
    }
  }
  checkOptionContainsImage(arr: any) {
    if (Array.isArray(arr)) {
      let i: number = 0;
      let res: boolean = true;
      for (i = 0; i < arr.length; i++) {
        let opt: any = arr[i];
        res = res && (opt.indexOf(';') !== -1) && (opt.indexOf('.') !== -1);
      }
      return res;
    }
  }

  generateRadioImageOptions(arr: string[], translatedArr: string[], id: string) {
    if (Array.isArray(arr)) {
      let i: number = 0;
      let res: string = '';
      for (i = 0; i < arr.length; i++) {
        let optHtml: string = templates.option_radio_image;
        let opt: any = arr[i].split(';')
        let translatedOpt = translatedArr[i].split(';')
        //  optHtml = optHtml.replace(/{{image}}/g, Config.CDN_URL+opt[1] );
        //  optHtml = optHtml.replace(/{{image}}/g, 'https://cx.getcloudcherry.com/microsurvey-assets/' + opt[0] + '_selected.svg');
        optHtml = optHtml.replace(/{{image}}/g, 'https://cx.getcloudcherry.com/microsurvey-assets/' + opt[1]);
        optHtml = optHtml.replace(/{{qId}}/g, "nm" + id);
        optHtml = optHtml.replace(/{{label}}/g, translatedOpt[0]);
        optHtml = optHtml.replace(/{{labelFor}}/g, translatedOpt[0].replace(/\s+/g, '-'));
        optHtml = optHtml.replace(/{{value}}/g, opt[0]);
        res += optHtml;

      }
      return res;
    }
  }
  generateRadioIgnoreImageOptions(arr: string[], translatedArr: string[], id: string) {
    if (Array.isArray(arr)) {
      let i: number = 0;
      let res: string = '';
      for (i = 0; i < arr.length; i++) {
        let optHtml: string = templates.option_radio;
        let opt: any = arr[i].split(';');
        let translatedOpt = translatedArr[i].split(';');
        //  optHtml = optHtml.replace(/{{image}}/g, Config.CDN_URL+opt[1] );
        //  optHtml = optHtml.replace(/{{image}}/g, 'https://cx.getcloudcherry.com/microsurvey-assets/' + opt[0] + '_selected.svg');
        optHtml = optHtml.replace(/{{qId}}/g, "nm" + id);
        optHtml = optHtml.replace(/{{label}}/g, translatedOpt[0]);
        optHtml = optHtml.replace(/{{labelFor}}/g, translatedOpt[0].replace(/\s+/g, '-'));
        optHtml = optHtml.replace(/{{value}}/g, opt[0]);
        res += optHtml;

      }
      return res;
    }
  }


  generateRadioOptions(arr: string, translatedArr: string[], id: string) {
    if (Array.isArray(arr)) {
      let i: number = 0;
      let res: string = '';
      for (i = 0; i < arr.length; i++) {
        let optHtml: string = templates.option_radio;
        let opt: any = arr[i].split(';');
        // normal radio
        let translatedOpt = translatedArr[i].split(';');
        optHtml = optHtml.replace(/{{qId}}/g, "nm" + id);
        optHtml = optHtml.replace(/{{label}}/g, translatedOpt[0]);
        optHtml = optHtml.replace(/{{labelFor}}/g, translatedOpt[0].replace(/\s+/g, '-'));
        optHtml = optHtml.replace(/{{value}}/g, opt[0]);
        res += optHtml;
      }
      return res;
    }
  }
  generateCheckboxImageOptions(arr: string[], translatedArr: string[], id: string) {
    if (Array.isArray(arr)) {
      let i: number = 0;
      let res: string = '';
      for (i = 0; i < arr.length; i++) {
        let optHtml: string = templates.option_checkbox_image;
        let opt: any = arr[i].split(';');
        let translatedOpt = translatedArr[i].split(';');
        //  optHtml = optHtml.replace(/{{image}}/g, Config.CDN_URL+opt[1] );
        //  optHtml = optHtml.replace(/{{image}}/g, 'https://cx.getcloudcherry.com/microsurvey-assets/' + opt[0] + '_selected.svg');
        optHtml = optHtml.replace(/{{image}}/g, 'https://cx.getcloudcherry.com/microsurvey-assets/' + opt[1]);
        optHtml = optHtml.replace(/{{qId}}/g, "nm" + id);
        optHtml = optHtml.replace(/{{label}}/g, translatedOpt[0]);
        optHtml = optHtml.replace(/{{labelFor}}/g, translatedOpt[0].replace(/\s+/g, '-'));
        optHtml = optHtml.replace(/{{value}}/g, opt[0]);
        res += optHtml;
      }
      return res;
    }
  }

  generateCheckboxIgnoreImageOptions(arr: string[], translatedArr: string[], id: string) {
    if (Array.isArray(arr)) {
      let i: number = 0;
      let res: string = '';
      for (i = 0; i < arr.length; i++) {
        let optHtml: string = templates.option_checkbox;
        let opt: any = arr[i].split(';');
        let translatedOpt = translatedArr[i].split(';');

        //  optHtml = optHtml.replace(/{{image}}/g, Config.CDN_URL+opt[1] );
        //  optHtml = optHtml.replace(/{{image}}/g, 'https://cx.getcloudcherry.com/microsurvey-assets/' + opt[0] + '_selected.svg');
        optHtml = optHtml.replace(/{{qId}}/g, "nm" + id);
        optHtml = optHtml.replace(/{{label}}/g, translatedOpt[0]);
        optHtml = optHtml.replace(/{{labelFor}}/g, translatedOpt[0].replace(/\s+/g, '-'));
        optHtml = optHtml.replace(/{{value}}/g, opt[0]);
        res += optHtml;

      }
      return res;
    }
  }

  generateCheckboxOptions(arr: string[], translatedArr: string[], id: string) {
    if (Array.isArray(arr)) {
      let i: number = 0;
      let res: string = '';
      for (i = 0; i < arr.length; i++) {
        let optHtml: string = templates.option_checkbox;
        let opt: any = arr[i].split(';');
        let translatedOpt = translatedArr[i].split(';');
        optHtml = optHtml.replace(/{{label}}/g, translatedOpt[0]);
        optHtml = optHtml.replace(/{{labelFor}}/g, translatedOpt[0].replace(/\s+/g, '-'));
        optHtml = optHtml.replace(/{{value}}/g, opt[0]);

        res += optHtml;

      }
      // console.log( res );
      return res;
    }
  }
}


//add Math.round


export { DomUtilities };
