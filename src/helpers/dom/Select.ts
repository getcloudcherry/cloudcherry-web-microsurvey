import { DomUtilities } from "./DomUtilities";
class Select{
  util : DomUtilities;
  $body : any ;
  $html : any ;
  qId : any ;
  select : any;
  type : string;
  listeners : any = [];
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

      //Assumption: iterating over array but there will always be one select at a time
      this.type = select[0].getAttribute('data-type');
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
    let ref2 = this.util.initListener('click',  "#"+qId+" .cc-select-option", function(e){      
    // let ref2 = this.util.initListener(this.$body, "click", "#"+qId+" .cc-select-option", function(e) {
      console.log('click cc-select-option',this);
      let selfOption = this;
      let value = this.getAttribute('data-value');
      //select cc-select-wrapper
      //todo: write a function to directly select parent via selector
      let selectOptions = this.parentNode;
      let select = selectOptions.parentNode.parentNode;
      this.select = select;
      let selectWrapper = select.parentNode;
      console.log(select);
      console.log(selectOptions);
      console.log(selectWrapper);
      //select all cc-select-option and remove class selection
      // self.util.removeClassAll(selectOptions.querySelectorAll(".cc-select-option"), "selection");
      // this.parents(".cc-select-options").find(".cc-select-option").removeClass("selection");

      self.util.addClass(this,"selection");
      let selectedOptionText = select.querySelectorAll('.cc-select-trigger')[0].textContent;
      console.log('select type', self.type);
      if(self.type !== 'multiple'){
        selectedOptionText = selfOption.textContent;
        self.util.removeClassAll(select, "opened");
        selectWrapper.querySelectorAll("select")[0].value = value;
      
      }else{
        console.log(selectedOptionText);        
        if(selectedOptionText != 'Select'){
          if(selectedOptionText.indexOf(selfOption.textContent) == 0){
            selectedOptionText = selectedOptionText.replace(selfOption.textContent + ',', '') ;   
            selectedOptionText = selectedOptionText.replace(selfOption.textContent, '') ;   
            self.util.removeClass(this,"selection");
          }else if(selectedOptionText.indexOf(selfOption.textContent) > 0){
            selectedOptionText = selectedOptionText.replace(',' + selfOption.textContent, '') ;    
            self.util.removeClass(this,"selection");
          }else{
            selectedOptionText = selectedOptionText + ',' + selfOption.textContent;
          }
        
        }else{
          console.log(selfOption.textContent);
          selectedOptionText = selfOption.textContent;
        }
        selectWrapper.querySelectorAll("select")[0].value = selectedOptionText;
        
        if(selectedOptionText.length < 1){
          select.querySelectorAll('.cc-select-trigger')[0].textContent = 'Select';
        }else{
          select.querySelectorAll('.cc-select-trigger')[0].textContent = selectedOptionText;
        }
        return false;
        
      }

    });
    this.listeners.push(ref2);    
    ref2.internalHandler = this.util.listener(this.$body, ref2.type, ref2.id, ref2.cb);
    let ref = this.util.initListener('click',  "#"+qId+" .cc-select-trigger", function(e){
      self.$html.addEventListener('click',function(e){
        if(!self.util.hasClass(e.target, 'cc-select-option')){
          self.util.removeClassAll(document.querySelectorAll(".cc-select"), "opened");
          self.$html.removeEventListener('click', function(){
          });
        }
      })
      var ccSelect = this.parentNode;
      console.log('click cc-select-trigger',ccSelect);
      self.util.toggleClass(ccSelect, "opened");
      e.stopPropagation();
    });
    this.listeners.push(ref);    
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  
  }

  destroyListeners(){
    for(let listener of this.listeners) {
        this.util.removeListener(this.$body, listener.type, listener.internalHandler);
    }
    return true;
  }


  setValue(value : string){
    let self = this;
    let qId = self.qId;
    let select :any;

    select =  document.querySelectorAll("#"+qId+" select")[0];
    select.value = value;
    document.querySelectorAll("#"+qId+" .cc-select-trigger")[0].textContent = value;
  }

  selectOption(el:any){
    this.util.addClass(el, 'selection');
  }

  selectOptions(csv : string){
    let self = this;
    if(csv){
      let allOptions = csv.split(',');
      for(let option of allOptions){
        let domOptions = document.querySelectorAll("#"+self.qId+" .cc-select-option");
        Array.prototype.forEach.call(domOptions, function(el, i){
          if(el.getAttribute('data-value') == option){
            self.selectOption(el);
          }
        });
          
      }
    }
  }

}
export { Select }
