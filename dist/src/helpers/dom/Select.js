"use strict";
var DomUtilities_1 = require("./DomUtilities");
var Select = (function () {
    function Select() {
        this.util = new DomUtilities_1.DomUtilities();
        this.$body = document.querySelectorAll("body");
        this.$html = document.querySelectorAll("html")[0];
        var select = document.querySelectorAll(".cc-select");
        var parent = this;
        Array.prototype.forEach.call(select, function (el, i) {
            var self = el;
            var $selectOptions = document.querySelectorAll(".cc-select-options");
            var classes = self.getAttribute("class"), id = self.getAttribute("id"), name = self.getAttribute("name");
            var template = '<div class="' + classes + '">';
            template += '<span class="cc-select-trigger">' + self.getAttribute("placeholder") + '</span>';
            template += '<div class="cc-select-options-container" cc-scrollbar-container><div class="cc-select-options">';
            var options = self.querySelectorAll("option");
            Array.prototype.forEach.call(options, function (el, i) {
                template += '<span class="cc-select-option ' + self.getAttribute("class") + '" data-value="' + self.getAttribute("value") + '">' + self.innerHTML + '</span>';
            });
            template += '</div></div></div>';
            parent.util.addClass(self, 'hide');
            self.insertAdjacentHTML('afterend', template);
        });
    }
    return Select;
}());
exports.Select = Select;
//# sourceMappingURL=Select.js.map