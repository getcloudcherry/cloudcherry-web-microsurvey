import { DomUtilities } from './DomUtilities';

class Theme{
   util : DomUtilities;
   brandColorDark : string;
   brandColorWhite : string;
	 constructor(brandColor, time){
	 this.util = new DomUtilities();
	 this.brandColorDark = this.util.shadeBlendConvert(-0.3, brandColor, undefined);
	 this.brandColorWhite= this.util.shadeBlendConvert(0.1, brandColor, undefined);

		let css : string = '\
		.cc-sdk #progressBar{ \
			background : '+ this.brandColorDark+';\
		}\
		.cc-sdk #progress-line{ \
			background: '+ brandColor+' \
		}\
		.cc-sdk .cc-checkbox input[type="checkbox"]:checked + label:before {\
			background:'+ brandColor +';\
		}\
		.overlay.glass{\
			background-color:'+ this.util.hexToRGB(brandColor,.5)+';\
		}\
		.cc-sdk .cc-checkbox input[type="checkbox"]:checked + label:after {\
			border-color: #fff;\
		}\
		.cc-sdk .cc-checkbox input[type="radio"]:checked + label:before {\
			border-color: '+brandColor+';\
		}\
		.cc-sdk .cc-checkbox input[type="radio"]:checked + label:before {\
			border-color: '+brandColor+';\
		}\
		.cc-sdk .cc-checkbox input[type="radio"]:checked + label:after {\
			background: '+brandColor+';\
		}\
		.cc-sdk .form-control:focus {\
			border-color: '+brandColor+';\
		}\
		.cc-sdk .cc-message-box__btn{\
			background: '+brandColor+';\
			color:#fff;\
		}\
		.cc-sdk .submit-icon{\
			 background-image: url("data:image/svg+xml,%3Csvg width=\'47px\' height=\'47px\' viewBox=\'0 0 47 47\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\'%3E%3C!-- Generator: Sketch 46 %2844423%29 - http://www.bohemiancoding.com/sketch --%3E%3Ctitle%3EGroup 16%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cdefs%3E%3Ccircle id=\'path-1\' cx=\'19.3130459\' cy=\'19.3130459\' r=\'19.3130459\'%3E%3C/circle%3E%3Cfilter x=\'-18.1%25\' y=\'-12.9%25\' width=\'136.2%25\' height=\'136.2%25\' filterUnits=\'objectBoundingBox\' id=\'filter-2\'%3E%3CfeOffset dx=\'0\' dy=\'2\' in=\'SourceAlpha\' result=\'shadowOffsetOuter1\'%3E%3C/feOffset%3E%3CfeGaussianBlur stdDeviation=\'2\' in=\'shadowOffsetOuter1\' result=\'shadowBlurOuter1\'%3E%3C/feGaussianBlur%3E%3CfeColorMatrix values=\'0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.116423234 0\' type=\'matrix\' in=\'shadowBlurOuter1\'%3E%3C/feColorMatrix%3E%3C/filter%3E%3C/defs%3E%3Cg id=\'Page-1\' stroke=\'none\' stroke-width=\'1\' fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg id=\'1-copy-20\' transform=\'translate%28-1246.000000, -664.000000%29\'%3E%3Cg id=\'Group-16\' transform=\'translate%281250.000000, 666.000000%29\'%3E%3Cg id=\'Oval-4\'%3E%3Cuse fill=\'white\' fill-opacity=\'1\' filter=\'url%28%23filter-2%29\' xlink:href=\'%23path-1\'%3E%3C/use%3E%3Cuse fill=\''+encodeURI(brandColor)+'\' fill-rule=\'evenodd\' xlink:href=\'%23path-1\'%3E%3C/use%3E%3C/g%3E%3Cg id=\'Group-5\' transform=\'translate%2812.000000, 11.000000%29\' fill-rule=\'nonzero\' fill=\'%23FFFFFF\'%3E%3Cg id=\'fast-forward-arrows\' transform=\'translate%286.173934, 0.000000%29\'%3E%3Cpolygon id=\'Shape\' points=\'0.993357559 0 0 0.993357559 7.30823082 8.3015552 0 15.6097197 0.993357559 16.6030772 9.29491276 8.3015552\'%3E%3C/polygon%3E%3C/g%3E%3Cg id=\'fast-forward-arrows-copy\'%3E%3Cpolygon id=\'Shape\' points=\'0.993357559 0 0 0.993357559 7.30823082 8.3015552 0 15.6097197 0.993357559 16.6030772 9.29491276 8.3015552\'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");\
		 }\
		html[dir="rtl"] .cc-sdk .submit-icon{\
			background-image: url("data:image/svg+xml,%3Csvg width=\'47px\' height=\'47px\' viewBox=\'0 0 47 47\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\'%3E%3C!-- Generator: Sketch 46.2 %2844496%29 - http://www.bohemiancoding.com/sketch --%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cdefs%3E%3C/defs%3E%3Cg id=\'Page-1\' stroke=\'none\' stroke-width=\'1\' fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg id=\'Submit_Icon\'%3E%3Cg id=\'Oval-4\'%3E%3Cg id=\'path-1-link\' fill-rule=\'nonzero\' fill=\'%23white\'%3E%3Ccircle id=\'path-1\' cx=\'19.3130459\' cy=\'19.3130459\' r=\'19.3130459\'%3E%3C/circle%3E%3C/g%3E%3Cg id=\'path-1-link\' fill=\''+encodeURI(brandColor)+'\'%3E%3Ccircle id=\'path-1\' cx=\'19.3130459\' cy=\'19.3130459\' r=\'19.3130459\'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3Cg id=\'Group-5\' transform=\'translate%2812.000000, 11.000000%29\' fill-rule=\'nonzero\' fill=\'%23ffffff\'%3E%3Cg id=\'fast-forward-arrows\' transform=\'translate%2811.173934, 8.500000%29 scale%28-1, 1%29 translate%28-11.173934, -8.500000%29 translate%286.173934, 0.000000%29\'%3E%3Cpolygon id=\'Shape\' points=\'0.993357559 0 0 0.993357559 7.30823082 8.3015552 0 15.6097197 0.993357559 16.6030772 9.29491276 8.3015552\'%3E%3C/polygon%3E%3C/g%3E%3Cg id=\'fast-forward-arrows-copy\' transform=\'translate%285.000000, 8.500000%29 scale%28-1, 1%29 translate%28-5.000000, -8.500000%29 \'%3E%3Cpolygon id=\'Shape\' points=\'0.993357559 0 0 0.993357559 7.30823082 8.3015552 0 15.6097197 0.993357559 16.6030772 9.29491276 8.3015552\'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");\
		}\
		.cc-sdk .cc-question-container__required-label{\
			color: '+brandColor+';\
		}\
		.cc-sdk input[type="range"]::-webkit-slider-runnable-track{\
			background: '+brandColor+' !important;\
			   background: -moz-linear-gradient(-45deg, '+brandColor+' 0%, '+this.brandColorDark+' 100%)!important;\
			   background: -webkit-linear-gradient(-45deg, '+brandColor+' 0%,'+this.brandColorDark+' 100%)!important;\
			   background: linear-gradient(135deg, '+brandColor+' 0%,'+this.brandColorDark+' 100%)!important;\
			   filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='+brandColor+ ', endColorstr='+this.brandColorDark+',GradientType=1 );\
		   }\
		.cc-sdk input[type="range"]::-moz-range-track {\
			background: '+brandColor+' !important;\
			background: -moz-linear-gradient(-45deg, '+brandColor+' 0%, '+this.brandColorDark+' 100%)!important;\
			background: -webkit-linear-gradient(-45deg, '+brandColor+' 0%,'+this.brandColorDark+' 100%)!important;\
			background: linear-gradient(135deg, '+brandColor+' 0%,'+this.brandColorDark+' 100%)!important;\
			filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='+brandColor+ ', endColorstr='+this.brandColorDark+',GradientType=1 );\
		}\
		   .cc-sdk input[type="range"]::-webkit-slider-thumb{\
			border: 1px solid '+brandColor+' ;\
			background-color: #fff;\
		   }\
		   .cc-sdk input[type="range"]::-moz-range-thumb {\
			border: 1px solid '+brandColor+' ;\
			background-color: #fff;\
		   }\
		   .cc-sdk svg.timer circle {\
			animation: countdown '+time+'s linear 1 forwards;\
			stroke: '+brandColor+';\
		   }\
		   .cc-sdk input[type=range].selected::-webkit-slider-thumb {\
				background-color: '+brandColor+';\
			}\
			.cc-sdk input[type = range].selected::-moz - range - thumb {\
				background-color: '+brandColor+';\
			}\
			.cc-sdk .cc-checkbox label:hover:before{\
				border: solid 1px '+ brandColor + ';\
			}\
		 @media (max-width: 767px){\
	 			.overlay.glass{\
	 			background-color:rgba(255,255,255,.85);\
	 			background-image:none;\
				}\
				.cc-sdk.cc-popup-container{\
					background-color : transparent;\
				}\
				.cc-sdk.cc-popup-container .overlay.glass{\
					background-color : ' + this.util.hexToRGB(brandColor,.9)+';\
				}\
				.cc-sdk.cc-popup-container .cc-message-box .cc-message-box__text{\
					color:#fff;\
				}\
		';
		this.util.appendStyle(css);

	}
}
export { Theme }
