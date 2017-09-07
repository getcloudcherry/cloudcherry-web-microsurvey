"use strict";
function makeRequest(method, url, postParams, headers) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                var res = xhr.response ? JSON.parse(xhr.response) : '';
                resolve(res);
            }
            else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        if (headers) {
            Object.keys(headers).forEach(function (key) {
                xhr.setRequestHeader(key, headers[key]);
            });
        }
        xhr.send(postParams);
    });
}
var RequestHelper = (function () {
    function RequestHelper() {
    }
    RequestHelper.get = function (url) {
        return makeRequest("GET", url, null, null);
    };
    RequestHelper.post = function (url, data) {
        console.log("Sending : " + data);
        return makeRequest("POST", url, JSON.stringify(data), { "Content-Type": "application/json; charset=utf-8" });
    };
    return RequestHelper;
}());
exports.RequestHelper = RequestHelper;
//# sourceMappingURL=Request.js.map