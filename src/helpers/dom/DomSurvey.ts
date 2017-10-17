import { DomUtilities } from './DomUtilities';
// import { ScrollBar } from './ScrollBar';
import { Select } from './Select';
import { Theme } from './Theme';
import { ConditionalFlowFilter } from "../filters/ConditionalFlowFilter";
import { Slider } from "./Slider";
import { Constants } from "../../Constants";

class DomSurvey{

  util : DomUtilities;
  // scrollbar : ScrollBar;
  domListeners: any;
  select : Select;
  theme : Theme;
  qIndex : number;
  currentQuestionId : string;
  $questionContainer : any;
  $innerQuestionContainer : any;
  $popupContainer : any;
  $popupContainer2 : any;
  $body : any;
  qResponse : any;
  trackSelects : any = [];
  trackRadios : any = [];
  ccsdk : any;
  currentQuestionListeners : any = [];
  

  constructor(ccsdk : any){
    let self : DomSurvey = this;
    this.domListeners = [];
    this.ccsdk = ccsdk;
  	this.qIndex = 0;
    this.qResponse = {};
    this.domSelectElements();
    this.util = new DomUtilities()
    // self.scrollbar = new ScrollBar("data-cc-scrollbar");
    this.util.ready(function(){
  	   // self.util.addClassAll(self.$popupContainer,'show-slide');
  	});
  }

  setTheme(brandColor){
    let self : DomSurvey = this;
    this.util.ready(function(){
      self.theme = new Theme(brandColor);
    });
  }

  setQIndex( index : number){
    this.qIndex = index;
  }

  getQindex(){
    return this.qIndex;
  }

  domSelectElements(){
    this.$questionContainer = document.
     querySelectorAll(".cc-questions-container");
  	this.$popupContainer = document.querySelectorAll(".cc-popup-container");
  	this.$popupContainer2 = document.querySelectorAll(".cc-popup-container-2");
  	this.$body = document.querySelectorAll("body")[0];
    // this.select = new Select();

  }


 removePrevListener(id : string) : boolean {
    for(let listener of this.domListeners) {
      if(listener.id == id) {
        console.log("removing listener", id);
        this.util.removeListener(this.$body, listener.type, listener.internalHandler);
      }
    }
    return true;
  }

  setupListeners(){
    let self = this;
    let startSurvey = this.util.initListener("click",".act-cc-survey-start", function() {
      let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyClickEvent);
      
      self.startSurvey();
    });

    startSurvey.internalHandler = this.util.listener(this.$body, startSurvey.type, startSurvey.id, startSurvey.cb);

    let nextQue = this.util.initListener( "click",".act-cc-button-next", function(){
      // alert("working");
      let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyClickEvent);
      self.nextQuestion();
    });
    nextQue.internalHandler = this.util.listener(this.$body, nextQue.type, nextQue.id, nextQue.cb);

    let prevQue = this.util.initListener( "click",".act-cc-button-prev", function(){
      let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyClickEvent);
      self.prevQuestion();
    });
    prevQue.internalHandler = this.util.listener(this.$body, prevQue.type, prevQue.id, prevQue.cb);

    let closeSurvey = this.util.initListener( "click",".act-cc-button-close", function(){
      let onSurveyCloseEvent = new CustomEvent(Constants.SURVEY_CLOSE_EVENT + "-" + self.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyCloseEvent);
      self.ccsdk.survey.answers = {};
      self.trackSelects = [];
      self.destroyListeners();
      self.util.trigger(document, 'ccclose', undefined);
      let bodyElement = <HTMLElement>document.
      getElementsByTagName("body")[0];
        self.util.removeClass( bodyElement, "blurr" )
      
    });

    closeSurvey.internalHandler = this.util.listener(this.$body, closeSurvey.type, closeSurvey.id, closeSurvey.cb);

    let minSurvey = this.util.initListener( "click",".act-cc-button-minimize", function(){
      self.minimizeSurvey();
    });

    minSurvey.internalHandler = this.util.listener(self.$body, minSurvey.type, minSurvey.id, minSurvey.cb);
  }


  minimizeSurvey(){
    // this.$popupContainer[0].removeClass('');
    this.util.removeClass(this.$popupContainer2[0], 'hide-right-left');
    this.util.addClass(this.$popupContainer2[0], 'hide-up-bottom');
    setTimeout(()=>{
      this.util.removeClass(this.$popupContainer2[0], 'show-slide');
    },200);
    this.util.removeClass(this.$popupContainer[0], 'hide-right-left');
    this.util.addClass(this.$popupContainer[0], 'hide-bottom-up');
    setTimeout(()=>{
      this.util.addClass(this.$popupContainer[0], 'show-slide');
    },200);
  }

  destroyListeners(){
    // console.log("Removing all listeners");
    for(let listener of this.domListeners) {
      this.util.removeListener(this.$body, listener.type, listener.internalHandler);
    }
  }

  startSurvey(){
      this.domSelectElements();
      // console.log("click in setup listener survey start");
      this.util.addClassAll(this.$popupContainer2, 'show-slide');
      this.util.removeClass(this.$popupContainer[0], 'show-slide');
      this.loadFirstQuestion();
  }

  updateProgress(){
    let el = <HTMLElement>document.querySelectorAll("#progress-line")[0];
		el.style.width = (this.qIndex/this.ccsdk.survey.questionsToDisplay.length)*100 + '%';
	}

	loadFirstQuestion(){
		// applyRuleToAllEl(this.$questionContainer, );
		// this.util.removeClassAll(this.$questionContainer, 'show-slide');
    // this.util.addClass(this.$questionContainer, 'show-slide');
    
    this.loadQuestionSpecifics(this.$questionContainer, 0);
    this.util.removeClassAll(this.$questionContainer[0].firstChild, 'show-slide');
    this.util.addClass(this.$questionContainer[0].firstChild, 'show-slide');
    let leftIcon : any = this.util.get('.act-cc-button-prev');
    this.util.addClassAll(leftIcon , 'hide-slide');
    let onSurveyQuestionEvent = new CustomEvent(Constants.SURVEY_QUESTION_EVENT + "-" + this.ccsdk.surveyToken);
    document.dispatchEvent(onSurveyQuestionEvent);
	}

	nextQuestion(){
    let onSurveyQuestionEvent = new CustomEvent(Constants.SURVEY_QUESTION_EVENT + "-" + this.ccsdk.surveyToken);
    document.dispatchEvent(onSurveyQuestionEvent);
    //submit the current response
    // console.log('submit ',this.qResponse.type, this.qResponse);
    let isRequired : boolean = false;
    let q : HTMLElement = this.$questionContainer[0].firstChild;
    // console.log(this.$questionContainer);
    isRequired = q.getAttribute('data-required').toLowerCase() == 'true' ? true : false;
    let span : Element = this.$questionContainer[0].firstChild.querySelectorAll(".cc-question-container__required")[0]
    if(isRequired && Object.keys(this.qResponse).length === 0) {
      if(span) {
        this.util.addClass(span, "show");
        this.util.removeClass(span, "hide");
      }
      return;
    } else {
      if(span) {
        this.util.removeClass(span, "show");
        this.util.addClass(span, "hide");
      }
      // console.log('qindex ' + this.qIndex);
      if(typeof this.ccsdk.survey.answers[this.currentQuestionId] !== 'undefined' && this.qResponse !== 'undefined'
        && this.qResponse.type == this.ccsdk.survey.answers[this.currentQuestionId].type
        && this.qResponse.text == this.ccsdk.survey.answers[this.currentQuestionId].text
        && this.qResponse.number == this.ccsdk.survey.answers[this.currentQuestionId].number
      ) {
        //don't submit if already submitted.
      } else {
      // console.log('submitting ' + this.currentQuestionId);
      let qId = this.qResponse.questionId?this.qResponse.questionId:this.currentQuestionId;
      this.submitQuestion(this.qIndex, this.qResponse, this.qResponse.type, qId);
      }
      //save response
      this.ccsdk.survey.answers[this.currentQuestionId] = JSON.parse(JSON.stringify(this.qResponse));
    }
    ConditionalFlowFilter.filterQuestion(this.ccsdk.survey, this.ccsdk.survey.questionsToDisplay[this.qIndex]);

    //go to next question
    this.qIndex++;
    //reset the post parameters
    this.qResponse = typeof this.ccsdk.survey.answers[this.currentQuestionId] !== 'undefined' ? JSON.parse(JSON.stringify(this.ccsdk.survey.answers[this.currentQuestionId])) : {};
    // this.qResponse = {};
    let nextButtonState : string = 'initial';
    // console.log(this.$questionContainer);
    let nextQ : HTMLElement = this.$questionContainer;
    // console.log(this.qIndex);
		if(this.qIndex == this.ccsdk.survey.questionsToDisplay.length){
      //Last run to show thank you message
      let leftIcon : any = this.util.get('.act-cc-button-prev');
      let rightIcon : any = this.util.get('.cc-icon-right');
      let nextIcon : any = this.util.get('.act-cc-button-next');
      this.util.addClassAll(leftIcon , 'hide');
      this.util.addClassAll(rightIcon , 'hide');
      this.util.addClassAll(nextIcon , 'hide');
      this.util.trigger(document,'ccdone', undefined);
      this.util.removeClass(this.$questionContainer[0].firstChild, 'show-slide');
      this.updateProgress();
		}else{
      if((this.qIndex > this.ccsdk.survey.questionsToDisplay.length)){
        //reset the counter to show first question
          this.qIndex = 0;
        }
        //repopulate qResponse based on answers.
        this.qResponse = typeof this.ccsdk.survey.answers[this.currentQuestionId] !== 'undefined' ? JSON.parse(JSON.stringify(this.ccsdk.survey.answers[this.currentQuestionId])) : {};
        // this.util.removeClassAll(this.$questionContainer[0].firstChild, 'show-slide');
    		// this.util.addClass(nextQ, 'show-slide');
        this.updateProgress();
        this.loadQuestionSpecifics(nextQ, this.qIndex);
        this.util.addClass(this.$questionContainer[0].firstChild, 'show-slide');
        // if(nextButtonState === 'dirty'){
          // this.submitQuestion(this.qIndex, 'test', 'multiline');
        // }
    }
    if(this.qIndex == 0) {
      let leftIcon : any = this.util.get('.act-cc-button-prev');
      this.util.addClassAll(leftIcon , 'hide-slide');
    } else {
      let leftIcon : any = this.util.get('.act-cc-button-prev');
      this.util.addClass(leftIcon[0] , 'show-slide');
      this.util.removeClass(leftIcon[0] , 'hide-slide');
    }
	}

	prevQuestion(){
    this.qIndex--;
		if(!this.ccsdk.survey.questionsToDisplay.length){
      this.qIndex = 0;
      return;
      // this.qIndex = this.$questionContainer.length - 1;
    }
    let onSurveyQuestionEvent = new CustomEvent(Constants.SURVEY_QUESTION_EVENT + "-" + this.ccsdk.surveyToken);
    document.dispatchEvent(onSurveyQuestionEvent);
    //re populate qResponse based on answers.
    // this.util.removeClassAll(this.$questionContainer,'show-slide');
    this.loadQuestionSpecifics(null, this.qIndex);
    this.qResponse = typeof this.ccsdk.survey.answers[this.currentQuestionId] !== 'undefined' ? JSON.parse(JSON.stringify(this.ccsdk.survey.answers[this.currentQuestionId])) : {};
		this.util.addClass(this.$questionContainer[0].firstChild, 'show-slide');
    this.updateProgress();
    if(this.qIndex == 0) {
      let leftIcon : any = this.util.get('.act-cc-button-prev');
      this.util.addClassAll(leftIcon , 'hide-slide');
      this.util.removeClassAll(leftIcon , 'show-slide');
    }
	}

  appendInBody(html){
    document.querySelectorAll("body")[0].insertAdjacentHTML(
      'afterbegin', html
    );
    //force update domSelect
    this.domSelectElements();
  }

  replaceInQuestionsContainer(html) {
    this.$questionContainer[0].innerHTML = html;
    this.domSelectElements();
  }

  appendInQuestionsContainer(html){
    document.querySelectorAll(".cc-questions-container")[0].insertAdjacentHTML(
      'afterbegin', html
    );
    //force update domSelect
    this.domSelectElements();
  }

  showWelcomeContainer(){
    setTimeout(() => {
      let startContainer = <HTMLElement>document.
      querySelectorAll(".act-cc-welcome-question-box")[0];
      let bodyElement = <HTMLElement>document.
      getElementsByTagName("body")[0];
        this.util.addClass(startContainer, "show-slide");
        this.util.addClass( bodyElement, "blurr" );
    },200);

  }

  getSurveyContainer( token : string){
    return document.querySelectorAll("#"+token+"-survey")[0];
  }

  getWelcomeContainer( token : string){
    return document.querySelectorAll("#"+token+"-welcome")[0];
  }

  loadQuestionSpecifics( q : HTMLElement, index : number){
    let self : DomSurvey = this;
    this.$questionContainer[0].innerHTML = "";
    let compiledTemplate = this.ccsdk.survey.compileTemplate(this.ccsdk.survey.questionsToDisplay[index]);
    this.$questionContainer[0].innerHTML += compiledTemplate;
    let qType : string = this.$questionContainer[0].firstChild.getAttribute('data-type');
    let qId : string = this.$questionContainer[0].firstChild.getAttribute('data-id');
    // console.log("QTYIPE AND QID " , qType, qId);
    this.currentQuestionId = qId.substring(2, qId.length);
    switch(qType){
        case 'scale':
          let allOptions1 : any = document.querySelectorAll('#' + qId + ' .option-number-item');
          let optionWidth1 = (100/allOptions1.length) - .6;
          // console.log("Option width", allOptions1, optionWidth1.toFixed(2));
          self.util.css(allOptions1 , 'width',  optionWidth1.toFixed(1) + '%');
          this.setupListenersQuestionScale(index, qId);
        break;
        case 'nps':
          this.setupListenersQuestionNPS(index, qId);
        break;
        case 'multiline':
          this.setupListenersQuestionMultiline(index, qId);
          break;
        case 'select':
          if(typeof this.select !== 'undefined' ){
            this.select.destroyListeners();
          }
          this.setupListenersQuestionSelect(index, qId);
          break;
        case 'radio':
        this.setupListenersQuestionRadio(index, qId);
        break;        
        case 'radioImage':
        this.setupListenersQuestionRadioImage(index, qId);
        break;
        case 'checkbox':
          this.setupListenersQuestionCheckbox(index, qId);
          break;
        case 'star':
          this.setupListenersQuestionStar(index, qId);
          break;
        case 'smile':
          this.setupListenersQuestionSmile(index, qId);
          break;
        case 'slider':
          this.setupListenersQuestionSlider(index, qId);
          break;
        case 'singleline':
          this.setupListenersQuestionSingleline(index, qId);
        default:
        break;
    }
  }

  // question specific listeners

  setupListenersQuestionScale( index : number, qId : string ){
    var self : DomSurvey = this;
    //add id too.
    if(this.util.checkIfListenerExists('#' + qId + ' .option-number-item', this.domListeners)) {
      return;
    }

    let ref = this.util.initListener('click', '#' + qId + ' .option-number-item', function(){
      let allOptions : any = document.querySelectorAll('#' + qId + ' .option-number-item');
      
      let rating : number = this.getAttribute('data-rating');
      self.util.removeClassAll(allOptions, "selected");
      self.util.addClass(this, "selected");
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // console.log('Scale selected',rating);
      self.qResponse.type = 'scale';
      self.qResponse.text = null;
      self.qResponse.number = rating;
      self.qResponse.questionId = qId;
      //move to next question automagically
      // alert('calling next questions inside scale');
      let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyClickEvent);
      self.nextQuestion();
      // self.util.trigger(document,'q-answered', {
      //   index : index,
      //   rating : rating,
      //   type : 'scale'
      // });
    });
    this.domListeners.push(ref);    
    
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  }

  setupListenersQuestionNPS( index : number, qId : string ){
    var self : DomSurvey = this;
    let selectedRating = <HTMLElement> document.querySelectorAll('#' + qId + ' .cc-nps-selected-rating')[0];
    let allOptions : any = document.querySelectorAll('#' + qId + ' .option-number-item');
    
    //add id too.
    if(this.util.checkIfListenerExists('#' + qId + ' .option-number-item', this.domListeners)) {
      //remove listeners
      console.log("nps question - previous listeners exists");
      this.removePrevListener('#' + qId + ' .option-number-item');
      
    }

    //set previous value
    let questionId : any ;
    questionId = qId.substring(2, qId.length);
    console.log('nps question',this.ccsdk.survey.answers[questionId]);
    if(typeof this.ccsdk.survey.answers[questionId] !== 'undefined' && this.ccsdk.survey.answers[questionId] !== ''){
      let previousValue =  this.ccsdk.survey.answers[questionId].number;
      let previousSelection = document.querySelectorAll('#' + qId + ' .option-number-item[data-rating="' + previousValue + '"]')[0];
      console.log('nps previous selection', previousSelection);
      if(typeof previousSelection !== 'undefined'){
        this.util.addClass(previousSelection, "selected");
      }
      
    }

    // console.log(self.domListeners);
    let ref = this.util.initListener('click', '#' + qId + ' .option-number-item', function(){
      let rating : number = this.getAttribute('data-rating');
      self.util.removeClassAll(allOptions, "selected");
      self.util.addClass(this, "selected");
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // console.log('Scale selected',rating);
      self.qResponse.type = 'nps';
      self.qResponse.text = null;
      self.qResponse.number = rating;
      self.qResponse.questionId = qId;
       selectedRating.innerHTML = ''+ rating;
      //move to next question automagically

      let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyClickEvent);
      
      // alert('calling next questions inside scale');
      self.nextQuestion();
      // self.util.trigger(document,'q-answered', {
      //   index : index,
      //   rating : rating,
      //   type : 'scale'
      // });
    });
    this.domListeners.push(ref);    
    
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  }

  setupListenersQuestionCheckbox( index : number, qId : string ){
    var self : DomSurvey = this;
    if(this.util.checkIfListenerExists('#'+qId+' .cc-checkbox', this.domListeners)) {
      return;
    }
    let ref = this.util.initListener('click', '#'+qId+' .cc-checkbox', function(){
      // let allOptions : any = document.querySelectorAll('#'+qId+' .cc-checkbox input');
      // let rating : number = this.querySelectorAll('input')[0].value;
      let rating : string = [].filter.call(document.querySelectorAll('#'+qId+' .cc-checkbox input'), function(c) {
        return c.checked;
      }).map(function(c) {
        return c.value;
      }).join(',');

      // console.log('Checkbox selected',rating);
      self.qResponse.type = 'checkbox';
      self.qResponse.text = rating;
      self.qResponse.number = null;
      self.qResponse.questionId = qId;
      //move to next question automagically
      // self.nextQuestion();
    });
    this.domListeners.push(ref);        
    let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
    document.dispatchEvent(onSurveyClickEvent);
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  }

  setupListenersQuestionRadio(index : number, qId : string ){
    var self : DomSurvey = this;
    if(this.util.checkIfListenerExists('#'+qId+' .cc-checkbox input', this.domListeners)) {
      return;
    }
    let ref = this.util.initListener('click', '#'+qId+' .cc-checkbox input', function(){
      // let allOptions : any = document.querySelectorAll('#'+qId+' .cc-checkbox');
      let rating : number = this.value;
      // self.util.removeClassAll(allOptions, "selected");
      // self.util.addClass(this, "selected");
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // console.log('Star selected',rating);
      self.qResponse.type = 'radio';
      self.qResponse.text = null;
      self.qResponse.number = rating;
      self.qResponse.questionId = qId;
      let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyClickEvent);
      //move to next question automagically
      self.nextQuestion();
    });
    this.domListeners.push(ref);    
    
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  }

  setupListenersQuestionRadioImage(index : number, qId : string ){
    var self : DomSurvey = this;
    if(this.util.checkIfListenerExists('#'+qId+' .cc-checkbox input', this.domListeners)) {
      return;
    }
    let ref = this.util.initListener('click', '#'+qId+' .cc-checkbox input', function(){
      // let allOptions : any = document.querySelectorAll('#'+qId+' .cc-checkbox');
      let rating : number = this.value;
      // self.util.removeClassAll(allOptions, "selected");
      // self.util.addClass(this, "selected");
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // console.log('Star selected',rating);
      self.qResponse.type = 'radioImage';
      self.qResponse.text = rating;
      self.qResponse.number = null;
      self.qResponse.questionId = qId;
      let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyClickEvent);
      //move to next question automagically
      self.nextQuestion();
    });
    this.domListeners.push(ref);    
    
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  }

  setupListenersQuestionStar(index : number, qId : string ){
    var self : DomSurvey = this;
    if(this.util.checkIfListenerExists('#'+qId+' .option-star-box', this.domListeners)) {
      //remove listeners
      console.log("smile question - previous listeners exists");
      this.removePrevListener('#'+qId+' .option-smile-box');
         
    }
    //set previous value
    let questionId : any ;
    questionId = qId.substring(2, qId.length);
    console.log('star question',this.ccsdk.survey.answers[questionId]);
    if(typeof this.ccsdk.survey.answers[questionId] !== 'undefined' && this.ccsdk.survey.answers[questionId] !== ''){
      let previousValue =  this.ccsdk.survey.answers[questionId].number;
      let previousSelection = document.querySelectorAll('#' + qId + ' .option-star-box[data-rating="' + previousValue + '"]')[0];
      console.log('star previous selection', previousSelection);
      if(typeof previousSelection !== 'undefined' && previousSelection != null){      
        this.util.addClass(previousSelection, "selected");
      }
      
    }
    let ref = this.util.initListener('click', '#'+qId+' .option-star-box', function(){
      let allOptions : any = document.querySelectorAll('#'+qId+' .option-star-box');
      let rating : number = this.getAttribute('data-rating');
      self.util.removeClassAll(allOptions, "selected");
      self.util.addClass(this, "selected");
      let child : any = this.previousSibling;
      while( ( child = child.previousSibling) != null ){
        // console.log('questionstar', 'previousSiblings', child);
        self.util.addClass(child, "selected");
      }
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // console.log('Star selected',rating);
      self.qResponse.type = 'star';
      self.qResponse.text = null;
      self.qResponse.number = rating;
      self.qResponse.questionId = qId;

      let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyClickEvent);
      //move to next question automagically
      self.nextQuestion();
    });
    this.domListeners.push(ref);    
    
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  }

  setupListenersQuestionSmile(index : number, qId : string ){
    var self : DomSurvey = this;
    if(this.util.checkIfListenerExists('#'+qId+' .option-smile-box', this.domListeners)) {
      //remove listeners
      console.log("smile question - previous listeners exists");
      this.removePrevListener('#'+qId+' .option-smile-box');
      
    }
    //set previous value
    let questionId : any ;
    questionId = qId.substring(2, qId.length);
    console.log('smile question',this.ccsdk.survey.answers[questionId]);
    if(typeof this.ccsdk.survey.answers[questionId] !== 'undefined' && this.ccsdk.survey.answers[questionId] !== ''){
      let previousValue =  this.ccsdk.survey.answers[questionId].number;
      let previousSelection = document.querySelectorAll('#' + qId + ' .option-smile-box[data-rating="' + previousValue + '"]')[0];
      console.log('smile previous selection', previousSelection);
      if(typeof previousSelection !== 'undefined' && previousSelection != null){
        
        this.util.addClass(previousSelection, "selected");
      }
      
    }
  
    let ref = this.util.initListener('click', '#'+qId+' .option-smile-box', function(){
      let allOptions : any = document.querySelectorAll('#'+qId+' .option-smile-box');
      let rating : number = this.getAttribute('data-rating');
      self.util.removeClassAll(allOptions, "selected");
      self.util.addClass(this, "selected");
      let child : any = this.previousSibling;
      while( ( child = child.previousSibling) != null ){
        // console.log('questionscale', 'previousSiblings', child);
        self.util.addClass(child, "selected");
      }
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      // console.log('Smile selected',rating);
      self.qResponse.type = 'smile';
      self.qResponse.text = null;
      self.qResponse.number = rating;
      self.qResponse.questionId = qId;

      let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyClickEvent);
      //move to next question automagically
      self.nextQuestion();
    });
    this.domListeners.push(ref);    
    
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  }

  setupListenersQuestionMultiline( index : number, qId : string ){
    let self : DomSurvey = this;
    let multilineRes : string = '';
    if(this.util.checkIfListenerExists('#'+qId, this.domListeners)) {
          //remove listeners
          console.log("multiine question - previous listeners exists");
          this.removePrevListener('#'+qId);
             
        }
        //set previous value
        let questionId : any ;
        questionId = qId.substring(2, qId.length);
        console.log('multiine question',this.ccsdk.survey.answers[questionId]);
        if(typeof this.ccsdk.survey.answers[questionId] !== 'undefined' && this.ccsdk.survey.answers[questionId] !== ''){
          let previousValue =  this.ccsdk.survey.answers[questionId].text;
          console.log('multiine input box',document.querySelectorAll('#' + qId)[0]);
          let previousSelection = <HTMLInputElement>document.querySelectorAll('#' + qId)[0];
          console.log('multiine previous selection', previousSelection);
          console.log('multiine previous value', previousValue);
          if(typeof previousSelection !== 'undefined' && 
           previousSelection != null &&
           typeof previousValue !== 'undefined'){
            previousSelection.value = previousValue ;      
          }
        }
    let ref = this.util.initListener('change', '#'+qId,function(){
      multilineRes = this.value;
      self.qResponse.type = 'multiline';
      self.qResponse.text = multilineRes;
      self.qResponse.number = null;
      self.qResponse.questionId = qId;
    });
    this.domListeners.push(ref);    
    
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  }

  setupListenersQuestionSingleline( index : number, qId : string ){
    let self : DomSurvey = this;
    let singlelineRes : string = '';
    if(this.util.checkIfListenerExists('#'+qId, this.domListeners)) {
      //remove listeners
      console.log("singleline question - previous listeners exists");
      this.removePrevListener('#'+qId);
         
    }
    //set previous value
    let questionId : any ;
    questionId = qId.substring(2, qId.length);
    console.log('singleline question',this.ccsdk.survey.answers[questionId]);
    if(typeof this.ccsdk.survey.answers[questionId] !== 'undefined' && this.ccsdk.survey.answers[questionId] !== ''){
      let previousValue =  this.ccsdk.survey.answers[questionId].text;
      console.log('singleline input box',document.querySelectorAll('#' + qId)[0]);
      let previousSelection = <HTMLInputElement>document.querySelectorAll('#' + qId)[0];
      console.log('singleline previous selection', previousSelection);
      console.log('singleline previous value', previousValue);
      if(typeof previousSelection !== 'undefined' && 
       previousSelection != null &&
       typeof previousValue !== 'undefined'){
        previousSelection.value = previousValue ;      
      }
    }
    let ref = this.util.initListener('change', '#'+qId,function(){
      singlelineRes = this.value;
      self.qResponse.type = 'singleline';
      self.qResponse.text = singlelineRes;
      self.qResponse.number = null;
      self.qResponse.questionId = qId;
    });
    this.domListeners.push(ref);    
    
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  }

  setupListenersQuestionSlider( index : number, qId : string ){
    let self : DomSurvey = this;
    let sliderRes : string = '';
    let slider = new Slider();
    
    if(this.util.checkIfListenerExists('#' + qId + " input", this.domListeners)) {
      // return;
      
    }
    //set previous value
    let questionId : any ;
    questionId = qId.substring(2, qId.length);
    console.log('slider question',this.ccsdk.survey.answers[questionId]);
    if(typeof this.ccsdk.survey.answers[questionId] !== 'undefined' && this.ccsdk.survey.answers[questionId] !== ''){
      let previousValue =  this.ccsdk.survey.answers[questionId].text;
      console.log('slider input box',document.querySelectorAll('#' + qId)[0]);
      let previousSelection = <HTMLInputElement>document.querySelectorAll('#' + qId + " .act-slider-tip")[0];
      console.log('slider previous selection', previousSelection);
      console.log('slider previous value', previousValue);
      if(typeof previousSelection !== 'undefined' && 
       previousSelection != null &&
       typeof previousValue !== 'undefined'){
        previousSelection.innerHTML = previousValue ;      
      }
    }
    let ref = this.util.initListener("change", '#' + qId + " input", function(){
      sliderRes = this.value;
      self.qResponse.type = 'slider';
      self.qResponse.number = sliderRes;
      self.qResponse.text = null;
      self.qResponse.questionId = qId;
      //move to next question automagically
      // self.nextQuestion();
    });
    this.domListeners.push(ref);    
    
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  }

  setupListenersQuestionSelect( index : number, qId : string ){
    let self : DomSurvey = this;
    let questionId : any ;
    console.log('select que');
    questionId = qId.substring(2, qId.length);
    // console.log(this.ccsdk.survey.answers[questionId]);
    // console.log(this.ccsdk.survey.surveyAnswers[questionId]);
    if(this.util.checkIfListenerExists('#'+qId+" .cc-select-options .cc-select-option", this.domListeners)) {
      console.log('select que listner exists');
      this.removePrevListener('#'+qId+" .cc-select-options .cc-select-option");
      // return;
    }
    console.log('select que');
    
    // if(!self.util.arrayContains.call(self.trackSelects, qId)){
      console.log('select que initialize select');
      
      self.select = new Select(qId);
      self.select.init(qId);
      if(typeof this.ccsdk.survey.answers[questionId] !== 'undefined' && this.ccsdk.survey.answers[questionId] !== ''){
        self.select.setValue(this.ccsdk.survey.answers[questionId].text);
      }
      self.trackSelects.push(qId);
    // }
    let selectRes : string = '';
    let ref = this.util.initListener('click', '#'+qId+" .cc-select-options .cc-select-option",function(){
      selectRes = this.getAttribute('data-value');
      // console.log(selectRes);
      self.qResponse.type = 'select';
      self.qResponse.text = selectRes;
      self.qResponse.number = null;
      self.qResponse.questionId = qId;
      //move to next question automagically

      let onSurveyClickEvent = new CustomEvent(Constants.SURVEY_CLICK_EVENT + "-" + self.ccsdk.surveyToken);
      document.dispatchEvent(onSurveyClickEvent);
      
      // self.nextQuestion();
    });
    
    // this.util.removeListener(this.$body, ref.type, listener.internalHandler);    
    this.domListeners.push(ref);    
    
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);

  }



  // addListenersNextButtonSubmit(index : number, data : any, type : string){
  //   let self : DomSurvey = this;
  //   let btnNext = self.util.get('.act-cc-button-next')[0];
  //   self.util.on('click', btnNext, this.submitQuestion(
  //     index, data, type
  //   ));
  //
  // }

  // removeListenersNextButtonSubmit(index : number, data : any, type : string){
  //   let self : DomSurvey = this;
  //   let btnNext = self.util.get('.act-cc-button-next');
  //   self.util.on('click', btnNext, this.submitQuestion(
  //     index, data, type
  //   ));
  //   self.util.off('click', btnNext, this.submitQuestion(
  //     index, data, type
  //   ));
  // }

  submitQuestion(index : number, data : any, type : string, qId : string){
      // console.log('type', type ,'res',data);
      this.util.trigger(document,'q-answered', {
        index : index,
        data : data,
        type : type,
        questionId : qId.substring(2, qId.length)
      });
  }

  

}

export { DomSurvey }
