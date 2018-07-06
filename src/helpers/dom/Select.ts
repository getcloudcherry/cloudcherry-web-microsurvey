import { DomUtilities } from "./DomUtilities";
import {LanguageTextFilter} from '../filters/LanguageTextFilter';

class Select {
  util: DomUtilities;
  $body: any;
  $html: any;
  qId: any;
  select: any;
  type: string;
  listeners: any = [];
  constructor( qId: string ) {
    this.qId = qId;
  }
  init( qId: string ) {
    this.util = new DomUtilities();
    this.$body = document.querySelectorAll( "body" )[ 0 ];
    this.$html = document.querySelectorAll( "html" )[ 0 ];
    var select = document.querySelectorAll( "#" + qId + " .cc-select" );

    // var divSelect = document.querySelectorAll("div.cc-select");
    // this.util.removeAll(divSelect);
    let parent = this;

    //Assumption: iterating over array but there will always be one select at a time
    this.type = select[ 0 ].getAttribute( 'data-type' );
    Array.prototype.forEach.call( select, function ( el, i ) {
      var self = el;
      var $selectOptions = document.querySelectorAll( "#" + qId + " .cc-select-options" );
      var classes = self.getAttribute( "class" ),
        id = self.getAttribute( "id" ),
        name = self.getAttribute( "name" );
      var template = '<div class="' + classes + '">';
      template += '<span class="cc-select-trigger">' + self.getAttribute( "placeholder" ) + '</span>';
      template += '<div class="cc-select-options-container" cc-scrollbar-container><div class="cc-select-options">';
      var options = self.querySelectorAll( "option" );
      Array.prototype.forEach.call( options, function ( el, i ) {
        template += '<span class="cc-select-option ' + el.getAttribute( "class" ) + '" data-value="' + el.getAttribute( "value" ) + '">' + el.innerHTML + '</span>';
      } );
      template += '</div></div></div>';
      parent.util.addClass( self, 'hide' );
      self.insertAdjacentHTML( 'afterend', template );
    } );
    this.setupListeners();
  }


  setupListeners() {
    var self = this;
    var qId = self.qId;
    let ref2 = this.util.initListener( 'click', "#" + qId + " .cc-select-option", function ( e ) {
      // let ref2 = this.util.initListener(this.$body, "click", "#"+qId+" .cc-select-option", function(e) {
      ( window as any ).ccsdkDebug ? console.log( 'click cc-select-option', this ) : '';
      let selfOption = this;
      let value = this.getAttribute( 'data-value' );
      //select cc-select-wrapper
      //todo: write a function to directly select parent via selector
      let selectOptions = this.parentNode;
      let select = selectOptions.parentNode.parentNode;
      this.select = select;
      let selectWrapper = select.parentNode;
      ( window as any ).ccsdkDebug ? console.log( select ) : '';
      ( window as any ).ccsdkDebug ? console.log( selectOptions ) : '';
      ( window as any ).ccsdkDebug ? console.log( selectWrapper ) : '';
      let selectionTrigger = select.querySelectorAll( '.cc-select-trigger' )[ 0 ];

      self.util.addClass( this, "selection" );
      let selectedOptionText = selectionTrigger.textContent;
      let selectedValueText = selectionTrigger.getAttribute( 'data-selection-value' ) || '';

      ( window as any ).ccsdkDebug ? console.log( 'select type', self.type ) : '';
      if ( self.type !== 'multiple' ) {
        ( window as any ).ccsdkDebug ? console.log( 'select type', self.type ) : '';
        selectedOptionText = selfOption.textContent;
        ( window as any ).ccsdkDebug ? console.log( 'selected option', selectedOptionText ) : '';
        self.util.removeClassAll( document.querySelectorAll( ".cc-select" ), "opened" );
        selectionTrigger.setAttribute( 'data-selection-value', value );
        selectWrapper.querySelectorAll( "select" )[ 0 ].value = value;
        selectionTrigger.textContent = selectedOptionText;
        self.util.removeClassAll( document.querySelectorAll( "#" + qId + " .cc-select-option" ), 'selection' );
        self.util.addClass( self, 'selection' );
      } else {
        ( window as any ).ccsdkDebug ? console.log( selectedOptionText ) : '';
        if ( selectedOptionText != 'Select' ) {
            selectedOptionText = self.addOrRemoveFromList(selectedOptionText, selfOption.textContent);
            selectedValueText = self.addOrRemoveFromList(selectedValueText, value);
        } else {
          ( window as any ).ccsdkDebug ? console.log( selfOption.textContent ) : '';
          selectedOptionText = selfOption.textContent;
          selectedValueText = value;
        }

        selectWrapper.querySelectorAll( "select" )[ 0 ].value = selectedValueText;
        selectionTrigger.setAttribute( 'data-selection-value', selectedValueText );
        self.util.removeClassAll( document.querySelectorAll( "#" + qId + " .cc-select-option" ), 'selection' );        
        self.selectOptions(selectedValueText);
        
        selectedValueText
        if ( selectedOptionText.length < 1 ) {
          selectionTrigger.textContent = 'Select';
        } else {
          selectionTrigger.textContent = selectedOptionText;
        }
        return false;

      }

    } );
    this.listeners.push( ref2 );
    ref2.internalHandler = this.util.listener( this.$body, ref2.type, ref2.id, ref2.cb );
    let ref = this.util.initListener( 'click', "#" + qId + " .cc-select-trigger", function ( e ) {
      self.$html.addEventListener( 'click', function ( e ) {
        if ( !self.util.hasClass( e.target, 'cc-select-option' ) ) {
          self.util.removeClassAll( document.querySelectorAll( ".cc-select" ), "opened" );
          self.$html.removeEventListener( 'click', function () {
          } );
        }
      } )
      var ccSelect = this.parentNode;
      ( window as any ).ccsdkDebug ? console.log( 'click cc-select-trigger', ccSelect ) : '';
      self.util.toggleClass( ccSelect, "opened" );
      e.stopPropagation();
    } );
    this.listeners.push( ref );
    ref.internalHandler = this.util.listener( this.$body, ref.type, ref.id, ref.cb );

  }

  destroyListeners() {
    for ( let listener of this.listeners ) {
      this.util.removeListener( this.$body, listener.type, listener.internalHandler );
    }
    return true;
  }


  setValue( value: string, question, surveyHandler ) {
    let self = this;
    let qId = self.qId;
    let select: any;

    select = document.querySelectorAll( "#" + qId + " select" )[ 0 ];
    select.value = value;
    let selectTrigger = document.querySelectorAll( "#" + qId + " .cc-select-trigger" )[ 0 ];
    let selectedValueList = value.split(',');
    let translatedSelection = selectedValueList.map(x => LanguageTextFilter.translateMultiSelectOption(surveyHandler, question, x) );
    selectTrigger.textContent = translatedSelection.join(',');
    selectTrigger.setAttribute('data-selection-value', value);
  }

  selectOption( el: any ) {
    this.util.addClass( el, 'selection' );
  }

  removeOption(el){
    this.util.removeClass(el, 'selection');
  }

  selectOptions( csv: string ) {
    let self = this;
    if ( csv ) {
      let allOptions = csv.split( ',' );
      for ( let option of allOptions ) {
        let domOptions = document.querySelectorAll( "#" + self.qId + " .cc-select-option" );
        Array.prototype.forEach.call( domOptions, function ( el, i ) {
          if ( el.getAttribute( 'data-value' ) == option ) {
            self.selectOption( el );
          } else {
            
          }
        } );
      }
    }
  }

  addOrRemoveFromList(listAsString: string, item: string){
    let list = listAsString.split(',');
    let itemIndex = list.indexOf(item);
    if(itemIndex !== -1){
      list.splice(itemIndex, 1);
    } else {
      list.push(item);
    }
    return list.join(',');
  }

}
export { Select }
