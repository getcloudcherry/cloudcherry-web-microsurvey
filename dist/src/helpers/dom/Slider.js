var Slider = (function () {
    function Slider() {
        this.inputRange = document.getElementsByClassName('range')[0];
        this.maxValue = 100;
        this.speed = 5;
        this.inputRange.min = 0;
        this.inputRange.max = this.maxValue;
        this.setupListeners();
    }
    Slider.prototype.setupListeners = function () {
        var self = this;
        this.inputRange.addEventListener('input', function () {
            if (this.value > 20) {
                self.inputRange.classList.add('ltpurple');
            }
            if (this.value > 40) {
                self.inputRange.classList.add('purple');
            }
            if (this.value > 60) {
                self.inputRange.classList.add('pink');
            }
            if (this.value < 20) {
                self.inputRange.classList.remove('ltpurple');
            }
            if (this.value < 40) {
                self.inputRange.classList.remove('purple');
            }
            if (this.value < 60) {
                self.inputRange.classList.remove('pink');
            }
        });
    };
    Slider.prototype.animateHandler = function () {
        var transX = this.currValue - this.maxValue;
        this.inputRange.value = this.currValue;
        if (this.currValue < 20) {
            this.inputRange.classList.remove('ltpurple');
        }
        if (this.currValue < 40) {
            this.inputRange.classList.remove('purple');
        }
        if (this.currValue < 60) {
            this.inputRange.classList.remove('pink');
        }
        if (this.currValue > -1) {
            window.requestAnimationFrame(this.animateHandler);
        }
        this.currValue = this.currValue - this.speed;
    };
    Slider.prototype.successHandler = function () {
    };
    return Slider;
}());
//# sourceMappingURL=Slider.js.map