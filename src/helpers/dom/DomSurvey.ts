import { DomUtilities } from './DomUtilities';
// import { ScrollBar } from './ScrollBar';
import { Select } from './Select';
import { Theme } from './Theme';

class DomSurvey{

  util : DomUtilities;
  // scrollbar : ScrollBar;
  domListeners: any;
  select : Select;
  theme : Theme;
  qIndex : number;
  $questionContainer : any;
  $popupContainer : any;
  $popupContainer2 : any;
  $body : any;
  qResponse : any;
  trackSelects : any = [];
  trackRadios : any = [];


  constructor(){
    let self : DomSurvey = this;
    this.domListeners = [];
  	let ccSDK = {
  		qIndex : 0,
  		totalQuestions : 0
  	}
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
     querySelectorAll(".cc-questions-container .cc-question-container");
  	this.$popupContainer = document.querySelectorAll(".cc-popup-container");
  	this.$popupContainer2 = document.querySelectorAll(".cc-popup-container-2");
  	this.$body = document.querySelectorAll("body")[0];
    // this.select = new Select();

  }


  addListener(id, type, cb) {
    let ref : any =  {
      id : id,
      type : type,
      cb : cb,
      internalHandler: undefined,
    };
    this.domListeners.push(ref);
    return ref;
  }



  setupListeners(){
    let self = this;
    let startSurvey = this.addListener(".act-cc-survey-start", "click", function() {
      self.startSurvey();
    });
    startSurvey.internalHandler = this.util.listener(this.$body, startSurvey.type, startSurvey.id, startSurvey.cb);

    let nextQue = this.addListener(".act-cc-button-next", "click", function(){
      self.nextQuestion()
    });
    nextQue.internalHandler = this.util.listener(this.$body, nextQue.type, nextQue.id, nextQue.cb);

    this.util.listener(this.$body, "click", ".act-cc-button-prev", function(){
      self.prevQuestion()
    });
    this.util.listener(self.$body, "click", ".act-cc-button-close", function(){
      self.destroyListeners();
      self.util.trigger(document, 'ccclose', undefined);
    });
    this.util.listener(self.$body, "click", ".act-cc-button-minimize", function(){
      self.minimizeSurvey();
    });
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
    for(let listener of this.domListeners) {
      console.log('removing listener', listener);
      this.util.removeListener(this.$body, listener.type, listener.internalHandler);
    }
  }

  startSurvey(){
      this.domSelectElements();
      console.log("click in setup listener survey start");
      this.util.addClassAll(this.$popupContainer2, 'show-slide');
      this.util.removeClass(this.$popupContainer[0], 'show-slide');
      this.loadFirstQuestion();
  }

  updateProgress(){
    let el = <HTMLElement>document.querySelectorAll("#progress-line")[0];
		el.style.width = (this.qIndex/this.$questionContainer.length)*100 + '%';
	}

	loadFirstQuestion(){
		// applyRuleToAllEl(this.$questionContainer, );
		this.util.removeClassAll(this.$questionContainer, 'show-slide');
		this.util.addClass(this.$questionContainer[0], 'show-slide');
    this.loadQuestionSpecifics(this.$questionContainer[0], 0);
	}

	nextQuestion(){
    //submit the current response
    console.log('submit ' + this.qResponse.type, this.qResponse);
    let isRequired : boolean = false;
    let q : HTMLElement = this.$questionContainer[this.qIndex];
    isRequired = q.getAttribute('data-required').toLowerCase() == 'true' ? true : false;
    let span : Element = this.$questionContainer[this.qIndex].querySelectorAll(".cc-question-container__required")[0]
    if(isRequired && Object.keys(this.qResponse).length === 0) {
      // alert('required');
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
      this.submitQuestion(this.qIndex, this.qResponse, this.qResponse.type);
      //show error
    }

    //reset the post parameters
    this.qResponse = {};

    //go to next question
		this.qIndex++;
    let nextButtonState : string = 'initial';
    console.log(this.$questionContainer);
    let nextQ : HTMLElement = this.$questionContainer[this.qIndex];
    console.log(this.qIndex);
		if( !nextQ &&
      (this.qIndex == this.$questionContainer.length)){
      //Last run to show thank you message
      let leftIcon : any = this.util.get('.cc-icon-left');
      let rightIcon : any = this.util.get('.cc-icon-right');
      let nextIcon : any = this.util.get('.act-cc-button-next');

      this.util.addClassAll(leftIcon , 'hide-slide');
      this.util.addClassAll(rightIcon , 'hide-slide');
      this.util.addClassAll(nextIcon , 'hide-slide');
      this.util.trigger(document,'ccdone', undefined);
      this.util.removeClassAll(this.$questionContainer, 'show-slide');
      this.updateProgress();
		}else{
      if( !nextQ
        && (this.qIndex > this.$questionContainer.length)){
        //reset the counter to show first question
        this.qIndex = 0;
      }
        this.util.removeClassAll(this.$questionContainer, 'show-slide');
    		this.util.addClass(nextQ, 'show-slide');
    		this.updateProgress();
        this.loadQuestionSpecifics(nextQ, this.qIndex);
        // if(nextButtonState === 'dirty'){
          // this.submitQuestion(this.qIndex, 'test', 'multiline');
        // }
    }
	}

	prevQuestion(){
		this.qIndex--;
		if(!this.$questionContainer[this.qIndex]){
			this.qIndex = this.$questionContainer.length - 1;
		}
		this.util.removeClassAll(this.$questionContainer,'show-slide');
		this.util.addClass(this.$questionContainer[this.qIndex], 'show-slide');
		this.updateProgress();
	}

  appendInBody(html){
    document.querySelectorAll("body")[0].insertAdjacentHTML(
      'afterbegin', html
    );
  }

  appendInQuestionsContainer(html){
    document.querySelectorAll(".cc-questions-container")[0].insertAdjacentHTML(
      'afterbegin', html
    );
  }

  showWelcomeContainer(){
    setTimeout(() => {
      let startContainer = <HTMLElement>document.
      querySelectorAll(".act-cc-welcome-question-box")[0];
        this.util.addClass(startContainer, "show-slide");
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
    let qType : string = q.getAttribute('data-type');
    let qId : string = q.getAttribute('data-id');
    console.log(qType);
    switch(qType){
        case 'scale':
          this.setupListenersQuestionScale(index, qId);
        break;
        case 'multiline':
          this.setupListenersQuestionMultiline(index, qId);
          break;
        case 'select':
          this.setupListenersQuestionSelect(index, qId);
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
        default:
        break;
    }
  }

  // question specific listeners

  setupListenersQuestionScale( index : number, qId : string ){
    var self : DomSurvey = this;
    this.util.listener(this.$body, 'click', '.act-cc-question-scale span.option-number-item', function(){
      let allOptions : any = document.querySelectorAll('.act-cc-question-scale span.option-number-item');
      let rating : number = this.getAttribute('data-rating');
      self.util.removeClassAll(allOptions, "selected");
      self.util.addClass(this, "selected");
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      console.log('Scale selected',rating);
      self.qResponse.type = 'scale';
      self.qResponse.text = null;
      self.qResponse.number = rating;
      // self.util.trigger(document,'q-answered', {
      //   index : index,
      //   rating : rating,
      //   type : 'scale'
      // });
    })
  }

  setupListenersQuestionCheckbox( index : number, qId : string ){
    var self : DomSurvey = this;
    this.util.listener(this.$body, 'click', '#'+qId+' .cc-checkbox', function(){
      // let allOptions : any = document.querySelectorAll('#'+qId+' .cc-checkbox input');
      // let rating : number = this.querySelectorAll('input')[0].value;
      let rating : string = [].filter.call(document.querySelectorAll('#'+qId+' .cc-checkbox input'), function(c) {
        return c.checked;
      }).map(function(c) {
        return c.value;
      }).join(',');

      console.log('Checkbox selected',rating);
      self.qResponse.type = 'checkbox';
      self.qResponse.text = rating;
      self.qResponse.number = null;
    })
  }

  setupListenersQuestionStar(index : number, qId : string ){
    var self : DomSurvey = this;
    this.util.listener(this.$body, 'click', '#'+qId+' .option-star-box', function(){
      let allOptions : any = document.querySelectorAll('#'+qId+' .option-star-box');
      let rating : number = this.getAttribute('data-rating');
      self.util.removeClassAll(allOptions, "selected");
      self.util.addClass(this, "selected");
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      console.log('Star selected',rating);
      self.qResponse.type = 'star';
      self.qResponse.text = null;
      self.qResponse.number = rating;
    })
  }

  setupListenersQuestionSmile(index : number, qId : string ){
    var self : DomSurvey = this;
    this.util.listener(this.$body, 'click', '#'+qId+' .option-smile-box', function(){
      let allOptions : any = document.querySelectorAll('#'+qId+' .option-smile-box');
      let rating : number = this.getAttribute('data-rating');
      self.util.removeClassAll(allOptions, "selected");
      self.util.addClass(this, "selected");
      // this.parentNode.querySelectorAll(".option-number-input")[0].value = rating ;
      console.log('Smile selected',rating);
      self.qResponse.type = 'smile';
      self.qResponse.text = null;
      self.qResponse.number = rating;
    })
  }

  setupListenersQuestionMultiline( index : number, qId : string ){
    let self : DomSurvey = this;
    let multilineRes : string = '';
    this.util.listener(this.$body, 'change', '#'+qId,function(){
      multilineRes = this.value;
      self.qResponse.type = 'multiline';
      self.qResponse.text = multilineRes;
      self.qResponse.number = null;
    });
  }

  setupListenersQuestionSingleline( index : number, qId : string ){
    let self : DomSurvey = this;
    let singlelineRes : string = '';
    this.util.listener(this.$body, 'change', '#'+qId,function(){
      singlelineRes = this.value;
      self.qResponse.type = 'singleline';
      self.qResponse.text = singlelineRes;
      self.qResponse.number = null;
    });
  }

  setupListenersQuestionSlider( index : number, qId : string ){
    let self : DomSurvey = this;
    let sliderRes : string = '';
    let ref = this.addListener('#' + qId + " input", "change", function(){
      sliderRes = this.value;
      self.qResponse.type = 'slider';
      self.qResponse.number = sliderRes;
      self.qResponse.text = null;
    });
    ref.internalHandler = this.util.listener(this.$body, ref.type, ref.id, ref.cb);
  }

  setupListenersQuestionSelect( index : number, qId : string ){
    let self : DomSurvey = this;
    if(!self.util.arrayContains.call(self.trackSelects, qId)){
      self.select = new Select(qId);
      self.select.init(qId);
      self.trackSelects.push(qId);
    }
    let selectRes : string = '';
    this.util.listener(this.$body, 'click', '#'+qId+" .cc-select-options .cc-select-option",function(){
      selectRes = this.getAttribute('data-value');
      console.log(selectRes);
      self.qResponse.type = 'select';
      self.qResponse.text = selectRes;
      self.qResponse.number = null;

    });

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

  submitQuestion(index : number, data : any, type : string){
      console.log('type', type ,'res',data);
      this.util.trigger(document,'q-answered', {
        index : index,
        data : data,
        type : type
      });
  }


}

export { DomSurvey }
