"use strict";
var DomUtilities_1 = require("./DomUtilities");
var Select = (function () {
    function Select(qId) {
        this.qId = qId;
    }
    Select.prototype.init = function (qId) {
        this.util = new DomUtilities_1.DomUtilities();
        this.$body = document.querySelectorAll("body")[0];
        this.$html = document.querySelectorAll("html")[0];
        var select = document.querySelectorAll("#" + qId + " .cc-select");
        var parent = this;
        Array.prototype.forEach.call(select, function (el, i) {
            var self = el;
            var $selectOptions = document.querySelectorAll("#" + qId + " .cc-select-options");
            var classes = self.getAttribute("class"), id = self.getAttribute("id"), name = self.getAttribute("name");
            var template = '<div class="' + classes + '">';
            template += '<span class="cc-select-trigger">' + self.getAttribute("placeholder") + '</span>';
            template += '<div class="cc-select-options-container" cc-scrollbar-container><div class="cc-select-options">';
            var options = self.querySelectorAll("option");
            Array.prototype.forEach.call(options, function (el, i) {
                template += '<span class="cc-select-option ' + el.getAttribute("class") + '" data-value="' + el.getAttribute("value") + '">' + el.innerHTML + '</span>';
            });
            template += '</div></div></div>';
            parent.util.addClass(self, 'hide');
            self.insertAdjacentHTML('afterend', template);
        });
        this.setupListeners();
    };
    Select.prototype.setupListeners = function () {
        var self = this;
        var qId = self.qId;
        this.util.listener(this.$body, "click", "#" + qId + " .cc-select-option", function (e) {
            console.log(this);
            var value = this.getAttribute('data-value');
            var selectOptions = this.parentNode;
            var select = selectOptions.parentNode.parentNode;
            var selectWrapper = select.parentNode;
            console.log(select);
            console.log(selectOptions);
            console.log(selectWrapper);
            selectWrapper.querySelectorAll("select")[0].value = value;
            self.util.addClass(this, "selection");
            self.util.removeClassAll(select, "opened");
            select.querySelectorAll('.cc-select-trigger')[0].textContent = this.textContent;
        });
        this.util.listener(this.$body, "click", "#" + qId + " .cc-select-trigger", function (e) {
            self.$html.addEventListener('click', function () {
                self.util.removeClassAll(document.querySelectorAll(".cc-select"), "opened");
                self.$html.removeEventListener('click', function () {
                });
            });
            var ccSelect = this.parentNode;
            self.util.toggleClass(ccSelect, "opened");
            e.stopPropagation();
        });
    };
    return Select;
}());
exports.Select = Select;
//# sourceMappingURL=Select.js.map