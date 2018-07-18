import { DomUtilities } from './DomUtilities';
class Slider {
  inputRange: any;
  rangeTip: any;
  maxValue: number;
  speed: number;
  currValue: number;
  rafID: any;
  timeout: any;
  util: any

  constructor() {
    this.inputRange = document.getElementsByClassName( 'ccsdk-range' )[ 0 ];
    this.rangeTip = this.inputRange.parentNode.querySelectorAll( ".act-slider-tip" )[ 0 ];
    this.util = new DomUtilities();
    //  this.maxValue = 100; // the higher the smoother when dragging
    this.speed = 5;


    // set min/max value
    // this.inputRange.min = 0;
    this.inputRange.min = this.inputRange.getAttribute( 'min' );
    // this.inputRange.max = this.maxValue;
    this.inputRange.max = this.inputRange.getAttribute( 'max' );
    this.setupListeners();
  }

  setupListeners() {
    let self: Slider = this;

    // bind events
    this.inputRange.addEventListener( 'mouseup', this.clearTo, false );

    // move gradient
    this.inputRange.addEventListener( 'input', function () {
      self.updateRangeTip();
      self.util.addClass( this, 'selected' );

      //Change slide thumb color on way up
      if ( this.value > 20 ) {
        self.inputRange.classList.add( 'ltpurple' );
      }
      if ( this.value > 40 ) {
        self.inputRange.classList.add( 'purple' );
      }
      if ( this.value > 60 ) {
        self.inputRange.classList.add( 'pink' );
      }

      //Change slide thumb color on way down
      if ( this.value < 20 ) {
        self.inputRange.classList.remove( 'ltpurple' );
      }
      if ( this.value < 40 ) {
        self.inputRange.classList.remove( 'purple' );
      }
      if ( this.value < 60 ) {
        self.inputRange.classList.remove( 'pink' );
      }
    } );
  }



  updateRangeTip() {
    let self: Slider = this;
    this.rangeTip.style.display = 'block';
    this.rangeTip.innerHTML = this.inputRange.value;
  }

  clearTo() {
    clearTimeout( this.timeout );
  }

  // listen for unlock
  // unlockStartHandler() {
  //   let self : any = this;
  //   // clear raf if trying again
  //   window.cancelAnimationFrame(this.rafID);
  //   // set to desired value
  //   this.currValue = +self.value;
  // }

  // unlockEndHandler() {
  //   // store current value
  //   this.currValue = + this.value;
  //   // determine if we have reached success or not
  //   if(this.currValue >= this.maxValue) {
  //      this.successHandler();
  //   }
  //   else {
  //      this.rafID = window.requestAnimationFrame(this.animateHandler);
  //   }
  // }

  // handle range animation
  animateHandler() {
    // calculate gradient transition
    var transX = this.currValue - this.maxValue;

    // update input range
    this.inputRange.value = this.currValue;

    //Change slide thumb color on mouse up
    if ( this.currValue < 20 ) {
      this.inputRange.classList.remove( 'ltpurple' );
    }
    if ( this.currValue < 40 ) {
      this.inputRange.classList.remove( 'purple' );
    }
    if ( this.currValue < 60 ) {
      this.inputRange.classList.remove( 'pink' );
    }

    // determine if we need to continue
    if ( this.currValue > -1 ) {
      window.requestAnimationFrame( this.animateHandler );
    }

    // decrement value
    this.currValue = this.currValue - this.speed;
  }

  // handle successful unlock
  successHandler() {
  }



}

export { Slider };
