import { DomUtilities } from './DomUtilities';
// import { ScrollBar } from './ScrollBar';
import { Select } from './Select';
import { Theme } from './Theme';

class DomSurvey{

  util : DomUtilities;
  // scrollbar : ScrollBar;
  select : Select;
  theme : Theme;
  qIndex : number;
  $questionContainer : any;
  $popupContainer : any;
  $popupContainer2 : any;
  $body : any;


  constructor( brandColor : string ){
    let self:DomSurvey = this;
    self.$questionContainer = document.querySelectorAll(".cc-questions-container .cc-question-container");
  	self.$popupContainer = document.querySelectorAll(".cc-popup-container");
  	self.$popupContainer2 = document.querySelectorAll(".cc-popup-container-2");
  	self.$body = document.querySelectorAll("body")[0];
  	let ccSDK = {
  		qIndex : 0,
  		totalQuestions : 0
  	}
  	self.qIndex = 0;
    self.util = new DomUtilities()
    // self.scrollbar = new ScrollBar("data-cc-scrollbar");
    self.util.ready(function(){
  	self.util.addClassAll(self.$popupContainer,'show');
    self.select = new Select();
  	self.theme = new Theme(brandColor);

  		self.util.listner(self.$body, "click", "#act-cc-survey-start", function(e) {
  			self.util.addClassAll(self.$popupContainer2, 'show');
  			self.util.removeClassAll(self.$popupContainer, 'show');
  			self.loadFirstQuestion();
  		});
  		self.util.listner(self.$body, "click", ".act-cc-button-next", function(event) {
  			self.nextQuestion();
  		});
  		self.util.listner(self.$body, "click", ".act-cc-button-prev", function(event) {
  			self.prevQuestion();
  		});
  	});
  }

  updateProgress(){
    let el = <HTMLElement>document.querySelectorAll("#progress-line")[0];
		el.style.width = (this.qIndex/this.$questionContainer.length)*100 + '%';
	}

	loadFirstQuestion(){
		// applyRuleToAllEl(this.$questionContainer, );
		this.util.removeClassAll(this.$questionContainer, 'show');
		this.util.addClass(this.$questionContainer[0], 'show');
	}

	nextQuestion(){
		this.qIndex++;
		if(this.$questionContainer[this.qIndex].length < 1){
			this.qIndex = 0;
		}
		this.util.removeClassAll(this.$questionContainer, 'show');
		this.util.addClass(this.$questionContainer[this.qIndex], 'show');
		this.updateProgress();
	}

	prevQuestion(){
		this.qIndex--;
		if(this.$questionContainer[this.qIndex].length < 1){
			this.qIndex = this.$questionContainer.length - 1;
		}
		this.util.removeClassAll(this.$questionContainer,'show');
		this.util.addClass(this.$questionContainer[this.qIndex], 'show');
		this.updateProgress();
	}

}

export { DomSurvey }
