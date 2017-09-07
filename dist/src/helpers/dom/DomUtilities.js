"use strict";
var Templates_1 = require("../Templates");
var Config_1 = require("../../Config");
var DomUtilities = (function () {
    function DomUtilities() {
    }
    DomUtilities.prototype.get = function (selector) {
        return document.querySelectorAll(selector);
    };
    DomUtilities.prototype.appendStyle = function (css) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    };
    DomUtilities.prototype.remove = function (el) {
        el.parentNode.removeChild(el);
    };
    DomUtilities.prototype.removeAll = function (elements) {
        Array.prototype.forEach.call(elements, function (el, i) {
            el.parentNode.removeChild(el);
        });
    };
    DomUtilities.prototype.removeClassAll = function (elements, className) {
        var _this = this;
        Array.prototype.forEach.call(elements, function (el, i) {
            _this.removeClass(el, className);
        });
    };
    DomUtilities.prototype.addClassAll = function (elements, className) {
        var _this = this;
        Array.prototype.forEach.call(elements, function (el, i) {
            _this.addClass(el, className);
        });
    };
    DomUtilities.prototype.removeClass = function (el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };
    DomUtilities.prototype.addClass = function (el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    };
    DomUtilities.prototype.toggleClass = function (el, className) {
        if (el.classList) {
            if (el.classList.contains(className))
                el.classList.remove(className);
            else
                el.classList.add(className);
        }
    };
    DomUtilities.prototype.ready = function (fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        }
        else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };
    DomUtilities.prototype.getParents = function (el, parentSelector) {
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
        parents.push(parentSelector);
        return parents;
    };
    DomUtilities.prototype.listener = function (el, evt, sel, handler) {
        el.addEventListener(evt, function (event) {
            var t = event.target;
            while (t && t !== this) {
                if (t.matches(sel)) {
                    handler.call(t, event);
                }
                t = t.parentNode;
            }
        });
    };
    DomUtilities.prototype.on = function (evt, el, handler) {
        el.addEventListener(evt, handler);
    };
    DomUtilities.prototype.off = function (evt, el, handler) {
        el.removeEventListener(evt, handler);
    };
    DomUtilities.prototype.trigger = function (el, eventName, data) {
        if (typeof CustomEvent === 'function') {
            var event = new CustomEvent(eventName, { detail: data });
        }
        else {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, data);
        }
        el.dispatchEvent(event);
    };
    DomUtilities.prototype.removeTrigger = function (el, eventName) {
        el.removeEventListener(eventName);
    };
    DomUtilities.prototype.shadeBlendConvert = function (p, from, to) {
        if (typeof (p) != "number" || p < -1 || p > 1 || typeof (from) != "string" || (from[0] != 'r' && from[0] != '#') || (typeof (to) != "string" && typeof (to) != "undefined"))
            return null;
        if (!this.sbcRip)
            this.sbcRip = function (d) {
                var l = d.length, RGB = new Object();
                if (l > 9) {
                    d = d.split(",");
                    if (d.length < 3 || d.length > 4)
                        return null;
                    RGB[0] = i(d[0].slice(4)), RGB[1] = i(d[1]), RGB[2] = i(d[2]), RGB[3] = d[3] ? parseFloat(d[3]) : -1;
                }
                else {
                    if (l == 8 || l == 6 || l < 4)
                        return null;
                    if (l < 6)
                        d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? d[4] + "" + d[4] : "");
                    d = i(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = l == 9 || l == 5 ? r(((d >> 24 & 255) / 255) * 10000) / 10000 : -1;
                }
                return RGB;
            };
        var i = parseInt, r = Math.round, h = from.length > 9, h = typeof (to) == "string" ? to.length > 9 ? true : to == "c" ? !h : false : h, b = p < 0, p = b ? p * -1 : p, to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF", f = this.sbcRip(from), t = this.sbcRip(to);
        if (!f || !t)
            return null;
        if (h)
            return "rgb(" + r((t[0] - f[0]) * p + f[0]) + "," + r((t[1] - f[1]) * p + f[1]) + "," + r((t[2] - f[2]) * p + f[2]) + (f[3] < 0 && t[3] < 0 ? ")" : "," + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3]) + ")");
        else
            return "#" + (0x100000000 + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255) * 0x1000000 + r((t[0] - f[0]) * p + f[0]) * 0x10000 + r((t[1] - f[1]) * p + f[1]) * 0x100 + r((t[2] - f[2]) * p + f[2])).toString(16).slice(f[3] > -1 || t[3] > -1 ? 1 : 3);
    };
    DomUtilities.prototype.hexToRGB = function (hex, alpha) {
        if (!hex || [4, 7].indexOf(hex.length) === -1) {
            return;
        }
        hex = hex.substr(1);
        if (hex.length === 3) {
            hex = hex.split('').map(function (el) {
                return el + el + '';
            }).join('');
        }
        var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        }
        else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    };
    DomUtilities.prototype.arrayContains = function (needle) {
        var findNaN = needle !== needle;
        var indexOf;
        if (!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        }
        else {
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
    };
    DomUtilities.prototype.generateSelectOptions = function (arr) {
        if (Array.isArray(arr)) {
            var i = 0;
            var res = '';
            for (i = 0; i < arr.length; i++) {
                res += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
            }
            return res;
        }
    };
    DomUtilities.prototype.checkOptionContainsImage = function (arr) {
        if (Array.isArray(arr)) {
            var i = 0;
            var res = true;
            for (i = 0; i < arr.length; i++) {
                var opt = arr[i];
                res = res && opt.includes(';') && opt.includes('.');
            }
            return res;
        }
    };
    DomUtilities.prototype.generateRadioImageOptions = function (arr) {
        if (Array.isArray(arr)) {
            var i = 0;
            var res = '';
            for (i = 0; i < arr.length; i++) {
                var optHtml = Templates_1.templates.option_radio_image;
                var opt = arr[i].split(';');
                optHtml = optHtml.replace(/{{image}}/g, Config_1.Config.CDN_URL + opt[1]);
                optHtml = optHtml.replace(/{{label}}/g, opt[0]);
                optHtml = optHtml.replace(/{{value}}/g, opt[0]);
                res += optHtml;
            }
            return res;
        }
    };
    return DomUtilities;
}());
exports.DomUtilities = DomUtilities;
//# sourceMappingURL=DomUtilities.js.map