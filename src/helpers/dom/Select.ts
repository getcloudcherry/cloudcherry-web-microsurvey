import { DomUtilities } from "./DomUtilities";
class Select{
  util : DomUtilities;
  $body : any ;
  $html : any ;
  qId : any ;
  constructor(qId : string){
    this.qId = qId;
	}
  init(qId : string){
    this.util = new DomUtilities();
    this.$body = document.querySelectorAll("body")[0];
    this.$html = document.querySelectorAll("html")[0];
    var select = document.querySelectorAll("#"+qId+" .cc-select");
  		// var divSelect = document.querySelectorAll("div.cc-select");
      // this.util.removeAll(divSelect);
      let parent = this;
  		Array.prototype.forEach.call(select, function(el, i){
  		  var self = el;
  			var $selectOptions = document.querySelectorAll("#"+qId+" .cc-select-options");
  		  var classes = self.getAttribute("class"),
  		      id      = self.getAttribute("id"),
  		      name    = self.getAttribute("name");
  		  var template =  '<div class="' + classes + '">';
  		      template += '<span class="cc-select-trigger">' + self.getAttribute("placeholder") + '</span>';
  		      template += '<div class="cc-select-options-container" cc-scrollbar-container><div class="cc-select-options">';
  			var options = self.querySelectorAll("option");
  				Array.prototype.forEach.call(options, function(el, i){
  		        template += '<span class="cc-select-option ' + el.getAttribute("class") + '" data-value="' + el.getAttribute("value") + '">' + el.innerHTML+ '</span>';
  		      });
  		  template += '</div></div></div>';
  		  parent.util.addClass(self, 'hide');
  		  self.insertAdjacentHTML('afterend',template);
  		});
      this.setupListeners();
  }
  setupListeners(){
    var self = this;
    var qId = self.qId;
    this.util.listener(this.$body, "click", "#"+qId+" .cc-select-option", function(e) {
      console.log(this);
      let value = this.getAttribute('data-value');
      //select cc-select-wrapper
      //todo: write a function to directly select parent via selector
      let selectOptions = this.parentNode;
      let select = selectOptions.parentNode.parentNode;
      let selectWrapper = select.parentNode;
      console.log(select);
      console.log(selectOptions);
      console.log(selectWrapper);
      //select all cc-select-option and remove class selection
      selectWrapper.querySelectorAll("select")[0].value = value;
      // self.util.removeClassAll(selectOptions.querySelectorAll(".cc-select-option"), "selection");
      // this.parents(".cc-select-options").find(".cc-select-option").removeClass("selection");
      self.util.addClass(this,"selection");
      self.util.removeClassAll(select, "opened");
      select.querySelectorAll('.cc-select-trigger')[0].textContent = this.textContent;

    });

    this.util.listener(this.$body, "click", "#"+qId+" .cc-select-trigger", function(e) {
      self.$html.addEventListener('click',function(){
        self.util.removeClassAll(document.querySelectorAll(".cc-select"), "opened");
        self.$html.removeEventListener('click', function(){
        });
      })
      var ccSelect = this.parentNode;
      // console.log(ccSelect);
      self.util.toggleClass(ccSelect, "opened");
      e.stopPropagation();
    });




  }

}
export { Select }
